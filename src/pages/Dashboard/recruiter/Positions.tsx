import React from "react";
import { FaBriefcase, FaEdit, FaCopy, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface PositionItem {
  id: string;
  title: string;
  templateName: string;
  totalCVs: number;
  status: "Active" | "Draft";
}

export const Positions: React.FC = () => {
  const navigate = useNavigate();
  
  const positionsList: PositionItem[] = [
    { id: "pos-1", title: "Full-Stack Web Engineer", templateName: "MERN Stack Template", totalCVs: 12, status: "Active" },
    { id: "pos-2", title: "Frontend Developer (React)", templateName: "Junior Frontend Template", totalCVs: 5, status: "Draft" },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Manage Positions</h2>
          <p className="text-muted">All recruiters share access to modify and manage these positions.</p>
        </div>
        <button onClick={() => navigate("/dashboard/create-position")} className="btn btn-primary d-flex align-items-center gap-2">
          <FaPlus /> Create Position
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-light">
            <tr>
              <th>Position Title</th>
              <th>Associated Template</th>
              <th>CVs Received</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {positionsList.map((pos) => (
              <tr key={pos.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <FaBriefcase className="text-primary" />
                    <span className="fw-semibold">{pos.title}</span>
                  </div>
                </td>
                <td>{pos.templateName}</td>
                <td><span className="badge bg-info text-dark">{pos.totalCVs} Applicants</span></td>
                <td>
                  <span className={`badge ${pos.status === "Active" ? "bg-success" : "bg-warning text-dark"}`}>
                    {pos.status}
                  </span>
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-sm btn-outline-secondary" title="Duplicate Position">
                      <FaCopy />
                    </button>
                    <button className="btn btn-sm btn-outline-primary" title="Edit">
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};