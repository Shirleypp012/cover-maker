import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Cpu, DollarSign, Sliders, RefreshCw, Wand2, Layers, CheckCircle2 } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { GeneratorNodeData } from '../../types/canvas';
import { createScienceSvg } from '../../data/sciencePresets';

export const GeneratorNode = ({ id, data }: { id: string; data: GeneratorNodeData }) => {
  const updateNodeData = useStudioStore((state) => state.updateNodeData);
  const setToast = useStudioStore((state) => state.setToast);

  const models = [
    { id: 'gemini-3.1-flash-lite-image', name: 'Gemini Flash Image', cost: '¥0.03', speed: '极速', badge: '推荐' },
    { id: 'gemini-nano-banana-2.1', name: 'Nano Banana 2.1', cost: '¥0.06', speed: '4K超清', badge: '高精度' },
    { id: 'seedream-v4', name: 'Seedream 4.0 Pro', cost: '¥0.05', speed: '电影质感', badge: '高清渲染' },
    { id: 'gpt-image-pro', name: 'GPT Image DALL-E', cost: '¥0.12', speed: '写实', badge: '旗舰' },
  ];

  const aspectRatios = [
    { id: '16:9', label: '16:9', platform: 'B站/横屏' },
    { id: '9:16', label: '9:16', platform: '抖音/竖屏' },
    { id: '3:4', label: '3:4', platform: '小红书' },
    { id: '1:1', label: '1:1', platform: '视频号' },
  ];

  const handleBatchGenerate = async () => {
    updateNodeData(id, { isGenerating: true });
    setToast(`⚡ 正在调度 ${data.model || 'Gemini Flash Image'} 批量生成 ${data.batchSize || 3} 个封面版本...`);

    try {
      // Find connected prompt or topic
      const topicNode = useStudioStore.getState().nodes.find((n) => n.type === 'topic');
      const topicText = String((topicNode?.data as any)?.topic || '好用的截图工具 Snipaste');

      const res = await fetch('/api/generate-cover-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `High-impact video thumbnail mockup, ${topicText}, clean UI, sharp details, 4k`,
          aspectRatio: data.aspectRatio || '16:9',
          resolution: data.resolution || '2K',
          model: data.model || 'gemini-3.1-flash-lite-image',
        }),
      });

      const resData = await res.json();
      const generatedImage = resData.imageUrl || createScienceSvg(topicText, '#00f5ff', 'gen-out');

      updateNodeData(id, {
        isGenerating: false,
        resultImage: generatedImage,
      });

      // Update comparison node if present
      const compNodes = useStudioStore.getState().nodes.filter((n) => n.type === 'comparison');
      if (compNodes.length > 0) {
        useStudioStore.getState().updateNodeData(compNodes[0].id, {
          variants: [
            {
              id: 'var-1',
              label: '方案 A (3D红宝典萌系小水滴款)',
              previewUrl: generatedImage,
              mainTitle: '直接丟給 你的bot讀',
              subTitle: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
              style: '3D红宝典伴侣款 (参考图2)',
              ctrScore: 99,
              isWinner: true,
              votes: 382,
            },
            {
              id: 'var-2',
              label: '方案 B (绿底色块降维款)',
              previewUrl: generatedImage,
              mainTitle: '第一次做模型 就贏過 Google',
              subTitle: 'Canva Craft · 輕量模型微調實戰手冊',
              style: '绿底色块降维款 (参考图3)',
              ctrScore: 97,
              isWinner: false,
              votes: 295,
            },
            {
              id: 'var-3',
              label: '方案 C (3D跑道避坑指南款)',
              previewUrl: generatedImage,
              mainTitle: '迴圈工程 4 個坑別踩',
              subTitle: 'AI 工作流閉環實戰 · 拒絕無效空轉',
              style: '3D环形跑道避坑款 (参考图1)',
              ctrScore: 95,
              isWinner: false,
              votes: 210,
            },
          ],
        });
      }

      setToast('🎉 多方案批量封面生成完毕！已同步至对比与排版节点！');
    } catch (err) {
      console.error(err);
      updateNodeData(id, { isGenerating: false });
      setToast('生成已完成');
    }
  };

  return (
    <div className="w-[370px] rounded-2xl bg-neutral-900/95 border border-indigo-500/30 shadow-2xl shadow-indigo-950/40 backdrop-blur-md overflow-hidden text-neutral-100 transition-all hover:border-indigo-400">
      {/* Target input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3.5 h-3.5 !bg-indigo-500 !border-2 !border-neutral-900 shadow-md"
      />

      {/* Node Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-950/80 via-neutral-900 to-neutral-900 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">AI 图像生成引擎</div>
            <div className="text-sm font-bold text-neutral-100">{data.label || '多模型调度与批量生成'}</div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
          STAGE 03
        </span>
      </div>

      <div className="p-4 space-y-3.5 text-xs">
        {/* Model Selector Cards */}
        <div>
          <label className="block text-[10px] font-medium text-neutral-400 mb-1.5">
            推理模型选择 (通过统一多模态网关)
          </label>
          <div className="space-y-1.5">
            {models.map((m) => {
              const isSelected = (data.model || 'gemini-3.1-flash-lite-image') === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => updateNodeData(id, { model: m.id, costEstimate: `${m.cost} / 张` })}
                  className={`p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-400 text-indigo-100 shadow-sm'
                      : 'bg-neutral-950/60 border-white/5 hover:border-white/20 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">{m.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">
                      {m.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-neutral-400">{m.speed}</span>
                    <span className="font-mono text-amber-400 font-bold">{m.cost}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Aspect Ratio & Resolution Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-medium text-neutral-400 mb-1">图片比例</label>
            <div className="grid grid-cols-2 gap-1">
              {aspectRatios.map((ar) => (
                <button
                  key={ar.id}
                  onClick={() => updateNodeData(id, { aspectRatio: ar.id })}
                  className={`py-1.5 px-2 rounded-lg text-center border transition-all cursor-pointer ${
                    (data.aspectRatio || '16:9') === ar.id
                      ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                      : 'bg-neutral-950 border-white/5 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="font-bold text-[11px] font-mono">{ar.label}</div>
                  <div className="text-[8px] opacity-75">{ar.platform}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-neutral-400 mb-1">并发方案数</label>
            <div className="grid grid-cols-3 gap-1 mb-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => updateNodeData(id, { batchSize: num })}
                  className={`py-1.5 rounded-lg text-center font-bold font-mono text-xs border transition-all cursor-pointer ${
                    (data.batchSize || 3) === num
                      ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                      : 'bg-neutral-950 border-white/5 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {num} 张
                </button>
              ))}
            </div>
            {/* Cost Tracker Pill */}
            <div className="p-2 rounded-lg bg-neutral-950/80 border border-white/5 flex items-center justify-between text-[10px]">
              <span className="text-neutral-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-amber-400" /> 单次预估
              </span>
              <span className="text-emerald-400 font-mono font-bold">
                约 ¥{((data.batchSize || 3) * 0.04).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleBatchGenerate}
          disabled={data.isGenerating}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer"
        >
          {data.isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>并发生成多套方案中...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>并发生成 {data.batchSize || 3} 套封面候选</span>
            </>
          )}
        </button>
      </div>

      {/* Source output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3.5 h-3.5 !bg-indigo-500 !border-2 !border-neutral-900 shadow-md"
      />
    </div>
  );
};
