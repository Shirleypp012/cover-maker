import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Compass, BarChart3, Palette, ExternalLink, ArrowRight, Check } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { ReferenceNodeData } from '../../types/canvas';

export const ReferenceNode = ({ id, data }: { id: string; data: ReferenceNodeData }) => {
  const updateNodeData = useStudioStore((state) => state.updateNodeData);
  const setToast = useStudioStore((state) => state.setToast);

  const handleApplyPalette = () => {
    if (data.extractedPalette && data.extractedPalette.length > 0) {
      const primaryColor = data.extractedPalette[1] || data.extractedPalette[0];
      // Apply to title node
      const titleNodes = useStudioStore.getState().nodes.filter((n) => n.type === 'title');
      if (titleNodes.length > 0) {
        useStudioStore.getState().updateNodeData(titleNodes[0].id, {
          glowColor: primaryColor,
          badgeColor: primaryColor,
        });
      }
      setToast(`🎨 已将竞品色系 ${primaryColor} 应用于封面光晕与标签！`);
    }
  };

  return (
    <div className="w-80 rounded-2xl bg-neutral-900/95 border border-amber-500/30 shadow-2xl shadow-amber-950/40 backdrop-blur-md overflow-hidden text-neutral-100 transition-all hover:border-amber-400">
      {/* Node Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-950/80 via-neutral-900 to-neutral-900 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">竞品封面分析</div>
            <div className="text-sm font-bold text-neutral-100">{data.label || '爆款竞品参考'}</div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
          STAGE 01
        </span>
      </div>

      <div className="p-4 space-y-3.5 text-xs">
        {/* Cover Thumbnail */}
        <div className="relative rounded-xl overflow-hidden bg-neutral-950 border border-white/10 aspect-video">
          <img src={data.imageUrl} alt={data.title} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase">
            {data.platform} // {data.views}播放
          </div>
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-bold">
            CTR 表现分 {data.ctrScore}
          </div>
        </div>

        {/* Title */}
        <div className="font-bold text-sm text-neutral-200 line-clamp-2">
          {data.title}
        </div>

        {/* Analysis Details */}
        <div className="space-y-2 text-[11px] bg-neutral-950/60 p-2.5 rounded-xl border border-white/5">
          <div className="text-neutral-300">
            <span className="text-amber-400 font-semibold">构图方式：</span>
            {data.compositionType}
          </div>
          <div className="text-neutral-300">
            <span className="text-amber-400 font-semibold">色彩策略：</span>
            {data.colorStrategy}
          </div>
        </div>

        {/* Palette Bar */}
        {data.extractedPalette && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>提取的视觉主色系</span>
              <button
                onClick={handleApplyPalette}
                className="text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer"
              >
                应用到工作流 →
              </button>
            </div>
            <div className="flex h-5 rounded-lg overflow-hidden border border-white/10">
              {data.extractedPalette.map((col, idx) => (
                <div
                  key={idx}
                  className="flex-1 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: col }}
                  title={col}
                />
              ))}
            </div>
          </div>
        )}
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
