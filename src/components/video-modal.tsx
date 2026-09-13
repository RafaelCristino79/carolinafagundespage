import "./video-modal.css";
import { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import clinicVideo from "../../assets/consultório.mp4";

type VideoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="video-modal" onClick={onClose}>
      <div
        className="video-modal__content"
        role="dialog"
        aria-modal="true"
        aria-label="Vídeo do consultório"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="video-modal__close"
          aria-label="Fechar vídeo"
          onClick={onClose}
        >
          <FaTimes aria-hidden="true" />
        </button>

        <video controls autoPlay muted loop playsInline>
          <source src={clinicVideo} type="video/mp4" />
          Seu navegador não suporta a reprodução de vídeos.
        </video>
      </div>
    </div>
  );
}

export default VideoModal;
