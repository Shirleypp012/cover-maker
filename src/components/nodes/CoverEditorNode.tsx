import React, { useRef, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  ShieldCheck,
  Tag,
  Clock,
  Type,
  Upload,
  User,
  Sliders,
  Sparkles,
  Layers,
  Move,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Wand2,
  RefreshCw,
  LayoutGrid,
  Zap,
  Bookmark,
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { CoverEditorNodeData } from '../../types/canvas';
import {
  createVerticalCoverVisual,
  DEFAULT_VERTICAL_LAYERS,
  VerticalLayerPositions,
} from '../../data/sciencePresets';

type LayerKey = keyof VerticalLayerPositions;

export const CoverEditorNode = ({ id, data }: { id: string; data: CoverEditorNodeData }) => {
  const updateNodeData = useStudioStore((state) => state.updateNodeData);
  const setToast = useStudioStore((state) => state.setToast);
  const nodes = useStudioStore((state) => state.nodes);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgContainerRef = useRef<SVGSVGElement>(null);

  // Upstream node lookups
  const topicNode = nodes.find((n) => n.type === 'topic')?.data as any;
  const titleNode = nodes.find((n) => n.type === 'title')?.data as any;
  const charNode = nodes.find((n) => n.type === 'character')?.data as any;

  // Active cover subject type
  const [subjectType, setSubjectType] = useState<
    '3d-book' | 'designer-chair' | 'tactile-loop' | 'clean-ui-card'
  >((data as any).subjectType || '3d-book');

  // Solid mint green banner mode toggle (as in Card 3: 就贏過 Google)
  const [headlineBannerMode, setHeadlineBannerMode] = useState<boolean>(
    Boolean((data as any).headlineBannerMode ?? titleNode?.headlineBannerMode)
  );

  // Extracted typography properties
  const currentBrand = (data as any).overrideBrandTitle || titleNode?.brandTitle || 'Grok Bot';
  const currentCreatorTag = (data as any).creatorTag || titleNode?.creatorTag || '>Jerry_AI.';
  const currentSeriesTag = (data as any).seriesTag || titleNode?.seriesTag || 'Canva Craft ▪';
  const currentHeadlineLine1 =
    (data as any).overrideHeadlineLine1 ||
    titleNode?.headlineLine1 ||
    titleNode?.headlineWhite ||
    '直接丟給';
  const currentHeadlineLine2 =
    (data as any).overrideHeadlineLine2 ||
    titleNode?.headlineLine2 ||
    titleNode?.headlineAccent ||
    '你的bot讀';
  const currentSub =
    data.overrideSubtitle ||
    titleNode?.subTitle ||
    'Grok Bot 指南 5 條規則 · 複製即可實裝';

  // AI Generated Subject Image
  const [aiHeroImageUrl, setAiHeroImageUrl] = useState<string>((data as any).aiHeroImageUrl || '');
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);

  // User uploaded portrait
  const avatarUrl = charNode?.avatarUrl;
  const avatarScale = charNode?.scale || 1.0;

  // Canva Layer State in 9:16 Vertical Space (540 x 960)
  const [layers, setLayers] = useState<VerticalLayerPositions>(
    (data as any).layers || DEFAULT_VERTICAL_LAYERS
  );
  const [selectedLayerId, setSelectedLayerId] = useState<LayerKey | null>('heroSubject');
  const [activeTab, setActiveTab] = useState<'canvas' | 'layers' | 'style' | 'text'>('canvas');
  const [isDragging, setIsDragging] = useState(false);

  // Drag tracking ref
  const dragRef = useRef<{
    layerId: LayerKey;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    containerRect: DOMRect | null;
  } | null>(null);

  // Sync state if external layers or nodes update
  useEffect(() => {
    if ((data as any).layers) {
      setLayers((data as any).layers);
    }
  }, [(data as any).layers]);

  useEffect(() => {
    if ((data as any).subjectType) {
      setSubjectType((data as any).subjectType);
    }
    if ((data as any).headlineBannerMode !== undefined) {
      setHeadlineBannerMode(Boolean((data as any).headlineBannerMode));
    }
  }, [(data as any).subjectType, (data as any).headlineBannerMode]);

  // Safe area guides
  const safeAreas = [
    { id: 'douyin', label: '抖音/Shorts 9:16', desc: '避开右侧互动键与底部文案' },
    { id: 'xiaohongshu', label: '小红书 3:4', desc: '避开底部标题与点赞条' },
    { id: 'bilibili', label: 'B站 16:9', desc: '裁切至横版时中央安全区' },
    { id: 'none', label: '纯净完整画幅', desc: '完整展示' },
  ];

  // Layer metadata
  const layerDefs: { id: LayerKey; name: string; type: 'text' | 'shape' | 'image' | 'badge' }[] = [
    { id: 'creatorTag', name: '作者Handle与系列标签', type: 'text' },
    { id: 'headline', name: '核心双色主标题 (纯白+薄荷绿)', type: 'text' },
    { id: 'heroSubject', name: '3D实体模型与主体', type: 'image' },
    { id: 'subtitle', name: '核心卖点副标题', type: 'text' },
    { id: 'brandTitle', name: '品牌辅助标题', type: 'text' },
    { id: 'badgePill', name: '顶部胶囊药丸', type: 'badge' },
  ];

  // Commit updated layers to store and generate preview
  const commitLayers = (
    newLayers?: VerticalLayerPositions,
    overrideUpdates?: Record<string, any>
  ) => {
    const l = newLayers || layers;
    const subType = overrideUpdates?.subjectType ?? subjectType;
    const isBanner = overrideUpdates?.headlineBannerMode ?? headlineBannerMode;
    const brand = overrideUpdates?.overrideBrandTitle ?? currentBrand;
    const creator = overrideUpdates?.creatorTag ?? currentCreatorTag;
    const series = overrideUpdates?.seriesTag ?? currentSeriesTag;
    const head1 = overrideUpdates?.overrideHeadlineLine1 ?? currentHeadlineLine1;
    const head2 = overrideUpdates?.overrideHeadlineLine2 ?? currentHeadlineLine2;
    const sub = overrideUpdates?.overrideSubtitle ?? currentSub;
    const aiImg = overrideUpdates?.aiHeroImageUrl ?? aiHeroImageUrl;

    const newVisual = createVerticalCoverVisual({
      headlineLine1: head1,
      headlineLine2: head2,
      headlineBannerMode: isBanner,
      subjectType: subType,
      brandTitle: brand,
      creatorTag: creator,
      seriesTag: series,
      subtitle: sub,
      aiHeroImageUrl: aiImg,
      avatarUrl,
      avatarScale,
      layers: l,
    });

    updateNodeData(id, {
      ...overrideUpdates,
      subjectType: subType,
      headlineBannerMode: isBanner,
      layers: l,
      aiHeroImageUrl: aiImg,
      previewUrl: newVisual,
    });
  };

  // AI Image Generation based on Topic (with clean, tactile, non-neon aesthetics)
  const handleSmartAiGenerateSubject = async () => {
    setIsGeneratingAiImage(true);
    const activeTopic = topicNode?.topic || currentBrand || 'Grok Bot';
    setToast(`🎨 正在为《${activeTopic}》生成极简质感 3D 实体画面 (告别刺眼荧光与机械味)...`);

    try {
      const res = await fetch('/api/generate-cover-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeTopic,
          prompt: `Clean minimalist 3D editorial design object for ${activeTopic}, tactile matte clay or leather or rounded smooth ceramic texture, soft studio rim lighting, deep dark matte slate background (#080C14), warm physical object, strictly NO neon glow, NO cyber laser beams, NO robotic mechanical parts, ultra-clean aesthetic, high resolution`,
          aspectRatio: '9:16',
          brandTitle: currentBrand,
        }),
      });
      const result = await res.json();
      if (result.success && result.imageUrl) {
        setAiHeroImageUrl(result.imageUrl);
        commitLayers(layers, { aiHeroImageUrl: result.imageUrl });
        setToast(`✨ 已成功生成极简质感主体并挂载至 9:16 封面！`);
      }
    } catch (e) {
      console.error(e);
      setToast('⚠️ 生成服务响应异常，已加载高保真 3D 质感实体模型');
    } finally {
      setIsGeneratingAiImage(false);
    }
  };

  // Drag interaction handlers
  const handlePointerDown = (layerId: LayerKey, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const layer = layers[layerId];
    if (layer?.locked) {
      setToast('🔒 该图层已锁定，请在图层面板中解锁后再拖拽');
      return;
    }

    const rect = svgContainerRef.current?.getBoundingClientRect() || null;
    dragRef.current = {
      layerId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: layer?.x ?? DEFAULT_VERTICAL_LAYERS[layerId]?.x ?? 270,
      initialY: layer?.y ?? DEFAULT_VERTICAL_LAYERS[layerId]?.y ?? 300,
      containerRect: rect,
    };

    setSelectedLayerId(layerId);
    setIsDragging(true);

    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch (err) {
      // Ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { layerId, startX, startY, initialX, initialY, containerRect } = dragRef.current;
    if (!containerRect) return;

    // SVG viewBox is 540 x 960 (9:16)
    const scaleRatio = 540 / containerRect.width;
    const dx = (e.clientX - startX) * scaleRatio;
    const dy = (e.clientY - startY) * scaleRatio;

    const updatedX = Math.round(initialX + dx);
    const updatedY = Math.round(initialY + dy);

    setLayers((prev) => ({
      ...prev,
      [layerId]: {
        ...(prev[layerId] || DEFAULT_VERTICAL_LAYERS[layerId]),
        x: updatedX,
        y: updatedY,
      },
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current) {
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore
      }
      dragRef.current = null;
      setIsDragging(false);
      commitLayers();
    }
  };

  // Alignment helpers
  const handleAlign = (type: 'left' | 'center' | 'right') => {
    if (!selectedLayerId) return;
    let targetX = 270;
    if (type === 'left') targetX = 60;
    else if (type === 'center') targetX = 270;
    else if (type === 'right') targetX = 420;

    const updated = {
      ...layers,
      [selectedLayerId]: {
        ...(layers[selectedLayerId] || DEFAULT_VERTICAL_LAYERS[selectedLayerId]),
        x: targetX,
      },
    };
    setLayers(updated);
    commitLayers(updated);
    setToast(
      `📐 已将图层对齐至：${type === 'left' ? '靠左' : type === 'center' ? '水平居中' : '靠右'}`
    );
  };

  // Reset to reference template layout
  const handleResetLayers = () => {
    setLayers(DEFAULT_VERTICAL_LAYERS);
    commitLayers(DEFAULT_VERTICAL_LAYERS);
    setToast('🔄 已重置所有图层为 9:16 竖屏黄金排版坐标');
  };

  // Toggle Visibility
  const toggleVisibility = (layerId: LayerKey) => {
    const updated = {
      ...layers,
      [layerId]: {
        ...(layers[layerId] || DEFAULT_VERTICAL_LAYERS[layerId]),
        visible: !(layers[layerId]?.visible ?? true),
      },
    };
    setLayers(updated);
    commitLayers(updated);
  };

  // Toggle Lock
  const toggleLock = (layerId: LayerKey) => {
    const updated = {
      ...layers,
      [layerId]: {
        ...(layers[layerId] || DEFAULT_VERTICAL_LAYERS[layerId]),
        locked: !layers[layerId]?.locked,
      },
    };
    setLayers(updated);
    commitLayers(updated);
    setToast(updated[layerId]?.locked ? '🔒 图层已锁定' : '🔓 图层已解锁自由拖拽');
  };

  // Step adjust position
  const stepPosition = (layerId: LayerKey, dx: number, dy: number) => {
    const cur = layers[layerId] || DEFAULT_VERTICAL_LAYERS[layerId];
    const updated = {
      ...layers,
      [layerId]: {
        ...cur,
        x: (cur?.x ?? 270) + dx,
        y: (cur?.y ?? 300) + dy,
      },
    };
    setLayers(updated);
    commitLayers(updated);
  };

  const handlePortraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imgUrl = event.target.result as string;

          const cNode = nodes.find((n) => n.type === 'character');
          if (cNode) {
            updateNodeData(cNode.id, {
              avatarUrl: imgUrl,
              name: file.name.replace(/\.[^/.]+$/, ''),
            });
          }

          commitLayers(layers, { avatarUrl: imgUrl });
          setToast('📸 我的个人肖像照片已成功挂载至 9:16 封面！');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const activeLayerConfig = selectedLayerId
    ? layers[selectedLayerId] || DEFAULT_VERTICAL_LAYERS[selectedLayerId]
    : null;

  return (
    <div className="w-[440px] rounded-2xl bg-neutral-900/98 border border-emerald-500/40 shadow-2xl shadow-emerald-950/40 backdrop-blur-md overflow-hidden text-neutral-100 transition-all hover:border-emerald-400">
      {/* Target input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3.5 h-3.5 !bg-emerald-400 !border-2 !border-neutral-900 shadow-md"
      />

      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-950/70 via-neutral-900 to-neutral-900 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              9:16 极简编辑排版
            </div>
            <div className="text-sm font-bold text-neutral-100">
              {data.label || '竖屏封面编辑器与分层控制'}
            </div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
          STAGE 06
        </span>
      </div>

      <div className="p-4 space-y-3.5 text-xs">
        {/* Style Quick Selector Matching Reference Cards */}
        <div className="p-2.5 rounded-xl bg-neutral-950 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium">
            <span>参考图 4 款型快速切换:</span>
            <span className="text-emerald-400 font-bold">零荧光 · 哑光质感</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => {
                setSubjectType('3d-book');
                setHeadlineBannerMode(false);
                commitLayers(layers, { subjectType: '3d-book', headlineBannerMode: false });
                setToast('🌱 已切换为：3D红宝典萌系小水滴款 (参考图2)');
              }}
              className={`py-1 px-1.5 rounded-lg text-center font-bold text-[10px] transition-all cursor-pointer ${
                subjectType === '3d-book' && !headlineBannerMode
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white'
              }`}
            >
              📖 3D宝典
            </button>
            <button
              onClick={() => {
                setSubjectType('designer-chair');
                setHeadlineBannerMode(true);
                commitLayers(layers, { subjectType: 'designer-chair', headlineBannerMode: true });
                setToast('🟩 已切换为：绿底色块包豪斯皮椅款 (参考图3)');
              }}
              className={`py-1 px-1.5 rounded-lg text-center font-bold text-[10px] transition-all cursor-pointer ${
                headlineBannerMode
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white'
              }`}
            >
              🟩 绿底色块
            </button>
            <button
              onClick={() => {
                setSubjectType('tactile-loop');
                setHeadlineBannerMode(false);
                commitLayers(layers, { subjectType: 'tactile-loop', headlineBannerMode: false });
                setToast('🏎️ 已切换为：3D黏土环形跑道款 (参考图1)');
              }}
              className={`py-1 px-1.5 rounded-lg text-center font-bold text-[10px] transition-all cursor-pointer ${
                subjectType === 'tactile-loop'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white'
              }`}
            >
              🏎️ 3D跑道
            </button>
            <button
              onClick={() => {
                setSubjectType('clean-ui-card');
                setHeadlineBannerMode(false);
                commitLayers(layers, { subjectType: 'clean-ui-card', headlineBannerMode: false });
                setToast('📱 已切换为：2.5D极简手机卡片款 (参考图4)');
              }}
              className={`py-1 px-1.5 rounded-lg text-center font-bold text-[10px] transition-all cursor-pointer ${
                subjectType === 'clean-ui-card'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white'
              }`}
            >
              📱 极简手机
            </button>
          </div>
        </div>

        {/* Action Bar (Canva Layer tabs & AI smart generation) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950 border border-white/10 text-[11px]">
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'canvas'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              画板拖拽
            </button>
            <button
              onClick={() => setActiveTab('layers')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'layers'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>图层面板</span>
            </button>
          </div>

          <button
            onClick={handleSmartAiGenerateSubject}
            disabled={isGeneratingAiImage}
            className="py-1.5 px-3 rounded-xl bg-neutral-950 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isGeneratingAiImage ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>智能生图</span>
              </>
            )}
          </button>
        </div>

        {/* Canva-Grade Interactive SVG Canvas Viewport (9:16 Vertical) */}
        <div className="relative rounded-xl overflow-hidden bg-[#080C14] border border-white/10 aspect-[9/16] w-[290px] mx-auto shadow-2xl select-none group">
          <svg
            ref={svgContainerRef}
            viewBox="0 0 540 960"
            className="w-full h-full block touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <defs>
              <linearGradient id="matteNavyBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0B101B" />
                <stop offset="50%" stopColor="#080C14" />
                <stop offset="100%" stopColor="#05070D" />
              </linearGradient>
              <radialGradient id="softStudioLight" cx="50%" cy="58%" r="65%">
                <stop offset="0%" stopColor="#1E293B" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#0B101B" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Layer: Deep matte navy with soft studio falloff */}
            <rect
              width="540"
              height="960"
              fill="url(#matteNavyBg)"
              onPointerDown={(e) => {
                if (e.target === e.currentTarget) setSelectedLayerId(null);
              }}
            />
            <rect width="540" height="960" fill="url(#softStudioLight)" pointerEvents="none" />

            {/* Layer 1: Author Handle & Series Tag (>Jerry_AI. + Canva Craft ■) */}
            {layers.creatorTag?.visible !== false && (
              <g
                id="layer-creatorTag"
                transform={`translate(${layers.creatorTag?.x ?? 54}, ${layers.creatorTag?.y ?? 60})`}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handlePointerDown('creatorTag', e)}
              >
                <text
                  x="0"
                  y="0"
                  fill="#FFFFFF"
                  fontFamily="'SF Pro Text', system-ui, sans-serif"
                  fontSize="22"
                  fontWeight="800"
                  letterSpacing="0.5"
                >
                  <tspan fill="#34D399" fontWeight="900" dx="0">
                    &gt;
                  </tspan>
                  <tspan fill="#FFFFFF">{currentCreatorTag.replace(/^>/, '')}</tspan>
                </text>
                <g transform="translate(0, 36)">
                  <text
                    x="0"
                    y="0"
                    fill="#F1F5F9"
                    fontFamily="'SF Pro Text', system-ui, sans-serif"
                    fontSize="22"
                    fontWeight="800"
                    letterSpacing="0.5"
                  >
                    {currentSeriesTag.replace(/[■▪]/g, '').trim()}
                  </text>
                  <rect x="135" y="-14" width="10" height="10" rx="1.5" fill="#34D399" />
                </g>

                {selectedLayerId === 'creatorTag' && (
                  <rect
                    x="-10"
                    y="-22"
                    width="260"
                    height="70"
                    fill="none"
                    stroke="#34D399"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    rx="4"
                  />
                )}
              </g>
            )}

            {/* Layer 2: Core Two-Tone Headline (White Line 1 + Mint Green Line 2 / Banner) */}
            {layers.headline?.visible !== false && (
              <g
                id="layer-headline"
                transform={`translate(${layers.headline?.x ?? 54}, ${layers.headline?.y ?? 170})`}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handlePointerDown('headline', e)}
              >
                {/* Line 1: Pure White */}
                <text
                  x="0"
                  y="0"
                  fill="#FFFFFF"
                  fontFamily="'Noto Sans SC', system-ui, sans-serif"
                  fontSize="52"
                  fontWeight="900"
                  letterSpacing="-1"
                >
                  {currentHeadlineLine1}
                </text>

                {/* Line 2: Mint Green OR Solid Mint Green Banner */}
                {headlineBannerMode ? (
                  <g transform="translate(0, 16)">
                    <rect
                      x="0"
                      y="0"
                      width={Math.max(260, currentHeadlineLine2.length * 48 + 36)}
                      height="68"
                      rx="4"
                      fill="#10B981"
                    />
                    <text
                      x="18"
                      y="50"
                      fill="#05080E"
                      fontFamily="'Noto Sans SC', system-ui, sans-serif"
                      fontSize="48"
                      fontWeight="900"
                      letterSpacing="-0.5"
                    >
                      {currentHeadlineLine2}
                    </text>
                  </g>
                ) : (
                  <text
                    x="0"
                    y="70"
                    fill="#34D399"
                    fontFamily="'Noto Sans SC', system-ui, sans-serif"
                    fontSize="52"
                    fontWeight="900"
                    letterSpacing="-1"
                  >
                    {currentHeadlineLine2}
                  </text>
                )}

                {selectedLayerId === 'headline' && (
                  <rect
                    x="-10"
                    y="-45"
                    width="440"
                    height="145"
                    fill="none"
                    stroke="#34D399"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                    rx="6"
                  />
                )}
              </g>
            )}

            {/* Layer 3: Tactile 3D Physical Subject or User Portrait / AI Gen Image */}
            {layers.heroSubject?.visible !== false && (
              <g
                id="layer-heroSubject"
                transform={`translate(${layers.heroSubject?.x ?? 270}, ${layers.heroSubject?.y ?? 600})`}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handlePointerDown('heroSubject', e)}
              >
                {/* If user uploaded portrait */}
                {avatarUrl ? (
                  <g transform={`scale(${avatarScale}) translate(-170, -170)`}>
                    <image
                      href={avatarUrl}
                      x="0"
                      y="0"
                      width="340"
                      height="340"
                      preserveAspectRatio="xMidYMid meet"
                      clipPath="inset(0 round 24px)"
                    />
                  </g>
                ) : aiHeroImageUrl ? (
                  /* If AI Generated Subject */
                  <g transform="translate(-160, -160)">
                    <image
                      href={aiHeroImageUrl}
                      x="0"
                      y="0"
                      width="320"
                      height="320"
                      preserveAspectRatio="xMidYMid meet"
                      clipPath="inset(0 round 20px)"
                    />
                  </g>
                ) : subjectType === '3d-book' ? (
                  /* Tactile 3D Red Guidebook with cute companion droplets (Card 2) */
                  <g>
                    {/* Shadow */}
                    <ellipse cx="0" cy="140" rx="160" ry="24" fill="#000000" opacity="0.45" />

                    {/* Companion droplet orange */}
                    <g transform="translate(-130, 80)">
                      <circle cx="0" cy="0" r="34" fill="#FB923C" />
                      <circle cx="-10" cy="-6" r="4.5" fill="#1E293B" />
                      <circle cx="10" cy="-6" r="4.5" fill="#1E293B" />
                    </g>

                    {/* Companion droplet blue */}
                    <g transform="translate(-75, 110)">
                      <rect x="-30" y="-30" width="60" height="60" rx="20" fill="#3B82F6" />
                      <circle cx="-10" cy="-4" r="4" fill="#0F172A" />
                      <circle cx="10" cy="-4" r="4" fill="#0F172A" />
                    </g>

                    {/* Companion droplet green */}
                    <g transform="translate(0, 130)">
                      <circle cx="0" cy="0" r="38" fill="#34D399" />
                      <circle cx="-10" cy="-5" r="4" fill="#0F172A" />
                      <circle cx="10" cy="-5" r="4" fill="#0F172A" />
                    </g>

                    {/* Companion droplet purple */}
                    <g transform="translate(100, 100)">
                      <rect x="-26" y="-30" width="52" height="60" rx="18" fill="#A855F7" />
                      <circle cx="-8" cy="-4" r="4" fill="#0F172A" />
                      <circle cx="8" cy="-4" r="4" fill="#0F172A" />
                    </g>

                    {/* Red 3D Guidebook */}
                    <g transform="translate(-100, -120)">
                      <rect
                        x="0"
                        y="0"
                        width="200"
                        height="240"
                        rx="24"
                        fill="#EF4444"
                        stroke="#DC2626"
                        strokeWidth="3"
                      />
                      <rect x="18" y="0" width="12" height="240" fill="#B91C1C" opacity="0.3" />
                      <text
                        x="100"
                        y="68"
                        fill="#FFFFFF"
                        fontFamily="system-ui"
                        fontSize="24"
                        fontWeight="900"
                        textAnchor="middle"
                      >
                        {currentBrand}
                      </text>
                      <text
                        x="100"
                        y="108"
                        fill="#FFFFFF"
                        fontFamily="'Noto Sans SC'"
                        fontSize="28"
                        fontWeight="900"
                        textAnchor="middle"
                      >
                        指南
                      </text>
                      <text
                        x="100"
                        y="152"
                        fill="#FFFFFF"
                        fontFamily="'Noto Sans SC'"
                        fontSize="22"
                        fontWeight="900"
                        textAnchor="middle"
                      >
                        5 條規則
                      </text>
                    </g>
                  </g>
                ) : subjectType === 'designer-chair' ? (
                  /* Modern Red Leather Bauhaus Armchair on Mint Pedestal (Card 3) */
                  <g>
                    <polygon
                      points="-180,120 180,120 140,165 -140,165"
                      fill="#10B981"
                      opacity="0.85"
                    />
                    <ellipse cx="0" cy="115" rx="120" ry="18" fill="#000000" opacity="0.4" />
                    {/* Metal tubular frames */}
                    <path
                      d="M -110,60 L -110,110 L 110,110 L 110,60"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M -90,-40 L -90,60 L 90,60 L 90,-40"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    {/* Red Leather Cushions */}
                    <rect
                      x="-85"
                      y="-55"
                      width="170"
                      height="90"
                      rx="16"
                      fill="#DC2626"
                      stroke="#991B1B"
                      strokeWidth="3"
                    />
                    <rect
                      x="-95"
                      y="15"
                      width="190"
                      height="50"
                      rx="14"
                      fill="#EF4444"
                      stroke="#B91C1C"
                      strokeWidth="3"
                    />
                  </g>
                ) : subjectType === 'tactile-loop' ? (
                  /* 3D Clay Racetrack Loop (Card 1) */
                  <g>
                    <ellipse cx="0" cy="80" rx="170" ry="75" fill="#000000" opacity="0.4" />
                    <ellipse
                      cx="0"
                      cy="40"
                      rx="165"
                      ry="85"
                      fill="#34D399"
                      stroke="#059669"
                      strokeWidth="8"
                    />
                    <ellipse cx="0" cy="40" rx="95" ry="45" fill="#080C14" />
                    <ellipse
                      cx="0"
                      cy="40"
                      rx="130"
                      ry="65"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="4"
                      strokeDasharray="16 12"
                    />
                    {/* Caution flag */}
                    <polygon points="-110,10 -80,-20 -110,-10" fill="#F59E0B" />
                    <line x1="-110" y1="10" x2="-110" y2="35" stroke="#E2E8F0" strokeWidth="4" />
                  </g>
                ) : (
                  /* Clean Modern 2.5D Smartphone App Card (Card 4) */
                  <g>
                    <rect
                      x="-110"
                      y="-150"
                      width="220"
                      height="310"
                      rx="28"
                      fill="#FFFFFF"
                      stroke="#CBD5E1"
                      strokeWidth="6"
                    />
                    <rect x="-80" y="-110" width="160" height="130" rx="18" fill="#F8FAFC" />
                    <circle cx="0" cy="-45" r="32" fill="#F97316" opacity="0.85" />
                    <rect x="-80" y="50" width="160" height="50" rx="10" fill="#34D399" />
                    <line
                      x1="-60"
                      y1="75"
                      x2="60"
                      y2="75"
                      stroke="#0F172A"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {selectedLayerId === 'heroSubject' && (
                  <rect
                    x="-180"
                    y="-180"
                    width="360"
                    height="360"
                    fill="none"
                    stroke="#34D399"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    rx="12"
                  />
                )}
              </g>
            )}

            {/* Layer 4: Subtitle */}
            {layers.subtitle?.visible !== false && (
              <g
                id="layer-subtitle"
                transform={`translate(${layers.subtitle?.x ?? 270}, ${layers.subtitle?.y ?? 890})`}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handlePointerDown('subtitle', e)}
              >
                <text
                  x="0"
                  y="0"
                  fill="#94A3B8"
                  fontFamily="'Noto Sans SC', system-ui"
                  fontSize="16"
                  fontWeight="600"
                  textAnchor="middle"
                  letterSpacing="0.5"
                >
                  {currentSub}
                </text>
                {selectedLayerId === 'subtitle' && (
                  <rect
                    x="-240"
                    y="-18"
                    width="480"
                    height="30"
                    fill="none"
                    stroke="#34D399"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    rx="4"
                  />
                )}
              </g>
            )}
          </svg>

          {/* Floating Canva Selection Overlay HUD */}
          {selectedLayerId && activeLayerConfig && (
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/90 backdrop-blur-md border border-emerald-500/50 text-[10px] text-emerald-300 font-mono shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{layerDefs.find((l) => l.id === selectedLayerId)?.name}</span>
              <span className="text-emerald-400 font-bold">
                X:{activeLayerConfig.x} Y:{activeLayerConfig.y}
              </span>
            </div>
          )}

          {/* Safe Area Guides */}
          {data.safeArea === 'douyin' && (
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-emerald-400/40 m-2 rounded">
              <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/85 text-[8px] text-emerald-300 rounded font-mono border border-emerald-500/30">
                [抖音/Shorts 9:16 安全视区]
              </div>
            </div>
          )}
          {data.safeArea === 'xiaohongshu' && (
            <div className="absolute inset-x-0 top-12 bottom-12 pointer-events-none border-2 border-dashed border-red-500/50 m-2 rounded" />
          )}
        </div>

        {/* Canva Quick Align & Nudge Toolbar */}
        <div className="p-2.5 rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-between gap-1 text-[11px]">
          <div className="flex items-center gap-1 text-neutral-400">
            <span className="text-[10px] text-neutral-400 mr-1">快捷对齐:</span>
            <button
              onClick={() => handleAlign('left')}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="靠左对齐 (X=60)"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleAlign('center')}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="水平居中 (X=270)"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleAlign('right')}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="靠右对齐"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Micro Nudges for Selected Layer */}
          {selectedLayerId && (
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-neutral-500">微调:</span>
              <button
                onClick={() => stepPosition(selectedLayerId, -5, 0)}
                className="px-1.5 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 cursor-pointer font-mono"
              >
                ←
              </button>
              <button
                onClick={() => stepPosition(selectedLayerId, 5, 0)}
                className="px-1.5 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 cursor-pointer font-mono"
              >
                →
              </button>
              <button
                onClick={() => stepPosition(selectedLayerId, 0, -5)}
                className="px-1.5 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 cursor-pointer font-mono"
              >
                ↑
              </button>
              <button
                onClick={() => stepPosition(selectedLayerId, 0, 5)}
                className="px-1.5 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 cursor-pointer font-mono"
              >
                ↓
              </button>
            </div>
          )}

          <button
            onClick={handleResetLayers}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
            title="恢复参考图默认黄金排版位置"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置</span>
          </button>
        </div>

        {/* TAB: Canva Layers Panel */}
        {activeTab === 'layers' && (
          <div className="p-3 rounded-xl bg-neutral-950 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-neutral-300 mb-1">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Layers className="w-3.5 h-3.5" />
                <span>Canva 图层分层列表 (点击选择/锁定/显隐)</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">9:16 画布</span>
            </div>

            <div className="space-y-1.5">
              {layerDefs.map((def) => {
                const isSelected = selectedLayerId === def.id;
                const layer = layers[def.id] || DEFAULT_VERTICAL_LAYERS[def.id];
                const isVisible = layer?.visible !== false;
                const isLocked = Boolean(layer?.locked);

                return (
                  <div
                    key={def.id}
                    onClick={() => setSelectedLayerId(def.id)}
                    className={`p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-400 text-white shadow-sm'
                        : 'bg-neutral-900/80 border-white/5 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-neutral-600'}`}
                      />
                      <span className="font-semibold text-xs text-neutral-200">{def.name}</span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] font-mono text-neutral-400">
                        X:{layer?.x ?? 0} Y:{layer?.y ?? 0}
                      </span>
                      <button
                        onClick={() => toggleLock(def.id)}
                        className={`p-1 rounded hover:bg-neutral-800 transition-colors ${
                          isLocked ? 'text-emerald-400' : 'text-neutral-500 hover:text-white'
                        }`}
                        title={isLocked ? '已锁定' : '未锁定'}
                      >
                        {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={() => toggleVisibility(def.id)}
                        className={`p-1 rounded hover:bg-neutral-800 transition-colors ${
                          isVisible ? 'text-emerald-400' : 'text-neutral-600'
                        }`}
                        title={isVisible ? '图层可见' : '图层隐藏'}
                      >
                        {isVisible ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload Portrait & Fast Subject Switcher */}
        <div className="space-y-3 pt-1">
          {/* Upload Portrait Section */}
          <div className="p-2.5 rounded-xl bg-neutral-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>我的肖像素材 (出镜人物照片)</span>
              </span>
              <span className="text-[10px] text-neutral-400">
                {avatarUrl ? '✓ 已挂载个人肖像' : '未上传 (展示 3D 实体模型/生图)'}
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{avatarUrl ? '替换我的肖像照片' : '上传我的真人肖像 (PNG/JPG)'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePortraitUpload}
                className="hidden"
              />

              {avatarUrl && (
                <button
                  onClick={() => {
                    const cNode = nodes.find((n) => n.type === 'character');
                    if (cNode) updateNodeData(cNode.id, { avatarUrl: '' });
                    commitLayers(layers, { avatarUrl: '' });
                    setToast('🔄 已切换回 3D 实体模型');
                  }}
                  className="py-2 px-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
                >
                  重置
                </button>
              )}
            </div>
          </div>

          {/* Quick Typography Edits in Editor */}
          <div className="space-y-2 p-3 rounded-xl bg-neutral-950 border border-white/10">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  作者 Handle (如 &gt;Jerry_AI.)
                </label>
                <input
                  type="text"
                  value={currentCreatorTag}
                  onChange={(e) => commitLayers(layers, { creatorTag: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-[11px] text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  系列标签 (如 Canva Craft ▪)
                </label>
                <input
                  type="text"
                  value={currentSeriesTag}
                  onChange={(e) => commitLayers(layers, { seriesTag: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-[11px] text-neutral-200 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white font-bold block mb-1">
                  第 1 行 (纯白标题)
                </label>
                <input
                  type="text"
                  value={currentHeadlineLine1}
                  onChange={(e) => commitLayers(layers, { overrideHeadlineLine1: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-[12px] text-white font-black tracking-tight focus:outline-none focus:border-emerald-400"
                  placeholder="直接丟給"
                />
              </div>
              <div>
                <label className="text-[10px] text-emerald-400 font-bold block mb-1">
                  第 2 行 (薄荷绿标题)
                </label>
                <input
                  type="text"
                  value={currentHeadlineLine2}
                  onChange={(e) => commitLayers(layers, { overrideHeadlineLine2: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-[12px] text-emerald-300 font-black tracking-tight focus:outline-none focus:border-emerald-400"
                  placeholder="你的bot讀"
                />
              </div>
            </div>

            {/* Banner Mode Toggle */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-white/5">
              <span className="text-[11px] text-neutral-300">
                绿底色块高亮开关 (就赢过 Google 款)
              </span>
              <button
                onClick={() => {
                  const next = !headlineBannerMode;
                  setHeadlineBannerMode(next);
                  commitLayers(layers, { headlineBannerMode: next });
                }}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  headlineBannerMode
                    ? 'bg-emerald-500 text-black'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {headlineBannerMode ? '已开启' : '开启'}
              </button>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">核心卖点副标题</label>
              <input
                type="text"
                value={currentSub}
                onChange={(e) => commitLayers(layers, { overrideSubtitle: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-[11px] text-neutral-200 focus:outline-none focus:border-emerald-400"
                placeholder="Grok Bot 指南 5 條規則 · 複製即可實裝"
              />
            </div>
          </div>
        </div>

        {/* Safe-Zone Selector */}
        <div>
          <label className="block text-[10px] font-medium text-neutral-400 mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 平台安全视区辅助线
          </label>
          <div className="grid grid-cols-4 gap-1">
            {safeAreas.map((sa) => (
              <button
                key={sa.id}
                onClick={() => {
                  updateNodeData(id, { safeArea: sa.id });
                  setToast(`📐 已切换安全视区：${sa.label}`);
                }}
                className={`py-1.5 rounded-lg text-center font-medium text-[10px] border transition-all cursor-pointer ${
                  (data.safeArea || 'douyin') === sa.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
                    : 'bg-neutral-950 border-white/5 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {sa.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Source output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3.5 h-3.5 !bg-emerald-400 !border-2 !border-neutral-900 shadow-md"
      />
    </div>
  );
};
