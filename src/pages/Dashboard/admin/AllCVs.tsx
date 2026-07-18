import React from "react";
import { FaFileAlt, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";

interface SystemCV {
  id: string;
  ownerName: string;
  positionTitle: string;
  version: number;
  lastSavedBy: string;
}

export const AllCVs: React.FC = () => {
  const allCvsList: SystemCV[] = [
    { id: "cv-101", ownerName: "Anik Ahmed", positionTitle: "Full-Stack Web Engineer", version: 4, lastSavedBy: "Owner" },
    { id: "cv-102", ownerName: "Tamim Iqbal", positionTitle: "Frontend Developer", version: 2, lastSavedBy: "Admin (Bypassed)" },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2>All System CVs (Global Access)</h2>
        <p className="text-muted">
          As an Administrator, you have full owner-level permissions to modify, fix typos, and manage every candidate's CV.
        </p>
      </div>

      {/* Global Search */}
      <div className="input-group mb-4" style={{ maxWidth: "450px" }}>
        <input type="text" className="form-control" placeholder="Search by Candidate Name, Position or content..." />
        <button className="btn btn-primary"><FaSearch /></button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-light">
            <tr>
              <th>Candidate Name</th>
              <th>Target Position</th>
              <th>Version Tracker</th>
              <th>Last Handled By</th>
              <th className="text-end">Owner-Privilege Actions</th>
            </tr>
          </thead>
          <tbody>
            {allCvsList.map((cv) => (
              <tr key={cv.id}>
                <td className="fw-semibold">{cv.ownerName}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <FaFileAlt className="text-secondary" />
                    <span>{cv.positionTitle}</span>
                  </div>
                </td>
                <td><span className="badge bg-dark">v{cv.version}</span></td>
                <td><small className="text-muted">{cv.lastSavedBy}</small></td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-sm btn-light border" title="View">
                      <FaEye />
                    </button>
                    <button className="btn btn-sm btn-primary" title="Edit as Owner (Fix Typos/Attributes)">
                      <FaEdit /> Edit as Owner
                    </button>
                    <button className="btn btn-sm btn-danger" title="Force Delete">
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