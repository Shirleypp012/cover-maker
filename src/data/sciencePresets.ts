import { Node, Edge } from '@xyflow/react';

export interface IllustrationIconItem {
  id: string;
  name: string;
  emoji: string;
  category: 'tool' | 'ai' | 'zodiac' | 'tutorial' | 'general';
  badge: string;
  color: string;
  promptKeyword: string;
  description: string;
  svgSnippet: string;
  previewUrl: string;
  tag?: string;
  promptSnippet?: string;
  svgDataUrl?: string;
}

// Full 3D / Vector Illustration Icons Catalog
export const ILLUSTRATION_ICONS: IllustrationIconItem[] = [
  {
    id: 'pin-3d',
    name: '3D 悬浮置顶图钉',
    emoji: '📌',
    category: 'tool',
    badge: '贴图必备',
    color: '#ef4444',
    promptKeyword: '3D isometric red pushpin, glossy plastic sphere head, metallic needle, glass drop shadow',
    description: 'Snipaste F3 核心贴图置顶的灵魂视觉元素',
    svgSnippet: `
      <!-- 3D Pushpin Icon -->
      <g filter="url(#iconGlow)">
        <!-- Metallic Pin Needle -->
        <polygon points="40,40 58,58 35,63" fill="#cbd5e1"/>
        <line x1="38" y1="38" x2="20" y2="70" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
        <!-- Drop Shadow -->
        <ellipse cx="20" cy="72" rx="10" ry="4" fill="#000000" opacity="0.4"/>
        <!-- 3D Pin Head (Red Glassmorphism Sphere) -->
        <circle cx="50" cy="30" r="22" fill="url(#pinSphereGrad)"/>
        <!-- Beveled Ridge -->
        <ellipse cx="50" cy="30" rx="22" ry="7" fill="#dc2626" opacity="0.7"/>
        <ellipse cx="44" cy="24" rx="7" ry="5" fill="#ffffff" opacity="0.6"/>
      </g>
    `,
    previewUrl: '',
  },
  {
    id: 'scissors-3d',
    name: '3D 智能截屏剪刀',
    emoji: '✂️',
    category: 'tool',
    badge: '截屏利器',
    color: '#38bdf8',
    promptKeyword: '3D isometric open scissors cutting dashed box, metallic titanium blades, cyan handles, neon glow',
    description: 'F1 一键截屏与像素级裁切指示图标',
    svgSnippet: `
      <!-- 3D Scissors Icon -->
      <g filter="url(#iconGlow)">
        <!-- Upper Blade -->
        <path d="M25,55 L55,25 L75,18 L58,35 Z" fill="#e2e8f0"/>
        <!-- Lower Blade -->
        <path d="M25,25 L55,55 L75,62 L58,45 Z" fill="#94a3b8"/>
        <!-- Pivot Screw -->
        <circle cx="45" cy="40" r="4" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"/>
        <!-- Cyan Handles -->
        <circle cx="22" cy="62" r="14" fill="none" stroke="#38bdf8" stroke-width="5"/>
        <circle cx="22" cy="18" r="14" fill="none" stroke="#38bdf8" stroke-width="5"/>
        <!-- Sparks -->
        <circle cx="68" cy="40" r="2.5" fill="#fef08a"/>
      </g>
    `,
    previewUrl: '',
  },
  {
    id: 'loupe-3d',
    name: '3D 放大镜取色器',
    emoji: '🔍',
    category: 'tool',
    badge: '像素取色',
    color: '#f59e0b',
    promptKeyword: '3D isometric magnifying glass loupe, golden brass rim, optical lens glass reflection, crosshair',
    description: 'Snipaste 按 C 键高精度像素级取色器',
    svgSnippet: `
      <!-- 3D Loupe Icon -->
      <g filter="url(#iconGlow)">
        <!-- Brass Handle -->
        <line x1="55" y1="55" x2="80" y2="80" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>
        <line x1="55" y1="55" x2="80" y2="80" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
        <!-- Magnifying Lens Rim -->
        <circle cx="36" cy="36" r="28" fill="#0f172a" stroke="#f59e0b" stroke-width="5"/>
        <!-- Lens Glass Reflection -->
        <path d="M20,24 A22,22 0 0,1 48,16" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
        <!-- Crosshair grid -->
        <line x1="36" y1="18" x2="36" y2="54" stroke="#00f5ff" stroke-width="2"/>
        <line x1="18" y1="36" x2="54" y2="36" stroke="#00f5ff" stroke-width="2"/>
        <rect x="28" y="28" width="16" height="16" fill="#00f5ff" opacity="0.3"/>
      </g>
    `,
    previewUrl: '',
  },
  {
    id: 'hotkey-caps',
    name: '3D [F1][F3] 机械键帽',
    emoji: '⌨️',
    category: 'tool',
    badge: '快捷键',
    color: '#10b981',
    promptKeyword: '3D mechanical keyboard keycaps F1 and F3, rounded profile, glowing neon legends, side rim lighting',
    description: '核心高频快捷键公式立体键帽',
    svgSnippet: `
      <!-- 3D Keycaps Icon -->
      <g filter="url(#iconGlow)">
        <rect x="8" y="16" width="36" height="36" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <rect x="11" y="18" width="30" height="26" rx="6" fill="#0f172a"/>
        <text x="26" y="36" fill="#38bdf8" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">F1</text>
        <rect x="42" y="32" width="36" height="36" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
        <rect x="45" y="34" width="30" height="26" rx="6" fill="#0f172a"/>
        <text x="60" y="52" fill="#10b981" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">F3</text>
      </g>
    `,
    previewUrl: '',
  },
  {
    id: 'ai-chip',
    name: '3D AI 极光智能芯片',
    emoji: '🤖',
    category: 'ai',
    badge: 'AI核心',
    color: '#a855f7',
    promptKeyword: '3D isometric AI neural processor chip, purple glowing circuits, golden connector pins, cyber aesthetic',
    description: 'AI 视频全流程生成与大模型计算核心',
    svgSnippet: `
      <!-- 3D AI Chip Icon -->
      <g filter="url(#iconGlow)">
        <!-- Base Package -->
        <rect x="18" y="18" width="50" height="50" rx="10" fill="#1e1035" stroke="#a855f7" stroke-width="2"/>
        <!-- Gold Pins -->
        <line x1="28" y1="12" x2="28" y2="18" stroke="#fbbf24" stroke-width="2.5"/>
        <line x1="43" y1="12" x2="43" y2="18" stroke="#fbbf24" stroke-width="2.5"/>
        <line x1="58" y1="12" x2="58" y2="18" stroke="#fbbf24" stroke-width="2.5"/>
        <line x1="28" y1="68" x2="28" y2="74" stroke="#fbbf24" stroke-width="2.5"/>
        <line x1="43" y1="68" x2="43" y2="74" stroke="#fbbf24" stroke-width="2.5"/>
        <line x1="58" y1="68" x2="58" y2="74" stroke="#fbbf24" stroke-width="2.5"/>
        <!-- Central Die Core -->
        <rect x="28" y="28" width="30" height="30" rx="6" fill="#a855f7" fill-opacity="0.2" stroke="#00f5ff" stroke-width="1.5"/>
        <text x="43" y="48" fill="#ffffff" font-family="monospace" font-size="12" font-weight="900" text-anchor="middle">AI</text>
      </g>
    `,
    previewUrl: '',
  },
  {
    id: 'video-timeline',
    name: '3D 影视胶卷与多轨轴',
    emoji: '🎬',
    category: 'ai',
    badge: '视频出片',
    color: '#00f5ff',
    promptKeyword: '3D film reel clapperboard with multi-track timeline, cyan glowing playhead, 4k render badge',
    description: '视频剪辑与 AI 一键成片时间轴图标',
    svgSnippet: `
      <!-- 3D Video Reel Icon -->
      <g filter="url(#iconGlow)">
        <!-- Film Reel -->
        <circle cx="43" cy="43" r="32" fill="#0c0717" stroke="#00f5ff" stroke-width="3"/>
        <circle cx="43" cy="43" r="14" fill="#a855f7"/>
        <polygon points="38,36 38,50 52,43" fill="#ffffff"/>
        <!-- Perforations -->
        <circle cx="43" cy="18" r="3" fill="#00f5ff"/>
        <circle cx="43" cy="68" r="3" fill="#00f5ff"/>
        <circle cx="18" cy="43" r="3" fill="#00f5ff"/>
        <circle cx="68" cy="43" r="3" fill="#00f5ff"/>
      </g>
    `,
    previewUrl: '',
  },
  {
    id: 'lightning-power',
    name: '3D 极速爆发金炽闪电',
    emoji: '⚡',
    category: 'general',
    badge: '效率翻倍',
    color: '#eab308',
    promptKeyword: '3D golden lightning bolt, volumetric glow, sharp electric facets, high energy sparks',
    description: '效率暴增与极速出片视觉冲击符号',
    svgSnippet: `
      <!-- 3D Lightning Bolt Icon -->
      <g filter="url(#iconGlow)">
        <polygon points="46,12 22,46 42,46 32,76 68,36 48,36" fill="url(#boltGrad)" stroke="#fef08a" stroke-width="1.5"/>
        <polygon points="45,15 25,45 42,45 35,70 62,38 48,38" fill="#ffffff" opacity="0.3"/>
      </g>
    `,
    previewUrl: '',
  },
  {
    id: 'zodiac-wheel',
    name: '3D 紫金全息占星星盘',
    emoji: '🔮',
    category: 'zodiac',
    badge: '深度解析',
    color: '#c084fc',
    promptKeyword: '3D celestial astrological wheel, glowing golden zodiac constellation compass, tarot sacred geometry',
    description: '天蝎与十二星座性格防御机制星盘',
    svgSnippet: `
      <!-- 3D Zodiac Wheel Icon -->
      <g filter="url(#iconGlow)">
        <circle cx="43" cy="43" r="32" fill="#180b2a" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="43" cy="43" r="24" stroke="#c084fc" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
        <circle cx="43" cy="43" r="10" fill="#f59e0b" opacity="0.8"/>
        <!-- Star Rays -->
        <line x1="43" y1="12" x2="43" y2="74" stroke="#f59e0b" stroke-width="1"/>
        <line x1="12" y1="43" x2="74" y2="43" stroke="#f59e0b" stroke-width="1"/>
        <text x="43" y="47" fill="#180b2a" font-family="'Noto Sans SC', sans-serif" font-size="12" font-weight="900" text-anchor="middle">♏</text>
      </g>
    `,
    previewUrl: '',
  },
  {
    id: 'rocket-speed',
    name: '3D 效率起飞火箭',
    emoji: '🚀',
    category: 'tutorial',
    badge: '极速进阶',
    color: '#f97316',
    promptKeyword: '3D cartoon isometric rocket launching, bright exhaust plume flames, metallic spaceship hull',
    description: '打工人与学习者效率飙升象征',
    svgSnippet: `
      <!-- 3D Rocket Icon -->
      <g filter="url(#iconGlow)">
        <!-- Exhaust Fire -->
        <polygon points="36,55 50,55 43,76" fill="#f59e0b"/>
        <polygon points="39,55 47,55 43,68" fill="#ef4444"/>
        <!-- Rocket Body -->
        <path d="M43,14 Q56,34 52,56 L34,56 Q30,34 43,14 Z" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>
        <!-- Porthole Window -->
        <circle cx="43" cy="34" r="6" fill="#00f5ff" stroke="#0f172a" stroke-width="2"/>
        <!-- Red Fins -->
        <polygon points="34,44 22,58 34,56" fill="#ef4444"/>
        <polygon points="52,44 64,58 52,56" fill="#ef4444"/>
      </g>
    `,
    previewUrl: '',
  },
  {
    id: 'lightbulb-idea',
    name: '3D 灵感点亮灯泡',
    emoji: '💡',
    category: 'tutorial',
    badge: '实操神技',
    color: '#fbbf24',
    promptKeyword: '3D illuminated lightbulb, golden coiled filament, glowing amber glass, creative inspiration',
    description: '新手避坑与核心高阶技巧点亮',
    svgSnippet: `
      <!-- 3D Lightbulb Icon -->
      <g filter="url(#iconGlow)">
        <circle cx="43" cy="36" r="22" fill="#fbbf24" fill-opacity="0.25" stroke="#f59e0b" stroke-width="3"/>
        <path d="M33,52 L53,52 L49,64 L37,64 Z" fill="#64748b"/>
        <rect x="36" y="64" width="14" height="4" rx="2" fill="#94a3b8"/>
        <!-- Filament -->
        <path d="M38,40 Q43,26 48,40" stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- Glow Sparks -->
        <line x1="43" y1="8" x2="43" y2="2" stroke="#fbbf24" stroke-width="2"/>
        <line x1="16" y1="20" x2="10" y2="16" stroke="#fbbf24" stroke-width="2"/>
        <line x1="70" y1="20" x2="76" y2="16" stroke="#fbbf24" stroke-width="2"/>
      </g>
    `,
    previewUrl: '',
  },
  {
    id: 'diamond-pro',
    name: '3D 封神高光钻石',
    emoji: '💎',
    category: 'general',
    badge: '封神神器',
    color: '#00f5ff',
    promptKeyword: '3D brilliant cut diamond gemstone, prismatic reflection facets, sparkle glimmer',
    description: '神器封神与千万播放高质感徽标',
    svgSnippet: `
      <!-- 3D Diamond Icon -->
      <g filter="url(#iconGlow)">
        <polygon points="20,32 32,16 54,16 66,32 43,68" fill="#06b6d4" stroke="#00f5ff" stroke-width="2"/>
        <polygon points="32,16 43,32 54,16" fill="#38bdf8"/>
        <polygon points="20,32 43,32 43,68" fill="#0891b2" opacity="0.6"/>
        <polygon points="66,32 43,32 43,68" fill="#00f5ff" opacity="0.8"/>
        <circle cx="56" cy="22" r="3" fill="#ffffff"/>
      </g>
    `,
    previewUrl: '',
  },
  {
    id: 'target-bullseye',
    name: '3D 痛点精准靶心',
    emoji: '🎯',
    category: 'tutorial',
    badge: '精准打击',
    color: '#f43f5e',
    promptKeyword: '3D bullseye target with red and white rings, golden arrow hit dead center',
    description: '一针见血解决用户核心痛点',
    svgSnippet: `
      <!-- 3D Target Icon -->
      <g filter="url(#iconGlow)">
        <circle cx="43" cy="43" r="32" fill="#f43f5e" stroke="#0f172a" stroke-width="2"/>
        <circle cx="43" cy="43" r="23" fill="#ffffff"/>
        <circle cx="43" cy="43" r="14" fill="#f43f5e"/>
        <circle cx="43" cy="43" r="5" fill="#fef08a"/>
        <!-- Golden Arrow -->
        <line x1="58" y1="28" x2="43" y2="43" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
        <polygon points="66,20 62,32 54,24" fill="#f59e0b"/>
      </g>
    `,
    previewUrl: '',
  },
];

