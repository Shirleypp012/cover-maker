import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useStudioStore } from '../../store/useStudioStore';
import { TopicNode } from '../nodes/TopicNode';
import { ScienceVisualNode } from '../nodes/ScienceVisualNode';
import { CharacterNode } from '../nodes/CharacterNode';
import { TitleNode } from '../nodes/TitleNode';
import { ReferenceNode } from '../nodes/ReferenceNode';
import { SketchNode } from '../nodes/SketchNode';
import { GeneratorNode } from '../nodes/GeneratorNode';
import { CoverEditorNode } from '../nodes/CoverEditorNode';
import { ComparisonNode } from '../nodes/ComparisonNode';
import { ExportNode } from '../nodes/ExportNode';

import {
  Plus,
  RotateCcw,
  RotateCw,
  Sparkles,
  LayoutGrid,
  Bot,
  Brain,
  Layers,
  User,
  Type,
  PenTool,
  Compass,
  Cpu,
  Trophy,
  Download,
  Trash2,
  Copy,
} from 'lucide-react';
import { NodeKind } from '../../types/canvas';

export const CanvasWorkspace: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    duplicateNode,
    autoLayout,
    undo,
    redo,
    historyIndex,
    history,
    selectedNodeId,
    setSelectedNodeId,
    toggleAgentDrawer,
    isAgentDrawerOpen,
  } = useStudioStore();

  const nodeTypes = useMemo(
    () => ({
      topic: TopicNode,
      scienceVisual: ScienceVisualNode,
      character: CharacterNode,
      title: TitleNode,
      reference: ReferenceNode,
      sketch: SketchNode,
      generator: GeneratorNode,
      coverEditor: CoverEditorNode,
      comparison: ComparisonNode,
      export: ExportNode,
    }),
    []
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={1.8}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#06b6d4', strokeWidth: 2 },
        }}
      >
        {/* Background Grid Pattern */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#334155"
          className="opacity-40"
        />

        <Controls
          className="!bg-neutral-900/90 !border-white/10 !fill-neutral-300 !rounded-xl !shadow-2xl overflow-hidden [&>button]:!bg-neutral-900 [&>button]:!border-white/5 [&>button:hover]:!bg-neutral-800"
          showInteractive={false}
        />

        <MiniMap
          nodeStrokeColor="#06b6d4"
          nodeColor="#1e293b"
          nodeBorderRadius={8}
          maskColor="rgba(2, 6, 23, 0.75)"
          className="!bg-neutral-950/80 !border !border-white/10 !rounded-2xl !overflow-hidden !shadow-2xl"
          zoomable
          pannable
        />

        {/* Top-Center Floating Node Palette & Controls */}
        <Panel position="top-center" className="flex items-center gap-2">
          {/* Quick Node Add Pills */}
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-neutral-900/90 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/80">
            <span className="text-[10px] font-bold text-neutral-400 px-2 uppercase tracking-wider font-mono">
              + 节点
            </span>
            <button
              onClick={() => addNode('topic')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all cursor-pointer"
              title="添加选题知识点解构节点"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>选题</span>
            </button>
            <button
              onClick={() => addNode('scienceVisual')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-950/50 hover:bg-blue-900/60 border border-blue-500/30 text-blue-300 text-xs font-medium transition-all cursor-pointer"
              title="添加视觉素材模型节点"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>视觉素材</span>
            </button>
            <button
              onClick={() => addNode('character')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all cursor-pointer"
              title="添加讲师人物素材节点"
            >
              <User className="w-3.5 h-3.5" />
              <span>人物</span>
            </button>
            <button
              onClick={() => addNode('title')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-pink-950/50 hover:bg-pink-900/60 border border-pink-500/30 text-pink-300 text-xs font-medium transition-all cursor-pointer"
              title="添加封面标题排版节点"
            >
              <Type className="w-3.5 h-3.5" />
              <span>标题</span>
            </button>
            <button
              onClick={() => addNode('sketch')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all cursor-pointer"
              title="添加草图空间规划节点"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>草图</span>
            </button>
            <button
              onClick={() => addNode('generator')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all cursor-pointer"
              title="添加AI多模型批量生成节点"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>生图</span>
            </button>
            <button
              onClick={() => addNode('coverEditor')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-950/50 hover:bg-teal-900/60 border border-teal-500/30 text-teal-300 text-xs font-medium transition-all cursor-pointer"
              title="添加封面合成与安全区节点"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>合成</span>
            </button>
            <button
              onClick={() => addNode('comparison')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all cursor-pointer"
              title="添加A/B/C方案对比节点"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>对比</span>
            </button>
            <button
              onClick={() => addNode('export')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all cursor-pointer"
              title="添加多端批量导出节点"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>
          </div>

          {/* Workflow & History Actions */}
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-neutral-900/90 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/80">
            <button
              onClick={autoLayout}
              className="p-2 rounded-xl hover:bg-neutral-800 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              title="智能流水线自动排版整理"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
              title="撤销 (Undo)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
              title="重做 (Redo)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Selected Node Actions Pill (when a node is selected) */}
          {selectedNodeId && (
            <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-neutral-900/95 border border-cyan-500/40 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-200">
              <span className="text-[10px] text-cyan-300 font-mono px-2 truncate max-w-[120px]">
                {selectedNodeId}
              </span>
              <button
                onClick={() => duplicateNode(selectedNodeId)}
                className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors cursor-pointer"
                title="复制节点"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteNode(selectedNodeId)}
                className="p-2 rounded-xl hover:bg-red-950/60 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                title="删除节点"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </Panel>

        {/* Bottom Floating Stats Pill */}
        <Panel position="bottom-left" className="m-4">
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-neutral-900/85 border border-white/10 backdrop-blur-xl text-[11px] text-neutral-400 shadow-xl font-mono">
            <span className="flex items-center gap-1.5 text-neutral-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              画布就绪
            </span>
            <span>•</span>
            <span>节点: {nodes.length} 个</span>
            <span>•</span>
            <span>数据链路: {edges.length} 条</span>
            <span>•</span>
            <span className="text-cyan-400">自动保存已开启</span>
          </div>
        </Panel>

        {/* Bottom-Right Floating AI Agent Button */}
        <Panel position="bottom-right" className="m-4">
          <button
            onClick={toggleAgentDrawer}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs backdrop-blur-xl border transition-all cursor-pointer shadow-2xl ${
              isAgentDrawerOpen
                ? 'bg-cyan-500 text-black border-cyan-300 shadow-cyan-500/30'
                : 'bg-neutral-900/90 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 hover:bg-neutral-800'
            }`}
          >
            <Bot className="w-4 h-4 animate-bounce" />
            <span>Brainstorm Agent 画布助手</span>
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
