import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Layers, Eye, RefreshCw, Wand2, Sparkles, Smartphone, Check } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { ScienceVisualNodeData } from '../../types/canvas';
import { createVerticalCoverVisual } from '../../data/sciencePresets';

export const ScienceVisualNode = ({ id, data }: { id: string; data: ScienceVisualNodeData }) => {
  const updateNodeData = useStudioStore((state) => state.updateNodeData);
  const setToast = useStudioStore((state) => state.setToast);
  const nodes = useStudioStore((state) => state.nodes);

  const topicNode = nodes.find((n) => n.type === 'topic')?.data as any;
  const titleNode = nodes.find((n) => n.type === 'title')?.data as any;
  const charNode = nodes.find((n) => n.type === 'character')?.data as any;

  const [promptInput, setPromptInput] = useState(
    data.prompt ||
      'Clean minimalist 3D editorial design object, tactile matte clay/leather texture, 3d red guidebook with friendly small colorful companion droplets, soft studio overhead lighting, deep dark matte navy background #080C14, zero neon slop, zero robotic laser lines, modern aesthetic 8k'
  );
  const [showFullImage, setShowFullImage] = useState(false);

  const handleGenerate = async () => {
    updateNodeData(id, { isGenerating: true, prompt: promptInput });
    const currentTopic = topicNode?.topic || titleNode?.brandTitle || 'Grok Bot';
    setToast(`🎨 正在为《${currentTopic}》智能生成极简质感 3D 实体画面 (告别刺眼荧光与机械味)...`);

    try {
      const res = await fetch('/api/generate-cover-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput,
          topic: currentTopic,
          style: 'vertical-hero',
          aspectRatio: data.aspectRatio || '9:16',
          resolution: data.resolution || '2K',
          brandTitle: titleNode?.brandTitle || 'Grok Bot',
        }),
      });
      const result = await res.json();
      if (result.success && result.imageUrl) {
        updateNodeData(id, {
          imageUrl: result.imageUrl,
          isGenerating: false,
        });

        // Also update downstream editor
        const editorNodes = nodes.filter((n) => n.type === 'coverEditor');
        if (editorNodes.length > 0) {
          updateNodeData(editorNodes[0].id, {
            aiHeroImageUrl: result.imageUrl,
            previewUrl: result.imageUrl,
          });
        }
        setToast('✨ 9:16 极简质感主体已智能生成并挂载至封面！');
      }
    } catch (e) {
      console.error(e);
      // Fallback procedural regeneration
      const fallbackSvg = createVerticalCoverVisual({
        headlineLine1: titleNode?.headlineLine1 || '直接丟給',
        headlineLine2: titleNode?.headlineLine2 || '你的bot讀',
        brandTitle: titleNode?.brandTitle || 'Grok Bot',
        creatorTag: titleNode?.creatorTag || '>Jerry_AI.',
        seriesTag: titleNode?.seriesTag || 'Canva Craft ▪',
        subtitle: titleNode?.subTitle || 'Grok Bot 指南 5 條規則 · 複製即可實裝',
        avatarUrl: charNode?.avatarUrl,
        avatarScale: charNode?.scale,
      });

      updateNodeData(id, { imageUrl: fallbackSvg, isGenerating: false });
      setToast('✨ 已重新加载高质感 3D 实体模型');
    }
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
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              9:16 竖屏视觉架构
            </div>
            <div className="text-sm font-bold text-neutral-100">
              {data.label || '视觉素材与智能生图'}
            </div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
          STAGE 02
        </span>
      </div>

      <div className="p-4 space-y-3.5 text-xs">
        {/* Visual Preview Window (9:16 Vertical) */}
        <div className="relative rounded-xl overflow-hidden bg-[#080C14] border border-white/10 aspect-[9/16] w-[210px] mx-auto group shadow-2xl">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt="Visual Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 gap-2">
              <Layers className="w-8 h-8 opacity-40 text-emerald-500" />
              <span>暂无渲染图像，点击下方生成</span>
            </div>
          )}

          {/* Overlay Tag */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
            9:16 VERTICAL // {data.resolution || '2K'}
          </div>

          {/* Quick Actions Hover */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowFullImage(true)}
              className="p-1.5 rounded bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-white/10 cursor-pointer"
              title="全屏放大查看"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Style Description: No neon, no mechanical slop */}
        <div className="p-2.5 rounded-xl bg-neutral-950 border border-emerald-500/20 text-[11px] text-neutral-300 space-y-1">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>智能生图：上面的图根据主题智能生图</span>
          </div>
          <p className="text-[10px] text-neutral-400 leading-relaxed">
            告别刺眼荧光与机械网格，采用高级哑光深色背景与温暖质感 3D 实体（指南红宝典、包豪斯皮椅、黏土跑道、极简手机）。
          </p>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">
            画面主体生成 Prompt (极简无荧光风格)
          </label>
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-neutral-950/80 border border-white/10 rounded-xl text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-400 text-xs leading-relaxed resize-none"
            placeholder="输入画面描述..."
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={data.isGenerating}
          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
        >
          {data.isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>正在智能生成主题主体...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>🎨 智能 AI 生图 (根据主题一键生成画面)</span>
            </>
          )}
        </button>
      </div>

      {/* Source output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3.5 h-3.5 !bg-emerald-400 !border-2 !border-neutral-900 shadow-md"
      />

      {/* Lightbox Modal */}
      {showFullImage && data.imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setShowFullImage(false)}
        >
          <img
            src={data.imageUrl}
            alt="Full Preview"
            className="max-h-[90vh] rounded-2xl border border-white/20 shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
};
