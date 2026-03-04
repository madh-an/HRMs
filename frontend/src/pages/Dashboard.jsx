import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const today = new Date().toISOString().split("T")[0];
const [dateFilter, setDateFilter] = useState(today);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [nameFilter, setNameFilter] = useState("");
  const [error, setError] = useState("");

  const departments = ["IT", "HR", "Finance", "Digital Marketing", "Operations"];

  useEffect(() => {
    fetchDashboard();
  }, [statusFilter, dateFilter, departmentFilter, nameFilter]);

  const fetchDashboard = async () => {
    try {
      let url = "dashboard/?";

      if (statusFilter !== "All") url += `status=${statusFilter}&`;
      if (dateFilter) url += `date=${dateFilter}&`;
      if (departmentFilter !== "All") url += `department=${departmentFilter}&`;
      if (nameFilter) url += `name=${nameFilter}&`;

      const res = await API.get(url);
      setData(res.data);
    } catch (err) {
      setError("Failed to load dashboard.");
    }
  };

  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!data) return <div className="container"><p className="loading">Loading...</p></div>;

  return (
    <div className="container">
      <h2 className="title">Dashboard Summary</h2>

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginTop: "20px"
      }}>
        <div className="card">
          <h3>Total Employees</h3>
          <p className="big-number">{data.total_employees}</p>
        </div>
        <div className="card">
          <h3>Total Attendance</h3>
          <p className="big-number">{data.total_attendance}</p>
        </div>
        <div className="card">
          <h3>Present Days</h3>
          <p className="big-number" style={{ color: "green" }}>
            {data.total_present}
          </p>
        </div>
        <div className="card">
          <h3>Absent Days</h3>
          <p className="big-number" style={{ color: "red" }}>
            {data.total_absent}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginTop: "30px" }}>
        <h3>Filter Attendance</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" }}>
          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>

          <input
            type="date"
            className="input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

          <select
            className="input"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            {departments.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>

          <input
            type="text"
            className="input"
            placeholder="Search by Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>

        {/* Results Table */}
        <div style={{ marginTop: "20px" }}>
          {data.attendance_list.length === 0 ? (
            <p className="empty">No records found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.attendance_list.map((item, index) => (
                  <tr key={index}>
                    <td>{item.employee_name}</td>
                    <td>{item.department}</td>
                    <td>{item.date}</td>
                    <td style={{
                      color: item.status === "Present" ? "green" : "red",
                      fontWeight: "bold"
                    }}>
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}