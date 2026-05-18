import { useState } from "react";
import Sidebar from "../components/Sidebar";
import OverviewPage from "./OverviewPage";
import AnalysisPage from "./AnalysisPage";
import MonitorPage from "./MonitorPage";
import SettingsPage from "./SettingsPage";
import TestPage from "./TestPage";

export default function MainPage({ onLogout }) {
  const [active, setActive] = useState("main");

  const pages = {
    main: <OverviewPage />,
    analysis: <AnalysisPage />,
    monitor: <MonitorPage />,
    settings: <SettingsPage />,
    test: <TestPage />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar active={active} setActive={setActive} onLogout={onLogout} />

      <main style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
        {pages[active]}
      </main>
    </div>
  );
}
