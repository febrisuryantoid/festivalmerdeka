import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import AdminPanel from "./AdminPanel.tsx";
import Proposal from "./Proposal.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/melbu" element={<AdminPanel />} />
        <Route path="/melbu/*" element={<AdminPanel />} />
        <Route path="/proposal" element={<Proposal />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
