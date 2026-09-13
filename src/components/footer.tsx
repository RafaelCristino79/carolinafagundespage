import "./footer.css";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiMail, FiMapPin } from "react-icons/fi";
import logo from "../../assets/logo.png";

const whatsappUrl = "https://api.whatsapp.com/send/?phone=5555996898896&text&type=phone_number&app_absent=0";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__identity">
          <a className="footer__brand" href="#" aria-label="Voltar ao início">
            <img src={logo} alt="Carolina Fagundes" />
          </a>
        </div>

        <section className="footer__section" aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title">Contato</h2>
          <a
            href="https://www.instagram.com/carolinafagundes.to/"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram aria-hidden="true" />
            <span>@carolinafagundes.to</span>
          </a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <FaWhatsapp aria-hidden="true" />
            <span>(55) 99689-8896</span>
          </a>
          <a href="mailto:carolinafagundes.to@gmail.com">
            <FiMail aria-hidden="true" />
            <span>carolinafagundes.to@gmail.com</span>
          </a>
        </section>

        <section className="footer__section" aria-labelledby="footer-address-title">
          <h2 id="footer-address-title">Consultório</h2>
          <address>
            <FiMapPin aria-hidden="true" />
            <span>
              Climed<br />
              R. Bento Martins, 2258 — Centro<br />
              Rosário do Sul/RS — 97590-000
            </span>
          </address>
        </section>
      </div>

      <p className="footer__copyright">© 2026 Carolina Fagundes. Todos os direitos reservados.</p>
    </footer>
  );
}

export default Footer;
