import React, { useState } from 'react';
import { useStudioStore } from './store/useStudioStore';
import { TopNavbar } from './components/layout/TopNavbar';
import { CanvasWorkspace } from './components/canvas/CanvasWorkspace';
import { CompetitorResearchView } from './components/studio/CompetitorResearchView';
import { ScriptStudioView } from './components/studio/ScriptStudioView';
import { BrainstormAgentDrawer } from './components/agent/BrainstormAgentDrawer';
import { AssetLibraryDrawer } from './components/studio/AssetLibraryDrawer';
import { McpModal } from './components/studio/McpModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const { activeTab, toastMessage } = useStudioStore();
  const [isAssetsOpen, setIsAssetsOpen] = useState(false);
  const [isMcpOpen, setIsMcpOpen] = useState(false);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-neutral-950 font-sans select-none">
      {/* Top Navigation */}
      <TopNavbar
        onOpenAssets={() => setIsAssetsOpen(true)}
        onOpenMcp={() => setIsMcpOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 relative overflow-hidden">
        {activeTab === 'canvas' && (
          <div className="w-full h-full relative">
            <CanvasWorkspace />
            <BrainstormAgentDrawer />
          </div>
        )}

        {activeTab === 'competitor' && <CompetitorResearchView />}

        {activeTab === 'script-studio' && <ScriptStudioView />}
      </main>

      {/* Asset Library Drawer */}
      <AssetLibraryDrawer
        isOpen={isAssetsOpen}
        onClose={() => setIsAssetsOpen(false)}
      />

      {/* MCP Integration Modal */}
      <McpModal
        isOpen={isMcpOpen}
        onClose={() => setIsMcpOpen(false)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-900/95 border border-cyan-500/40 text-neutral-100 text-xs font-semibold shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
