import React from "react";
import { FaFileAlt, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";

interface CVItem {
  id: string;
  positionTitle: string;
  updatedAt: string;
  status: "Draft" | "Submitted";
  version: number;
}

export const MyCVs: React.FC = () => {
  // ডেমো ডেটা (পরবর্তীতে API থেকে আসবে)
  const cvList: CVItem[] = [
    { id: "cv-1", positionTitle: "Full-Stack Web Engineer", updatedAt: "2026-07-18", status: "Submitted", version: 3 },
    { id: "cv-2", positionTitle: "Frontend Developer (React)", updatedAt: "2026-07-19", status: "Draft", version: 1 },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My CVs</h2>
          <p className="text-muted">Manage your tailored CVs for different positions.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2">
          <FaPlus /> Create New CV
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-light">
            <tr>
              <th>Position Title</th>
              <th>Last Updated</th>
              <th>Version</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cvList.map((cv) => (
              <tr key={cv.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <FaFileAlt className="text-primary" />
                    <span className="fw-semibold">{cv.positionTitle}</span>
                  </div>
                </td>
                <td>{cv.updatedAt}</td>
                <td><span className="badge bg-secondary">v{cv.version}</span></td>
                <td>
                  <span className={`badge ${cv.status === "Submitted" ? "bg-success" : "bg-warning text-dark"}`}>
                    {cv.status}
                  </span>
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-sm btn-outline-info" title="View CV">
                      <FaEye />
                    </button>
                    <button className="btn btn-sm btn-outline-primary" title="Edit CV">
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" title="Delete CV">
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