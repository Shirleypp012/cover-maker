export type NodeKind =
  | 'topic'
  | 'scienceVisual'
  | 'character'
  | 'title'
  | 'reference'
  | 'sketch'
  | 'generator'
  | 'coverEditor'
  | 'comparison'
  | 'export';

export interface ViralTitleOption {
  formula: string;
  mainTitle: string;
  subTitle: string;
  ctrScore: number;
}

export interface VisualMetaphorData {
  concept: string;
  focalElement: string;
  backgroundMood: string;
  colorPalette: string[];
}

export interface TopicNodeData {
  label?: string;
  topic: string;
  script?: string;
  coreConcept?: string;
  knowledgeSummary?: string;
  viralTitles: ViralTitleOption[];
  selectedTitleIndex: number;
  visualMetaphor?: VisualMetaphorData;
  suggestedVisualPrompt?: string;
  isAnalyzing?: boolean;
}

export interface ScienceVisualNodeData {
  label?: string;
  prompt: string;
  style: string;
  aspectRatio: '16:9' | '9:16' | '3:4' | '1:1';
  resolution: '1K' | '2K' | '4K';
  imageUrl?: string;
  isGenerating?: boolean;
  historyImages?: string[];
  youtubeTheme?: 'editorial-cream' | 'tech-vscode' | 'saas-desktop' | 'creative-studio';
}

export interface CharacterNodeData {
  label?: string;
  name: string;
  avatarUrl: string;
  role: string;
  angle: string;
  removeBg: boolean;
  scale: number;
  opacity: number;
  posX: number;
  posY: number;
}

export interface TitleNodeData {
  label?: string;
  eyebrowTag?: string;
  mainTitle: string;
  subTitle: string;
  accentSubtitle?: string;
  badgeText: string;
  pillBadge?: string;
  stylePreset: 'youtube-editorial' | 'youtube-tech-dev' | 'youtube-saas-clean' | 'youtube-creative' | 'cyber-glow';
  fontFamily: string;
  fontSize: number;
  color: string;
  badgeColor: string;
  glowColor: string;
  glowIntensity: number;
  posX: number;
  posY: number;
}

export interface ReferenceNodeData {
  label?: string;
  title: string;
  platform: 'bilibili' | 'douyin' | 'xiaohongshu';
  views: string;
  imageUrl: string;
  ctrScore: number;
  compositionType: string;
  colorStrategy: string;
  typographyAnalysis?: string;
  extractedPalette: string[];
}

export interface SketchNodeData {
  label?: string;
  layoutType: 'thirds' | 'center-burst' | 'diagonal-split' | 'golden-ratio';
  subjectArea: { x: number; y: number; w: number; h: number; label: string };
  personArea: { x: number; y: number; w: number; h: number; label: string };
  titleArea: { x: number; y: number; w: number; h: number; label: string };
  roughSketchUrl?: string;
}

export interface GeneratorNodeData {
  label?: string;
  model: 'gemini-3.1-flash-lite-image' | 'gemini-nano-banana-2.1' | 'seedream-v4' | 'gpt-image-pro';
  aspectRatio: '16:9' | '9:16' | '3:4' | '1:1';
  resolution: '1K' | '2K' | '4K';
  batchSize: number;
  costEstimate: string;
  isGenerating: boolean;
  resultImage?: string;
  generatedVariants?: string[];
}

export interface CoverEditorNodeData {
  label?: string;
  previewUrl?: string;
  safeArea: 'none' | 'bilibili' | 'douyin' | 'xiaohongshu';
  showGrid: boolean;
  showRulers: boolean;
  contrast: number;
  brightness: number;
  vignette: boolean;
  // YouTube Minimalist Layout Layer
  youtubeStyle?: 'youtube-editorial' | 'youtube-tech-dev' | 'youtube-saas-clean' | 'youtube-creative';
  eyebrowTag?: string;
  overrideTitle?: string;
  overrideSubtitle?: string;
  accentSubtitle?: string;
  overrideBadge?: string;
  pillBadge?: string;
  showDurationBadge?: boolean;
  durationText?: string;
  creatorTag?: string;
}

export interface ComparisonVariant {
  id: string;
  label: string;
  previewUrl: string;
  mainTitle: string;
  subTitle: string;
  style: string;
  ctrScore: number;
  isWinner: boolean;
  votes: number;
}

export interface ComparisonNodeData {
  label?: string;
  variants: ComparisonVariant[];
  selectedWinnerId?: string;
}

export interface ExportPlatformConfig {
  id: 'douyin' | 'xiaohongshu' | 'bilibili' | 'wechat';
  name: string;
  ratio: string;
  dimensions: string;
  aspectRatioDecimal: number;
  iconName: string;
  badge: string;
  selected: boolean;
}

export interface ExportNodeData {
  label?: string;
  platforms: ExportPlatformConfig[];
  status: 'idle' | 'rendering' | 'completed';
  exportedUrls: Record<string, string>;
}

export interface CanvasHistorySnapshot {
  id: string;
  timestamp: number;
  description: string;
  nodesCount: number;
  edgesCount: number;
  data: {
    nodes: any[];
    edges: any[];
  };
}

export interface AgentExecutionStep {
  title: string;
  detail?: string;
  status: 'completed' | 'in_progress' | 'queued' | 'running' | 'pending';
}

export interface AgentActionMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: number;
  actionType?: string;
  appliedSkills?: string[];
  steps?: AgentExecutionStep[];
}
