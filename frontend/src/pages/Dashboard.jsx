import { useEffect, useState } from "react";
import API from "../services/api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("dashboard/");
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  const chartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [data.total_present, data.total_absent],
        backgroundColor: ["#16a34a", "#dc2626"],
      },
    ],
  };

  // Department summary
  const departmentSummary = {};
  data.attendance_list.forEach((item) => {
    if (!departmentSummary[item.department]) {
      departmentSummary[item.department] = { present: 0, absent: 0 };
    }

    if (item.status === "Present") {
      departmentSummary[item.department].present += 1;
    } else {
      departmentSummary[item.department].absent += 1;
    }
  });

  return (
    <div className="container">
      <h2 className="title">Dashboard Summary</h2>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="card">
          <h4>Total Employees</h4>
          <p className="big-number">{data.total_employees}</p>
        </div>

        <div className="card">
          <h4>Total Attendance</h4>
          <p className="big-number">{data.total_attendance}</p>
        </div>

        <div className="card">
          <h4>Present Days</h4>
          <p className="big-number green">{data.total_present}</p>
        </div>

        <div className="card">
          <h4>Absent Days</h4>
          <p className="big-number red">{data.total_absent}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div style={{ marginTop: "40px", width: "300px" }}>
        <h3>Attendance Chart</h3>
        <Pie data={chartData} />
      </div>

      {/* Department Summary */}
      <div style={{ marginTop: "40px" }}>
        <h3>Department Attendance Summary</h3>

        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Present</th>
              <th>Absent</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(departmentSummary).map((dept) => (
              <tr key={dept}>
                <td>{dept}</td>
                <td>{departmentSummary[dept].present}</td>
                <td>{departmentSummary[dept].absent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attendance Table */}
      <div style={{ marginTop: "40px" }}>
        <h3>Recent Attendance</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
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
                <td>
                  <span
                    className={
                      item.status === "Present"
                        ? "badge badge-green"
                        : "badge badge-red"
                    }
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}