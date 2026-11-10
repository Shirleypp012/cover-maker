import React, { useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, Upload, Scissors, Sliders, RefreshCw, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { CharacterNodeData } from '../../types/canvas';
import { createCharacterSvg, createVerticalCoverVisual, createYouTubeCoverVisual } from '../../data/sciencePresets';

export const CharacterNode = ({ id, data }: { id: string; data: CharacterNodeData }) => {
  const updateNodeData = useStudioStore((state) => state.updateNodeData);
  const setToast = useStudioStore((state) => state.setToast);
  const nodes = useStudioStore((state) => state.nodes);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scale = data.scale ?? 1.0;
  const posX = data.posX ?? 0;
  const posY = data.posY ?? 0;
  const hasCustomAvatar = Boolean(data.avatarUrl && !data.avatarUrl.includes('data:image/svg+xml'));

  // Propagate character changes to downstream cover editor node
  const syncToCoverEditor = (updatedAvatarUrl?: string, updatedScale?: number, updatedX?: number, updatedY?: number) => {
    const editorNode = nodes.find((n) => n.type === 'coverEditor');
    if (editorNode) {
      const eData = editorNode.data as any;
      const newPreview = createVerticalCoverVisual({
        headlineLine1: eData.overrideHeadlineLine1 || '直接丟給',
        headlineLine2: eData.overrideHeadlineLine2 || '你的bot讀',
        headlineBannerMode: eData.headlineBannerMode,
        subjectType: eData.subjectType || '3d-book',
        brandTitle: eData.overrideBrandTitle || 'Grok Bot',
        creatorTag: eData.creatorTag || '>Jerry_AI.',
        seriesTag: eData.seriesTag || 'Canva Craft ▪',
        subtitle: eData.overrideSubtitle || 'Grok Bot 指南 5 條規則 · 複製即可實裝',
        avatarUrl: updatedAvatarUrl !== undefined ? updatedAvatarUrl : data.avatarUrl,
        avatarScale: updatedScale !== undefined ? updatedScale : scale,
        avatarPosX: updatedX !== undefined ? updatedX : posX,
        avatarPosY: updatedY !== undefined ? updatedY : posY,
        aiHeroImageUrl: eData.aiHeroImageUrl,
        layers: eData?.layers,
      });

      updateNodeData(editorNode.id, {
        previewUrl: newPreview,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const avatarUrl = event.target.result as string;
          const name = file.name.replace(/\.[^/.]+$/, '');
          updateNodeData(id, {
            avatarUrl,
            name,
            role: '我的真实个人肖像',
          });
          syncToCoverEditor(avatarUrl);
          setToast('📸 我的真人肖像照片上传成功！已同步至 YouTube 封面右侧！');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToGrokBot = () => {
    // Empty avatar triggers default GrokBot silver sphere mascot from user reference image
    updateNodeData(id, {
      avatarUrl: '',
      name: 'GrokBot 银质头像 (默认)',
      role: 'YouTube 极简暗黑标志物',
    });
    syncToCoverEditor('');
    setToast('🔄 已切换为 GrokBot 银质标志物');
  };

  const handleSelectStarterSample = (name: string, color: string) => {
    const avatarUrl = createCharacterSvg(name, color);
    updateNodeData(id, {
      avatarUrl,
      name,
      role: '主讲人出镜素材',
    });
    syncToCoverEditor(avatarUrl);
    setToast(`👤 已选用出镜素材：${name}`);
  };

  return (
    <div className="w-[380px] rounded-2xl bg-neutral-900/98 border border-amber-500/40 shadow-2xl shadow-amber-950/40 backdrop-blur-md overflow-hidden text-neutral-100 transition-all hover:border-amber-400">
      {/* Node Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-950/80 via-neutral-900 to-neutral-900 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">我的出镜素材库</div>
            <div className="text-sm font-bold text-neutral-100">{data.label || '真人肖像素材'}</div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
          STAGE 03
        </span>
      </div>

      <div className="p-4 space-y-3.5 text-xs">
        {/* Upload Portrait Hero Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-amber-950/30 to-black/60 border border-amber-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>上传我的真人肖像照片</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {hasCustomAvatar ? '✓ 已上传个人肖像' : '未上传'}
            </span>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            支持上传您本人的清晰半身照或免抠透明肖像 (PNG/JPG)，系统会自动在左侧施加暗黑过渡羽化，与封面背景无缝融合。
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{hasCustomAvatar ? '📸 点击更换我的真人肖像照片' : '📸 点击上传我的真人肖像照片 (PNG/JPG)'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Avatar Display & Real-time Adjustment */}
        <div className="flex gap-3 items-center p-3 rounded-xl bg-neutral-950 border border-white/10">
          <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center group shrink-0 shadow-inner">
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={data.name || '我的肖像'}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-1 text-[9px] text-neutral-500">
                <ImageIcon className="w-6 h-6 mx-auto mb-1 text-neutral-600" />
                GrokBot 银球
              </div>
            )}
            <span className="absolute bottom-1 right-1 text-[9px] px-1 py-0.5 bg-amber-500/90 text-black rounded font-mono font-bold">
              右置
            </span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="font-bold text-neutral-100 text-sm truncate">{data.name || '我的肖像'}</div>
            <div className="text-[10px] text-amber-300 font-mono truncate">{data.role || '支持免抠或带背景真实照片'}</div>
            <div className="pt-1.5 flex items-center gap-2">
              <button
                onClick={handleResetToGrokBot}
                className="text-[10px] px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-white/10 cursor-pointer transition-colors"
              >
                选用 GrokBot 原版银球
              </button>
            </div>
          </div>
        </div>

        {/* Live Positioning Sliders */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-white/10 space-y-2.5">
          <div className="text-[11px] font-bold text-neutral-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>封面右侧肖像位置与大小微调</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[10px] text-neutral-400">
            <div>
              <div className="flex justify-between mb-1">
                <span>缩放比例</span>
                <span className="font-mono text-amber-300">{Math.round(scale * 100)}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={180}
                value={Math.round(scale * 100)}
                onChange={(e) => {
                  const s = Number(e.target.value) / 100;
                  updateNodeData(id, { scale: s });
                  syncToCoverEditor(undefined, s, undefined, undefined);
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>水平左右偏移</span>
                <span className="font-mono text-amber-300">{posX}px</span>
              </div>
              <input
                type="range"
                min={-60}
                max={60}
                value={posX}
                onChange={(e) => {
                  const x = Number(e.target.value);
                  updateNodeData(id, { posX: x });
                  syncToCoverEditor(undefined, undefined, x, undefined);
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Starter Preset Avatars (In case user wants ready-made avatar) */}
        <div>
          <label className="block text-[10px] font-medium text-neutral-400 mb-1.5">
            备选出镜人物示范（未上传肖像前可临时选用）
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { name: '科技测评阿杰', color: '#F5A623', role: '极客连帽衫+耳机' },
              { name: 'AI创客小艾', color: '#E2E8F0', role: '全息眼镜+现代风' },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectStarterSample(p.name, p.color)}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  data.name === p.name
                    ? 'bg-amber-950/40 border-amber-400 text-amber-200'
                    : 'bg-neutral-950/60 border-white/5 hover:border-white/20 text-neutral-300'
                }`}
              >
                <div className="font-bold text-[11px] truncate">{p.name}</div>
                <div className="text-[9px] text-neutral-400 truncate">{p.role}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3.5 h-3.5 !bg-amber-500 !border-2 !border-neutral-900 shadow-md"
      />
    </div>
  );
};
