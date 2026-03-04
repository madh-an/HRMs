import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
<nav className="navbar">
  <div className="nav-container">
    <h2 className="logo">HRMS Lite</h2>
    <div>
      <Link to="/">Dashboard</Link>
      <Link to="/employees">Employees</Link>
      <Link to="/attendance">Attendance</Link>
    </div>
  </div>
</nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;