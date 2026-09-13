import "./whatsapp-button.css";
import { FaWhatsapp } from "react-icons/fa";

function WhatsappButton() {
  return (
    <a
      className="whatsapp-button"
      href="https://api.whatsapp.com/send/?phone=5555996898896&text&type=phone_number&app_absent=0"
      target="_blank"
      rel="noreferrer"
      aria-label="Agendar consulta pelo WhatsApp"
    >
      <FaWhatsapp aria-hidden="true" />
    </a>
  );
}

export default WhatsappButton;
