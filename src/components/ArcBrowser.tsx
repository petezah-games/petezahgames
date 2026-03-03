import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useBrowserState } from "@/hooks/useBrowserState";
import Sidebar from "@/components/BrowserSidebar";
import Toolbar from "@/components/BrowserToolbar";
import ContentArea from "@/components/ContentArea";
import StatusBar from "@/components/StatusBar";
import AccountPanel from "@/components/AccountPanel";
import DiscordPopup from "@/components/DiscordPopup";

export default function ArcBrowser() {
  const state = useBrowserState();
  const splitTab = state.splitTabId ? state.tabs.find((t) => t.id === state.splitTabId) : undefined;
  const [showAccount, setShowAccount] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
        onAccountClick={() => setShowAccount(!showAccount)}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <Toolbar
          activeTab={state.activeTab}
          urlInput={state.urlInput}
          isUrlFocused={state.isUrlFocused}
          onUrlChange={state.setUrlInput}
          onUrlFocus={state.setIsUrlFocused}
          onNavigate={state.navigateToUrl}
          onNotificationClick={() => setShowNotifications(!showNotifications)}
        />
        <ContentArea activeTab={state.activeTab} splitTab={splitTab} />
        <StatusBar tabCount={state.tabs.length} spaceCount={state.spaces.length} />
      </main>
      <AnimatePresence>
        {showAccount && <AccountPanel onClose={() => setShowAccount(false)} />}
      </AnimatePresence>
      <DiscordPopup />
    </div>
  );
}
