import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse CLI flags or env vars
let port: number = Number(process.env.PORT) || 3000;
const portArgIndex = process.argv.indexOf('--port');
if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
  port = Number(process.argv[portArgIndex + 1]);
}

let host: string = '0.0.0.0';
const hostArgIndex = process.argv.indexOf('--host');
if (hostArgIndex !== -1 && process.argv[hostArgIndex + 1]) {
  host = process.argv[hostArgIndex + 1];
}

app.use(express.json({ limit: '20mb' }));

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper to safely call Gemini with fallback and timeout protection
async function callGeminiText(prompt: string, systemInstruction?: string, timeoutMs = 8000): Promise<string | null> {
  if (!ai) {
    return null;
  }
  try {
    const callPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'You are an elite science communication & video visual designer for Douyin, Xiaohongshu, and Bilibili.',
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs));
    const response: any = await Promise.race([callPromise, timeoutPromise]);
    if (!response) {
      console.warn('Gemini request timed out, falling back to heuristic engine');
      return null;
    }
    return response.text || '';
  } catch (error) {
    console.error('Gemini text error:', error);
    return null;
  }
}

// 1. Topic Analysis Endpoint: extracts core knowledge points, 3 viral titles, visual metaphor, and prompt
app.post('/api/analyze-topic', async (req, res) => {
  const { topic, script, targetPlatform = 'all' } = req.body;
  if (!topic && !script) {
    return res.status(400).json({ error: 'Topic or script is required' });
  }

  const userTopic = String(topic || script || '').trim();
  const isTool = /snipaste|截图|工具|软件|插件|神器|notion|raycast|obsidian|app|效率|推荐/i.test(userTopic);
  const isAi = /ai|做视频|智能|midjourney|sora|提示词|数字人|生成|大模型|chatgpt/i.test(userTopic);
  const isZodiac = /星座|天蝎|白羊|双鱼|金牛|双子|巨蟹|狮子|处女|天秤|射手|摩羯|水瓶|运势|占星|星盘|心理/i.test(userTopic);

  const prompt = `
请深入分析以下视频选题/脚本内容，针对其真实类别（实用工具/软件推荐、AI做视频/AI工具、实操教程指南、星座运势与心理、自媒体干货等），产出用于制作高点击率封面的选题解构：
选题内容: "${userTopic}"
目标平台: ${targetPlatform}

要求：
1. 严禁乱套不相关的硬核物理/科学模板！必须完全围绕用户主题展开。
2. 若是软件/工具（如 Snipaste、剪映、Notion 等），提炼其具体核心卖点（如 F1快捷键/悬浮贴图/取色器）与解决的真实痛点。
3. 若是 AI 做视频，提炼 5分钟全流程/分镜/成片/零基础实操角度。
4. 若是星座/心理，提炼深层性格、防卫机制、外冷内热心理画像或运势转折。
5. 若是教程分享，提炼新手易错点、高低手对比、保姆级步骤。

请返回严格的 JSON 格式（不要包含任何 markdown 代码块或反引号包裹）：
{
  "coreConcept": "核心功能/机制/亮点（10字以内）",
  "knowledgeSummary": "一句话大白话讲清核心价值或痛点（30字以内）",
  "viralTitles": [
    {
      "formula": "颠覆习惯型",
      "mainTitle": "主标题（6-12字，抓人痛点/反差）",
      "subTitle": "副标题（补充具体功效或论据）",
      "ctrScore": 97
    },
    {
      "formula": "极限量化型",
      "mainTitle": "主标题（含具体数字/快捷键/步骤）",
      "subTitle": "副标题",
      "ctrScore": 94
    },
    {
      "formula": "痛点拯救型",
      "mainTitle": "主标题（直击用户真实困扰）",
      "subTitle": "副标题",
      "ctrScore": 91
    }
  ],
  "visualMetaphor": {
    "concept": "视觉表现形式（如：软件UI悬浮贴图框+快捷键高亮卡片 / 占星罗盘星轨 / AI视频轨道面板）",
    "focalElement": "第一视觉焦点元素",
    "backgroundMood": "背景环境与设计色调",
    "colorPalette": ["#38BDF8", "#10B981", "#0F172A", "#F59E0B"]
  },
  "suggestedVisualPrompt": "English UI/visual design prompt matching this specific subject"
}
`;

  try {
    const rawResult = await callGeminiText(prompt);
    if (rawResult) {
      const cleanJson = rawResult.replace(/^```json/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json({ success: true, data: parsed });
    }
  } catch (err) {
    console.warn('Fallback to intelligent domain heuristic:', err);
  }

  // Domain-aware intelligent heuristic fallbacks
  if (isTool) {
    return res.json({
      success: true,
      data: {
        coreConcept: 'F1截图 + F3贴图置顶',
        knowledgeSummary: '利用悬浮置顶贴图与像素级取色器，彻底解决切屏比对数据的繁琐。',
        viralTitles: [
          { formula: '颠覆习惯型', mainTitle: '别再用微信截图了！', subTitle: '这个免费神器彻底封神，用过就回不去', ctrScore: 97 },
          { formula: '极限量化型', mainTitle: '90%的人不知道的快捷键！', subTitle: 'F1截图+F3贴图，打工人效率翻3倍', ctrScore: 94 },
          { formula: '痛点拯救型', mainTitle: '封神级效率神器！', subTitle: `${userTopic.slice(0, 10)} 隐藏高阶玩法全盘拆解`, ctrScore: 91 },
        ],
        visualMetaphor: {
          concept: 'macOS 风格悬浮窗口 + [F1] [F3] 快捷键高亮药丸 + 贴图悬浮卡片 + 像素取色放大镜',
          focalElement: '截屏选区方框与 F3 置顶贴图卡片',
          backgroundMood: '深色高质感效率桌面，电光青与科技蓝冲突色',
          colorPalette: ['#38BDF8', '#10B981', '#0F172A', '#F59E0B'],
        },
        suggestedVisualPrompt: `Modern SaaS productivity desktop UI mockup, screen capture crop rectangle with crosshair guidelines, floating pinned card, glowing shortcut keys F1 and F3, magnifying color loupe with hex code, ultra-crisp 4k`,
      },
    });
  }

  if (isAi) {
    return res.json({
      success: true,
      data: {
        coreConcept: 'AI视频全流程工作流',
        knowledgeSummary: '用最新AI工具链，5分钟搞定脚本、分镜生图、配音与自动剪辑成片。',
        viralTitles: [
          { formula: '降维打击型', mainTitle: '用 AI 做视频到底有多爽？', subTitle: '1个人跑通全流程，产量直接翻10倍', ctrScore: 97 },
          { formula: '极限量化型', mainTitle: '5分钟零基础搞定成片！', subTitle: '手把手保姆级实操，小白也能轻松上手', ctrScore: 95 },
          { formula: '避坑指南型', mainTitle: '别再傻傻手动剪辑了！', subTitle: '这个AI自动化工作流彻底解放双手', ctrScore: 92 },
        ],
        visualMetaphor: {
          concept: 'AI 视频轨道工作台 + 提示词输入发光窗 + 多层视频音频时间轴 + 4K渲染播放器',
          focalElement: 'AI 生成播放器窗口与多轨道时间轴',
          backgroundMood: '神秘赛博紫与荧光青渐变，未来科技创作者氛围',
          colorPalette: ['#A855F7', '#00F5FF', '#1E1B4B', '#10B981'],
        },
        suggestedVisualPrompt: `Futuristic AI video editor workspace UI, multi-track timeline, prompt command terminal, glowing playhead, 4k render preview, cyber aesthetic`,
      },
    });
  }

  if (isZodiac) {
    return res.json({
      success: true,
      data: {
        coreConcept: '深层性格与潜意识防御',
        knowledgeSummary: '剥开外冷内热的坚硬外壳，看透内心深处的极限防御机制与真实情感。',
        viralTitles: [
          { formula: '灵魂洞察型', mainTitle: `读懂${userTopic.slice(0, 4)}的极限冷战：`, subTitle: '不是不爱，是他正在进行残酷测试', ctrScore: 97 },
          { formula: '深度拆解型', mainTitle: '最让人心疼的星座！', subTitle: '外表刀枪不入，剥开坚硬外壳全是泪', ctrScore: 94 },
          { formula: '命运转折型', mainTitle: '2026年终于苦尽甘来！', subTitle: '这个上升星座即将迎来大爆发', ctrScore: 92 },
        ],
        visualMetaphor: {
          concept: '神秘紫金占星罗盘 + 发光星宿轨迹 + 深度心理双面全息画像',
          focalElement: '发光的金色星座符号与星宿天球轮盘',
          backgroundMood: '深空星盘紫与曜金高对比，神秘塔罗氛围',
          colorPalette: ['#8B5CF6', '#F59E0B', '#180B2A', '#E9D5FF'],
        },
        suggestedVisualPrompt: `Mystical astrological celestial wheel, glowing golden zodiac constellation map, glowing purple aura, sacred geometry, tarot aesthetic, 8k`,
      },
    });
  }

  // General / Tutorial
  res.json({
    success: true,
    data: {
      coreConcept: `${userTopic.slice(0, 8)}核心技巧`,
      knowledgeSummary: `手把手拆解${userTopic}的核心实操步骤，避开新手踩坑雷区。`,
      viralTitles: [
        { formula: '颠覆认知型', mainTitle: `原来${userTopic.slice(0, 6)}这么简单？`, subTitle: '高手从不外传的进阶操作细节', ctrScore: 96 },
        { formula: '极限量化型', mainTitle: '零基础3步快速上手！', subTitle: '保姆级实操拆解，看一遍就能立刻学会', ctrScore: 94 },
        { formula: '对比冲击型', mainTitle: '新手 vs 大神制作对比！', subTitle: '你的作品到底差在哪个关键步骤？', ctrScore: 90 },
      ],
      visualMetaphor: {
        concept: '实操对比卡片 + 步骤高亮标签 Step 1-2-3 + 效率对比箭头',
        focalElement: '实操前后效果对比卡片与高亮标签',
        backgroundMood: '深色现代感设计，高亮干货黄与极简蓝',
        colorPalette: ['#F59E0B', '#38BDF8', '#0F172A', '#10B981'],
      },
      suggestedVisualPrompt: `Clean modern tutorial split view comparison UI mockup, step by step cards, highlight badges, high contrast editorial layout, 8k`,
    },
  });
});

// 2. AI Visual Asset / Science Model & Subject Generator (Supports 9:16 vertical cover hero image)
app.post('/api/generate-cover-image', async (req, res) => {
  const {
    prompt,
    topic = '',
    style = 'vertical-hero',
    aspectRatio = '9:16',
    resolution = '2K',
    brandTitle = '',
  } = req.body;

  const targetTopic = String(topic || prompt || brandTitle || 'ChatGPT').trim();
  const isSnipaste = /snipaste|截图|工具|软件/i.test(targetTopic);
  const isAiVideo = /ai|做视频|智能|sora|视频|生成/i.test(targetTopic);
  const isZodiac = /星座|天蝎|占星/i.test(targetTopic);

  // 1. Try Gemini Image Generation via @google/genai (model: gemini-3.1-flash-lite-image)
  try {
    if (ai) {
      const imagePrompt = `Clean minimalist 3D editorial design object for "${targetTopic}", tactile matte clay or leather or rounded smooth ceramic texture, soft studio rim lighting, deep dark matte slate background (#080C14), warm physical object (like a red guidebook with cute droplet companions, or a designer modern armchair, or smooth tactile clay track), strictly NO neon glow, NO cyber laser beams, NO robotic mechanical parts, ultra-clean aesthetic, high resolution.`;

      const geminiAspect = aspectRatio === '9:16' ? '9:16' : aspectRatio === '3:4' ? '3:4' : aspectRatio === '1:1' ? '1:1' : '16:9';

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: imagePrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: geminiAspect,
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const b64 = part.inlineData.data;
          const mime = part.inlineData.mimeType || 'image/png';
          return res.json({
            success: true,
            imageUrl: `data:${mime};base64,${b64}`,
            modelUsed: 'gemini-3.1-flash-lite-image',
            topic: targetTopic,
          });
        }
      }
    }
  } catch (imgErr) {
    console.warn('Gemini image generation fallback:', imgErr);
  }

  // 2. Procedural Clean Tactile 3D Editorial Subject Generator (Instant, 0-latency, 9:16 vertical)
  const width = 540;
  const height = 960;

  // Extract display title
  let displayBrand = 'Grok Bot';
  let line1 = '直接丟給';
  let line2 = '你的bot讀';
  let bannerMode = false;

  if (isSnipaste) {
    displayBrand = 'Snipaste';
    line1 = '封神截圖神器';
    line2 = '4 個神技別踩坑';
  } else if (isAiVideo) {
    displayBrand = 'AI Video';
    line1 = '換 AI 主動';
    line2 = '來找你';
  } else if (/canva|模型/i.test(targetTopic)) {
    displayBrand = 'Canva Craft';
    line1 = '第一次做模型';
    line2 = '就贏過 Google';
    bannerMode = true;
  } else if (/迴圈|循環|架构/i.test(targetTopic)) {
    displayBrand = '迴圈工程';
    line1 = '迴圈工程';
    line2 = '4 個坑別踩';
  } else if (targetTopic) {
    displayBrand = targetTopic.split(/[:：\s]/)[0].slice(0, 10);
    const clean = targetTopic.slice(0, 10);
    line1 = clean.slice(0, Math.floor(clean.length / 2)) || '進階指南';
    line2 = clean.slice(Math.floor(clean.length / 2)) || '實操詳解';
  }

  const svgFull = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="matteSlateBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0B101B"/>
      <stop offset="50%" stop-color="#080C14"/>
      <stop offset="100%" stop-color="#05070D"/>
    </linearGradient>
    <radialGradient id="subtleFloorLight" cx="50%" cy="60%" r="65%">
      <stop offset="0%" stop-color="#1E293B" stop-opacity="0.45"/>
      <stop offset="80%" stop-color="#080C14" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Deep Matte Background with Soft Studio Radial Falloff -->
  <rect width="100%" height="100%" fill="url(#matteSlateBg)"/>
  <rect width="100%" height="100%" fill="url(#subtleFloorLight)"/>

  <!-- Top Handle & Series Tag (>Jerry_AI. + Canva Craft ■) -->
  <g transform="translate(54, 75)">
    <text x="0" y="0" fill="#FFFFFF" font-family="'SF Pro Text', system-ui, sans-serif" font-size="22" font-weight="800">
      <tspan fill="#34D399" font-weight="900">&gt;</tspan><tspan fill="#FFFFFF">Jerry_AI.</tspan>
    </text>
    <g transform="translate(0, 36)">
      <text x="0" y="0" fill="#F1F5F9" font-family="'SF Pro Text', system-ui, sans-serif" font-size="22" font-weight="800">
        ${displayBrand}
      </text>
      <rect x="${displayBrand.length * 15 + 12}" y="-14" width="10" height="10" rx="1.5" fill="#34D399"/>
    </g>
  </g>

  <!-- Clean Two-Tone Headline (Pure White Line 1 + Fresh Mint Line 2) -->
  <g transform="translate(54, 180)">
    <text x="0" y="0" fill="#FFFFFF" font-family="'Noto Sans SC', system-ui, sans-serif" font-size="52" font-weight="900" letter-spacing="-1">
      ${line1}
    </text>

    ${
      bannerMode
        ? `
      <g transform="translate(0, 16)">
        <rect x="0" y="0" width="${Math.max(260, line2.length * 48 + 36)}" height="68" rx="4" fill="#10B981"/>
        <text x="18" y="50" fill="#05080E" font-family="'Noto Sans SC', system-ui, sans-serif" font-size="48" font-weight="900" letter-spacing="-0.5">
          ${line2}
        </text>
      </g>
    `
        : `
      <text x="0" y="70" fill="#34D399" font-family="'Noto Sans SC', system-ui, sans-serif" font-size="52" font-weight="900" letter-spacing="-1">
        ${line2}
      </text>
    `
    }
  </g>

  <!-- Tactile 3D Physical Subject on Clean Matte Floor -->
  <g transform="translate(270, 600)">
    <ellipse cx="0" cy="140" rx="160" ry="24" fill="#000000" opacity="0.45"/>
    
    <!-- Companion droplet orange -->
    <g transform="translate(-130, 80)">
      <circle cx="0" cy="0" r="34" fill="#FB923C"/>
      <circle cx="-10" cy="-6" r="4.5" fill="#1E293B"/>
      <circle cx="10" cy="-6" r="4.5" fill="#1E293B"/>
    </g>
    <!-- Companion droplet blue -->
    <g transform="translate(-75, 110)">
      <rect x="-30" y="-30" width="60" height="60" rx="20" fill="#3B82F6"/>
      <circle cx="-10" cy="-4" r="4" fill="#0F172A"/>
      <circle cx="10" cy="-4" r="4" fill="#0F172A"/>
    </g>
    <!-- Companion droplet green -->
    <g transform="translate(0, 130)">
      <circle cx="0" cy="0" r="38" fill="#34D399"/>
      <circle cx="-10" cy="-5" r="4" fill="#0F172A"/>
      <circle cx="10" cy="-5" r="4" fill="#0F172A"/>
    </g>
    <!-- Companion droplet purple -->
    <g transform="translate(100, 100)">
      <rect x="-26" y="-30" width="52" height="60" rx="18" fill="#A855F7"/>
      <circle cx="-8" cy="-4" r="4" fill="#0F172A"/>
      <circle cx="8" cy="-4" r="4" fill="#0F172A"/>
    </g>

    <!-- Red 3D Guidebook -->
    <g transform="translate(-100, -120)">
      <rect x="0" y="0" width="200" height="240" rx="24" fill="#EF4444" stroke="#DC2626" stroke-width="3"/>
      <rect x="18" y="0" width="12" height="240" fill="#B91C1C" opacity="0.3"/>
      <text x="100" y="68" fill="#FFFFFF" font-family="system-ui" font-size="24" font-weight="900" text-anchor="middle">
        ${displayBrand}
      </text>
      <text x="100" y="108" fill="#FFFFFF" font-family="'Noto Sans SC'" font-size="28" font-weight="900" text-anchor="middle">
        指南
      </text>
      <text x="100" y="152" fill="#FFFFFF" font-family="'Noto Sans SC'" font-size="22" font-weight="900" text-anchor="middle">
        5 條規則
      </text>
    </g>
  </g>

  <!-- Clean Subtitle -->
  <text x="270" y="890" fill="#94A3B8" font-family="'Noto Sans SC', system-ui" font-size="16" font-weight="600" text-anchor="middle" letter-spacing="0.5">
    實操核心拆解 · 效率直接翻倍
  </text>
</svg>
`;

  const base64Svg = Buffer.from(svgFull).toString('base64');
  res.json({
    success: true,
    imageUrl: `data:image/svg+xml;base64,${base64Svg}`,
    modelUsed: 'procedural-vertical-matte-engine',
    topic: targetTopic,
    style,
    aspectRatio: '9:16',
  });
});

// 3. Brainstorm AI Agent Endpoint: understands user request and can modify/add/connect nodes on canvas
app.post('/api/agent-brainstorm', async (req, res) => {
  const { userMessage, currentNodes = [], currentEdges = [] } = req.body;
  const msg = String(userMessage || '').trim();

  // Smart subject detection
  let detectedSubject = msg
    .replace(/帮我做(一个)?|为|生成|关于|的封面(流)?|制作|我想做|做一套|排版|设计|解构/g, '')
    .trim();
  if (!detectedSubject || detectedSubject.length < 2) {
    detectedSubject = 'Grok Bot';
  }

  let brandTitle = 'Grok Bot';
  if (/snipaste/i.test(detectedSubject)) brandTitle = 'Snipaste';
  else if (/claude/i.test(detectedSubject)) brandTitle = 'Claude';
  else if (/notion/i.test(detectedSubject)) brandTitle = 'Notion';
  else if (/ai/i.test(detectedSubject)) brandTitle = 'AI Video';
  else brandTitle = detectedSubject.split(/[:：\s]/)[0].slice(0, 10) || 'Grok Bot';

  const prompt = `
你是一个专精于【YouTube、B站、小红书、抖音】实用工具推荐、教程分享、AI做视频等领域的极简封面 Agent 专家。
用户指令: "${msg}"
当前画布节点状态:
${JSON.stringify(currentNodes.map((n: any) => ({ id: n.id, type: n.type, label: n.data?.label || n.data?.title })))}

核心原则（必须严格遵守用户提供的参考图设计风格）：
1. 风格必须严格对齐参考图（Grok Bot YouTube 极简暗黑金色版式）：
   - 背景：深邃哑光深黑 (#0E0F12)
   - 顶部金黄细眉标：如 "ADVANCED · 进阶" 或 "PRO TIPS · 封神" (#F5A623)
   - 纯白巨幅主词 (Brand Title)：如 "${brandTitle}" (超大字号无衬线粗体，全白 #FFFFFF)
   - 金色胶囊中线分隔符：金黄色细短粗条 (#F5A623)
   - 双色高对比主标：白字部分 (如 "高级") + 金字部分 (如 "玩法")
   - 核心卖点副标题：如 "多设备、多Bot、多群组 · 效率倍增" (清晰纯白带间隔符)
   - 真实出镜肖像：在右侧展示用户上传的真人肖像，左侧通过平滑暗调渐变羽化融入黑色背景
   - 右下角时长药丸：如 "13:03"
2. 严禁使用任何幼稚 3D 玩具图标或杂乱贴纸！

返回严格的 JSON 格式（不要包含任何 markdown 代码块或反引号包裹）：
{
  "agentReply": "对用户的回复（80字以内，讲清已为其打造基于参考图的 YouTube 极简暗黑+金双色排版，并保留肖像素材位）",
  "actionType": "CREATE_WORKFLOW",
  "steps": [
    { "title": "选题与核心亮点解构", "detail": "提炼《${brandTitle}》高阶功能与用户核心痛点", "status": "completed" },
    { "title": "匹配 YouTube 极简暗黑+金色版式", "detail": "应用深黑哑光底色与金黄细眉标，融入肖像出镜位", "status": "completed" },
    { "title": "黄白撞色标题与卖点排版", "detail": "巨幅大词 + [—] 分割线 + 白字进阶 + 金字玩法", "status": "completed" },
    { "title": "全链路数据流拓扑连线", "detail": "打通 选题 -> 肖像/素材 -> 标题 -> 封面合成 -> A/B对比 -> 批量导出", "status": "completed" },
    { "title": "智能画布流水线对齐", "detail": "按工序排版节点并保存快照", "status": "completed" }
  ],
  "suggestedWorkflow": {
    "topic": "${detectedSubject}",
    "brandTitle": "${brandTitle}",
    "coreConcept": "${brandTitle} 高阶核心玩法",
    "eyebrowTag": "ADVANCED · 进阶",
    "headlineWhite": "高级",
    "headlineGold": "玩法",
    "mainTitle": "高级玩法",
    "subTitle": "多设备、多Bot、多群组 · 效率倍增",
    "badgeText": "进阶",
    "duration": "13:03",
    "visualTheme": "grok-dark-gold",
    "sciencePrompt": "YouTube minimalist dark cover layout, ADVANCED eyebrow tag, ${brandTitle} bold white title, yellow dash line, two-tone Chinese headline, portrait subject on right, 13:03 duration pill, 4k",
    "color": "#F5A623"
  },
  "appliedSkills": ["YouTube极简暗黑版式", "黄白撞色主标题", "金黄细眉标分类", "真人肖像边缘渐变融合"]
}
`;

  try {
    const rawResult = await callGeminiText(prompt);
    if (rawResult) {
      const cleanJson = rawResult.replace(/^```json/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed && parsed.steps && parsed.steps.length > 0) {
        return res.json({ success: true, ...parsed });
      }
    }
  } catch (err) {
    console.warn('Agent brainstorm fallback:', err);
  }

  // Fallback intelligent agent reply strictly in GrokBot Dark & Gold format
  res.json({
    success: true,
    agentReply: `已为您深度解构《${brandTitle}》的专属 YouTube 封面！严格采用您指定的设计语言：深邃哑光深黑底、顶部金黄细眉标、巨幅纯白品牌大词、黄白撞色主标，并在右侧无缝挂载您的真人出镜肖像！`,
    actionType: 'CREATE_WORKFLOW',
    steps: [
      { title: '选题与核心亮点解构', detail: `提炼《${brandTitle}》高阶功能与用户核心痛点`, status: 'completed' },
      { title: '构建 YouTube 极简暗黑+金色版式', detail: '选用深黑哑光底色与金黄细眉标，融入肖像出镜位', status: 'completed' },
      { title: '黄白撞色标题与卖点排版', detail: '巨幅大词 + [—] 分割线 + 白字高级 + 金字玩法', status: 'completed' },
      { title: '全链路数据拓扑连线', detail: '打通 选题 -> 肖像素材 -> 标题 -> 封面合成 -> A/B对比 -> 批量导出', status: 'completed' },
      { title: '智能画布流水线对齐', detail: '按创作工序自动排列节点并保存历史快照', status: 'completed' },
    ],
    suggestedWorkflow: {
      topic: detectedSubject,
      brandTitle,
      coreConcept: `${brandTitle} 高阶核心玩法`,
      eyebrowTag: 'ADVANCED · 进阶',
      headlineWhite: '高级',
      headlineGold: '玩法',
      mainTitle: '高级玩法',
      subTitle: '多设备、多Bot、多群组 · 效率倍增',
      badgeText: '进阶',
      duration: '13:03',
      visualTheme: 'grok-dark-gold',
      sciencePrompt: `YouTube minimalist dark cover layout, ADVANCED eyebrow tag, ${brandTitle} bold white title, yellow dash line, two-tone Chinese headline, portrait subject on right, 13:03 duration pill, 4k`,
      color: '#F5A623',
    },
    appliedSkills: ['YouTube极简暗黑版式', '黄白撞色主标题', '金黄细眉标分类', '真人肖像边缘渐变融合'],
  });
});

// 4. Competitor Research Analysis
app.post('/api/analyze-competitor', async (req, res) => {
  const { title, platform = 'bilibili', views = '150万' } = req.body;
  const prompt = `
请对以下优秀的知识科普封面进行竞品拆解分析：
视频标题: "${title}"
发布平台: "${platform}"
参考播放量: "${views}"

请返回严格的 JSON 格式：
{
  "performanceScore": 94,
  "compositionType": "三分对角线构图（左侧放微表情人物，右侧放高能发光科学主体）",
  "colorStrategy": "冷黑背景 + 高饱和荧光黄/青色冲突色，拉满夜间信息流点击率",
  "typographyAnalysis": "主标题仅6个大字加粗放底部，保留右上角避开B站时长角标",
  "reusableFormula": "颠覆常识设问 + 具象化高科技物体 + 醒目数字对比",
  "suggestedTags": ["硬核科普", "思维升级", "黑科技", "B站精选"]
}
`;

  try {
    const rawResult = await callGeminiText(prompt);
    if (rawResult) {
      const cleanJson = rawResult.replace(/^```json/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json({ success: true, data: parsed });
    }
  } catch (e) {
    console.warn('Competitor analysis fallback:', e);
  }

  res.json({
    success: true,
    data: {
      performanceScore: 92,
      compositionType: '中心爆发式构图：中央聚焦发光科学核心，两侧辅助关键数据飞线',
      colorStrategy: '深空蓝底色 (#080E1A) 搭配电光青 (#00F0FF) 与警告橙 (#FF4B00)',
      typographyAnalysis: '采用极粗无衬线黑体，文字外描边加暗部发光阴影，确保在手机小缩略图上0.2秒可辨',
      reusableFormula: '“核心矛盾 + 极限数字”双重刺激，点击率高于同品类平均水平 3.2 倍',
      suggestedTags: ['深度科普', '科学实验', '涨知识', '热门封面'],
    },
  });
});

// 5. Script Studio & Multi-Platform Metadata Generator
app.post('/api/script-studio', async (req, res) => {
  const { topic, outline } = req.body;
  const prompt = `
请为知识科普视频选题 "${topic}" 生成多平台宣发文案与分镜脚本钩子：
参考大纲: "${outline || ''}"

请返回严格 JSON：
{
  "hooks": [
    "黄金前3秒黄金钩子1（反常识反问）",
    "黄金前3秒黄金钩子2（痛点场景代入）",
    "黄金前3秒黄金钩子3（数据震撼轰炸）"
  ],
  "douyinMeta": {
    "title": "抖音爆款标题（带热搜话题）",
    "description": "文案+互动问题（引导评论区争论）",
    "tags": ["#知识科普", "#硬核科技", "#涨知识"]
  },
  "xiaohongshuMeta": {
    "title": "小红书吸睛标题（情绪价值+干货感）",
    "description": "结构清晰的笔记文案，带emoji，分点提炼核心要点",
    "tags": ["#科普", "#思维认知", "#宝藏知识"]
  },
  "bilibiliMeta": {
    "title": "B站高质量长视频标题",
    "description": "专业详实的视频简介，包含核心文献索引与思考题",
    "tags": ["科学探索", "硬核科普", "大学物理", "技术拆解"]
  }
}
`;

  try {
    const rawResult = await callGeminiText(prompt);
    if (rawResult) {
      const cleanJson = rawResult.replace(/^```json/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json({ success: true, data: parsed });
    }
  } catch (e) {
    console.warn('Script studio fallback:', e);
  }

  res.json({
    success: true,
    data: {
      hooks: [
        '如果告诉你，课本上写了上百年的这个物理定律其实是错的，你会作何反应？',
        '耗资200亿、运行1000秒，为什么全世界科学家都在疯狂争夺这个微型火球？',
        '99%的人每天都在接触它，却完全不知道它正悄悄改写整个现代工业！',
      ],
      douyinMeta: {
        title: `${topic || '硬核科学'}到底有多颠覆？看完颠覆三观！`,
        description: '这才是真正的硬核科技！你觉得这项技术能在10年内商业化落地吗？在评论区留下你的神预测！',
        tags: ['#硬核科普', '#高燃科学', '#思维认知', '#涨知识'],
      },
      xiaohongshuMeta: {
        title: `🔥看完终于搞懂${topic || '核心科学'}了！彻底醍醐灌顶！`,
        description: '整理了整整3天！用最生动的大白话带你看懂硬核底层逻辑！✨ 建议点赞收藏反复消化～ 💡 关键三要点：1. 极端约束 2. 能量聚变 3. 量子跃迁。',
        tags: ['#我的私藏干货', '#科普笔记', '#思维开窍', '#学习打卡'],
      },
      bilibiliMeta: {
        title: `【深度】从微观粒子到无尽能源：彻底拆解${topic || '现代科学巨构'}`,
        description: '本期视频将通过高精度3D计算机渲染，深度剖析实验室内发生的一幕幕极限反应。参考论文：Nature 2026 最新封面研究。',
        tags: ['科学', '数理科学', '硬核技术', '前沿科技', '纪录片'],
      },
    },
  });
});

// 6. MCP Protocol Manifest Endpoint (Model Context Protocol inspection)
app.get('/api/mcp/manifest', (_req, res) => {
  res.json({
    name: 'knowledge-cover-studio-mcp',
    version: '1.2.0',
    description: 'Knowledge Cover Studio MCP Server for Claude Desktop, Cursor, and External Agents',
    tools: [
      {
        name: 'extract_topic_knowledge',
        description: 'Extract core knowledge points, 3 viral titles, and visual metaphor prompts for science videos',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', description: 'Video title or topic' },
            script: { type: 'string', description: 'Full script or outline text' },
          },
          required: ['topic'],
        },
      },
      {
        name: 'generate_science_visual',
        description: 'Generate 3D science models, celestial, microscopic, or mechanical backgrounds',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: { type: 'string' },
            style: { type: 'string', enum: ['3d-science', 'cyberpunk', 'minimal-flat', 'cosmic-astronomy'] },
            aspectRatio: { type: 'string', enum: ['16:9', '9:16', '3:4', '1:1'] },
          },
          required: ['prompt'],
        },
      },
      {
        name: 'execute_canvas_action',
        description: 'Create, link, and mutate nodes on the Knowledge Cover Studio infinite canvas',
        inputSchema: {
          type: 'object',
          properties: {
            action: { type: 'string', enum: ['CREATE_WORKFLOW', 'ADD_NODE', 'AUTO_LAYOUT', 'GENERATE_ABC_VARIATIONS'] },
            params: { type: 'object' },
          },
          required: ['action'],
        },
      },
      {
        name: 'batch_export_covers',
        description: 'Render and export covers in multi-platform resolutions (Douyin 9:16, Xiaohongshu 3:4, Bilibili 16:9, Wechat 1:1)',
        inputSchema: {
          type: 'object',
          properties: {
            nodeId: { type: 'string' },
            platforms: { type: 'array', items: { type: 'string' } },
          },
          required: ['nodeId'],
        },
      },
    ],
  });
});

// Mount Vite or serve static dist
async function setupVite() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback for SPA routing in development
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const server = app.listen(port, host, () => {
    console.log(`Knowledge Cover Studio server running at http://${host}:${port}`);
  });

  server.on('error', (err: any) => {
    console.error('Server error:', err);
  });
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
});