// Helper to convert an icon SVG into data URL preview
export function getIllustrationIconDataUrl(snippet: string, color: string = '#00f5ff'): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="86" height="86" viewBox="0 0 86 86">
  <defs>
    <radialGradient id="pinSphereGrad" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#f87171"/>
      <stop offset="45%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#7f1d1d"/>
    </radialGradient>
    <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <filter id="iconGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="transparent"/>
  ${snippet}
</svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

// Populate previewUrls on startup
ILLUSTRATION_ICONS.forEach((item) => {
  item.previewUrl = getIllustrationIconDataUrl(item.svgSnippet, item.color);
  item.svgDataUrl = item.previewUrl;
  item.tag = item.badge;
  item.promptSnippet = item.promptKeyword;
});

// Vertical 9:16 Poster Layer System matching user's two reference styles
export interface LayerItemConfig {
  x: number;
  y: number;
  scale?: number;
  visible?: boolean;
  locked?: boolean;
}

export interface VerticalLayerPositions {
  badgePill?: LayerItemConfig;
  brandTitle?: LayerItemConfig;
  headline?: LayerItemConfig;
  heroSubject?: LayerItemConfig;
  subtitle?: LayerItemConfig;
  bottomGrid?: LayerItemConfig;
  dateBadge?: LayerItemConfig;
  creatorTag?: LayerItemConfig;
  // Backward compatibility keys
  eyebrow?: LayerItemConfig;
  accentPill?: LayerItemConfig;
  portrait?: LayerItemConfig;
  duration?: LayerItemConfig;
}

