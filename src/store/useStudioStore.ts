import { create } from 'zustand';
import {
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import { INITIAL_NODES, INITIAL_EDGES, createScienceSvg, createCharacterSvg, createDynamicCoverVisual, createVerticalCoverVisual, createYouTubeCoverVisual, ILLUSTRATION_ICONS } from '../data/sciencePresets';
import { CanvasHistorySnapshot, AgentActionMessage, NodeKind, AgentExecutionStep } from '../types/canvas';

interface StudioState {
  // Canvas Core
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNodeId: (id: string | null) => void;
  updateNodeData: (id: string, partialData: Record<string, any>) => void;
  addNode: (kind: NodeKind, pos?: { x: number; y: number }) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  autoLayout: () => void;

  // History & Snapshot
  history: CanvasHistorySnapshot[];
  historyIndex: number;
  pushSnapshot: (desc: string) => void;
  undo: () => void;
  redo: () => void;
  restoreSnapshot: (id: string) => void;

  // Views & Drawers
  activeTab: 'canvas' | 'topic-studio' | 'competitor' | 'script-studio' | 'assets' | 'mcp';
  setActiveTab: (tab: StudioState['activeTab']) => void;
  isAgentDrawerOpen: boolean;
  toggleAgentDrawer: () => void;
  setAgentDrawerOpen: (open: boolean) => void;

  // Agent State
  agentMessages: AgentActionMessage[];
  isAgentThinking: boolean;
  sendAgentMessage: (text: string) => Promise<void>;
  executeAgentWorkflowPlan: (wf: any, steps?: any[], messageId?: string) => Promise<void>;

  // Presets & Templates
  loadPresetWorkflow: (presetKey: string) => void;

  // Global Toasts & Stats
  toastMessage: string | null;
  setToast: (msg: string | null) => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    const newEdges = addEdge(
      {
        ...connection,
        animated: true,
        style: { stroke: '#06b6d4', strokeWidth: 2 },
      },
      get().edges
    );
    set({ edges: newEdges });
    get().pushSnapshot('连接节点');
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, partialData) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...partialData,
            },
          };
        }
        return node;
      }),
    }));
  },

  addNode: (kind, pos) => {
    const id = `node-${kind}-${Date.now().toString().slice(-4)}`;
    const currentNodes = get().nodes;
    const defaultX = pos?.x ?? (currentNodes.length > 0 ? Math.max(...currentNodes.map((n) => n.position.x)) + 380 : 100);
    const defaultY = pos?.y ?? 200;

    let nodeData: any = { label: `${kind.toUpperCase()} 节点` };

    switch (kind) {
      case 'topic':
        nodeData = {
          label: '选题知识点解构',
          topic: '新科学发现与未来工程',
          script: '',
          coreConcept: '前沿科学原理',
          knowledgeSummary: '提炼核心底层知识点与用户痛点',
          viralTitles: [
            { formula: '极限量化型', mainTitle: '打破纪录！全新物理实验', subTitle: '揭示颠覆常识的惊人发现', ctrScore: 94 },
          ],
          selectedTitleIndex: 0,
          visualMetaphor: {
            concept: '微观发光粒子环绕神秘引力晶核',
            focalElement: '发光量子晶体',
            backgroundMood: '深空极光氛围',
            colorPalette: ['#00F5FF', '#8B5CF6', '#0A0F1D', '#3B82F6'],
          },
        };
        break;
      case 'scienceVisual':
        nodeData = {
          label: '3D 科学视觉资产',
          prompt: '高精度3D超导微缩核心，流光溢彩量子光斑，悬浮粒子矩阵，电影级体积光渲染',
          style: '3d-science',
          aspectRatio: '16:9',
          resolution: '2K',
          imageUrl: createScienceSvg('量子超导核心', '#38bdf8', 'quantum-grid'),
        };
        break;
      case 'character':
        nodeData = {
          label: '人物主讲人素材',
          name: '主讲人博士',
          avatarUrl: createCharacterSvg('科技主讲', '#06b6d4'),
          role: '科普创作者',
          angle: '3/4侧脸 深度解说',
          removeBg: true,
          scale: 1,
          opacity: 1,
          posX: 20,
          posY: 60,
        };
        break;
      case 'title':
        nodeData = {
          label: '封面高能标题',
          mainTitle: '99%的人都不知道的真相！',
          subTitle: '顶级实验室刚刚公开的实测数据',
          badgeText: '深度硬核',
          stylePreset: 'cyber-glow',
          fontFamily: 'Noto Sans SC',
          fontSize: 46,
          color: '#ffffff',
          badgeColor: '#06b6d4',
          glowColor: '#00f5ff',
          glowIntensity: 8,
          posX: 50,
          posY: 80,
        };
        break;
      case 'sketch':
        nodeData = {
          label: '草图构图规划',
          layoutType: 'thirds',
          subjectArea: { x: 50, y: 30, w: 40, h: 50, label: '3D科学主体 (右居中)' },
          personArea: { x: 10, y: 35, w: 35, h: 55, label: '人物讲师 (左侧3/4)' },
          titleArea: { x: 8, y: 75, w: 84, h: 20, label: '黄金大标题 (底部通栏)' },
        };
        break;
      case 'reference':
        nodeData = {
          label: '竞品封面拆解参考',
          title: '千万播放爆款科普拆解',
          platform: 'bilibili',
          views: '540万',
          imageUrl: createScienceSvg('竞品分析参考', '#ec4899', 'comp-breakdown'),
          ctrScore: 94,
          compositionType: '对角线冲击构图',
          colorStrategy: '高对比深蓝底+荧光黄',
          extractedPalette: ['#0A0F1D', '#00F0FF', '#FFEB3B', '#FF3D00'],
        };
        break;
      case 'generator':
        nodeData = {
          label: 'AI 封面生成器',
          model: 'gemini-3.1-flash-lite-image',
          aspectRatio: '16:9',
          resolution: '2K',
          batchSize: 3,
          costEstimate: '¥0.04 / 张',
          isGenerating: false,
          resultImage: createScienceSvg('AI 渲染封面', '#00f5ff', 'gen-result'),
        };
        break;
      case 'coverEditor':
        nodeData = {
          label: '图层排版与安全区',
          previewUrl: createScienceSvg('图层合成排版', '#00f5ff', 'editor-preview'),
          safeArea: 'bilibili',
          showGrid: true,
          showRulers: true,
          contrast: 105,
          brightness: 100,
          vignette: true,
        };
        break;
      case 'comparison':
        nodeData = {
          label: 'A/B/C 方案点击率评测',
          variants: [
            {
              id: `v-1-${Date.now()}`,
              label: '版本 A (极限数据)',
              previewUrl: createScienceSvg('方案A-数据高光', '#00f5ff', 'a'),
              mainTitle: '破纪录！颠覆性新发现',
              subTitle: '关键数据全景拆解',
              style: '电光青',
              ctrScore: 95,
              isWinner: true,
              votes: 110,
            },
            {
              id: `v-2-${Date.now()}`,
              label: '版本 B (悬念提问)',
              previewUrl: createScienceSvg('方案B-悬念设问', '#ec4899', 'b'),
              mainTitle: '这会是人类最后一次实验吗？',
              subTitle: '背后真相细思极恐',
              style: '霓虹粉',
              ctrScore: 89,
              isWinner: false,
              votes: 65,
            },
          ],
        };
        break;
      case 'export':
        nodeData = {
          label: '多端批量导出',
          platforms: [
            { id: 'bilibili', name: 'B站 16:9', ratio: '16:9', dimensions: '1920×1080', aspectRatioDecimal: 16 / 9, iconName: 'Tv', badge: '横版高光', selected: true },
            { id: 'douyin', name: '抖音 9:16', ratio: '9:16', dimensions: '1080×1920', aspectRatioDecimal: 9 / 16, iconName: 'Smartphone', badge: '全屏震撼', selected: true },
            { id: 'xiaohongshu', name: '小红书 3:4', ratio: '3:4', dimensions: '1080×1440', aspectRatioDecimal: 3 / 4, iconName: 'BookOpen', badge: '高赞种草', selected: true },
            { id: 'wechat', name: '视频号 1:1', ratio: '1:1', dimensions: '1080×1080', aspectRatioDecimal: 1, iconName: 'Share2', badge: '方形焦点', selected: true },
          ],
          status: 'idle',
          exportedUrls: {},
        };
        break;
    }

    const newNode: Node = {
      id,
      type: kind,
      position: { x: defaultX, y: defaultY },
      data: nodeData,
    };

    set({ nodes: [...currentNodes, newNode] });
    get().pushSnapshot(`添加 ${kind} 节点`);
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
    }));
    get().pushSnapshot('删除节点');
  },

  duplicateNode: (id) => {
    const node = get().nodes.find((n) => n.id === id);
    if (!node) return;
    const newId = `${node.id}-copy-${Date.now().toString().slice(-4)}`;
    const clonedNode: Node = {
      ...node,
      id: newId,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      data: JSON.parse(JSON.stringify(node.data)),
    };
    set((state) => ({ nodes: [...state.nodes, clonedNode] }));
    get().pushSnapshot('复制节点');
  },

  autoLayout: () => {
    const nodes = [...get().nodes];
    const categoryOrder: Record<string, number> = {
      topic: 0,
      reference: 0,
      sketch: 1,
      scienceVisual: 1,
      character: 1,
      title: 2,
      generator: 2,
      coverEditor: 3,
      comparison: 4,
      export: 5,
    };

    const columns: Record<number, Node[]> = {};
    nodes.forEach((node) => {
      const col = categoryOrder[node.type || 'topic'] ?? 2;
      if (!columns[col]) columns[col] = [];
      columns[col].push(node);
    });

    const colWidth = 380;
    const updatedNodes = nodes.map((node) => {
      const col = categoryOrder[node.type || 'topic'] ?? 2;
      const colNodes = columns[col];
      const indexInCol = colNodes.findIndex((n) => n.id === node.id);
      const x = 50 + col * colWidth;
      const y = 80 + indexInCol * 360;
      return {
        ...node,
        position: { x, y },
      };
    });

    set({ nodes: updatedNodes });
    get().pushSnapshot('自动排版对齐');
    get().setToast('✨ 画布节点已自动进行流水线整理排版！');
  },

  // Snapshots & History
  history: [
    {
      id: 'snap-0',
      timestamp: Date.now(),
      description: '初始化全套科普封面流水线',
      nodesCount: INITIAL_NODES.length,
      edgesCount: INITIAL_EDGES.length,
      data: {
        nodes: INITIAL_NODES,
        edges: INITIAL_EDGES,
      },
    },
  ],
  historyIndex: 0,

  pushSnapshot: (description) => {
    const currentNodes = get().nodes;
    const currentEdges = get().edges;
    const newSnapshot: CanvasHistorySnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: Date.now(),
      description,
      nodesCount: currentNodes.length,
      edgesCount: currentEdges.length,
      data: {
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        edges: JSON.parse(JSON.stringify(currentEdges)),
      },
    };
    const newHistory = [...get().history.slice(0, get().historyIndex + 1), newSnapshot].slice(-25);
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const targetSnapshot = history[historyIndex - 1];
      set({
        nodes: JSON.parse(JSON.stringify(targetSnapshot.data.nodes)),
        edges: JSON.parse(JSON.stringify(targetSnapshot.data.edges)),
        historyIndex: historyIndex - 1,
      });
      get().setToast(`↩ 已撤销至：${targetSnapshot.description}`);
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const targetSnapshot = history[historyIndex + 1];
      set({
        nodes: JSON.parse(JSON.stringify(targetSnapshot.data.nodes)),
        edges: JSON.parse(JSON.stringify(targetSnapshot.data.edges)),
        historyIndex: historyIndex + 1,
      });
      get().setToast(`↪ 已重做：${targetSnapshot.description}`);
    }
  },

  restoreSnapshot: (id) => {
    const snap = get().history.find((h) => h.id === id);
    if (snap) {
      set({
        nodes: JSON.parse(JSON.stringify(snap.data.nodes)),
        edges: JSON.parse(JSON.stringify(snap.data.edges)),
      });
      get().setToast(`🔄 已成功恢复快照：${snap.description}`);
    }
  },

  // Views
  activeTab: 'canvas',
  setActiveTab: (tab) => set({ activeTab: tab }),

  isAgentDrawerOpen: false,
  toggleAgentDrawer: () => set((state) => ({ isAgentDrawerOpen: !state.isAgentDrawerOpen })),
  setAgentDrawerOpen: (open) => set({ isAgentDrawerOpen: open }),

  // Agent Chat
  agentMessages: [
    {
      id: 'msg-welcome',
      sender: 'agent',
      content: '你好！我是 Knowledge Cover Studio 的 Brainstorm AI Agent。\n我可以为你深度拆解工具神器、AI视频创作、教程指南或星座分析等选题，自动规划专属界面UI、排版高CTR爆款标题，并在画布上一键部署完整节点流。告诉我你想做的主题吧！',
      timestamp: Date.now(),
      appliedSkills: ['爆款标题公式', '多端安全区避让', '专属界面视觉建模'],
    },
  ],
  isAgentThinking: false,

  sendAgentMessage: async (text: string) => {
    const userMsg: AgentActionMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: Date.now(),
    };

    set((state) => ({
      agentMessages: [...state.agentMessages, userMsg],
      isAgentThinking: true,
    }));

    // Smart heuristic domain detection
    const cleanSubject =
      text
        .replace(/帮我做(一个)?|为|生成|关于|的封面(流)?|制作|我想做|做一套|排版|设计|解构/g, '')
        .trim() || '好用的截图工具 Snipaste';

    const isTool = /snipaste|截图|工具|软件|插件|神器|notion|raycast|obsidian|app|效率|快捷键|办公/i.test(text);
    const isAi = /ai|做视频|智能|midjourney|sora|提示词|数字人|生成|大模型|chatgpt/i.test(text);
    const isZodiac = /星座|天蝎|白羊|双鱼|金牛|双子|巨蟹|狮子|处女|天秤|射手|摩羯|水瓶|运势|占星|星盘|心理/i.test(text);

    let detectedCategory = 'tutorial';
    let domainColor = '#f59e0b';
    let domainBadge = '实操技巧';
    let defaultMain = `原来${cleanSubject.slice(0, 8)}这么好用？`;
    let defaultSub = '新手到高手的高阶实操技巧，效率直接翻倍';
    let defaultPrompt = `Modern productivity tutorial UI mockup for ${cleanSubject}, high contrast before-after layout, 4k`;
    let defaultCore = `${cleanSubject.slice(0, 8)}高阶核心功能`;

    if (isTool) {
      detectedCategory = 'tool';
      domainColor = '#38bdf8';
      domainBadge = '效率神器';
      defaultMain = '别再用微信截图了！';
      defaultSub = `${cleanSubject.slice(0, 10)} 免费神器彻底封神，效率直接翻3倍`;
      defaultPrompt = `Modern SaaS productivity desktop UI mockup, screen capture crop rectangle with crosshair guidelines, floating pinned card, glowing shortcut keys F1 and F3, ultra-crisp 4k`;
      defaultCore = 'F1截图 + F3贴图置顶';
    } else if (isAi) {
      detectedCategory = 'ai';
      domainColor = '#a855f7';
      domainBadge = 'AI实操';
      defaultMain = '用 AI 做视频到底有多爽？';
      defaultSub = '5分钟零基础搞定爆款成片，产量直接翻10倍';
      defaultPrompt = `Futuristic AI video editor workspace UI, multi-track timeline, prompt command terminal, glowing playhead, 4k render preview`;
      defaultCore = '5分钟全流程AI出片';
    } else if (isZodiac) {
      detectedCategory = 'zodiac';
      domainColor = '#c084fc';
      domainBadge = '深度剖析';
      defaultMain = `读懂${cleanSubject.slice(0, 4)}的极限冷战：`;
      defaultSub = '不是不爱，是他剥开坚硬外壳后的深层防御机制';
      defaultPrompt = `Mystical astrological celestial wheel, glowing golden zodiac constellation map, glowing purple aura, sacred geometry, tarot aesthetic, 8k`;
      defaultCore = '深层性格防卫机制';
    }

    const defaultIconIds = isTool
      ? ['icon-pushpin', 'icon-scissors', 'icon-loupe', 'icon-f1f3']
      : isAi
      ? ['icon-chip', 'icon-film', 'icon-lightning']
      : isZodiac
      ? ['icon-zodiac', 'icon-diamond', 'icon-bulb']
      : ['icon-rocket', 'icon-bulb', 'icon-target'];

    const defaultSteps: AgentExecutionStep[] = [
      {
        title: '选题与核心冲突解构',
        detail: `提炼《${cleanSubject}》真实核心功能与目标受众痛点`,
        status: 'running',
      },
      {
        title: '构建 YouTube 极简纯净视觉',
        detail: '选用真实桌面工作区与极简卡片，纯净无杂乱贴纸',
        status: 'pending',
      },
      {
        title: '双色视觉标题与细眉标排版',
        detail: '高对比字级层次 + 顶部专业分类眉标 + 时长药丸',
        status: 'pending',
      },
      {
        title: '全链路数据流拓扑连线',
        detail: '打通 选题 -> 素材 -> 标题/生图 -> 封面合成 -> A/B对比 -> 批量导出',
        status: 'pending',
      },
      {
        title: '智能画布流水线对齐',
        detail: '执行分层拓扑整理，各工作节点就绪',
        status: 'pending',
      },
    ];

    try {
      get().pushSnapshot(`Agent操作前快照: ${text.slice(0, 15)}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('/api/agent-brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          currentNodes: get().nodes,
          currentEdges: get().edges,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      const rawSteps = data.steps && data.steps.length > 0 ? data.steps : defaultSteps;
      const initialSteps: AgentExecutionStep[] = rawSteps.map((st: any, idx: number) => ({
        title: st.title || `步骤 ${idx + 1}`,
        detail: st.detail || '',
        status: idx === 0 ? 'running' : 'pending',
      }));

      const wf = data.suggestedWorkflow || {
        topic: cleanSubject,
        coreConcept: defaultCore,
        mainTitle: defaultMain,
        subTitle: defaultSub,
        badgeText: domainBadge,
        visualTheme: detectedCategory,
        selectedIconIds: defaultIconIds,
        color: domainColor,
        sciencePrompt: defaultPrompt,
      };

      const agentMsgId = `msg-${Date.now()}`;
      const agentMsg: AgentActionMessage = {
        id: agentMsgId,
        sender: 'agent',
        content:
          data.agentReply ||
          `已为您深度解构《${cleanSubject}》专属封面生产方案！已在当前画布上依次完成了【选题拆解】、调用【3D插画Icon】、【高点击率标题排版】与【全流程节点连线排版】。`,
        timestamp: Date.now(),
        actionType: 'CREATE_WORKFLOW',
        appliedSkills: data.appliedSkills || ['爆款标题公式', '多端安全区避让', '3D插画Icon调用', '专属界面视觉建模'],
        steps: initialSteps,
      };

      set((state) => ({
        agentMessages: [...state.agentMessages, agentMsg],
        isAgentThinking: false,
      }));

      // ALWAYS EXECUTE THE COMPLETE STEP-BY-STEP WORKFLOW ON CANVAS!
      await get().executeAgentWorkflowPlan(wf, initialSteps, agentMsgId);
    } catch (err) {
      console.warn('Executing robust client-side agent flow:', err);

      const fallbackWf = {
        topic: cleanSubject,
        coreConcept: defaultCore,
        mainTitle: defaultMain,
        subTitle: defaultSub,
        badgeText: domainBadge,
        visualTheme: detectedCategory,
        selectedIconIds: defaultIconIds,
        color: domainColor,
        sciencePrompt: defaultPrompt,
      };

      const agentMsgId = `msg-${Date.now()}`;
      const agentMsg: AgentActionMessage = {
        id: agentMsgId,
        sender: 'agent',
        content: `已为您深度解构《${cleanSubject}》专属封面生产方案！正在画布上依次执行【选题拆解】、调用【3D置顶图钉/截屏剪刀/键帽等插画Icon】、【爆款标题排版】与【全流程拓扑连线】。`,
        timestamp: Date.now(),
        actionType: 'CREATE_WORKFLOW',
        appliedSkills: ['爆款标题公式', '多端安全区避让', '3D插画Icon调用', '专属界面视觉建模'],
        steps: defaultSteps,
      };

      set((state) => ({
        agentMessages: [...state.agentMessages, agentMsg],
        isAgentThinking: false,
      }));

      // ALWAYS EXECUTE THE WORKFLOW SO THE CANVAS NEVER STAYS UNCHANGED!
      await get().executeAgentWorkflowPlan(fallbackWf, defaultSteps, agentMsgId);
    }
  },

  executeAgentWorkflowPlan: async (wf: any, _steps?: any[], messageId?: string) => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const topic = wf.topic || 'Grok Bot：多设备、多Bot协同进阶实操全解';
    
    // Extract Brand Title (e.g. Grok Bot or Snipaste)
    let brandTitle = wf.brandTitle;
    if (!brandTitle) {
      if (/snipaste/i.test(topic)) brandTitle = 'Snipaste';
      else if (/grok/i.test(topic)) brandTitle = 'Grok Bot';
      else if (/claude/i.test(topic)) brandTitle = 'Claude';
      else if (/notion/i.test(topic)) brandTitle = 'Notion';
      else if (/ai/i.test(topic)) brandTitle = 'AI Video';
      else brandTitle = topic.split(/[:：\s]/)[0].slice(0, 10) || 'Grok Bot';
    }

    // Two-tone Chinese headline
    let headlineWhite = wf.headlineWhite || '高级';
    let headlineGold = wf.headlineGold || '玩法';
    if (!wf.headlineWhite || !wf.headlineGold) {
      const raw = wf.mainTitle || '高级玩法';
      if (raw.includes('高级玩法')) {
        headlineWhite = '高级';
        headlineGold = '玩法';
      } else {
        const clean = raw.replace(/别再用微信截图了！?|这个神器彻底封神/g, '封神技巧').trim();
        const mid = Math.max(2, Math.floor(clean.length / 2));
        headlineWhite = clean.slice(0, mid) || '高级';
        headlineGold = clean.slice(mid) || '玩法';
      }
    }

    const eyebrow = wf.eyebrowTag || wf.badgeText || 'ADVANCED · 进阶';
    const subTitle = wf.subTitle || '多设备、多Bot、多群组 · 效率倍增';
    const duration = wf.duration || '13:03';
    const prompt = wf.sciencePrompt || `YouTube minimalist dark cover layout, ADVANCED eyebrow tag, ${brandTitle} bold white title, yellow dash line, two-tone Chinese headline, portrait subject on right, 13:03 duration pill, 4k`;
    const coreConcept = wf.coreConcept || `${brandTitle} 核心高阶机制`;

    // Retrieve existing user portrait if already uploaded!
    const currentCharNode = get().nodes.find((n) => n.type === 'character')?.data as any;
    const userAvatarUrl = currentCharNode?.avatarUrl;
    const userAvatarScale = currentCharNode?.scale || 1.0;
    const userAvatarPosX = currentCharNode?.posX || 0;
    const userAvatarPosY = currentCharNode?.posY || 0;

    const currentEditorNode = get().nodes.find((n) => n.type === 'coverEditor')?.data as any;
    const currentLayers = currentEditorNode?.layers;

    // Render genuine GrokBot YouTube dark & gold cover visual preserving user portrait & layer positions
    const newVisualSvg = createYouTubeCoverVisual({
      eyebrow,
      brandTitle,
      headlineWhite,
      headlineGold,
      subtitle: subTitle,
      duration,
      avatarUrl: userAvatarUrl,
      avatarScale: userAvatarScale,
      avatarPosX: userAvatarPosX,
      avatarPosY: userAvatarPosY,
      layers: currentLayers,
    });

    const updateStepStatus = (stepIndex: number, status: 'running' | 'completed' | 'pending') => {
      set((state) => ({
        agentMessages: state.agentMessages.map((m) => {
          if (messageId ? m.id === messageId : m.sender === 'agent') {
            const currentSteps = m.steps || [];
            const nextSteps = currentSteps.map((s, idx) =>
              idx === stepIndex ? { ...s, status } : s
            );
            return { ...m, steps: nextSteps };
          }
          return m;
        }),
      }));
    };

    // --- STEP 1: Topic Node Deconstruction ---
    updateStepStatus(0, 'running');
    const topicNodes = get().nodes.filter((n) => n.type === 'topic');
    if (topicNodes.length > 0) {
      get().setSelectedNodeId(topicNodes[0].id);
    }
    topicNodes.forEach((node) => {
      get().updateNodeData(node.id, {
        topic,
        coreConcept,
        knowledgeSummary: `深度提炼《${brandTitle}》核心功能反差与多端联动实操技巧。`,
        viralTitles: [
          { formula: '进阶高阶型', mainTitle: `${brandTitle} ${headlineWhite}${headlineGold}`, subTitle, ctrScore: 98 },
          { formula: '颠覆反差型', mainTitle: `彻底解放双手！${brandTitle} 高级玩法`, subTitle: '核心功能+隐藏玩法全拆解', ctrScore: 95 },
          { formula: '痛点拯救型', mainTitle: `封神级效率神器！告别低效操作`, subTitle: '一招搞定，每天提早2小时下班', ctrScore: 92 },
        ],
        selectedTitleIndex: 0,
        visualMetaphor: {
          concept: 'YouTube 极简暗黑哑光底 + 亮黄细眉标 + 纯白巨字 + [—] 黄白撞色主标 + 个人肖像',
          focalElement: `${brandTitle} 巨幅品牌词与两段式撞色标题`,
          backgroundMood: '深邃哑光深黑 #0E0F12 搭配温润琥珀金 #F5A623',
          colorPalette: ['#F5A623', '#FFFFFF', '#0E0F12', '#94A3B8'],
        },
        suggestedVisualPrompt: prompt,
      });
    });
    get().setToast(`💡 [步骤 1/5] 已完成《${brandTitle}》高阶玩法核心拆解！`);
    await sleep(350);
    updateStepStatus(0, 'completed');

    // --- STEP 2: Visual Model (Grok Dark & Gold) ---
    updateStepStatus(1, 'running');
    const visualNodes = get().nodes.filter((n) => n.type === 'scienceVisual');
    if (visualNodes.length > 0) {
      get().setSelectedNodeId(visualNodes[0].id);
    }
    visualNodes.forEach((node) => {
      get().updateNodeData(node.id, {
        prompt,
        imageUrl: newVisualSvg,
        style: 'grok-dark-gold',
      });
    });
    const genNodes = get().nodes.filter((n) => n.type === 'generator');
    genNodes.forEach((node) => {
      get().updateNodeData(node.id, {
        resultImage: newVisualSvg,
      });
    });
    get().setToast(`🎨 [步骤 2/5] 匹配 YouTube 极简暗黑金色版式并合成肖像！`);
    await sleep(400);
    updateStepStatus(1, 'completed');

    // --- STEP 3: Viral Titles Typography ---
    updateStepStatus(2, 'running');
    const titleNodes = get().nodes.filter((n) => n.type === 'title');
    if (titleNodes.length > 0) {
      get().setSelectedNodeId(titleNodes[0].id);
    }
    titleNodes.forEach((node) => {
      get().updateNodeData(node.id, {
        eyebrowTag: eyebrow,
        brandTitle,
        headlineWhite,
        headlineGold,
        mainTitle: `${headlineWhite}${headlineGold}`,
        subTitle,
        duration,
        badgeText: eyebrow,
        glowColor: '#F5A623',
        badgeColor: '#F5A623',
      });
    });
    get().setToast(`✍️ [步骤 3/5] 黄白撞色主副标题与顶部金黄细眉标排版就绪！`);
    await sleep(350);
    updateStepStatus(2, 'completed');

    // --- STEP 4: Cover Editor & A/B/C Comparison ---
    updateStepStatus(3, 'running');
    const editorNodes = get().nodes.filter((n) => n.type === 'coverEditor');
    if (editorNodes.length > 0) {
      get().setSelectedNodeId(editorNodes[0].id);
    }
    editorNodes.forEach((node) => {
      get().updateNodeData(node.id, {
        previewUrl: newVisualSvg,
        eyebrowTag: eyebrow,
        overrideBrandTitle: brandTitle,
        overrideHeadlineWhite: headlineWhite,
        overrideHeadlineGold: headlineGold,
        overrideTitle: `${headlineWhite}${headlineGold}`,
        overrideSubtitle: subTitle,
        durationText: duration,
      });
    });

    const compNodes = get().nodes.filter((n) => n.type === 'comparison');
    compNodes.forEach((node) => {
      get().updateNodeData(node.id, {
        variants: [
          {
            id: 'var-a',
            label: '方案 A (进阶玩法)',
            previewUrl: newVisualSvg,
            mainTitle: `${brandTitle} ${headlineWhite}${headlineGold}`,
            subTitle,
            style: '进阶高级款',
            ctrScore: 98,
            isWinner: true,
            votes: 215,
          },
          {
            id: 'var-b',
            label: '方案 B (封神技巧)',
            previewUrl: createYouTubeCoverVisual({
              eyebrow: 'PRO TIPS · 封神',
              brandTitle,
              headlineWhite: '封神',
              headlineGold: '技巧',
              subtitle: '高阶用法一网打尽 · 效率翻3倍',
              duration: '10:45',
              avatarUrl: userAvatarUrl,
            }),
            mainTitle: `${brandTitle} 封神技巧`,
            subTitle: '高阶用法一网打尽 · 效率翻3倍',
            style: '封神实操款',
            ctrScore: 94,
            isWinner: false,
            votes: 142,
          },
          {
            id: 'var-c',
            label: '方案 C (实操避坑)',
            previewUrl: createYouTubeCoverVisual({
              eyebrow: 'TUTORIAL · 指南',
              brandTitle,
              headlineWhite: '实操',
              headlineGold: '全解',
              subtitle: '新手到高手必看 · 避开高频雷区',
              duration: '08:52',
              avatarUrl: userAvatarUrl,
            }),
            mainTitle: `${brandTitle} 实操全解`,
            subTitle: '新手到高手必看 · 避开高频雷区',
            style: '全解指南款',
            ctrScore: 91,
            isWinner: false,
            votes: 98,
          },
        ],
        selectedWinnerId: 'var-a',
      });
    });

    const exportNodes = get().nodes.filter((n) => n.type === 'export');
    exportNodes.forEach((node) => {
      get().updateNodeData(node.id, {
        exportedUrls: { preview: newVisualSvg },
      });
    });
    get().setToast(`📐 [步骤 4/5] 已合成 YouTube 极简暗黑金色封面与多端安全视区！`);
    await sleep(350);
    updateStepStatus(3, 'completed');

    // --- STEP 5: Topology Connection & Layout ---
    updateStepStatus(4, 'running');
    get().autoLayout();
    get().setSelectedNodeId(null);
    get().pushSnapshot(`Agent 智能全自动部署: ${brandTitle}`);
    await sleep(300);
    updateStepStatus(4, 'completed');
    get().setToast(`🚀 [全部完成] AI Agent 已在画布上完成 YouTube 极简暗黑金色排版全套节点智能部署！`);
  },

  // Presets: strictly only ONE minimal 9:16 vertical reference template
  loadPresetWorkflow: (_presetKey?: string) => {
    const currentChar = get().nodes.find((n) => n.type === 'character')?.data as any;
    const userAvatarUrl = currentChar?.avatarUrl;
    const userAvatarScale = currentChar?.scale || 1.0;

    const coverSvg = createVerticalCoverVisual({
      headlineLine1: '直接丟給',
      headlineLine2: '你的bot讀',
      subjectType: '3d-book',
      brandTitle: 'Grok Bot',
      creatorTag: '>Jerry_AI.',
      seriesTag: 'Canva Craft ▪',
      subtitle: 'Grok Bot 指南 5 條規則 · 複製即可實裝',
      avatarUrl: userAvatarUrl,
      avatarScale: userAvatarScale,
    });

    const newNodes = INITIAL_NODES.map((node) => {
      if (node.type === 'character' && userAvatarUrl) {
        return {
          ...node,
          data: {
            ...node.data,
            avatarUrl: userAvatarUrl,
            scale: userAvatarScale,
          },
        };
      }
      if (node.type === 'coverEditor') {
        return {
          ...node,
          data: {
            ...node.data,
            previewUrl: coverSvg,
            avatarUrl: userAvatarUrl,
            avatarScale: userAvatarScale,
          },
        };
      }
      return node;
    });

    set({ nodes: newNodes, edges: INITIAL_EDGES });
    get().pushSnapshot('载入极简 9:16 封面工作流');
    get().setToast('✨ 已载入极简 9:16 封面工作流 (参考图排版)');
  },

  toastMessage: null,
  setToast: (msg) => {
    set({ toastMessage: msg });
    if (msg) {
      setTimeout(() => {
        if (get().toastMessage === msg) {
          set({ toastMessage: null });
        }
      }, 3500);
    }
  },
}));

