import { useEffect, useState } from "react";
import API from "../services/api";

export default function Attendance() {
  const today = new Date().toISOString().split("T")[0];

  const [employees, setEmployees] = useState([]);
  const [todayData, setTodayData] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState(today);
  const [status, setStatus] = useState("Present");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchTodayAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("employees/");
      setEmployees(res.data);
    } catch {
      setError("Failed to load employees.");
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const res = await API.get("today-attendance/");
      setTodayData(res.data);
    } catch {
      setError("Failed to load today's attendance.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("attendance/", {
        employee: selectedEmployee,
        date,
        status,
      });

      setSuccess("Attendance marked successfully!");
      setTimeout(() => setSuccess(""), 2500);

      fetchTodayAttendance();
    } catch {
      setError("Attendance already marked for this date.");
    }
  };

  const markAllPresent = async () => {
    for (let emp of employees) {
      try {
        await API.post("attendance/", {
          employee: emp.id,
          date: today,
          status: "Present",
        });
      } catch {}
    }

    setSuccess("All employees marked Present!");
    setTimeout(() => setSuccess(""), 2500);

    fetchTodayAttendance();
  };

  return (
    <div className="container">
      <h2 className="title">Attendance Management</h2>

      {/* Success / Error Banner */}
      {success && <div className="success-banner">{success}</div>}
      {error && <div className="error-banner">{error}</div>}

      {/* Summary Cards */}
      {todayData && (
        <div className="summary-grid">
          <div className="card">
            <h4>Present Today</h4>
            <p className="big-number green">{todayData.present_count}</p>
          </div>

          <div className="card">
            <h4>Absent Today</h4>
            <p className="big-number red">{todayData.absent_count}</p>
          </div>

          <div className="card">
            <h4>Total Marked</h4>
            <p className="big-number">{todayData.total}</p>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="attendance-layout">
        
        {/* LEFT: FORM */}
        <div className="card form-card">
          <h3 className="mt-30">Mark Attendance</h3>

          <form onSubmit={handleSubmit} className="vertical-form">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
              className="input"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>

            <button className="btn btn-primary">
              Mark Attendance
            </button>
          </form>

          <button
            onClick={markAllPresent}
            className="btn btn-success"
            style={{ marginTop: "15px" }}
          >
            Mark All Present (Today)
          </button>
        </div>

        {/* RIGHT: ILLUSTRATION */}
        <div className="attendance-illustration">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Attendance"
            className="attendance-image"
          />
          <p className="illustration-text">
            Track daily employee attendance efficiently and monitor workforce presence in real-time.
          </p>
        </div>
      </div>

      {/* Today Attendance Table */}
      {todayData && todayData.attendance_list.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3>Today's Attendance</h3>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todayData.attendance_list.map(item => (
                <tr key={item.id}>
                  <td>{item.employee_name}</td>
                  <td>{item.department}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.status === "Present"
                          ? "badge-green"
                          : "badge-red"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}