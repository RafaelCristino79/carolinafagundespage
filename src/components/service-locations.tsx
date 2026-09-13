import "./service-locations.css";
import { FiMapPin } from "react-icons/fi";
import { useScrollReveal } from "../hooks/use-scroll-reveal";

const locations = [
  {
    city: "Rosário do Sul",
    description:
      "Atendimentos presenciais e domiciliares disponíveis na cidade.",
    places: [
      {
        name: "Clínica Climed",
        address: "R. Bento Martins, 2258 — Centro, Rosário do Sul/RS — 97590-000",
      },
      {
        name: "Cauzzo Mais",
        address: "Rua dos Andradas, 2723 — Centro, Rosário do Sul/RS — 97590-000",
      },
      {
        name: "Atendimento domiciliar",
        address: "Em Rosário do Sul.",
      },
    ],
    icon: FiMapPin,
  },
  {
    city: "Santana do Livramento",
    description: "Atendimentos realizados em formato domiciliar.",
    places: [
      {
        name: "Atendimento domiciliar",
        address: "Em Santana do Livramento.",
      },
    ],
    icon: FiMapPin,
  },
];

function ServiceLocations() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`service-locations${isVisible ? " is-visible" : ""}`}
      id="locais-de-atendimento"
      aria-labelledby="service-locations-title"
    >
      <div className="service-locations__container">
        <div className="service-locations__heading">
          <p>Atendimentos</p>
          <h2 id="service-locations-title">Em que cidades e locais eu atuo</h2>
        </div>

        <div className="service-locations__grid">
          {locations.map(({ city, description, places, icon: Icon }) => (
            <article className="service-locations__card" key={city}>
              <div className="service-locations__card-heading">
                <span className="service-locations__icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{city}</h3>
              </div>
              <p>{description}</p>
              {places && (
                <ul className="service-locations__places">
                  {places.map(({ name, address }) => (
                    <li key={name}>
                      <strong>{name}</strong>
                      <span>{address}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceLocations;
