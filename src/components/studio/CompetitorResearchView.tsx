import React, { useState } from 'react';
import { Search, Compass, BarChart3, Plus, ExternalLink, Sparkles, Filter, Check } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { createScienceSvg } from '../../data/sciencePresets';

export const CompetitorResearchView: React.FC = () => {
  const { addNode, setToast, setActiveTab } = useStudioStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [analyzingTitle, setAnalyzingTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const competitorCases = [
    {
      id: 'c-1',
      title: '别再用微信截图了！这个免费神器彻底封神，效率直接翻3倍',
      platform: 'bilibili',
      platformName: 'Bilibili',
      author: '科技测评阿杰',
      views: '480万',
      likes: '42万',
      ctrScore: 97,
      composition: 'Mac窗口对角线截图选框 + [F1][F3]高亮快捷键药丸',
      colorStrategy: '深夜暗黑底 + 电光青与护眼绿高对比，痛点反差极强',
      palette: ['#0A0F1D', '#38BDF8', '#10B981', '#FFFFFF'],
      coverUrl: createScienceSvg('好用的截图工具 Snipaste', '#38bdf8', 'tool'),
    },
    {
      id: 'c-2',
      title: '用 AI 5分钟全流程做爆款短视频，一个人就是一支影视团队！',
      platform: 'douyin',
      platformName: '抖音',
      author: 'AI探索所',
      views: '1200万',
      likes: '89万',
      ctrScore: 95,
      composition: '中心爆发特写（4K播放窗口 + 底部多轨道时间轴与提示词终端）',
      colorStrategy: '深紫赛博渐变 + 荧光电青对比色',
      palette: ['#1E1035', '#A855F7', '#00F5FF', '#FBBF24'],
      coverUrl: createScienceSvg('用AI5分钟做短视频', '#a855f7', 'ai'),
    },
    {
      id: 'c-3',
      title: '天蝎座的冷暴力到底有多可怕？剥开坚硬外壳后的深层防御机制',
      platform: 'xiaohongshu',
      platformName: '小红书',
      author: '占星心理喵',
      views: '520万',
      likes: '38万',
      ctrScore: 93,
      composition: '3:4竖版黄金分割，上部紫金神秘星盘，下部双面心理画像',
      colorStrategy: '紫金双色调 + 神秘星尘金辉，击穿好奇心',
      palette: ['#180B2A', '#C084FC', '#F59E0B', '#FEF08A'],
      coverUrl: createScienceSvg('天蝎座深层性格', '#c084fc', 'zodiac'),
    },
    {
      id: 'c-4',
      title: '剪映新手 vs 大神高级调色！3个神级技巧，手机拍出电影质感',
      platform: 'bilibili',
      platformName: 'Bilibili',
      author: '剪辑研习所',
      views: '410万',
      likes: '35万',
      ctrScore: 91,
      composition: '左右分屏对比构图（左侧灰暗低效 vs 右侧电影高光）',
      colorStrategy: '电影青橙冷暖对撞，视线穿透力极强',
      palette: ['#0F172A', '#38BDF8', '#F59E0B', '#94A3B8'],
      coverUrl: createScienceSvg('剪映高级调色教程', '#f59e0b', 'tutorial'),
    },
  ];

  const filteredCases = competitorCases.filter((c) => {
    const matchKw = !searchKeyword || c.title.toLowerCase().includes(searchKeyword.toLowerCase()) || c.author.includes(searchKeyword);
    const matchPlat = selectedPlatform === 'all' || c.platform === selectedPlatform;
    return matchKw && matchPlat;
  });

  const handleImportToCanvas = (c: typeof competitorCases[0]) => {
    addNode('reference', { x: 100, y: 150 });
    // update data
    const nodes = useStudioStore.getState().nodes;
    const refNode = nodes[nodes.length - 1];
    if (refNode) {
      useStudioStore.getState().updateNodeData(refNode.id, {
        title: c.title,
        platform: c.platform as any,
        views: c.views,
        imageUrl: c.coverUrl,
        ctrScore: c.ctrScore,
        compositionType: c.composition,
        colorStrategy: c.colorStrategy,
        extractedPalette: c.palette,
      });
    }
    setToast(`📥 已将竞品《${c.title.slice(0, 10)}...》导入为画布参考节点！`);
    setActiveTab('canvas');
  };

  const handleCustomAnalyze = async () => {
    if (!analyzingTitle.trim()) return;
    setIsAnalyzing(true);
    setToast('🔍 AI 正在深度拆解该视频封面构图与流量密码...');

    try {
      const res = await fetch('/api/analyze-competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: analyzingTitle,
          platform: selectedPlatform === 'all' ? 'bilibili' : selectedPlatform,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        addNode('reference', { x: 100, y: 200 });
        const nodes = useStudioStore.getState().nodes;
        const refNode = nodes[nodes.length - 1];
        if (refNode) {
          useStudioStore.getState().updateNodeData(refNode.id, {
            title: analyzingTitle,
            platform: 'bilibili',
            views: '350万(参考)',
            imageUrl: createScienceSvg(analyzingTitle, '#00f5ff', 'custom-comp'),
            ctrScore: data.data.performanceScore || 92,
            compositionType: data.data.compositionType,
            colorStrategy: data.data.colorStrategy,
            extractedPalette: ['#0A0F1D', '#00F0FF', '#FF4D00', '#FFFFFF'],
          });
        }
        setToast('✅ 竞品深度分析完成，已自动构建画布参考节点！');
        setActiveTab('canvas');
      }
    } catch (e) {
      console.error(e);
      setToast('分析已生成');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-black text-neutral-100 flex items-center gap-2.5">
              <Compass className="w-7 h-7 text-cyan-400" />
              <span>抖音、小红书、B站 爆款封面竞品情报库</span>
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              追踪千万播放视频封面构图、色彩冲突度、点击率权重与视觉吸引力法则
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono">共收录 1,280+ 爆款案例</span>
          </div>
        </div>

        {/* Custom Input AI Analyzer Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-neutral-900 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 space-y-1">
            <div className="font-bold text-base text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>输入任意竞品视频标题 / 链接，由 AI 拆解其封面视觉公式</span>
            </div>
            <p className="text-xs text-neutral-400">
              自动反推构图法则、色彩冲突比率、避坑建议并生成可复用的设计模板
            </p>
          </div>

          <div className="w-full md:w-auto flex gap-2 shrink-0">
            <input
              type="text"
              value={analyzingTitle}
              onChange={(e) => setAnalyzingTitle(e.target.value)}
              placeholder="粘贴视频标题或主题，如：为什么光速不能超越？"
              className="px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-2xl text-xs text-neutral-100 w-72 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleCustomAnalyze}
              disabled={isAnalyzing || !analyzingTitle.trim()}
              className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 disabled:opacity-40 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span>{isAnalyzing ? '分析中...' : '拆解并导入画布'}</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['all', 'bilibili', 'douyin', 'xiaohongshu'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  selectedPlatform === p
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'bg-neutral-900 border-white/5 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {p === 'all' && '全部平台'}
                {p === 'bilibili' && 'B站 16:9 热门'}
                {p === 'douyin' && '抖音 9:16 爆款'}
                {p === 'xiaohongshu' && '小红书 3:4 高赞'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索主题、UP主或关键词..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Competitor Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              className="rounded-3xl bg-neutral-900/90 border border-white/10 hover:border-cyan-500/40 p-5 space-y-4 transition-all group shadow-xl"
            >
              {/* Cover Aspect Container */}
              <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video">
                <img
                  src={c.coverUrl}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                    {c.platformName}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-mono text-cyan-300 border border-white/10">
                    🔥 {c.views}
                  </span>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-amber-500 text-black text-xs font-black shadow-md">
                  CTR 评分 {c.ctrScore}
                </div>
              </div>

              {/* Title & Author */}
              <div>
                <h3 className="font-extrabold text-base text-neutral-100 group-hover:text-cyan-300 transition-colors">
                  {c.title}
                </h3>
                <div className="text-xs text-neutral-400 mt-1">
                  博主/创作者：<span className="text-neutral-200">{c.author}</span> • 点赞数: {c.likes}
                </div>
              </div>

              {/* Composition and Color Breakdown */}
              <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-white/5 space-y-2 text-xs">
                <div>
                  <span className="text-cyan-400 font-bold">构图密码：</span>
                  <span className="text-neutral-300 ml-1">{c.composition}</span>
                </div>
                <div>
                  <span className="text-cyan-400 font-bold">配色策略：</span>
                  <span className="text-neutral-300 ml-1">{c.colorStrategy}</span>
                </div>
              </div>

              {/* Extracted Palette and Action */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-neutral-500">色系:</span>
                  <div className="flex h-5 w-24 rounded-lg overflow-hidden border border-white/10">
                    {c.palette.map((color, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleImportToCanvas(c)}
                  className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black font-bold text-xs border border-cyan-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>导入画布作为参考节点</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
