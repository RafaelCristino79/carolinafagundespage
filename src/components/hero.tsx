import "./hero.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import branch from "../../assets/Ramo.png";

const whatsappUrl =
  "https://api.whatsapp.com/send/?phone=5555996898896&text&type=phone_number&app_absent=0";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">

        <div className="heroTittle">
            <p className="pre-tittle">Terapeuta Ocupacional</p>
            <p className="hero-p">Crefito 5/27817 -TO</p>
        </div>

        <h1>Carolina Fagundes</h1>

        
        <div className="hero-desc">
            <FaMapMarkerAlt className="descIcon" />
            <p>Atendimento em Rosário do Sul e Santana do Livramento</p>
        </div>


        <div className="hero-buttons">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="cta1"
          >
            Agendar Consulta
            <FaArrowRightLong className="arrow" />
          </a>
          <a href="#sobre" className="cta2">
            Sobre mim
          </a>
        </div>
      </div>

      <div className="hero-image">
        <div className="hero-image__frame">
          <img className="hero-image__branch" src={branch} alt="" aria-hidden="true" />
          <img
            className="hero-image__branch hero-image__branch--bottom"
            src={branch}
            alt=""
            aria-hidden="true"
          />
          <img className="hero-image__portrait" src="./assets/carol.jpeg" alt="Carolina Fagundes" />
        </div>
      </div>
    </section>
  );
}
export default Hero;
