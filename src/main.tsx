import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

const AdminPanel = lazy(() => import("./AdminPanel.tsx"));
const Proposal = lazy(() => import("./Proposal.tsx"));

const PageLoader = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mr-3"></div>
    Memuat...
  </div>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/melbu" element={<AdminPanel />} />
          <Route path="/melbu/*" element={<AdminPanel />} />
          <Route path="/proposal" element={<Proposal />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);

