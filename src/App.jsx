import './App.css'
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import MeetingHallBooking from "./components/MeetingHallBooking.jsx";

function App() {
  return (
    <Router>
      {/* Toast container can go here */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/booking" element={<MeetingHallBooking />} />
      </Routes>
    </Router>
  );
}

export default App;
