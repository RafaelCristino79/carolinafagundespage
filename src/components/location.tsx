import "./location.css";
import { FiMapPin } from "react-icons/fi";
import { useScrollReveal } from "../hooks/use-scroll-reveal";

function Location() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`location${isVisible ? " is-visible" : ""}`}
      id="contato"
    >
      <div className="location__content">
        <div>
          <p className="location__eyebrow">Atendimento presencial</p>
          <h2>Localização do meu consultório</h2>
        </div>

        <div className="location__contacts">
          <address>
            <FiMapPin aria-hidden="true" />
            <span>
              Clínica Climed<br />
              R. Bento Martins, 2258 — Centro<br />
              Rosário do Sul/RS — 97590-000
            </span>
          </address>
        </div>
      </div>

      <div className="location__map">
        <iframe
          src="https://www.google.com/maps?q=Climed%2C%20R.%20Bento%20Martins%2C%202258%20-%20Centro%2C%20Ros%C3%A1rio%20do%20Sul%20-%20RS%2C%2097590-000%2C%20Brasil&z=18&output=embed"
          title="Local de atendimento na Climed"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}

export default Location;
