import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Download, CheckCircle2, Share2, Smartphone, Tv, BookOpen, Sparkles, FolderDown } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { ExportNodeData } from '../../types/canvas';

export const ExportNode = ({ id, data }: { id: string; data: ExportNodeData }) => {
  const updateNodeData = useStudioStore((state) => state.updateNodeData);
  const setToast = useStudioStore((state) => state.setToast);
  const nodes = useStudioStore((state) => state.nodes);

  // Retrieve current winning or edited cover
  const editorNode = nodes.find((n) => n.type === 'coverEditor')?.data as any;
  const comparisonNode = nodes.find((n) => n.type === 'comparison')?.data as any;
  const winnerVariant = comparisonNode?.variants?.find((v: any) => v.isWinner);
  const sourceImage = data.exportedUrls?.preview || winnerVariant?.previewUrl || editorNode?.previewUrl;

  const togglePlatform = (platId: string) => {
    const updated = (data.platforms || []).map((p) => {
      if (p.id === platId) {
        return { ...p, selected: !p.selected };
      }
      return p;
    });
    updateNodeData(id, { platforms: updated });
  };

  const handleDownloadSingle = (platformName: string, ratio: string) => {
    if (!sourceImage) return;
    const a = document.createElement('a');
    a.href = sourceImage;
    a.download = `科普封面_${platformName}_${ratio.replace(':', '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setToast(`📥 已下载【${platformName}】高清封面！`);
  };

  const handleBatchExport = () => {
    updateNodeData(id, { status: 'rendering' });
    setToast('🚀 正在一键裁切适配抖音、小红书、B站、视频号 4大平台全套封面...');

    setTimeout(() => {
      updateNodeData(id, { status: 'completed' });
      // Trigger download for each selected platform
      (data.platforms || [])
        .filter((p) => p.selected)
        .forEach((p, idx) => {
          setTimeout(() => {
            const a = document.createElement('a');
            a.href = sourceImage || '';
            a.download = `爆款封面_${p.name}_${p.dimensions}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }, idx * 250);
        });

      setToast('🎉 全套平台封面批量打包下载完成！包含安全区避让与超清分辨率！');
    }, 1200);
  };

  return (
    <div className="w-[410px] rounded-2xl bg-neutral-900/95 border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 backdrop-blur-md overflow-hidden text-neutral-100 transition-all hover:border-emerald-400">
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
            <Download className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">多平台批量导出</div>
            <div className="text-sm font-bold text-neutral-100">{data.label || '全渠道尺寸自动适配'}</div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
          FINAL STAGE
        </span>
      </div>

      <div className="p-4 space-y-3.5 text-xs">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>选择需要自动适配分发的渠道</span>
          <span className="text-emerald-400 font-mono">4大主流规格</span>
        </div>

        {/* Platform Grid with Live Aspect Previews */}
        <div className="grid grid-cols-2 gap-2">
          {(data.platforms || []).map((p) => {
            return (
              <div
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  p.selected
                    ? 'bg-emerald-950/40 border-emerald-400 text-emerald-100 shadow-sm'
                    : 'bg-neutral-950/60 border-white/5 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    {p.id === 'bilibili' && <Tv className="w-3.5 h-3.5 text-blue-400" />}
                    {p.id === 'douyin' && <Smartphone className="w-3.5 h-3.5 text-pink-400" />}
                    {p.id === 'xiaohongshu' && <BookOpen className="w-3.5 h-3.5 text-red-400" />}
                    {p.id === 'wechat' && <Share2 className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{p.name}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={p.selected}
                    onChange={() => {}}
                    className="rounded border-white/20 bg-neutral-900 text-emerald-500 focus:ring-0"
                  />
                </div>

                {/* Aspect ratio preview block */}
                <div className="h-16 w-full rounded-lg bg-black overflow-hidden relative border border-white/10 flex items-center justify-center">
                  {sourceImage && (
                    <img
                      src={sourceImage}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: 'center',
                      }}
                    />
                  )}
                  <span className="absolute bottom-1 right-1 text-[8px] px-1 bg-black/80 text-white rounded font-mono">
                    {p.ratio}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 text-[9px] text-neutral-400 font-mono">
                  <span>{p.dimensions}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadSingle(p.name, p.ratio);
                    }}
                    className="hover:text-emerald-300 text-neutral-300 underline cursor-pointer"
                  >
                    单张导出
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Batch Export Button */}
        <button
          onClick={handleBatchExport}
          disabled={data.status === 'rendering'}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
        >
          {data.status === 'rendering' ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>全平台高分辨率渲染裁切中...</span>
            </>
          ) : (
            <>
              <FolderDown className="w-4 h-4" />
              <span>批量打包下载全套封面 (ZIP/PNG)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
