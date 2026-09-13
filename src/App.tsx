import Header from "./components/header"
import Hero from "./components/hero"
import About from "./components/about"
import Services from "./components/services"
import ServiceLocations from "./components/service-locations"
import Clinic from "./components/clinic"
import ClinicTour from "./components/clinic-tour"
import Location from "./components/location"
import Footer from "./components/footer"
import WhatsappButton from "./components/whatsapp-button"
import "./app.css"

function App() {
  return (

    <>
    <Header/>
    <Hero />
    <About/>
    <Services/>
    <ServiceLocations/>
    <Clinic/>
    <ClinicTour/>
    <Location/>
    <Footer/>
    <WhatsappButton/>
   </>
  )
}

export default App
