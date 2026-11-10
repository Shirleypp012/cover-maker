import React, { useState } from 'react';
import {
  Brain,
  Compass,
  Video,
  Layers,
  Server,
  Bot,
  Sparkles,
  Download,
  ChevronDown,
  DollarSign,
  Activity,
  Workflow,
  Check,
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

interface TopNavbarProps {
  onOpenAssets: () => void;
  onOpenMcp: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenAssets, onOpenMcp }) => {
  const {
    activeTab,
    setActiveTab,
    loadPresetWorkflow,
    toggleAgentDrawer,
    isAgentDrawerOpen,
    setToast,
  } = useStudioStore();

  const [isPresetMenuOpen, setIsPresetMenuOpen] = useState(false);

  // Strictly only ONE clean reference template, removed all legacy/useless ones
  const presets = [
    {
      id: 'vertical-minimal',
      label: '🌱 极简 9:16 封面工作流 (参考图排版)',
      color: '#34d399',
    },
  ];

  const handleSelectPreset = (id: string) => {
    loadPresetWorkflow(id);
    setIsPresetMenuOpen(false);
  };

  const handleQuickExport = () => {
    const exportNode = useStudioStore.getState().nodes.find((n) => n.type === 'export');
    if (exportNode) {
      setActiveTab('canvas');
      setToast('🚀 正在跳转至导出节点并准备下载全套平台封面...');
    } else {
      setToast('📥 已准备就绪，您可在多平台导出节点中一键打包！');
    }
  };

  return (
    <header className="h-16 px-5 bg-neutral-950/95 border-b border-white/10 backdrop-blur-2xl flex items-center justify-between text-neutral-100 z-30 select-none">
      {/* Brand & Preset Dropdown */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('canvas')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                Creator Cover Studio
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                9:16 极简版
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 font-medium">
              极简爆款竖屏封面设计平台 (纯白+薄荷绿字级 · 3D质感 · 肖像出镜)
            </div>
          </div>
        </div>

        {/* Preset Workflow Template Selector (Only 1 Single Template) */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsPresetMenuOpen(!isPresetMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>极简 9:16 封面工作流</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {isPresetMenuOpen && (
            <div className="absolute top-10 left-0 w-80 rounded-2xl bg-neutral-900 border border-emerald-500/30 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] text-neutral-400 font-mono flex items-center justify-between">
                <span>精选官方工作流模板 (仅保留 1 个):</span>
                <span className="text-emerald-400 font-bold">参考图标准版</span>
              </div>
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id)}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 hover:bg-emerald-900/40 flex items-center justify-between text-xs text-white transition-colors cursor-pointer"
                >
                  <span className="font-bold truncate text-emerald-300">{p.label}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: p.color }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Studio View Navigation */}
      <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900/80 border border-white/10">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'canvas'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>无限画布</span>
        </button>
        <button
          onClick={() => setActiveTab('competitor')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'competitor'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>竞品情报</span>
        </button>
        <button
          onClick={() => setActiveTab('script-studio')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'script-studio'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>脚本工作室</span>
        </button>
      </nav>

      {/* Right Tools & Export Action */}
      <div className="flex items-center gap-2.5">
        {/* Asset Library Button */}
        <button
          onClick={onOpenAssets}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
          title="素材库 (人物、3D模型、Logo)"
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span className="hidden lg:inline">素材中心</span>
        </button>

        {/* MCP Server Button */}
        <button
          onClick={onOpenMcp}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
          title="MCP 协议服务与外部 Agent 接入"
        >
          <Server className="w-4 h-4 text-indigo-400" />
          <span className="hidden lg:inline">MCP 协议</span>
        </button>

        {/* Brainstorm Agent Toggle */}
        <button
          onClick={toggleAgentDrawer}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
            isAgentDrawerOpen
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
              : 'bg-neutral-900 text-cyan-400 border-cyan-500/30 hover:border-cyan-400'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Agent</span>
        </button>

        {/* Quick Batch Export */}
        <button
          onClick={handleQuickExport}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>批量导出</span>
        </button>
      </div>
    </header>
  );
};
