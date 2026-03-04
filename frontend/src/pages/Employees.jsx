import { useEffect, useState } from "react";
import API from "../services/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("employees/");
      setEmployees(res.data);
    } catch (err) {
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await API.post("employees/", form);
      setSuccess("Employee added successfully!");
      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });
      fetchEmployees();
    } catch (err) {
      setError(
        err.response?.data?.email ||
        err.response?.data?.employee_id ||
        "Error adding employee."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      await API.delete(`employees/${id}/`);
      fetchEmployees();
    } catch (err) {
      setError("Failed to delete employee.");
    }
  };

  return (
    <div className="container">
      <h2 className="title">Employee Management</h2>

      {/* Success / Error Messages */}
      {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}
      {error && <p className="error">{error}</p>}

      {/* Add Employee Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID"
            value={form.employee_id}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="input"
          />
            <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
            className="input"
            >
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Operations">Operations</option>
            </select>
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </div>
      </form>

      {/* Loading State */}
      {loading && <p className="loading">Loading employees...</p>}

      {/* Empty State */}
      {employees.length === 0 && !loading && (
        <p className="empty">No employees found.</p>
      )}

      {/* Employee Table */}
      {employees.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.employee_id}</td>
                <td>{emp.full_name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}