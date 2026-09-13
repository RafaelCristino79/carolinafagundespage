import { useEffect, useRef, useState } from "react";
import { FiBox, FiMinus, FiPlus, FiRotateCcw, FiRotateCw } from "react-icons/fi";
import { useScrollReveal } from "../hooks/use-scroll-reveal";
import type { ClinicView, ClinicViewer } from "./clinic-viewer";
import clinicReference from "../../assets/referencia consultorio.png";
import "./clinic-tour.css";

function ClinicTour() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<ClinicViewer | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [view, setView] = useState<ClinicView>("interior");

  const changeView = (nextView: ClinicView) => {
    setView(nextView);
    viewerRef.current?.setView(nextView);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!isVisible || !canvas) return;
    let cancelled = false;
    let viewer: ClinicViewer | undefined;

    import("./clinic-viewer")
      .then(({ createClinicViewer }) => {
        if (cancelled) return;
        viewer = createClinicViewer(canvas, {
          onLoad: () => { if (!cancelled) setStatus("ready"); },
          onError: () => { if (!cancelled) setStatus("error"); },
        });
        viewerRef.current = viewer;
      })
      .catch(() => { if (!cancelled) setStatus("error"); });

    return () => {
      cancelled = true;
      viewer?.dispose();
      viewerRef.current = null;
    };
  }, [isVisible, attempt]);

  return (
    <section ref={ref} className="clinic-tour" id="consultorio-3d" aria-labelledby="clinic-tour-title">
      <div className="clinic-tour__heading">
        <p className="clinic-tour__eyebrow">Um olhar por dentro</p>
        <h2 id="clinic-tour-title">Conheça o consultório em 3D</h2>
        <p>Explore a sala de atendimento infantil e conheça cada cantinho do espaço dedicado ao cuidado e às descobertas.</p>
      </div>

      <div className="clinic-tour__views" role="group" aria-label="Escolher vista do consultório">
        <button type="button" aria-pressed={view === "interior"} disabled={status !== "ready"} onClick={() => changeView("interior")}>Dentro da sala</button>
        <button type="button" aria-pressed={view === "overview"} disabled={status !== "ready"} onClick={() => changeView("overview")}>Vista geral</button>
      </div>
      <div className="clinic-tour__viewer" aria-busy={status === "loading"}>
        <span className="clinic-tour__badge"><FiBox aria-hidden="true" /> Sala de atendimento infantil</span>
        <canvas
          key={attempt}
          ref={canvasRef}
          className="clinic-tour__canvas"
          tabIndex={status === "ready" ? 0 : -1}
          role="img"
          aria-label="Modelo 3D interativo da sala de atendimento infantil"
          aria-describedby="clinic-tour-instructions"
        />
        {status !== "ready" && (
          <div className="clinic-tour__message" role="status" aria-live="polite">
            <img className="clinic-tour__poster" src={clinicReference} alt="Render de referência da sala, com mesa de madeira, tapete colorido e balanço de tecido turquesa" />
            <div className="clinic-tour__loading-card">
            <FiBox aria-hidden="true" />
            <p>{status === "error" ? "Não foi possível abrir a visualização 3D." : "Preparando o consultório para você…"}</p>
            {status === "error" && <>
              <p>Confira sua conexão e se o navegador permite conteúdo 3D.</p>
              <button type="button" onClick={() => { setStatus("loading"); setView("interior"); setAttempt((value) => value + 1); }}>Tentar novamente</button>
            </>}
            </div>
          </div>
        )}
      </div>

      <div className="clinic-tour__toolbar">
        <p id="clinic-tour-instructions">{view === "interior" ? "Arraste para olhar ao redor." : "Arraste para girar a sala."} Use dois dedos ou os botões para aproximar. No teclado, use as setas, + e −.</p>
        <div className="clinic-tour__controls" role="group" aria-label="Controles da visualização 3D">
          <button type="button" disabled={status !== "ready"} onClick={() => viewerRef.current?.rotate(-1)} aria-label="Girar para a esquerda" title="Girar para a esquerda"><FiRotateCcw aria-hidden="true" /></button>
          <button type="button" disabled={status !== "ready"} onClick={() => viewerRef.current?.rotate(1)} aria-label="Girar para a direita" title="Girar para a direita"><FiRotateCw aria-hidden="true" /></button>
          <button type="button" disabled={status !== "ready"} onClick={() => viewerRef.current?.zoom(1)} aria-label="Aproximar" title="Aproximar"><FiPlus aria-hidden="true" /></button>
          <button type="button" disabled={status !== "ready"} onClick={() => viewerRef.current?.zoom(-1)} aria-label="Afastar" title="Afastar"><FiMinus aria-hidden="true" /></button>
          <button type="button" disabled={status !== "ready"} onClick={() => viewerRef.current?.reset()}>Restaurar vista</button>
        </div>
      </div>
    </section>
  );
}

export default ClinicTour;
