import React, { useState, useEffect } from "react";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const employees = ["Rohit Kumar", "Anjali Sharma", "Suresh Singh"];

const CompanyAttendance = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("attendance");
    if (saved) setAttendance(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handleToggle = (emp, date) => {
    const dateKey = date.toISOString().split("T")[0];
    const now = new Date();

    setAttendance(prev => {
      const current = prev[emp]?.[dateKey];

      if (current) {
        const diff = (now - new Date(current.timestamp)) / (1000 * 60 * 60);
        if (diff > 12) {
          alert("12 ghante ke baad change allowed nahi hai!");
          return prev;
        }
      }

      return {
        ...prev,
        [emp]: {
          ...prev[emp],
          [dateKey]: {
            status: current?.status === "Present" ? "Absent" : "Present",
            time: now.toLocaleTimeString(),
            timestamp: now
          }
        }
      };
    });
  };

  const days = getDaysInMonth(year, month);
  const yearOptions = Array.from({ length: 11 }, (_, i) => 2020 + i);

  return (
    <div style={{ padding: 20 }}>
      <h2>Company Attendance</h2>

      <div style={{ marginBottom: 20 }}>
        Year:
        <select value={year} onChange={e => setYear(Number(e.target.value))}>
          {yearOptions.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        Month:
        <select value={month} onChange={e => setMonth(Number(e.target.value))}>
          {months.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Employee</th>
              {days.map(d => (
                <th key={d.toISOString()}>{d.getDate()}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {employees.map(emp => (
              <tr key={emp}>
                <td>{emp}</td>

                {days.map(date => {
                  const dateKey = date.toISOString().split("T")[0];
                  const entry = attendance[emp]?.[dateKey];

                  return (
                    <td key={dateKey}>
                      <input
                        type="checkbox"
                        checked={entry?.status === "Present"}
                        onChange={() => handleToggle(emp, date)}
                      />
                      <div style={{ fontSize: 10 }}>
                        {entry?.time || ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyAttendance;
