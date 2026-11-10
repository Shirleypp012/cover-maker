import React, { useState, useRef } from 'react';
import { User, Sparkles, Plus, Upload, X, Youtube, Image as ImageIcon } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { createCharacterSvg, createVerticalCoverVisual, createYouTubeCoverVisual } from '../../data/sciencePresets';

export const AssetLibraryDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addNode, setToast } = useStudioStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'grok' | 'character' | 'badge'>('grok');

  // Strictly only ONE minimal 9:16 reference template
  const grokPresets = [
    {
      id: 'vertical-minimal',
      name: '🌱 极简 9:16 竖屏模板 (参考图标杆)',
      desc: '哑光深黑底 #080C14，纯白主标题，薄荷绿重点词，质感 3D 实体模型，支持真人肖像出镜',
      brandTitle: 'Grok Bot',
      headlineLine1: '直接丟給',
      headlineLine2: '你的bot讀',
      subtitle: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
      creatorTag: '>Jerry_AI.',
      seriesTag: 'Canva Craft ▪',
      preview: createVerticalCoverVisual({
        headlineLine1: '直接丟給',
        headlineLine2: '你的bot讀',
        subjectType: '3d-book',
        brandTitle: 'Grok Bot',
        creatorTag: '>Jerry_AI.',
        seriesTag: 'Canva Craft ▪',
        subtitle: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
      }),
    },
  ];

  const [characters, setCharacters] = useState([
    { id: 'char-1', name: '我的真人肖像 (点击上传)', role: '出镜主讲', preview: createCharacterSvg('我的肖像', '#10B981'), isUser: true },
    { id: 'char-2', name: '主讲人阿杰', role: '极简商务出镜', preview: createCharacterSvg('阿杰', '#34D399'), isUser: false },
    { id: 'char-3', name: '创作者小艾', role: '短视频主理人', preview: createCharacterSvg('小艾', '#E2E8F0'), isUser: false },
  ]);

  const [badges, setBadges] = useState([
    { id: 'b-1', text: '>Jerry_AI.', color: '#34D399' },
    { id: 'b-2', text: 'Canva Craft ▪', color: '#10B981' },
    { id: 'b-3', text: '5 條規則', color: '#F1F5F9' },
    { id: 'b-4', text: '避坑指南', color: '#34D399' },
  ]);

  if (!isOpen) return null;

  const handleApplyGrokPreset = (preset: typeof grokPresets[0]) => {
    const nodes = useStudioStore.getState().nodes;
    const currentChar = nodes.find((n) => n.type === 'character')?.data as any;

    const newPreview = createVerticalCoverVisual({
      headlineLine1: preset.headlineLine1,
      headlineLine2: preset.headlineLine2,
      brandTitle: preset.brandTitle,
      creatorTag: preset.creatorTag,
      seriesTag: preset.seriesTag,
      subtitle: preset.subtitle,
      subjectType: '3d-book',
      avatarUrl: currentChar?.avatarUrl,
      avatarScale: currentChar?.scale,
    });

    // 1. Update Title Node
    const titleNode = nodes.find((n) => n.type === 'title');
    if (titleNode) {
      useStudioStore.getState().updateNodeData(titleNode.id, {
        brandTitle: preset.brandTitle,
        headlineLine1: preset.headlineLine1,
        headlineLine2: preset.headlineLine2,
        subTitle: preset.subtitle,
        creatorTag: preset.creatorTag,
        seriesTag: preset.seriesTag,
      });
    }

    // 2. Update Visual Node
    const visualNode = nodes.find((n) => n.type === 'scienceVisual');
    if (visualNode) {
      useStudioStore.getState().updateNodeData(visualNode.id, {
        imageUrl: newPreview,
        style: 'vertical-hero',
      });
    }

    // 3. Update Cover Editor Node
    const editorNode = nodes.find((n) => n.type === 'coverEditor');
    if (editorNode) {
      useStudioStore.getState().updateNodeData(editorNode.id, {
        previewUrl: newPreview,
        overrideBrandTitle: preset.brandTitle,
        overrideHeadlineLine1: preset.headlineLine1,
        overrideHeadlineLine2: preset.headlineLine2,
        overrideSubtitle: preset.subtitle,
        creatorTag: preset.creatorTag,
        seriesTag: preset.seriesTag,
        subjectType: '3d-book',
      });
    }

    setToast(`✨ 已应用【${preset.name}】！`);
  };

  const handleAddCharacterToCanvas = (char: typeof characters[0]) => {
    const nodes = useStudioStore.getState().nodes;
    let charNode = nodes.find((n) => n.type === 'character');
    if (charNode) {
      useStudioStore.getState().updateNodeData(charNode.id, {
        name: char.name,
        avatarUrl: char.preview,
        role: char.role,
      });
      // Also sync to editor
      const editorNode = nodes.find((n) => n.type === 'coverEditor');
      if (editorNode) {
        const eData = editorNode.data as any;
        const newPreview = createVerticalCoverVisual({
          headlineLine1: eData.overrideHeadlineLine1 || '直接丟給',
          headlineLine2: eData.overrideHeadlineLine2 || '你的bot讀',
          brandTitle: eData.overrideBrandTitle || 'Grok Bot',
          creatorTag: eData.creatorTag || '>Jerry_AI.',
          seriesTag: eData.seriesTag || 'Canva Craft ▪',
          subtitle: eData.overrideSubtitle || 'Grok Bot 指南 5 條規則 · 複製即可實裝',
          subjectType: eData.subjectType || '3d-book',
          avatarUrl: char.preview,
          avatarScale: eData.avatarScale || 1.0,
          aiHeroImageUrl: eData.aiHeroImageUrl,
          layers: eData.layers,
        });
        useStudioStore.getState().updateNodeData(editorNode.id, {
          previewUrl: newPreview,
        });
      }
      setToast(`👤 已将【${char.name}】设为封面出镜肖像！`);
    } else {
      addNode('character');
      setToast(`👤 已添加人物出镜素材节点！`);
    }
  };

  const handleUploadUserPortrait = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imgUrl = event.target.result as string;
          const newChar = {
            id: `char-user-${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            role: '我的真实个人肖像',
            preview: imgUrl,
            isUser: true,
          };
          setCharacters([newChar, ...characters.filter((c) => !c.isUser)]);
          handleAddCharacterToCanvas(newChar);
          setToast('📸 我的个人肖像照片已成功上传并设为出镜素材！');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[440px] bg-neutral-900/98 border-l border-amber-500/20 backdrop-blur-2xl shadow-2xl z-50 flex flex-col text-neutral-100 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-neutral-100">YouTube 极简暗黑+金 资产中心</h2>
            <p className="text-[11px] text-amber-300">纯净哑光深黑、高质感双色排版与真人肖像库</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 px-4 gap-1.5 pt-2 bg-neutral-950/40 overflow-x-auto">
        {[
          { id: 'grok', label: '🎬 暗黑金光版式', count: grokPresets.length },
          { id: 'character', label: '我的肖像素材', count: characters.length },
          { id: 'badge', label: '金黄细眉标', count: badges.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === tab.id
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-400">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Grok Presets Tab */}
        {activeTab === 'grok' && (
          <div className="space-y-3.5">
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-neutral-300">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                参考图标杆：Grok Bot 经典暗黑金色极简版式
              </div>
              <div className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                删除一切冗余死板图标。纯黑哑光底色 + 顶部金黄细眉标 + 纯白巨幅主词 + 黄白撞色主标 + 右侧真人出镜肖像。
              </div>
            </div>

            <div className="space-y-3">
              {grokPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3 rounded-2xl bg-neutral-950/90 border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col gap-2 group"
                >
                  <div className="relative aspect-[9/16] w-[180px] mx-auto rounded-xl overflow-hidden border border-white/10 bg-black">
                    <img
                      src={preset.preview}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded bg-black/85 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                      {preset.creatorTag}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-xs text-neutral-200">{preset.name}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">{preset.desc}</div>
                  </div>

                  <button
                    onClick={() => handleApplyGrokPreset(preset)}
                    className="w-full py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>一键应用到当前封面画布</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Character Tab */}
        {activeTab === 'character' && (
          <div className="space-y-3.5">
            {/* Upload My Portrait Button */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-950/40 to-black border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>上传我的真人出镜照片</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  PNG/JPG
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                上传您的半身出镜照片，系统自动置于封面右半区，并通过左侧暗色羽化平滑融入背景。
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40 cursor-pointer transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>立即上传我的真人肖像照片</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadUserPortrait}
                className="hidden"
              />
            </div>

            <div className="text-xs text-neutral-400 font-medium">可用肖像素材库</div>

            <div className="grid grid-cols-2 gap-2.5">
              {characters.map((char) => (
                <div
                  key={char.id}
                  className="p-3 rounded-2xl bg-neutral-950/80 border border-white/10 hover:border-amber-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="w-full h-28 rounded-xl bg-black border border-white/5 flex items-center justify-center p-2 mb-2 relative overflow-hidden">
                    <img src={char.preview} alt={char.name} className="w-full h-full object-contain filter drop-shadow" />
                    {char.isUser && (
                      <span className="absolute bottom-1 right-1 text-[8px] px-1.5 py-0.5 bg-amber-500 text-black font-bold rounded">
                        我的肖像
                      </span>
                    )}
                  </div>
                  <div className="mb-2">
                    <div className="font-bold text-xs text-neutral-200 truncate">{char.name}</div>
                    <div className="text-[10px] text-amber-300 truncate mt-0.5">{char.role}</div>
                  </div>
                  <button
                    onClick={() => handleAddCharacterToCanvas(char)}
                    className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>设为封面出镜肖像</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badge' && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-neutral-300">
              顶部金黄细眉标（Uppercase Letter-spaced Eyebrow Tag）
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-2xl bg-neutral-950/80 border border-white/10 flex flex-col justify-between gap-3"
                >
                  <div className="py-2.5 px-2 rounded-xl bg-black flex items-center justify-center border border-white/5">
                    <span
                      className="text-xs font-black tracking-widest uppercase"
                      style={{ color: b.color }}
                    >
                      {b.text}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const nodes = useStudioStore.getState().nodes;
                      const titleNode = nodes.find((n) => n.type === 'title');
                      if (titleNode) {
                        useStudioStore.getState().updateNodeData(titleNode.id, {
                          eyebrowTag: b.text,
                        });
                      }
                      const editorNode = nodes.find((n) => n.type === 'coverEditor');
                      if (editorNode) {
                        useStudioStore.getState().updateNodeData(editorNode.id, {
                          eyebrowTag: b.text,
                        });
                      }
                      setToast(`🏷️ 已应用金黄细眉标：${b.text}`);
                    }}
                    className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>应用到封面</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
