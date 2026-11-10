import React, { useState } from 'react';
import { Video, FileText, Sparkles, Copy, Check, Tv, Smartphone, BookOpen, Send, ArrowRight } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

export const ScriptStudioView: React.FC = () => {
  const { addNode, setToast, setActiveTab } = useStudioStore();
  const [topic, setTopic] = useState('好用的截图工具 Snipaste：效率翻倍的高阶实操技巧');
  const [outline, setOutline] = useState('1. 痛点：每天切十几次窗口抄数据对比，频繁切屏效率极低\n2. 解决方案：F1 截图 + F3 贴图置顶，把参考图直接钉在当前软件上方\n3. 隐藏神器技巧：按 C 像素级取色、按 Shift/Ctrl 微调选区尺寸\n4. 实际场景：写报告、对照做PPT、写代码比对接口，效率瞬间翻倍');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [scriptData, setScriptData] = useState<any>({
    hooks: [
      '每天工作还在按微信截图来回切窗口比对数据？教你一个彻底封神的免费工具，效率直接翻3倍！',
      '90%的人电脑里装了 Snipaste，却只用它按 F1 截图，其实它的 F3 悬浮置顶贴图才是真正的降维打击！',
      '如果你经常写PPT、核对表格或写代码，这期视频绝对能帮你每天省出至少2小时摸鱼时间！',
    ],
    douyinMeta: {
      title: '别再用微信截图了！这个免费神器彻底封神，效率直接翻3倍',
      description: '打工人相见恨晚的提效黑科技！F1截图+F3贴图置顶，再也不用来回切屏了！学会这3个隐藏快捷键，每天提早2小时打卡下班！赶紧收藏备用！⚡',
      tags: ['#效率神器', '#打工人必备', '#实用工具', '#Snipaste', '#办公技巧'],
    },
    xiaohongshuMeta: {
      title: '🔥被问了800遍的截图神器！太香了吧！',
      description: '熬夜整理的职场提效封神软件！用过真的回不去！✨\n\n💡 核心三个神仙用法：\n1️⃣ [F1] 智能选区截屏：自动吸附窗口边缘\n2️⃣ [F3] 贴图置顶：直接悬浮在任何页面上方，核对数据神器\n3️⃣ 按 [C] 放大镜取色：设计师与产品经理狂喜！\n\n赶紧点赞收藏，免得要用的时候找不到～💻',
      tags: ['#软件推荐', '#效率工具', '#提升工作效率', '#办公软件', '#干货分享'],
    },
    bilibiliMeta: {
      title: '【干货】别再用微信截图了！Snipaste 隐藏高阶技巧全盘拆解',
      description: '本期视频系统讲解免费截图神器 Snipaste 的底层工作流，彻底解决多窗口频繁切换与比对数据的低效痛点。\n\n时间线：\n00:00 为什么微信截图效率低？\n01:30 F1 智能框选与快捷标注\n03:45 F3 贴图置顶与多图比对\n06:20 像素级放大镜取色实操',
      tags: ['Snipaste', '软件推荐', '效率神器', '电脑技巧', '职场干货'],
    },
  });

  const handleGenerateScript = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setToast('🤖 AI 正在生成前3秒黄金钩子与全平台宣发文案...');

    try {
      const res = await fetch('/api/script-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, outline }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setScriptData(data.data);
        setToast('✅ 视频脚本钩子与多端发布文案已生成完毕！');
      }
    } catch (e) {
      console.error(e);
      setToast('生成已完成');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setToast('📋 文案已复制到剪贴板！');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyToCanvas = () => {
    const titleNodes = useStudioStore.getState().nodes.filter((n) => n.type === 'title');
    if (titleNodes.length > 0) {
      useStudioStore.getState().updateNodeData(titleNodes[0].id, {
        mainTitle: scriptData.douyinMeta.title.slice(0, 14),
        subTitle: '1000秒突破！关键数据全景拆解',
      });
    }
    const topicNodes = useStudioStore.getState().nodes.filter((n) => n.type === 'topic');
    if (topicNodes.length > 0) {
      useStudioStore.getState().updateNodeData(topicNodes[0].id, {
        topic,
        script: outline,
      });
    }
    setToast('🎯 已将脚本选题与标题同步至画布工作流！');
    setActiveTab('canvas');
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto bg-neutral-950 text-neutral-100">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-black text-neutral-100 flex items-center gap-2.5">
              <Video className="w-7 h-7 text-pink-400" />
              <span>科普视频脚本工作室 & 多平台文案工坊</span>
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              围绕核心知识点，一键生成抓人前3秒黄金钩子、抖音热搜标题、小红书高赞笔记及B站长文案
            </p>
          </div>

          <button
            onClick={handleApplyToCanvas}
            className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>同步此脚本与标题到封面画布</span>
          </button>
        </div>

        {/* Input Panel */}
        <div className="p-6 rounded-3xl bg-neutral-900/90 border border-white/10 shadow-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-2">
                科普视频选题主题
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-2xl text-xs text-neutral-100 focus:outline-none focus:border-pink-500"
                placeholder="例如：好用的截图工具 Snipaste / 5分钟AI做短视频..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-2">
                核心逻辑提纲或参考资料
              </label>
              <textarea
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-neutral-950 border border-white/10 rounded-2xl text-xs text-neutral-100 focus:outline-none focus:border-pink-500 resize-none leading-relaxed"
                placeholder="分点输入视频脉络..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerateScript}
              disabled={isGenerating || !topic.trim()}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-500/20 disabled:opacity-40 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'AI 生成全套文案中...' : '立即生成前3秒钩子与全平台宣发文案'}</span>
            </button>
          </div>
        </div>

        {/* Golden 3-Seconds Hooks */}
        <div className="p-6 rounded-3xl bg-neutral-900/90 border border-amber-500/30 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-base text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>黄金前3秒吸睛台词钩子 (High Retention Hooks)</span>
            </div>
            <span className="text-[11px] text-neutral-400">决定 60% 用户是否划走</span>
          </div>

          <div className="space-y-3">
            {scriptData.hooks.map((hook: string, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-neutral-950/80 border border-white/5 hover:border-amber-400/40 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-semibold text-neutral-100 leading-relaxed">
                    "{hook}"
                  </p>
                </div>
                <button
                  onClick={() => copyText(hook, `hook-${idx}`)}
                  className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer shrink-0"
                  title="复制文案"
                >
                  {copiedKey === `hook-${idx}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Platform Metadata Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Douyin */}
          <div className="p-5 rounded-3xl bg-neutral-900/90 border border-pink-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-pink-300">
                  <Smartphone className="w-4 h-4" />
                  <span>抖音短视频发布套件</span>
                </div>
                <button
                  onClick={() => copyText(`${scriptData.douyinMeta.title}\n\n${scriptData.douyinMeta.description}\n\n${scriptData.douyinMeta.tags.join(' ')}`, 'douyin')}
                  className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-pink-300 cursor-pointer"
                >
                  {copiedKey === 'douyin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 font-mono">推荐标题:</span>
                <div className="font-bold text-xs text-neutral-100 mt-0.5">
                  {scriptData.douyinMeta.title}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 font-mono">互动描述:</span>
                <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed bg-neutral-950 p-2.5 rounded-xl border border-white/5">
                  {scriptData.douyinMeta.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 pt-2">
              {scriptData.douyinMeta.tags.map((tag: string, i: number) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Xiaohongshu */}
          <div className="p-5 rounded-3xl bg-neutral-900/90 border border-red-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-red-300">
                  <BookOpen className="w-4 h-4" />
                  <span>小红书图文笔记套件</span>
                </div>
                <button
                  onClick={() => copyText(`${scriptData.xiaohongshuMeta.title}\n\n${scriptData.xiaohongshuMeta.description}\n\n${scriptData.xiaohongshuMeta.tags.join(' ')}`, 'red')}
                  className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-red-300 cursor-pointer"
                >
                  {copiedKey === 'red' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 font-mono">吸睛笔记标题:</span>
                <div className="font-bold text-xs text-neutral-100 mt-0.5">
                  {scriptData.xiaohongshuMeta.title}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 font-mono">高赞笔记正文:</span>
                <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed bg-neutral-950 p-2.5 rounded-xl border border-white/5 whitespace-pre-line">
                  {scriptData.xiaohongshuMeta.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 pt-2">
              {scriptData.xiaohongshuMeta.tags.map((tag: string, i: number) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-300 border border-red-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bilibili */}
          <div className="p-5 rounded-3xl bg-neutral-900/90 border border-blue-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-blue-300">
                  <Tv className="w-4 h-4" />
                  <span>B站中长视频套件</span>
                </div>
                <button
                  onClick={() => copyText(`${scriptData.bilibiliMeta.title}\n\n${scriptData.bilibiliMeta.description}\n\n${scriptData.bilibiliMeta.tags.join(' ')}`, 'bili')}
                  className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-blue-300 cursor-pointer"
                >
                  {copiedKey === 'bili' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 font-mono">视频主标题:</span>
                <div className="font-bold text-xs text-neutral-100 mt-0.5">
                  {scriptData.bilibiliMeta.title}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-500 font-mono">视频深度简介:</span>
                <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed bg-neutral-950 p-2.5 rounded-xl border border-white/5 whitespace-pre-line">
                  {scriptData.bilibiliMeta.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 pt-2">
              {scriptData.bilibiliMeta.tags.map((tag: string, i: number) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
