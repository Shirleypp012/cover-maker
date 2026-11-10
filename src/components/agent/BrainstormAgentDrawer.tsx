import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, RotateCcw, Zap, Terminal, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

export const BrainstormAgentDrawer: React.FC = () => {
  const {
    isAgentDrawerOpen,
    setAgentDrawerOpen,
    agentMessages,
    isAgentThinking,
    sendAgentMessage,
    undo,
  } = useStudioStore();

  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentMessages, isAgentThinking]);

  if (!isAgentDrawerOpen) return null;

  const quickPrompts = [
    '🌱 制作《直接丟給 你的bot讀》3D指南宝典极简排版',
    '🟩 开启绿底色块高亮《第一次做模型 就贏過 Google》',
    '🏎️ 生成《迴圈工程 4 個坑別踩》3D跑道避坑排版',
    '📱 生成《换 AI 主动 来找你》2.5D极简手机排版',
  ];

  const handleSend = () => {
    if (!input.trim() || isAgentThinking) return;
    const msg = input.trim();
    setInput('');
    sendAgentMessage(msg);
  };

  return (
    <div className="absolute top-16 right-4 bottom-4 w-96 rounded-3xl bg-neutral-900/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl shadow-black/80 z-40 flex flex-col overflow-hidden text-neutral-100 animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-neutral-900 via-neutral-900 to-cyan-950/60 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-neutral-100 flex items-center gap-1.5">
              <span>Brainstorm AI Agent</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-cyan-300 font-mono">
              CANVAS CO-PILOT v3.8
            </div>
          </div>
        </div>
        <button
          onClick={() => setAgentDrawerOpen(false)}
          className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Loaded Agent Skills Indicator */}
      <div className="px-4 py-2 bg-cyan-950/30 border-b border-white/5 flex items-center gap-1.5 text-[10px] text-cyan-300 overflow-x-auto whitespace-nowrap">
        <Shield className="w-3 h-3 text-cyan-400 shrink-0" />
        <span className="font-mono text-neutral-400">已挂载 Skills:</span>
        <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">工具效率爆款公式</span>
        <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">多端安全区避让</span>
        <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">专属UI与视觉建模</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {agentMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-xs shadow-md'
                  : 'bg-neutral-950/80 border border-white/10 text-neutral-200 rounded-bl-xs'
              }`}
            >
              <div className="font-medium">{msg.content}</div>

              {/* Step-by-Step Execution Plan Checklist */}
              {msg.steps && msg.steps.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-white/10 space-y-2">
                  <div className="text-[10px] font-bold text-cyan-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      智能节点执行流程 ({msg.steps.filter((s) => s.status === 'completed').length}/{msg.steps.length})
                    </span>
                    {msg.steps.some((s) => s.status === 'running' || s.status === 'in_progress') ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono flex items-center gap-1">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        EXECUTING...
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        ALL DONE
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {msg.steps.map((st, sIdx) => {
                      const isRunning = st.status === 'running' || st.status === 'in_progress';
                      const isDone = st.status === 'completed';
                      return (
                        <div
                          key={sIdx}
                          className={`p-2 rounded-xl border flex items-start gap-2 text-[10px] transition-all ${
                            isRunning
                              ? 'bg-cyan-950/50 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                              : isDone
                              ? 'bg-neutral-900/90 border-white/5'
                              : 'bg-neutral-950/60 border-white/5 opacity-60'
                          }`}
                        >
                          {isRunning ? (
                            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0 mt-0.5" />
                          ) : isDone ? (
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5 shadow-sm">
                              ✓
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-500 border border-neutral-700 flex items-center justify-center font-mono text-[9px] shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-neutral-100 flex items-center justify-between">
                              <span>步骤 {sIdx + 1}: {st.title}</span>
                              {isRunning && (
                                <span className="text-[9px] text-cyan-300 font-mono animate-pulse">执行中</span>
                              )}
                            </div>
                            {st.detail && (
                              <div className="text-neutral-400 text-[9px] mt-0.5 leading-relaxed">
                                {st.detail}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Agent Actions / Snapshot notice */}
              {msg.sender === 'agent' && msg.actionType && (
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3 h-3" /> 已完成画布全量部署
                  </span>
                  <button
                    onClick={undo}
                    className="flex items-center gap-1 text-neutral-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>撤销改动</span>
                  </button>
                </div>
              )}
            </div>
            <span className="text-[9px] text-neutral-600 font-mono mt-1 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isAgentThinking && (
          <div className="p-3.5 rounded-2xl bg-neutral-950/90 border border-cyan-500/30 text-cyan-300 space-y-2 text-xs shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold text-[11px]">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>AI Agent 正在调度智能节点流水线...</span>
            </div>
            <div className="space-y-1 text-[10px] text-neutral-400 pl-6 border-l-2 border-cyan-500/30 font-mono">
              <div className="text-cyan-300">▶ 正在解构受众痛点与核心功能卖点...</div>
              <div>▷ 准备部署对应领域界面 UI 与高光资产</div>
              <div>▷ 计算高 CTR 爆款公式与吸睛光晕</div>
              <div>▷ 自动建立端到端拓扑连线并排版</div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="p-3 bg-neutral-950/40 border-t border-white/5 space-y-1.5">
        <div className="text-[10px] text-neutral-400 font-medium">💡 灵感指令速选</div>
        <div className="flex flex-col gap-1">
          {quickPrompts.slice(0, 2).map((qp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(qp);
                sendAgentMessage(qp);
              }}
              className="text-left px-2.5 py-1.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 border border-white/5 text-[11px] text-neutral-300 hover:text-cyan-300 transition-all truncate cursor-pointer"
            >
              ⚡ {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 bg-neutral-950 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入指令，如：为好用的截图工具 Snipaste 做一套爆款封面..."
            className="flex-1 px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500 text-xs"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isAgentThinking}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold disabled:opacity-40 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
