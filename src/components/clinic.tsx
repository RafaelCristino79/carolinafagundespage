import "./clinic.css";
import clinicImage from "../../assets/consultório.png";
import { FiMapPin } from "react-icons/fi";
import { useScrollReveal } from "../hooks/use-scroll-reveal";

const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=Climed%2C%20R.%20Bento%20Martins%2C%202258%20-%20Centro%2C%20Ros%C3%A1rio%20do%20Sul%20-%20RS%2C%2097590-000";

function Clinic() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`clinic${isVisible ? " is-visible" : ""}`}
      aria-labelledby="clinic-title"
    >
      <div className="clinic__content">
        <p className="clinic__eyebrow">Conheça o espaço</p>
        <ul className="clinic__tags" aria-label="Características do espaço">
          <li>Acolhimento</li>
          <li>Conforto</li>
          <li>Cuidado</li>
        </ul>
        <h2 id="clinic-title">Atendimentos em Rosário do Sul</h2>
        <p className="clinic__description">
          Os atendimentos são realizados em meu consultório, localizado na clínica Climed. O espaço foi planejado e preparado para oferecer
          conforto, privacidade e
          cuidado em cada encontro.
        </p>
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="clinic__map-button"
        >
          <FiMapPin aria-hidden="true" />
          Ver no mapa
        </a>
      </div>

      <div className="clinic__image">
        <img src={clinicImage} alt="Espaço de atendimento da Climed" className="hero-image__portrait"/>
      </div>
    </section>
  );
}

export default Clinic;
