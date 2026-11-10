import React, { useState } from 'react';
import { Terminal, Copy, Check, X, Server, Sparkles, Code2, Play, ExternalLink } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

export const McpModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const setToast = useStudioStore((state) => state.setToast);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [simulatedTool, setSimulatedTool] = useState('extract_topic_knowledge');
  const [simulatedOutput, setSimulatedOutput] = useState<string | null>(null);

  if (!isOpen) return null;

  const mcpConfigJson = JSON.stringify(
    {
      mcpServers: {
        'knowledge-cover-studio': {
          command: 'npx',
          args: ['-y', 'mcp-remote-client', 'http://localhost:3000/api/mcp/manifest'],
          env: {
            STUDIO_API_URL: 'http://localhost:3000',
          },
        },
      },
    },
    null,
    2
  );

  const tools = [
    {
      name: 'extract_topic_knowledge',
      desc: '从视频选题、工具教程或星座脚本中，提取核心知识点与卖点、3组爆款标题及界面视觉提示词',
      params: 'topic: string, script?: string, platform?: string',
    },
    {
      name: 'generate_science_visual',
      desc: '调用云端统一多模态网关生成软件UI、AI工作台、实操对比分屏或星座星盘资产',
      params: 'prompt: string, style: string, resolution: "1K"|"2K"|"4K"',
    },
    {
      name: 'execute_canvas_action',
      desc: '供 Claude / Cursor 直接控制画布：创建节点、连线、批量生成A/B方案、智能流水线排版',
      params: 'action: "CREATE_WORKFLOW"|"AUTO_LAYOUT"|"ADD_NODE", params: object',
    },
    {
      name: 'batch_export_covers',
      desc: '一键将指定封面以各平台安全区规范裁切导出（抖音9:16、小红书3:4、B站16:9）',
      params: 'nodeId: string, platforms: string[]',
    },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setToast('📋 MCP 配置代码已复制到剪贴板！');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSimulateRun = () => {
    if (simulatedTool === 'extract_topic_knowledge') {
      setSimulatedOutput(
        JSON.stringify(
          {
            status: 'success',
            coreConcept: 'F1截图 + F3贴图置顶',
            suggestedTitle: '别再用微信截图了！这个免费神器彻底封神',
            ctrScore: 97,
            canvasActionDispatched: 'SYNC_TO_NODE_TOPIC',
          },
          null,
          2
        )
      );
    } else {
      setSimulatedOutput(
        JSON.stringify(
          {
            status: 'success',
            message: `Tool ${simulatedTool} executed successfully on Knowledge Cover Studio canvas.`,
            timestamp: Date.now(),
          },
          null,
          2
        )
      );
    }
    setToast(`⚡ MCP 工具 ${simulatedTool} 模拟调用成功！`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col text-neutral-100 max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-neutral-900 via-neutral-900 to-indigo-950/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base text-neutral-100 flex items-center gap-2">
                <span>Model Context Protocol (MCP) 集成服务器</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  ONLINE v1.2.0
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                赋能 Claude Desktop、Claude Code、Cursor 等外部 Agent 深度参与封面创作
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Config snippet for Claude Desktop / Cursor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-200 flex items-center gap-1.5 text-xs">
                <Code2 className="w-4 h-4 text-cyan-400" />
                Claude Desktop / Cursor 客户端配置 (claude_desktop_config.json)
              </span>
              <button
                onClick={() => handleCopy(mcpConfigJson, 'mcp')}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer text-xs"
              >
                {copiedKey === 'mcp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>复制配置 JSON</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
              {mcpConfigJson}
            </pre>
          </div>

          {/* Exposed MCP Tools List */}
          <div className="space-y-3">
            <div className="font-bold text-neutral-200 text-xs">
              已就绪的 4 项核心创作 Tools:
            </div>
            <div className="space-y-2">
              {tools.map((t) => (
                <div
                  key={t.name}
                  className="p-3.5 rounded-2xl bg-neutral-950/70 border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-300 text-xs">{t.name}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">MCP RPC</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">{t.desc}</p>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    参数: {t.params}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Simulator Test Console */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-300 flex items-center gap-1.5 text-xs">
                <Terminal className="w-4 h-4 text-emerald-400" />
                MCP 工具在线联调沙箱 (Simulation Console)
              </span>
              <button
                onClick={handleSimulateRun}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Play className="w-3 h-3 fill-black" />
                <span>发送测试 RPC</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-[11px]">调用工具:</span>
              <select
                value={simulatedTool}
                onChange={(e) => setSimulatedTool(e.target.value)}
                className="px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-cyan-500 font-mono"
              >
                {tools.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {simulatedOutput && (
              <pre className="p-3 rounded-xl bg-black border border-white/5 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                {simulatedOutput}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
