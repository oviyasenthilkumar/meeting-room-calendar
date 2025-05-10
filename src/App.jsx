import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import MeetingHallBooking from "./components/MeetingHallBooking";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/booking" element={<MeetingHallBooking />} />
      </Routes>
    </Router>
  );
}

export default App;
