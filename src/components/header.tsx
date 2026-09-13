import "./header.css";
import { useState } from "react";
import { FaBars, FaTimes, FaWhatsapp } from "react-icons/fa";

const whatsappUrl = "https://api.whatsapp.com/send/?phone=5555996898896&text&type=phone_number&app_absent=0";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header__primary">
          <a href="#" aria-label="Página inicial" onClick={closeMenu}>
            <img className="header__logo" src="./assets/logo.png" alt="" />
          </a>

          <nav
            className={`header__nav${isMenuOpen ? " is-open" : ""}`}
            id="main-navigation"
          >
            <div className="nav">
              <a href="#" onClick={closeMenu}>Início</a>
              <a href="#sobre" onClick={closeMenu}>Sobre</a>
              <a href="#servicos" onClick={closeMenu}>Serviços</a>
              <a href="#contato" onClick={closeMenu}>Contato</a>
            </div>
          </nav>
        </div>

        <div className="header__actions">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="header__mobile-button"
            aria-label="Agendar consulta pelo WhatsApp"
          >
            <FaWhatsapp aria-hidden="true" />
            <span>Agendar</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="header__button"
          >
            <FaWhatsapp className="headerCta" />
            Agendar consulta
          </a>

          <button
            type="button"
            className="header__menu-toggle"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
