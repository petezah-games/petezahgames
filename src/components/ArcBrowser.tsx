import { motion } from "framer-motion";
import { useBrowserState } from "@/hooks/useBrowserState";
import Sidebar from "@/components/BrowserSidebar";
import Toolbar from "@/components/BrowserToolbar";
import ContentArea from "@/components/ContentArea";

export default function ArcBrowser() {
  const state = useBrowserState();
  const splitTab = state.splitTabId ? state.tabs.find((t) => t.id === state.splitTabId) : undefined;

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      <Sidebar
        spaces={state.spaces}
        activeSpaceId={state.activeSpaceId}
        pinnedTabs={state.pinnedTabs}
        unpinnedTabs={state.unpinnedTabs}
        activeTabId={state.activeTabId}
        collapsed={state.sidebarCollapsed}
        onSpaceSwitch={state.setActiveSpaceId}
        onTabSelect={state.setActiveTabId}
        onTabClose={state.closeTab}
        onTabPin={state.togglePin}
        onTabSplit={state.toggleSplit}
        onAddTab={state.addTab}
        onToggleCollapse={() => state.setSidebarCollapsed(!state.sidebarCollapsed)}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <Toolbar
          activeTab={state.activeTab}
          urlInput={state.urlInput}
          isUrlFocused={state.isUrlFocused}
          onUrlChange={state.setUrlInput}
          onUrlFocus={state.setIsUrlFocused}
          onNavigate={state.navigateToUrl}
        />
        <ContentArea activeTab={state.activeTab} splitTab={splitTab} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between px-4 py-1.5 border-t border-border/50"
        >
          <span className="text-[9px] font-mono tracking-wider text-muted-foreground">
            {state.tabs.length} tabs · {state.spaces.length} spaces
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-space-green" />
            <span className="text-[9px] font-mono tracking-wider text-muted-foreground">
              Secure
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
