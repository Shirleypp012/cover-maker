import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { PenTool, Layout, Maximize2, Sparkles } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { SketchNodeData } from '../../types/canvas';

export const SketchNode = ({ id, data }: { id: string; data: SketchNodeData }) => {
  const updateNodeData = useStudioStore((state) => state.updateNodeData);
  const setToast = useStudioStore((state) => state.setToast);

  const layouts = [
    { id: 'thirds', name: '三分构图', desc: '左侧人物 + 右侧核心主体 + 底部大标题' },
    { id: 'center-burst', name: '中心爆发', desc: '中央3D高能主体 + 顶部警示标题' },
    { id: 'diagonal-split', name: '对角线冲击', desc: '左上角人物 + 右下角实验装置' },
    { id: 'golden-ratio', name: '黄金螺旋', desc: '视线焦点落于黄金分割交点' },
  ];

  const handleSelectLayout = (layoutId: any) => {
    updateNodeData(id, { layoutType: layoutId });
    setToast(`📐 已切换封面构图草图规划：${layoutId}`);
  };

  return (
    <div className="w-80 rounded-2xl bg-neutral-900/95 border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 backdrop-blur-md overflow-hidden text-neutral-100 transition-all hover:border-emerald-400">
      {/* Target input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3.5 h-3.5 !bg-emerald-500 !border-2 !border-neutral-900 shadow-md"
      />

      {/* Node Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-950/80 via-neutral-900 to-neutral-900 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">草图构图规划</div>
            <div className="text-sm font-bold text-neutral-100">{data.label || '空间布局线框'}</div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
          STAGE 02
        </span>
      </div>

      <div className="p-4 space-y-3.5 text-xs">
        {/* Interactive Layout Wireframe Board */}
        <div className="relative rounded-xl overflow-hidden bg-neutral-950 border border-dashed border-emerald-500/30 aspect-video p-3 flex flex-col justify-between">
          {/* Top/Side Zones according to selected layout */}
          {data.layoutType === 'center-burst' ? (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <div className="w-24 h-24 rounded-full border-2 border-emerald-400/80 bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-300 animate-pulse">
                3D核心爆发区
              </div>
              <div className="absolute top-1 inset-x-2 py-1 bg-pink-500/20 border border-pink-500/40 rounded text-center text-[9px] text-pink-200">
                标题通栏区
              </div>
            </div>
          ) : (
            <div className="w-full h-full grid grid-cols-12 gap-1.5 relative">
              {/* Person zone */}
              <div className="col-span-5 h-full rounded-lg bg-purple-500/15 border border-purple-400/40 flex flex-col items-center justify-center text-center p-1 text-[10px] text-purple-300">
                <span>讲师出镜</span>
                <span className="text-[8px] opacity-75">3/4 黄金侧脸</span>
              </div>
              {/* Subject zone */}
              <div className="col-span-7 h-full rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex flex-col items-center justify-center text-center p-1 text-[10px] text-cyan-300">
                <span>核心视觉主体</span>
                <span className="text-[8px] opacity-75">软件UI/星盘/对比卡片</span>
              </div>
              {/* Overlay Title bar */}
              <div className="absolute bottom-1 inset-x-1 py-1 rounded bg-pink-500/25 border border-pink-400/50 text-center text-[9px] font-bold text-pink-100 backdrop-blur-sm">
                爆款主标题 + 极限量化副标题
              </div>
            </div>
          )}
        </div>

        {/* Layout Mode Selector */}
        <div>
          <label className="block text-[10px] font-medium text-neutral-400 mb-1.5">
            构图法则方案
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {layouts.map((l) => (
              <button
                key={l.id}
                onClick={() => handleSelectLayout(l.id)}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  data.layoutType === l.id
                    ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200 shadow-sm'
                    : 'bg-neutral-950/60 border-white/5 hover:border-white/20 text-neutral-300'
                }`}
              >
                <div className="font-semibold text-[11px]">{l.name}</div>
                <div className="text-[9px] text-neutral-400 truncate">{l.desc}</div>
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
        className="w-3.5 h-3.5 !bg-emerald-500 !border-2 !border-neutral-900 shadow-md"
      />
    </div>
  );
};
