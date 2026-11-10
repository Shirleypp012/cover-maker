import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Type, Sparkles, Tag, Check, Layout, Bookmark } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { TitleNodeData } from '../../types/canvas';
import { createVerticalCoverVisual } from '../../data/sciencePresets';

export const TitleNode = ({ id, data }: { id: string; data: TitleNodeData }) => {
  const updateNodeData = useStudioStore((state) => state.updateNodeData);
  const setToast = useStudioStore((state) => state.setToast);
  const nodes = useStudioStore((state) => state.nodes);

  const headlineLine1 = (data as any).headlineLine1 || (data as any).headlineWhite || '直接丟給';
  const headlineLine2 = (data as any).headlineLine2 || (data as any).headlineAccent || '你的bot讀';
  const headlineBannerMode = Boolean((data as any).headlineBannerMode);
  const brandTitle = (data as any).brandTitle || 'Grok Bot';
  const creatorTag = (data as any).creatorTag || '>Jerry_AI.';
  const seriesTag = (data as any).seriesTag || 'Canva Craft ▪';
  const subTitle = data.subTitle || 'Grok Bot 指南 5 條規則 · 複製即可實裝';

  // Synchronize to downstream cover editor node and update preview
  const syncToCoverEditor = (updates: Record<string, any>) => {
    const editorNode = nodes.find((n) => n.type === 'coverEditor');
    const charNode = nodes.find((n) => n.type === 'character')?.data as any;

    const hl1 = updates.headlineLine1 ?? headlineLine1;
    const hl2 = updates.headlineLine2 ?? headlineLine2;
    const isBanner = updates.headlineBannerMode ?? headlineBannerMode;
    const bt = updates.brandTitle ?? brandTitle;
    const ct = updates.creatorTag ?? creatorTag;
    const st = updates.seriesTag ?? seriesTag;
    const sub = updates.subTitle ?? subTitle;

    if (editorNode) {
      const eData = editorNode.data as any;
      const newPreview = createVerticalCoverVisual({
        headlineLine1: hl1,
        headlineLine2: hl2,
        headlineBannerMode: isBanner,
        brandTitle: bt,
        creatorTag: ct,
        seriesTag: st,
        subtitle: sub,
        subjectType: eData?.subjectType || '3d-book',
        avatarUrl: charNode?.avatarUrl,
        avatarScale: charNode?.scale,
        aiHeroImageUrl: eData?.aiHeroImageUrl,
        layers: eData?.layers,
      });

      updateNodeData(editorNode.id, {
        overrideHeadlineLine1: hl1,
        overrideHeadlineLine2: hl2,
        overrideTitle: `${hl1} ${hl2}`,
        overrideSubtitle: sub,
        overrideBrandTitle: bt,
        creatorTag: ct,
        seriesTag: st,
        headlineBannerMode: isBanner,
        previewUrl: newPreview,
      });
    }
  };

  const handleChange = (key: string, value: any) => {
    updateNodeData(id, { [key]: value });
    syncToCoverEditor({ [key]: value });
  };

  const applyPreset = (preset: {
    line1: string;
    line2: string;
    banner: boolean;
    brand: string;
    series: string;
    sub: string;
    subject: '3d-book' | 'designer-chair' | 'tactile-loop' | 'clean-ui-card';
  }) => {
    const updates = {
      headlineLine1: preset.line1,
      headlineLine2: preset.line2,
      headlineBannerMode: preset.banner,
      brandTitle: preset.brand,
      seriesTag: preset.series,
      subTitle: preset.sub,
      mainTitle: `${preset.line1} ${preset.line2}`,
      headlineWhite: preset.line1,
      headlineAccent: preset.line2,
    };
    updateNodeData(id, updates);

    // Also update editor node subjectType
    const editorNode = nodes.find((n) => n.type === 'coverEditor');
    if (editorNode) {
      updateNodeData(editorNode.id, { subjectType: preset.subject });
    }

    syncToCoverEditor(updates);
    setToast(`✨ 已应用参考图排版风格: 《${preset.line1} ${preset.line2}》`);
  };

  return (
    <div className="w-[390px] rounded-2xl bg-neutral-900/98 border border-emerald-500/40 shadow-2xl shadow-emerald-950/30 backdrop-blur-md overflow-hidden text-neutral-100 transition-all hover:border-emerald-400">
      {/* Target input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3.5 h-3.5 !bg-emerald-400 !border-2 !border-neutral-900 shadow-md"
      />

      {/* Node Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-950/70 via-neutral-900 to-neutral-900 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">参考图极简字级排版</div>
            <div className="text-sm font-bold text-neutral-100">{data.label || '白绿撞色与色块字级'}</div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
          STAGE 04
        </span>
      </div>

      <div className="p-4 space-y-3 text-xs">
        {/* Exact Reference Typography Live Preview Card */}
        <div className="p-4 rounded-xl bg-[#080C14] border border-emerald-500/30 relative overflow-hidden select-none space-y-2 text-left">
          {/* Top Brand/Author Tag */}
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="font-bold text-white tracking-wide">
              <span className="text-emerald-400 font-extrabold mr-0.5">&gt;</span>
              {creatorTag.replace(/^>/, '')}
            </span>
            <span className="text-neutral-400 font-medium flex items-center gap-1">
              {seriesTag}
            </span>
          </div>

          {/* Typography Display */}
          <div className="pt-1 space-y-1">
            <div className="text-2xl font-black text-white tracking-tight leading-tight font-['Noto_Sans_SC',system-ui]">
              {headlineLine1}
            </div>

            {headlineBannerMode ? (
              <div className="inline-block px-3 py-1 bg-[#10B981] rounded-sm text-[#05080E] font-black text-2xl tracking-tight leading-tight font-['Noto_Sans_SC',system-ui] shadow-md">
                {headlineLine2}
              </div>
            ) : (
              <div className="text-2xl font-black text-[#34D399] tracking-tight leading-tight font-['Noto_Sans_SC',system-ui]">
                {headlineLine2}
              </div>
            )}
          </div>

          {/* Subtitle */}
          <div className="text-[10px] text-neutral-400 pt-1 border-t border-white/5 truncate font-medium">
            {subTitle}
          </div>
        </div>

        {/* Quick Style Switcher matching the 4 reference cards */}
        <div>
          <div className="text-[10px] text-neutral-400 font-medium mb-1.5 flex items-center justify-between">
            <span>参考图 4 大款型一键套用:</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() =>
                applyPreset({
                  line1: '直接丟給',
                  line2: '你的bot讀',
                  banner: false,
                  brand: 'Grok Bot',
                  series: 'Grok Bot ▪',
                  sub: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
                  subject: '3d-book',
                })
              }
              className="p-2 rounded-lg bg-neutral-950 border border-white/10 hover:border-emerald-500/50 text-left cursor-pointer transition-all hover:bg-neutral-800"
            >
              <div className="font-bold text-white text-[11px] truncate">🌱 3D红宝典款</div>
              <div className="text-[9px] text-emerald-400 truncate">直接丟給 / 你的bot讀</div>
            </button>

            <button
              onClick={() =>
                applyPreset({
                  line1: '第一次做模型',
                  line2: '就贏過 Google',
                  banner: true,
                  brand: 'Canva Craft',
                  series: 'Canva Craft ▪',
                  sub: 'Canva Craft · 輕量模型微調實戰手冊',
                  subject: 'designer-chair',
                })
              }
              className="p-2 rounded-lg bg-neutral-950 border border-white/10 hover:border-emerald-500/50 text-left cursor-pointer transition-all hover:bg-neutral-800"
            >
              <div className="font-bold text-white text-[11px] truncate">🟩 绿底色块款</div>
              <div className="text-[9px] text-emerald-300 truncate">就贏過 Google (色块)</div>
            </button>

            <button
              onClick={() =>
                applyPreset({
                  line1: '迴圈工程',
                  line2: '4 個坑別踩',
                  banner: false,
                  brand: '迴圈工程',
                  series: 'System Pro ▪',
                  sub: 'AI 工作流閉環實戰 · 拒絕無效空轉',
                  subject: 'tactile-loop',
                })
              }
              className="p-2 rounded-lg bg-neutral-950 border border-white/10 hover:border-emerald-500/50 text-left cursor-pointer transition-all hover:bg-neutral-800"
            >
              <div className="font-bold text-white text-[11px] truncate">🏎️ 3D跑道款</div>
              <div className="text-[9px] text-emerald-400 truncate">迴圈工程 / 4 個坑別踩</div>
            </button>

            <button
              onClick={() =>
                applyPreset({
                  line1: '換 AI 主動',
                  line2: '來找你',
                  banner: false,
                  brand: 'Claude Duet',
                  series: 'Claude ▪',
                  sub: '主動式 AI 助手設定教學',
                  subject: 'clean-ui-card',
                })
              }
              className="p-2 rounded-lg bg-neutral-950 border border-white/10 hover:border-emerald-500/50 text-left cursor-pointer transition-all hover:bg-neutral-800"
            >
              <div className="font-bold text-white text-[11px] truncate">📱 极简手机款</div>
              <div className="text-[9px] text-emerald-400 truncate">換 AI 主動 / 來找你</div>
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-2 pt-1">
          {/* Brand & Author */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">
                作者 Handle (如 &gt;Jerry_AI.)
              </label>
              <input
                type="text"
                value={creatorTag}
                onChange={(e) => handleChange('creatorTag', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">
                系列标签 (如 Canva Craft ▪)
              </label>
              <input
                type="text"
                value={seriesTag}
                onChange={(e) => handleChange('seriesTag', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-neutral-200 text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Headline Line 1 & Line 2 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-white font-bold block mb-1">
                主标题 第 1 行 (纯白字)
              </label>
              <input
                type="text"
                value={headlineLine1}
                onChange={(e) => handleChange('headlineLine1', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white font-black text-xs focus:outline-none focus:border-emerald-400"
                placeholder="直接丟給"
              />
            </div>
            <div>
              <label className="text-[10px] text-emerald-400 font-bold block mb-1">
                主标题 第 2 行 (薄荷绿重点)
              </label>
              <input
                type="text"
                value={headlineLine2}
                onChange={(e) => handleChange('headlineLine2', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-emerald-300 font-black text-xs focus:outline-none focus:border-emerald-400"
                placeholder="你的bot讀"
              />
            </div>
          </div>

          {/* Solid Mint Green Banner Block Toggle (就赢过Google款) */}
          <div className="p-2.5 rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>绿底色块高亮模式</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  参考图3款
                </span>
              </div>
              <div className="text-[10px] text-neutral-400">
                将第2行文字包裹在实心薄荷绿矩形块内（黑字高对比），如《就赢过 Google》
              </div>
            </div>
            <button
              onClick={() => handleChange('headlineBannerMode', !headlineBannerMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                headlineBannerMode
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {headlineBannerMode ? '已开启' : '开启'}
            </button>
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-[10px] text-neutral-400 font-medium block mb-1">
              核心实操副标题
            </label>
            <input
              type="text"
              value={subTitle}
              onChange={(e) => handleChange('subTitle', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-neutral-200 text-xs focus:outline-none focus:border-emerald-400"
              placeholder="Grok Bot 指南 5 條規則 · 複製即可實裝"
            />
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