// Default vertical 9:16 layer positions (540 x 960 viewBox)
export const DEFAULT_VERTICAL_LAYERS: VerticalLayerPositions = {
  badgePill: { x: 270, y: 75, visible: true, locked: false },
  brandTitle: { x: 270, y: 155, visible: true, locked: false },
  headline: { x: 270, y: 245, visible: true, locked: false },
  heroSubject: { x: 270, y: 570, scale: 1.0, visible: true, locked: false },
  subtitle: { x: 270, y: 310, visible: true, locked: false },
  bottomGrid: { x: 270, y: 720, visible: true, locked: false },
  dateBadge: { x: 380, y: 75, visible: true, locked: false },
  creatorTag: { x: 90, y: 40, visible: true, locked: false },
  // Compatibility
  eyebrow: { x: 270, y: 75, visible: true, locked: false },
  accentPill: { x: 270, y: 195, visible: true, locked: false },
  portrait: { x: 270, y: 570, scale: 1.0, visible: true, locked: false },
  duration: { x: 440, y: 910, visible: true, locked: false },
};

export const DEFAULT_COVER_LAYERS = DEFAULT_VERTICAL_LAYERS;
export type YouTubeLayerPositions = VerticalLayerPositions;

export interface VerticalCoverOptions {
  style?: 'mint-clean' | 'mint-banner' | 'editorial-duet' | 'vertical-hero' | 'vertical-bento' | string;
  topic?: string;
  brandTitle?: string;
  seriesTag?: string; // e.g. "Canva Craft ▪" or "Snipaste Pro ▪"
  creatorTag?: string; // e.g. ">Jerry_AI."
  headlineLine1?: string; // e.g. "直接丟給" or "迴圈工程" or "第一次做模型" or "換 AI 主動"
  headlineLine2?: string; // e.g. "你的bot讀" or "4 個坑別踩" or "就贏過 Google" or "來找你"
  headlineBannerMode?: boolean; // if true, renders headlineLine2 inside a solid mint green rectangular block with black text
  headlineWhite?: string;
  headlineAccent?: string;
  headlineGold?: string;
  headlineSuffix?: string;
  mainTitle?: string;
  subtitle?: string;
  accentColor?: string; // Default: fresh mint green #10B981 / #34D399
  // Hero Subject Visuals
  subjectType?: '3d-book' | 'designer-chair' | 'tactile-loop' | 'clean-ui-card' | 'ai-image' | 'portrait';
  aiHeroImageUrl?: string;
  avatarUrl?: string;
  avatarScale?: number;
  avatarPosX?: number;
  avatarPosY?: number;
  layers?: VerticalLayerPositions;
  // Legacy / Overload
  pillBadge?: string;
  newBadge?: string;
  eyebrow?: string;
  title?: string;
  duration?: string;
  dateTag?: string;
  categoryBadge?: string;
  bentoItems?: Array<{ title: string; desc?: string; type?: string; color?: string }>;
}

export type YouTubeCoverOptions = VerticalCoverOptions;

// Intelligently deconstructs topic & viral titles into clean editorial vertical cover fields
export function parseViralTitleToCoverFields(
  topic: string,
  mainTitle: string,
  subTitle?: string,
  formula?: string
) {
  const combined = `${topic || ''} ${mainTitle || ''}`;

  // 1. Brand Title: extract product/tool/keyword
  let brandTitle = 'Grok Bot';
  if (/snipaste/i.test(combined)) brandTitle = 'Snipaste';
  else if (/claude/i.test(combined)) brandTitle = 'Claude Duet';
  else if (/canva/i.test(combined)) brandTitle = 'Canva Craft';
  else if (/chatgpt|gpt/i.test(combined)) brandTitle = 'ChatGPT';
  else if (/notion/i.test(combined)) brandTitle = 'Notion';
  else if (/midjourney/i.test(combined)) brandTitle = 'Midjourney';
  else if (/剪映|capcut/i.test(combined)) brandTitle = 'CapCut';
  else if (/天蝎/i.test(combined)) brandTitle = '天蝎座';
  else if (/ai/i.test(combined)) brandTitle = 'AI Video';
  else if (topic) {
    const cleaned = topic.split(/[:：\s—\-]/)[0].trim();
    brandTitle = cleaned.slice(0, 12) || 'Grok Bot';
  }

  // 2. Headline Parts matching reference image (White line 1 + Mint Green line 2)
  let headlineLine1 = '直接丟給';
  let headlineLine2 = '你的bot讀';
  let headlineBannerMode = false;
  let subjectType: '3d-book' | 'designer-chair' | 'tactile-loop' | 'clean-ui-card' = '3d-book';

  const rawClean = (mainTitle || '')
    .replace(/[!！?？]/g, '')
    .trim();

  if (/snipaste/i.test(combined)) {
    headlineLine1 = '封神截圖神器';
    headlineLine2 = '4 個神技別踩坑';
    headlineBannerMode = false;
    subjectType = 'tactile-loop';
  } else if (/claude/i.test(combined)) {
    headlineLine1 = '換 AI 主動';
    headlineLine2 = '來找你';
    headlineBannerMode = false;
    subjectType = 'clean-ui-card';
  } else if (/canva|模型/i.test(combined)) {
    headlineLine1 = '第一次做模型';
    headlineLine2 = '就贏過 Google';
    headlineBannerMode = true;
    subjectType = 'designer-chair';
  } else if (/迴圈|循環|架构|工程/i.test(combined)) {
    headlineLine1 = '迴圈工程';
    headlineLine2 = '4 個坑別踩';
    headlineBannerMode = false;
    subjectType = 'tactile-loop';
  } else if (rawClean.length >= 4) {
    const mid = Math.min(5, Math.max(2, Math.floor(rawClean.length / 2)));
    headlineLine1 = rawClean.slice(0, mid);
    headlineLine2 = rawClean.slice(mid);
    if (/赢过|最强|必须|第一/i.test(rawClean)) {
      headlineBannerMode = true;
    }
  }

  const creatorTag = '>Jerry_AI.';
  const seriesTag = `${brandTitle} ▪`;

  return {
    brandTitle,
    headlineLine1,
    headlineLine2,
    headlineBannerMode,
    subjectType,
    creatorTag,
    seriesTag,
    headlineWhite: headlineLine1,
    headlineAccent: headlineLine2,
    headlineGold: headlineLine2,
    headlineSuffix: '',
    pillBadge: brandTitle,
    subTitle: subTitle || '實操核心拆解 · 效率直接翻倍',
    mainTitle: `${headlineLine1} ${headlineLine2}`,
  };
}

