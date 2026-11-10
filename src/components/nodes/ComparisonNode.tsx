import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, Trophy, BarChart2, ThumbsUp, Sparkles, ArrowRight } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { ComparisonNodeData } from '../../types/canvas';

export const ComparisonNode = ({ id, data }: { id: string; data: ComparisonNodeData }) => {
  const updateNodeData = useStudioStore((state) => state.updateNodeData);
  const setToast = useStudioStore((state) => state.setToast);

  const handlePickWinner = (variantId: string) => {
    const updated = (data.variants || []).map((v) => ({
      ...v,
      isWinner: v.id === variantId,
    }));
    updateNodeData(id, {
      variants: updated,
      selectedWinnerId: variantId,
    });

    const winner = updated.find((v) => v.id === variantId);
    if (winner) {
      // Sync winner preview image to export node
      const exportNodes = useStudioStore.getState().nodes.filter((n) => n.type === 'export');
      if (exportNodes.length > 0) {
        useStudioStore.getState().updateNodeData(exportNodes[0].id, {
          exportedUrls: {
            preview: winner.previewUrl,
          },
        });
      }
      setToast(`🏆 已选定【${winner.label}】为最终胜出封面，并推送至批量导出节点！`);
    }
  };

  const handleVote = (e: React.MouseEvent, variantId: string) => {
    e.stopPropagation();
    const updated = (data.variants || []).map((v) => {
      if (v.id === variantId) {
        return { ...v, votes: (v.votes || 50) + 1 };
      }
      return v;
    });
    updateNodeData(id, { variants: updated });
    setToast('👍 已为该版本投票，AI 正在重新微调点击率权重');
  };

  return (
    <div className="w-[400px] rounded-2xl bg-neutral-900/95 border border-amber-500/30 shadow-2xl shadow-amber-950/40 backdrop-blur-md overflow-hidden text-neutral-100 transition-all hover:border-amber-400">
      {/* Target input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3.5 h-3.5 !bg-amber-500 !border-2 !border-neutral-900 shadow-md"
      />

      {/* Node Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-950/80 via-neutral-900 to-neutral-900 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">A/B/C 方案对比</div>
            <div className="text-sm font-bold text-neutral-100">{data.label || '点击率赛马评测'}</div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
          STAGE 05
        </span>
      </div>

      <div className="p-4 space-y-3.5 text-xs">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>多版本点击率预测对比</span>
          <span className="text-amber-400 font-medium">点击卡片选定胜出封面</span>
        </div>

        {/* Variants List */}
        <div className="space-y-2.5">
          {(data.variants || []).map((v) => {
            const isWinner = v.isWinner || data.selectedWinnerId === v.id;
            return (
              <div
                key={v.id}
                onClick={() => handlePickWinner(v.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex gap-3 items-center ${
                  isWinner
                    ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-950/30'
                    : 'bg-neutral-950/60 border-white/5 hover:border-white/20 text-neutral-300'
                }`}
              >
                {/* Thumbnail (9:16 vertical) */}
                <div className="relative w-14 h-24 rounded-lg overflow-hidden bg-black shrink-0 border border-white/10 aspect-[9/16]">
                  <img src={v.previewUrl} alt={v.label} className="w-full h-full object-cover" />
                  {isWinner && (
                    <div className="absolute top-1 left-1 px-1 py-0.2 bg-amber-500 text-black text-[7px] font-black rounded">
                      WINNER
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-neutral-100 text-xs truncate">{v.label}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                      CTR {v.ctrScore}%
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-300 font-semibold truncate">
                    {v.mainTitle}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400">
                    <span className="truncate">{v.style}</span>
                    <button
                      onClick={(e) => handleVote(e, v.id)}
                      className="flex items-center gap-1 hover:text-amber-400 transition-colors px-1 py-0.5 rounded bg-neutral-900 border border-white/5 cursor-pointer"
                    >
                      <ThumbsUp className="w-2.5 h-2.5" />
                      <span>{v.votes || 42}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Source output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3.5 h-3.5 !bg-amber-500 !border-2 !border-neutral-900 shadow-md"
      />
    </div>
  );
};
