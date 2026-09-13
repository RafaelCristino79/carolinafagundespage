import "./about.css";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useScrollReveal } from "../hooks/use-scroll-reveal";
import aboutImage from "../../assets/sobre.png";

function About() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`about-section${isVisible ? " is-visible" : ""}`}
      id="sobre"
    >
      <div className="about">
        <div className="about__image">
          <img src={aboutImage} alt="Carolina Fagundes" />
        </div>

        <div className="about__content">
          <div className="about__intro">
            <p className="about__title">Um pouco sobre mim</p>
            <p className="about__description">
            Olá, me chamo Carolina Fagundes Dornelles, sou natural de Rosário do Sul e formada em Terapia Ocupacional pela Universidade Federal
            de Santa Maria (UFSM). Através do meu trabalho, busco promover mais autonomia e 
            qualidade de vida a população atendida, com um olhar acolhedor e individualizado, contribuindo para uma vida 
            mais funcional e significativa.
            </p>
          </div>

          <div className="about__follow">
            <h3>Acompanhe meu trabalho</h3>
            <p>
              No Instagram, compartilho reflexões, orientações e conteúdos
              para tornar a rotina mais leve e funcional. Acesse o meu perfil e conheça mais sobre os 
              benefícios da Terapia Ocupacional 
            </p>

            <div className="about__follow-actions">
              <a
                href="https://www.instagram.com/carolinafagundes.to/"
                target="_blank"
                rel="noreferrer"
                className="about__instagram-button"
              >
                <FaInstagram aria-hidden="true" />
                Acessar Instagram
              </a>

              <a
                href="https://api.whatsapp.com/send/?phone=5555996898896&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="about__button"
              >
                <FaWhatsapp className="about__button-icon" />
                Agendar consulta
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
