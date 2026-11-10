import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Sparkles, Brain, Copy, Check, ChevronRight, Zap, Lightbulb } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { TopicNodeData, ViralTitleOption } from '../../types/canvas';
import { parseViralTitleToCoverFields, createVerticalCoverVisual, createYouTubeCoverVisual } from '../../data/sciencePresets';

export const TopicNode = ({ id, data }: { id: string; data: TopicNodeData }) => {
  const updateNodeData = useStudioStore((state) => state.updateNodeData);
  const setToast = useStudioStore((state) => state.setToast);
  const [topicInput, setTopicInput] = useState(data.topic || '');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const applyParsedTitleToStudio = (topicName: string, titleItem: ViralTitleOption) => {
    const parsed = parseViralTitleToCoverFields(
      topicName,
      titleItem.mainTitle,
      titleItem.subTitle,
      titleItem.formula
    );

    const storeState = useStudioStore.getState();
    const nodes = storeState.nodes;
    const charNode = nodes.find((n) => n.type === 'character')?.data as any;
    const editorNode = nodes.find((n) => n.type === 'coverEditor');
    const existingLayers = (editorNode?.data as any)?.layers;

    // 1. Generate updated vertical 9:16 cover preview
    const newPreview = createVerticalCoverVisual({
      headlineLine1: parsed.headlineLine1,
      headlineLine2: parsed.headlineLine2,
      headlineBannerMode: parsed.headlineBannerMode,
      subjectType: parsed.subjectType,
      brandTitle: parsed.brandTitle,
      creatorTag: parsed.creatorTag,
      seriesTag: parsed.seriesTag,
      subtitle: parsed.subTitle,
      avatarUrl: charNode?.avatarUrl,
      avatarScale: charNode?.scale,
      aiHeroImageUrl: (editorNode?.data as any)?.aiHeroImageUrl,
      layers: existingLayers,
    });

    // 2. Sync to TitleNode
    const titleNodes = nodes.filter((n) => n.type === 'title');
    titleNodes.forEach((tn) => {
      storeState.updateNodeData(tn.id, {
        brandTitle: parsed.brandTitle,
        headlineLine1: parsed.headlineLine1,
        headlineLine2: parsed.headlineLine2,
        headlineBannerMode: parsed.headlineBannerMode,
        creatorTag: parsed.creatorTag,
        seriesTag: parsed.seriesTag,
        mainTitle: parsed.mainTitle,
        subTitle: parsed.subTitle,
        headlineWhite: parsed.headlineLine1,
        headlineAccent: parsed.headlineLine2,
        headlineGold: parsed.headlineLine2,
        pillBadge: parsed.brandTitle,
      });
    });

    // 3. Sync to CoverEditorNode
    if (editorNode) {
      storeState.updateNodeData(editorNode.id, {
        overrideBrandTitle: parsed.brandTitle,
        overrideHeadlineLine1: parsed.headlineLine1,
        overrideHeadlineLine2: parsed.headlineLine2,
        headlineBannerMode: parsed.headlineBannerMode,
        subjectType: parsed.subjectType,
        creatorTag: parsed.creatorTag,
        seriesTag: parsed.seriesTag,
        overrideTitle: parsed.mainTitle,
        overrideSubtitle: parsed.subTitle,
        previewUrl: newPreview,
      });
    }

    // 4. Sync to ScienceVisualNode
    const visualNodes = nodes.filter((n) => n.type === 'scienceVisual');
    visualNodes.forEach((vn) => {
      storeState.updateNodeData(vn.id, {
        imageUrl: newPreview,
        prompt: `Clean minimalist 3D editorial design object, tactile matte clay/leather texture, 3d subject for ${parsed.brandTitle}, soft studio rim lighting, deep dark matte navy background #080C14, zero neon slop, zero robotic laser lines, modern aesthetic 8k`,
      });
    });

    // 5. Sync to GeneratorNode
    const genNodes = nodes.filter((n) => n.type === 'generator');
    genNodes.forEach((gn) => {
      storeState.updateNodeData(gn.id, {
        resultImage: newPreview,
      });
    });

    setToast(`✨ 选题解构《${parsed.headlineLine1} ${parsed.headlineLine2}》已自动应用至竖屏封面排版！`);
  };

  const handleAnalyze = async () => {
    if (!topicInput.trim()) return;
    updateNodeData(id, { isAnalyzing: true, topic: topicInput });
    setToast('🧠 AI 正在深度解构知识点与爆款公式...');

    try {
      const res = await fetch('/api/analyze-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicInput, script: data.script || '' }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        const d = result.data;
        updateNodeData(id, {
          coreConcept: d.coreConcept,
          knowledgeSummary: d.knowledgeSummary,
          viralTitles: d.viralTitles || [],
          visualMetaphor: d.visualMetaphor,
          suggestedVisualPrompt: d.suggestedVisualPrompt,
          isAnalyzing: false,
        });

        // Auto-apply the top recommended viral title to Cover Editor and typography
        if (d.viralTitles && d.viralTitles.length > 0) {
          applyParsedTitleToStudio(topicInput, d.viralTitles[0]);
        }
      }
    } catch (e) {
      console.error(e);
      updateNodeData(id, { isAnalyzing: false });
      setToast('⚠️ 分析服务响应异常，已启用本地知识库智能推荐');
    }
  };

  const handleSelectTitle = (index: number) => {
    updateNodeData(id, { selectedTitleIndex: index });
    const selected = data.viralTitles[index];
    if (selected) {
      applyParsedTitleToStudio(topicInput, selected);
    }
  };

  const copyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setToast('📋 提示词已复制到剪贴板！');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-96 rounded-2xl bg-neutral-900/95 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 backdrop-blur-md overflow-hidden text-neutral-100 transition-all hover:border-cyan-400">
      {/* Node Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-cyan-950/80 via-neutral-900 to-neutral-900 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">选题与知识点解构</div>
            <div className="text-sm font-bold text-neutral-100">{data.label || '核心知识点节点'}</div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
          STAGE 01
        </span>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Topic Input */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1.5">
            视频选题 / 工具名称 / 教程主题
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="例如：好用的截图工具 Snipaste / 5分钟AI做短视频 / 天蝎座深层性格分析..."
              className="flex-1 px-3 py-2 bg-neutral-950/80 border border-white/10 rounded-xl text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500 text-xs"
            />
            <button
              onClick={handleAnalyze}
              disabled={data.isAnalyzing}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{data.isAnalyzing ? '解构中...' : 'AI解构'}</span>
            </button>
          </div>
        </div>

        {/* Core Concept & Summary Pill */}
        {data.coreConcept && (
          <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px]">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>核心亮点/概念：{data.coreConcept}</span>
            </div>
            <p className="text-neutral-300 text-[11px] leading-relaxed">
              {data.knowledgeSummary}
            </p>
          </div>
        )}

        {/* Viral Titles with CTR Formulas */}
        {data.viralTitles && data.viralTitles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium">
              <span>🔥 爆款封面标题公式推荐</span>
              <span className="text-cyan-400 text-[10px]">点击即可直接应用</span>
            </div>
            <div className="space-y-1.5">
              {data.viralTitles.map((t, idx) => {
                const isSelected = data.selectedTitleIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectTitle(idx)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md shadow-cyan-950/30'
                        : 'bg-neutral-950/40 border-white/5 hover:border-white/20 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                        {t.formula}
                      </span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                        CTR预估 {t.ctrScore}%
                      </span>
                    </div>
                    <div className="font-bold text-sm text-neutral-100">{t.mainTitle}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">{t.subTitle}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Visual Metaphor Chip */}
        {data.visualMetaphor && (
          <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-neutral-300 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> 推荐视觉隐喻主体
              </span>
              <div className="flex gap-1">
                {data.visualMetaphor.colorPalette?.map((c, i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <p className="text-neutral-400 text-[11px]">
              {data.visualMetaphor.concept}
            </p>
          </div>
        )}

        {/* 3D Prompt Snippet */}
        {data.suggestedVisualPrompt && (
          <div className="p-2 rounded-xl bg-neutral-950/80 border border-white/5 flex items-center justify-between gap-2">
            <span className="text-[10px] text-neutral-400 font-mono truncate flex-1">
              {data.suggestedVisualPrompt}
            </span>
            <button
              onClick={() => copyPrompt(data.suggestedVisualPrompt!, 99)}
              className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              title="复制提示词"
            >
              {copiedIndex === 99 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>

      {/* Connection Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3.5 h-3.5 !bg-cyan-500 !border-2 !border-neutral-900 shadow-md shadow-cyan-500"
      />
    </div>
  );
};
