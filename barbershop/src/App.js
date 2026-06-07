import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import BookingForm from "./BookingForm";
import Authentication from "./Auth";
import ReservationDashboard from "./ReservationDashboard";
import Portfolio from "./Portfolio";
import About from "./about";
import SelectServices from "./SelectionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Selectservices" element={<SelectServices />} />
        <Route path="/BookingForm" element={<BookingForm />} />
        <Route path="/Auth" element={<Authentication />} />
        <Route path="/booking/:token" element={<ReservationDashboard />} />
        <Route path="/ReservationDashboard" element={<ReservationDashboard />} />
        <Route path="/Portfolio" element={<Portfolio />} />
        <Route path="/About" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
