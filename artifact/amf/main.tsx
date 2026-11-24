import React from "react";
import ReactDOM from "react-dom/client";
import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import "@/index.css";
import "./standalone.css";
import AmfHome from "@/pages/amf/AmfHome";
import AmfCourse from "@/pages/amf/AmfCourse";
import AmfTraining from "@/pages/amf/AmfTraining";
import AmfQuiz from "@/pages/amf/AmfQuiz";
import AmfExam from "@/pages/amf/AmfExam";
import AmfSheets from "@/pages/amf/AmfSheets";

// Les composants utilisent la classe `.dark` de Tailwind : on la synchronise avec le thème du lecteur.
const root = document.documentElement;
const media = window.matchMedia("(prefers-color-scheme: dark)");
const syncTheme = () => {
  const explicit = root.getAttribute("data-theme");
  root.classList.toggle("dark", explicit ? explicit === "dark" : media.matches);
};
syncTheme();
media.addEventListener("change", syncTheme);
new MutationObserver(syncTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

ReactDOM.createRoot(document.getElementById("amf-root")!).render(
  <React.StrictMode>
    <MemoryRouter initialEntries={["/amf"]}>
      <Routes>
        <Route path="/amf" element={<AmfHome />} />
        <Route path="/amf/cours" element={<AmfCourse />} />
        <Route path="/amf/cours/:themeId" element={<AmfCourse />} />
        <Route path="/amf/entrainement" element={<AmfTraining />} />
        <Route path="/amf/quiz/:scope" element={<AmfQuiz />} />
        <Route path="/amf/examen" element={<AmfExam />} />
        <Route path="/amf/fiches" element={<AmfSheets />} />
        <Route path="*" element={<Navigate to="/amf" replace />} />
      </Routes>
    </MemoryRouter>
  </React.StrictMode>,
);
