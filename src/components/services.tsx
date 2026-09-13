import "./services.css";
import { FaWhatsapp } from "react-icons/fa";
import { FaChild, FaPeopleGroup, FaPersonCane, FaUser } from "react-icons/fa6";
import { useScrollReveal } from "../hooks/use-scroll-reveal";

const audiences = [
  {
    title: "Crianças e adolescentes",
    icon: FaChild,
    description:
      "Auxiliar no desenvolvimento da autonomia, das habilidades motoras, cognitivas, sensoriais, sociais e emocionais, favorecendo sua participação nas brincadeiras, na rotina, na escola e nas atividades do dia a dia.",
  },
  {
    title: "Adultos",
    icon: FaUser,
    description: "Auxiliar na promoção da autonomia, organização da rotina, desempenho nas atividades diárias, trabalho, autocuidado e participação social, favorecendo mais independência e qualidade de vida.",
  },
  {
    title: "Idosos",
    icon: FaPersonCane,
    description: "Contribuir para a manutenção da autonomia, das habilidades cognitivas e motoras, da participação nas atividades do dia a dia e de uma rotina mais ativa, segura e significativa.",
  },
  {
    title: "Famílias",
    icon: FaPeopleGroup,
    description: "Orientar e apoiar familiares na organização da rotina, adaptação das atividades e do ambiente, além de construir estratégias que favoreçam a autonomia e o bem-estar da pessoa atendida.",
  },
];

function Services() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`services${isVisible ? " is-visible" : ""}`}
      id="servicos"
      aria-label="Públicos atendidos"
    >
      <div className="services__container">
        <div className="services__heading">
          <p>Perfis atendidos</p>
          <h2>Cuidado em cada fase</h2>
        </div>

        <div className="services__grid">
          {audiences.map(({ title, description, icon: Icon }) => (
            <article className="services__card" key={title}>
              <h3 className="services__card-title">
                <span className="services__card-icon">
                  <Icon aria-hidden="true" />
                </span>
                {title}
              </h3>
              <p>{description}</p>
            </article>
          ))}
        </div>

        <div className="services__cta">
          <a
            href="https://api.whatsapp.com/send/?phone=5555996898896&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="services__button"
          >
            <FaWhatsapp aria-hidden="true" />
            Agendar consulta
          </a>
        </div>
      </div>
    </section>
  );
}

export default Services;