// 9:16 Vertical Mobile Cover Visual Generator (540 x 960)
// Designed strictly according to user reference image (image_11b1e620.png):
// - Deep matte navy background (#0A0E17)
// - Clean typography: Crisp White (#FFFFFF) + Fresh Mint Green (#34D399 / #10B981)
// - Optional solid mint green banner block with black text (like "就贏過 Google")
// - Tactile, friendly 3D / studio objects with natural soft shadows (NO laser fluorescent grids, NO robotic neon slop)
export function createVerticalCoverVisual(options: VerticalCoverOptions | string = {}) {
  const width = 540;
  const height = 960;

  const opts: VerticalCoverOptions = typeof options === 'string' ? { topic: options, brandTitle: options } : options;
  const style = opts.style || 'mint-clean';

  // Typography & Content
  const brandTitle = opts.brandTitle || 'Grok Bot';
  const creatorTag = opts.creatorTag || '>Jerry_AI.';
  const seriesTag = opts.seriesTag || (brandTitle ? `${brandTitle} ▪` : 'Canva Craft ▪');
  
  // Headline Line 1 & Line 2
  const headlineLine1 = opts.headlineLine1 || opts.headlineWhite || '直接丟給';
  const headlineLine2 = opts.headlineLine2 || opts.headlineAccent || opts.headlineGold || '你的bot讀';
  
  // Mint Banner Mode (Solid green box with bold black text, as in Card 3 "就贏過 Google")
  const isBannerMode = opts.headlineBannerMode ?? (style === 'mint-banner' || /赢过|Google/i.test(headlineLine2));

  // Mint Green Accent Color (Soft, fresh, non-fluorescent mint green from screenshot)
  const mintColor = opts.accentColor || '#34D399';
  const mintBannerColor = '#10B981';

  // Layers & Coordinates
  const layers = opts.layers || DEFAULT_VERTICAL_LAYERS;
  const creatorTagPos = layers.creatorTag ?? { x: 70, y: 55, visible: true, locked: false };
  const brandTitlePos = layers.brandTitle ?? { x: 70, y: 110, visible: true, locked: false };
  const headlinePos = layers.headline ?? { x: 70, y: 175, visible: true, locked: false };
  const heroSubjectPos = layers.heroSubject ?? layers.portrait ?? { x: 270, y: 620, scale: 1.0, visible: true, locked: false };
  const subtitlePos = layers.subtitle ?? { x: 70, y: 260, visible: false, locked: false };

  // Subject Type (default: 3D book or user-selected)
  let subjectType = opts.subjectType || '3d-book';
  if (/canva|模型|椅|chair/i.test(`${opts.topic} ${brandTitle}`)) subjectType = 'designer-chair';
  else if (/迴圈|工程|loop|坑/i.test(`${opts.topic} ${brandTitle} ${headlineLine1}`)) subjectType = 'tactile-loop';
  else if (/claude|duet|手機|ui/i.test(`${opts.topic} ${brandTitle}`)) subjectType = 'clean-ui-card';

  // Images
  const aiHeroImageUrl = opts.aiHeroImageUrl;
  const avatarUrl = opts.avatarUrl;
  const heroImageToDisplay = avatarUrl || aiHeroImageUrl;
  const heroScale = heroSubjectPos.scale ?? opts.avatarScale ?? 1.0;

  // Render SVG
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <!-- Deep Matte Slate / Charcoal Background (Clean, organic, zero fluorescent glare) -->
    <linearGradient id="matteNavyBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#080C14"/>
      <stop offset="50%" stop-color="#0B101B"/>
      <stop offset="100%" stop-color="#070A10"/>
    </linearGradient>

    <!-- Natural Soft Studio Drop Shadow for 3D Objects -->
    <filter id="softStudioShadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#000000" flood-opacity="0.65"/>
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.4"/>
    </filter>

    <!-- Warm Leather Gradient for Designer Chair -->
    <linearGradient id="redLeatherGrad" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#DC2626"/>
      <stop offset="45%" stop-color="#B91C1C"/>
      <stop offset="85%" stop-color="#7F1D1D"/>
      <stop offset="100%" stop-color="#450A0A"/>
    </linearGradient>

    <!-- Chrome Metal Tubing Gradient -->
    <linearGradient id="chromeTubing" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94A3B8"/>
      <stop offset="35%" stop-color="#FFFFFF"/>
      <stop offset="65%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#64748B"/>
    </linearGradient>

    <!-- Soft Floor Vignette Shadow -->
    <radialGradient id="floorAmbient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1E293B" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#080C14" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Deep Matte Dark Slate Background -->
  <rect width="100%" height="100%" fill="url(#matteNavyBg)"/>

  <!-- Soft Ambient Light on Center Floor -->
  <ellipse cx="270" cy="720" rx="240" ry="140" fill="url(#floorAmbient)"/>

  <!-- Top Creator Handle (>Jerry_AI.) -->
  ${
    creatorTagPos.visible !== false
      ? `
  <g transform="translate(${creatorTagPos.x}, ${creatorTagPos.y})">
    <text x="0" y="0" fill="#E2E8F0" font-family="'JetBrains Mono', -apple-system, sans-serif" font-size="20" font-weight="700" letter-spacing="0.5">
      <tspan fill="${mintColor}">&gt;</tspan>${creatorTag.replace(/^>/, '')}
    </text>
  </g>
      `
      : ''
  }

  <!-- Series Brand Title (e.g. "Canva Craft ▪" or "Claude Duet") -->
  ${
    brandTitlePos.visible !== false && seriesTag
      ? `
  <g transform="translate(${brandTitlePos.x}, ${brandTitlePos.y})">
    <text x="0" y="0" fill="#FFFFFF" font-family="'PingFang SC', 'Noto Sans SC', system-ui, sans-serif" font-size="26" font-weight="800" letter-spacing="-0.3">
      ${seriesTag.replace(/[▪■]/g, '')}
      <tspan fill="${mintColor}" font-size="20" dx="4">■</tspan>
    </text>
  </g>
      `
      : ''
  }

  <!-- Primary Headline Group (White Line 1 + Mint Green Line 2 / Banner) -->
  ${
    headlinePos.visible !== false
      ? `
  <g transform="translate(${headlinePos.x}, ${headlinePos.y})">
    <!-- Line 1: Pure White Headline (e.g. "直接丟給" or "迴圈工程" or "第一次做模型") -->
    <text x="0" y="0" fill="#FFFFFF" font-family="'PingFang SC', 'Noto Sans SC', 'Noto Sans TC', system-ui, sans-serif" font-size="54" font-weight="900" letter-spacing="-1">
      ${headlineLine1}
    </text>

    <!-- Line 2: Mint Green Accent Text OR Solid Mint Green Highlight Block -->
    ${
      isBannerMode
        ? `
    <!-- Solid Mint Green Highlight Banner Block with Bold Black Text (Reference: 就贏過 Google) -->
    <g transform="translate(-4, 24)">
      <rect x="0" y="0" width="${Math.max(280, headlineLine2.length * 48 + 36)}" height="68" rx="6" fill="${mintBannerColor}"/>
      <text x="${Math.max(280, headlineLine2.length * 48 + 36) / 2}" y="49" fill="#05080E" font-family="'PingFang SC', 'Noto Sans SC', 'Noto Sans TC', system-ui, sans-serif" font-size="44" font-weight="950" text-anchor="middle" letter-spacing="-0.5">
        ${headlineLine2}
      </text>
    </g>
        `
        : `
    <!-- Clean Mint Green Text (Reference: 你的bot讀 / 4 個坑別踩 / 來找你) -->
    <text x="0" y="68" fill="${mintColor}" font-family="'PingFang SC', 'Noto Sans SC', 'Noto Sans TC', system-ui, sans-serif" font-size="54" font-weight="900" letter-spacing="-1">
      ${headlineLine2}
    </text>
        `
    }
  </g>
      `
      : ''
  }

  <!-- Optional Subtitle -->
  ${
    subtitlePos.visible !== false && opts.subtitle
      ? `
  <g transform="translate(${subtitlePos.x}, ${subtitlePos.y})">
    <text x="0" y="0" fill="#94A3B8" font-family="'PingFang SC', system-ui, sans-serif" font-size="16" font-weight="600">
      ${opts.subtitle}
    </text>
  </g>
      `
      : ''
  }

  <!-- Central Tactile 3D Studio Subject / Hero Visual -->
  ${
    heroSubjectPos.visible !== false
      ? `
  <g id="hero-subject-container" transform="translate(${heroSubjectPos.x}, ${heroSubjectPos.y})">
    ${
      heroImageToDisplay
        ? `
    <!-- User Uploaded Portrait or AI Generated Visual (Rendered with natural soft studio shadow) -->
    <g transform="scale(${heroScale}) translate(-190, -190)" filter="url(#softStudioShadow)">
      <image href="${heroImageToDisplay}" x="0" y="0" width="380" height="380" preserveAspectRatio="xMidYMid meet" clip-path="inset(0 round 24px)"/>
    </g>
        `
        : subjectType === 'designer-chair'
        ? `
    <!-- Subject Style 1: Designer Bauhaus Red Leather Armchair on Mint Pedestal (Card 3 in reference) -->
    <g transform="scale(${heroScale})" filter="url(#softStudioShadow)">
      <!-- Mint Pedestal Block -->
      <polygon points="-160,110 160,110 185,160 -185,160" fill="#0D9488" opacity="0.6"/>
      <rect x="-185" y="160" width="370" height="42" fill="#0F766E" opacity="0.6"/>

      <!-- Chrome Tubular Steel Frame -->
      <path d="M -110,135 L -110,-20 Q -110,-60 -70,-60 L 70,-60 Q 110,-60 110,-20 L 110,135" fill="none" stroke="url(#chromeTubing)" stroke-width="14" stroke-linecap="round"/>
      <path d="M -110,50 L 110,50" fill="none" stroke="url(#chromeTubing)" stroke-width="12"/>
      <path d="M -125,0 Q -125,-40 -85,-40 L 85,-40 Q 125,-40 125,0 L 125,135 L -125,135 Z" fill="none" stroke="url(#chromeTubing)" stroke-width="12" stroke-linejoin="round"/>

      <!-- Cushioned Red Leather Seat & Backrest -->
      <!-- Backrest Cushion -->
      <rect x="-95" y="-85" width="190" height="120" rx="20" fill="url(#redLeatherGrad)" stroke="#EF4444" stroke-width="1.5"/>
      <!-- Tufted crease highlights -->
      <path d="M -70,-25 Q 0,-35 70,-25" stroke="#7F1D1D" stroke-width="4" fill="none" opacity="0.7"/>
      <path d="M -70,-55 Q 0,-65 70,-55" stroke="#F87171" stroke-width="2" fill="none" opacity="0.6"/>

      <!-- Seat Cushion -->
      <rect x="-105" y="15" width="210" height="85" rx="16" fill="url(#redLeatherGrad)" stroke="#B91C1C" stroke-width="2"/>
      <path d="M -80,55 Q 0,45 80,55" stroke="#7F1D1D" stroke-width="4" fill="none" opacity="0.7"/>

      <!-- Armrest Cushions -->
      <rect x="-122" y="-15" width="24" height="75" rx="12" fill="url(#redLeatherGrad)"/>
      <rect x="98" y="-15" width="24" height="75" rx="12" fill="url(#redLeatherGrad)"/>
    </g>
        `
        : subjectType === 'tactile-loop'
        ? `
    <!-- Subject Style 2: Tactile 3D Clay Racetrack Loop (Card 1 in reference) -->
    <g transform="scale(${heroScale})" filter="url(#softStudioShadow)">
      <!-- Support Pillars below track -->
      <rect x="-135" y="40" width="24" height="65" rx="12" fill="#475569"/>
      <rect x="110" y="40" width="24" height="65" rx="12" fill="#475569"/>
      <rect x="-55" y="65" width="24" height="65" rx="12" fill="#334155"/>
      <rect x="30" y="65" width="24" height="65" rx="12" fill="#334155"/>

      <!-- 3D Stadium Loop Track -->
      <ellipse cx="0" cy="15" rx="165" ry="95" fill="#0F766E"/>
      <ellipse cx="0" cy="0" rx="165" ry="95" fill="#10B981" stroke="#34D399" stroke-width="6"/>
      <ellipse cx="0" cy="0" rx="95" ry="52" fill="#080C14"/>

      <!-- White dashed center lane markings -->
      <ellipse cx="0" cy="0" rx="130" ry="73" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="14 12"/>

      <!-- Direction Arrow in Mint -->
      <polygon points="120,-30 145,-15 120,0" fill="#042F2E"/>

      <!-- Pit Holes & Warning Triangles -->
      <!-- Pit 1 -->
      <ellipse cx="-115" cy="-20" rx="22" ry="12" fill="#04060A"/>
      <polygon points="-115,-40 -126,-22 -104,-22" fill="#F59E0B" stroke="#000000" stroke-width="1.5"/>
      <text x="-115" y="-25" fill="#000000" font-family="monospace" font-size="10" font-weight="900" text-anchor="middle">!</text>

      <!-- Pit 2 -->
      <ellipse cx="90" cy="35" rx="24" ry="14" fill="#04060A"/>
      <polygon points="90,15 78,34 102,34" fill="#F59E0B" stroke="#000000" stroke-width="1.5"/>
      <text x="90" y="31" fill="#000000" font-family="monospace" font-size="10" font-weight="900" text-anchor="middle">!</text>

      <!-- Pit 3 -->
      <ellipse cx="-100" cy="40" rx="20" ry="12" fill="#04060A"/>
      <polygon points="-100,20 -110,38 -90,38" fill="#F59E0B" stroke="#000000" stroke-width="1.5"/>
      <text x="-100" y="35" fill="#000000" font-family="monospace" font-size="10" font-weight="900" text-anchor="middle">!</text>
    </g>
        `
        : subjectType === 'clean-ui-card'
        ? `
    <!-- Subject Style 3: Clean Modern UI Card Phone & Floating Icons (Card 4 in reference) -->
    <g transform="scale(${heroScale})" filter="url(#softStudioShadow)">
      <!-- Main Smartphone White Card -->
      <rect x="-85" y="-140" width="170" height="270" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="3"/>
      <rect x="-70" y="-120" width="140" height="230" rx="12" fill="#F8FAFC"/>
      <!-- Top Speaker Notch -->
      <rect x="-24" y="-132" width="48" height="5" rx="2.5" fill="#CBD5E1"/>

      <!-- App Content: Orange/Terracotta Organic Avatar Badge -->
      <circle cx="0" cy="-45" r="38" fill="#D97706" opacity="0.85"/>
      <!-- Organic Scribble -->
      <path d="M -18,-45 Q -9,-60 0,-45 Q 9,-30 18,-45" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round"/>

      <!-- Mint Green UI Action Strip -->
      <rect x="-52" y="25" width="104" height="28" rx="6" fill="${mintColor}"/>

      <!-- Left Floating Envelope Card -->
      <g transform="translate(-145, -70)">
        <rect x="0" y="0" width="58" height="42" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="2"/>
        <path d="M 6,10 L 29,26 L 52,10" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
      </g>

      <!-- Left Document Lines Card -->
      <g transform="translate(-145, 10)">
        <rect x="0" y="0" width="52" height="62" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
        <line x1="12" y1="18" x2="40" y2="18" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
        <line x1="12" y1="30" x2="40" y2="30" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
        <line x1="12" y1="42" x2="30" y2="42" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
      </g>

      <!-- Right Calendar Check Card -->
      <g transform="translate(100, -10)">
        <rect x="0" y="0" width="56" height="56" rx="10" fill="#FFFFFF" stroke="#059669" stroke-width="2"/>
        <rect x="0" y="0" width="56" height="16" rx="8" fill="#047857"/>
        <path d="M 18,36 L 25,43 L 40,28" fill="none" stroke="#10B981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </g>
        `
        : `
    <!-- Subject Style 4: 3D Guide Book with Cute Droplet Companions (Card 2 in reference) -->
    <g transform="scale(${heroScale})" filter="url(#softStudioShadow)">
      <!-- 3D Red Book (Grok Bot 指南 5條規則) -->
      <g transform="translate(-50, -40)">
        <!-- Book spine and paper edge -->
        <rect x="-42" y="-105" width="180" height="215" rx="16" fill="#F8FAFC"/>
        <line x1="-36" y1="-95" x2="-36" y2="95" stroke="#CBD5E1" stroke-width="1.5"/>
        <line x1="-32" y1="-95" x2="-32" y2="95" stroke="#CBD5E1" stroke-width="1.5"/>

        <!-- Book Front Cover -->
        <rect x="-30" y="-110" width="170" height="225" rx="14" fill="#EF4444" stroke="#DC2626" stroke-width="2"/>
        
        <!-- Book Spine Stitch detail -->
        <circle cx="-20" cy="-60" r="3" fill="#FFFFFF"/>
        <circle cx="-20" cy="0" r="3" fill="#FFFFFF"/>
        <circle cx="-20" cy="60" r="3" fill="#FFFFFF"/>

        <!-- Book Title Text -->
        <text x="55" y="-35" fill="#FFFFFF" font-family="'PingFang SC', system-ui, sans-serif" font-size="28" font-weight="950" text-anchor="middle" letter-spacing="-0.5">
          ${brandTitle.slice(0, 8)}
        </text>
        <text x="55" y="5" fill="#FFFFFF" font-family="'PingFang SC', system-ui, sans-serif" font-size="28" font-weight="950" text-anchor="middle" letter-spacing="-0.5">
          指南
        </text>
        <text x="55" y="45" fill="#FFFFFF" font-family="'PingFang SC', system-ui, sans-serif" font-size="24" font-weight="950" text-anchor="middle" letter-spacing="-0.5">
          5 條規則
        </text>
      </g>

      <!-- Cute Colorful Droplet Character Companions (from Reference Card 2) -->
      <!-- Orange droplet (Left top) -->
      <g transform="translate(-125, 10)">
        <path d="M 0,-30 C -25,-10 -25,25 0,30 C 25,25 25,-10 0,-30 Z" fill="#F97316"/>
        <circle cx="-5" cy="5" r="2.5" fill="#000000"/>
        <circle cx="5" cy="5" r="2.5" fill="#000000"/>
        <circle cx="-4" cy="4" r="1" fill="#FFFFFF"/>
        <circle cx="6" cy="4" r="1" fill="#FFFFFF"/>
      </g>

      <!-- Blue droplet (Bottom left) -->
      <g transform="translate(-95, 75)">
        <path d="M 0,-30 C -30,0 -30,30 0,35 C 30,30 30,0 0,-30 Z" fill="#3B82F6"/>
        <circle cx="-6" cy="5" r="3" fill="#000000"/>
        <circle cx="6" cy="5" r="3" fill="#000000"/>
      </g>

      <!-- Green cute creature (Bottom center) -->
      <g transform="translate(-10, 85)">
        <circle cx="0" cy="0" r="32" fill="#10B981"/>
        <circle cx="-7" cy="-2" r="3.5" fill="#000000"/>
        <circle cx="7" cy="-2" r="3.5" fill="#000000"/>
        <circle cx="-6" cy="-3" r="1" fill="#FFFFFF"/>
        <circle cx="8" cy="-3" r="1" fill="#FFFFFF"/>
      </g>

      <!-- Teal cone creature (Bottom right) -->
      <g transform="translate(65, 80)">
        <polygon points="0,-32 -28,26 28,26" fill="#14B8A6"/>
        <circle cx="-5" cy="5" r="2.5" fill="#000000"/>
        <circle cx="5" cy="5" r="2.5" fill="#000000"/>
      </g>

      <!-- Purple droplet (Far right) -->
      <g transform="translate(100, 25)">
        <path d="M 0,-25 C -20,-5 -20,20 0,25 C 20,20 20,-5 0,-25 Z" fill="#8B5CF6"/>
        <circle cx="-4" cy="5" r="2.5" fill="#000000"/>
        <circle cx="4" cy="5" r="2.5" fill="#000000"/>
      </g>
    </g>
        `
    }
  </g>
      `
      : ''
  }

  <!-- Bottom Brand Handle (As seen in Card 4 of reference) -->
  <g transform="translate(270, 915)">
    <text x="0" y="0" fill="#E2E8F0" opacity="0.8" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" text-anchor="middle" letter-spacing="0.5">
      <tspan fill="${mintColor}">&gt;</tspan>${creatorTag.replace(/^>/, '')}
    </text>
  </g>
</svg>
  `;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}


// Backward compatibility alias: createYouTubeCoverVisual now renders the enhanced vertical/horizontal covers
export function createYouTubeCoverVisual(options: YouTubeCoverOptions | string = {}) {
  return createVerticalCoverVisual(options);
}


// Backward compatibility aliases
export const createDynamicCoverVisual = (
  title: string,
  accentColor?: string,
  category?: string
) => createYouTubeCoverVisual({ title, accentColor, topic: category });

export const createScienceSvg = createDynamicCoverVisual;

// Generates character avatars tailored to tutorials & creators
export function createCharacterSvg(name: string, accentColor: string) {
  const width = 400;
  const height = 500;
  const isZodiac = /星座|占星|塞拉|神秘/i.test(name);
  const isTech = /阿杰|测评|极客|工具|截图/i.test(name);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="rimGlow" cx="60%" cy="30%" r="70%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>
  
  <rect width="100%" height="100%" fill="transparent"/>

  <!-- Character Aura -->
  <circle cx="200" cy="150" r="110" fill="url(#rimGlow)"/>
  
  <!-- Head & Hair -->
  <circle cx="200" cy="130" r="55" fill="#f8fafc"/>
  <path d="M145,100 Q200,60 255,100 Q230,70 170,70 Z" fill="#0f172a"/>

  <!-- Accessories (Tech headset or Astro headband) -->
  ${
    isTech
      ? `<rect x="160" y="115" width="80" height="16" rx="8" fill="${accentColor}"/>
         <circle cx="150" cy="130" r="14" fill="#1e293b" stroke="${accentColor}" stroke-width="2"/>
         <circle cx="250" cy="130" r="14" fill="#1e293b" stroke="${accentColor}" stroke-width="2"/>`
      : isZodiac
      ? `<path d="M150,90 Q200,75 250,90" stroke="#f59e0b" stroke-width="4" fill="none"/>
         <circle cx="200" cy="80" r="6" fill="#f59e0b"/>`
      : `<rect x="165" y="120" width="70" height="14" rx="7" fill="${accentColor}" opacity="0.8"/>`
  }

  <!-- Body & Apparel (Hoodie / Casual Blazer) -->
  <path d="M115,205 Q200,185 285,205 L305,400 L95,400 Z" fill="#0f172a"/>
  <path d="M155,205 L200,265 L245,205 Z" fill="${accentColor}" opacity="0.9"/>

  <!-- Name tag -->
  <rect x="75" y="420" width="250" height="42" rx="21" fill="#020617" stroke="${accentColor}" stroke-width="1.5"/>
  <text x="200" y="446" fill="#f8fafc" text-anchor="middle" font-family="'Noto Sans SC', sans-serif" font-size="14" font-weight="bold">
    ${name}
  </text>
</svg>
`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

// Initial default nodes: strictly matching user reference vertical cards (image_11b1e620.png):
// - Matte dark slate (#080C14)
// - Crisp White + Fresh Mint Green (#34D399) / Solid Mint Banner (#10B981)
// - Tactile 3D physical subjects (Red Guidebook + cute droplet companions, Bauhaus leather chair, clay loop, phone)
// - Zero neon glare, zero cyber laser lines
export const INITIAL_NODES: Node[] = [
  {
    id: 'node-topic',
    type: 'topic',
    position: { x: 50, y: 150 },
    data: {
      label: '1. 选题与知识点解构',
      topic: 'Grok Bot：直接丟給你的bot讀 5條進階實操規則',
      script: '深度拆解 Grok Bot 與 AI 助手進階實操：把這份指南直接丟給你的 bot 讀，5 條規則搞定提示詞架構，告別無效空轉！',
      coreConcept: 'Grok Bot 5條實操規則 · 提示詞指南',
      knowledgeSummary: '手把手實操：直接複製指南丟給 Bot、建立精準 prompt 閉環、避開循環工程死角。',
      viralTitles: [
        {
          formula: '极简实操型',
          mainTitle: '直接丟給 你的bot讀',
          subTitle: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
          ctrScore: 99,
        },
        {
          formula: '颠覆降维型',
          mainTitle: '第一次做模型 就贏過 Google',
          subTitle: 'Canva Craft · 輕量模型微調實戰手冊',
          ctrScore: 97,
        },
        {
          formula: '避坑指南型',
          mainTitle: '迴圈工程 4 個坑別踩',
          subTitle: 'AI 工作流閉環實戰 · 拒絕無效空轉',
          ctrScore: 95,
        },
        {
          formula: '主动响应型',
          mainTitle: 'Claude Duet 換 AI 主動 來找你',
          subTitle: '主動式 AI 助手設定教學',
          ctrScore: 92,
        },
      ],
      selectedTitleIndex: 0,
      visualMetaphor: {
        concept: '深邃哑光背景 #080C14 + 纯白大标题 + 鲜嫩薄荷绿 #34D399 + 质感3D宝典/皮椅实体',
        focalElement: '质感3D红色宝典与萌系陪伴小水滴伙伴，或包豪斯红皮椅',
        backgroundMood: '高级哑光深色影棚 #080C14，柔和自然顶光，告别刺眼荧光和机械网格',
        colorPalette: ['#FFFFFF', '#34D399', '#10B981', '#080C14'],
      },
      suggestedVisualPrompt: 'Clean minimalist 3D editorial design object, tactile matte clay/leather texture, 3d red guidebook with friendly small colorful companion droplets, soft studio overhead lighting, deep dark matte navy background #080C14, zero neon slop, zero robotic laser lines, modern aesthetic 8k',
      isAnalyzing: false,
    },
  },
  {
    id: 'node-visual',
    type: 'scienceVisual',
    position: { x: 440, y: 50 },
    data: {
      label: '2. 竖屏视觉与智能生图',
      prompt: 'Clean minimalist 3D red guidebook with cute colorful droplet companions, soft studio lighting on deep matte slate floor, white title Direct Give To, mint green your bot read, high resolution',
      style: 'vertical-hero',
      aspectRatio: '9:16',
      resolution: '2K',
      imageUrl: createVerticalCoverVisual({
        headlineLine1: '直接丟給',
        headlineLine2: '你的bot讀',
        subjectType: '3d-book',
        brandTitle: 'Grok Bot',
        creatorTag: '>Jerry_AI.',
        seriesTag: 'Grok Bot ▪',
        subtitle: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
      }),
      isGenerating: false,
    },
  },
  {
    id: 'node-char',
    type: 'character',
    position: { x: 440, y: 460 },
    data: {
      label: '3. 我的肖像 / 真人出镜素材',
      name: '我的肖像',
      avatarUrl: '',
      role: '支持上传任意个人真实照片 (PNG/JPG)',
      angle: '居中/右侧视觉重心 专注出镜',
      removeBg: true,
      scale: 1.0,
      opacity: 1.0,
      posX: 0,
      posY: 0,
    },
  },
  {
    id: 'node-title',
    type: 'title',
    position: { x: 830, y: 380 },
    data: {
      label: '4. 爆款主副标题排版',
      creatorTag: '>Jerry_AI.',
      seriesTag: 'Canva Craft ▪',
      brandTitle: 'Grok Bot',
      headlineLine1: '直接丟給',
      headlineLine2: '你的bot讀',
      headlineBannerMode: false,
      mainTitle: '直接丟給 你的bot讀',
      subTitle: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
      headlineWhite: '直接丟給',
      headlineAccent: '你的bot讀',
      headlineGold: '你的bot讀',
      headlineSuffix: '',
      pillBadge: 'Grok Bot',
      stylePreset: 'vertical-hero',
      fontFamily: 'Noto Sans SC',
      fontSize: 56,
      color: '#FFFFFF',
      colorLine2: '#34D399',
      bannerBgColor: '#10B981',
      bannerTextColor: '#05080E',
      posX: 270,
      posY: 180,
    },
  },
  {
    id: 'node-generator',
    type: 'generator',
    position: { x: 830, y: 50 },
    data: {
      label: '5. 多模型封面生成引擎',
      model: 'gemini-3.1-flash-lite-image',
      aspectRatio: '9:16',
      resolution: '2K',
      batchSize: 3,
      costEstimate: '¥0.04 / 张',
      isGenerating: false,
      resultImage: createVerticalCoverVisual({
        headlineLine1: '直接丟給',
        headlineLine2: '你的bot讀',
        subjectType: '3d-book',
        brandTitle: 'Grok Bot',
        creatorTag: '>Jerry_AI.',
        seriesTag: 'Grok Bot ▪',
        subtitle: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
      }),
    },
  },
  {
    id: 'node-editor',
    type: 'coverEditor',
    position: { x: 1220, y: 150 },
    data: {
      label: '6. 竖屏封面编辑器与安全区',
      previewUrl: createVerticalCoverVisual({
        headlineLine1: '直接丟給',
        headlineLine2: '你的bot讀',
        subjectType: '3d-book',
        brandTitle: 'Grok Bot',
        creatorTag: '>Jerry_AI.',
        seriesTag: 'Grok Bot ▪',
        subtitle: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
      }),
      safeArea: 'douyin',
      showGrid: true,
      showRulers: true,
      contrast: 100,
      brightness: 100,
      vignette: false,
      coverStyle: 'vertical-hero',
      subjectType: '3d-book',
      headlineBannerMode: false,
      overrideBrandTitle: 'Grok Bot',
      overrideHeadlineLine1: '直接丟給',
      overrideHeadlineLine2: '你的bot讀',
      overrideTitle: '直接丟給 你的bot讀',
      overrideSubtitle: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
      creatorTag: '>Jerry_AI.',
      seriesTag: 'Canva Craft ▪',
      layers: DEFAULT_VERTICAL_LAYERS,
    },
  },
  {
    id: 'node-comparison',
    type: 'comparison',
    position: { x: 1610, y: 60 },
    data: {
      label: '7. A/B/C 方案点击率对比',
      variants: [
        {
          id: 'var-a',
          label: '方案 A (3D红宝典萌系小水滴款)',
          previewUrl: createVerticalCoverVisual({
            headlineLine1: '直接丟給',
            headlineLine2: '你的bot讀',
            subjectType: '3d-book',
            brandTitle: 'Grok Bot',
            creatorTag: '>Jerry_AI.',
            seriesTag: 'Grok Bot ▪',
            subtitle: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
          }),
          mainTitle: '直接丟給 你的bot讀',
          subTitle: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
          style: '3D红宝典萌系伴侣款 (参考图2)',
          ctrScore: 99,
          isWinner: true,
          votes: 382,
        },
        {
          id: 'var-b',
          label: '方案 B (绿底色块降维颠覆款)',
          previewUrl: createVerticalCoverVisual({
            headlineLine1: '第一次做模型',
            headlineLine2: '就贏過 Google',
            headlineBannerMode: true,
            subjectType: 'designer-chair',
            brandTitle: 'Canva Craft',
            creatorTag: '>Jerry_AI.',
            seriesTag: 'Canva Craft ▪',
            subtitle: 'Canva Craft · 輕量模型微調實戰手冊',
          }),
          mainTitle: '第一次做模型 就贏過 Google',
          subTitle: 'Canva Craft · 輕量模型微調實戰手冊',
          style: '绿底色块降维款 (参考图3)',
          ctrScore: 97,
          isWinner: false,
          votes: 295,
        },
        {
          id: 'var-c',
          label: '方案 C (3D跑道避坑指南款)',
          previewUrl: createVerticalCoverVisual({
            headlineLine1: '迴圈工程',
            headlineLine2: '4 個坑別踩',
            headlineBannerMode: false,
            subjectType: 'tactile-loop',
            brandTitle: '迴圈工程',
            creatorTag: '>Jerry_AI.',
            seriesTag: 'System Pro ▪',
            subtitle: 'AI 工作流閉環實戰 · 拒絕無效空轉',
          }),
          mainTitle: '迴圈工程 4 個坑別踩',
          subTitle: 'AI 工作流閉環實戰 · 拒絕無效空轉',
          style: '3D环形跑道避坑款 (参考图1)',
          ctrScore: 95,
          isWinner: false,
          votes: 210,
        },
      ],
      selectedWinnerId: 'var-a',
    },
  },
  {
    id: 'node-export',
    type: 'export',
    position: { x: 2000, y: 150 },
    data: {
      label: '8. 多平台批量自动裁切与导出',
      platforms: [
        { id: 'douyin', name: '抖音/Shorts/Reels', ratio: '9:16', dimensions: '1080×1920', aspectRatioDecimal: 9 / 16, iconName: 'Smartphone', badge: '全屏竖屏 (默认)', selected: true },
        { id: 'xiaohongshu', name: '小红书高赞封面', ratio: '3:4', dimensions: '1080×1440', aspectRatioDecimal: 3 / 4, iconName: 'BookOpen', badge: '爆款种草', selected: true },
        { id: 'bilibili', name: 'B站视频缩略图', ratio: '16:9', dimensions: '1920×1080', aspectRatioDecimal: 16 / 9, iconName: 'Tv', badge: '横版高光', selected: true },
        { id: 'wechat', name: '视频号/朋友圈', ratio: '1:1', dimensions: '1080×1080', aspectRatioDecimal: 1, iconName: 'Share2', badge: '正方焦点', selected: true },
      ],
      status: 'idle',
      exportedUrls: {},
    },
  },
];

export const INITIAL_EDGES: Edge[] = [
  { id: 'e-topic-visual', source: 'node-topic', target: 'node-visual', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e-topic-title', source: 'node-topic', target: 'node-title', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e-visual-generator', source: 'node-visual', target: 'node-generator', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e-char-editor', source: 'node-char', target: 'node-editor', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e-title-editor', source: 'node-title', target: 'node-editor', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e-gen-editor', source: 'node-generator', target: 'node-editor', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e-editor-comparison', source: 'node-editor', target: 'node-comparison', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e-comparison-export', source: 'node-comparison', target: 'node-export', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
];
