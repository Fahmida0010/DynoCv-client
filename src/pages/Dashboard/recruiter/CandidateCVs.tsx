import React from "react";
import { FaFileAlt, FaSearch, FaEye, FaThumbsUp } from "react-icons/fa";

interface CandidateCV {
  id: string;
  candidateName: string;
  positionApplied: string;
  matchScore: string;
  likes: number;
}

export const CandidateCVs: React.FC = () => {
  const cvs: CandidateCV[] = [
    { id: "cv-101", candidateName: "John Doe", positionApplied: "Full-Stack Web Engineer", matchScore: "95%", likes: 8 },
    { id: "cv-102", candidateName: "Jane Smith", positionApplied: "Frontend Developer", matchScore: "88%", likes: 3 },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2>Candidate CVs (Pool)</h2>
        <p className="text-muted">Read-only view of all candidate profiles. Search via positions or directly.</p>
      </div>

      {/* Full-Text Search and Filter Section */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
            <input type="text" className="form-control" placeholder="Full-text search (e.g., React, IELTS 7.5, Sylhet)..." />
          </div>
        </div>
        <div className="col-md-4">
          <select className="form-select">
            <option>All Positions</option>
            <option>Full-Stack Web Engineer</option>
            <option>Frontend Developer</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100">Filter</button>
        </div>
      </div>

      {/* CV List */}
      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-light">
            <tr>
              <th>Candidate</th>
              <th>Target Position</th>
              <th>Template Match</th>
              <th>Likes</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cvs.map((cv) => (
              <tr key={cv.id}>
                <td>
                  <div className="fw-bold text-dark">{cv.candidateName}</div>
                  <small className="text-muted">ID: {cv.id}</small>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <FaFileAlt className="text-muted" />
                    <span>{cv.positionApplied}</span>
                  </div>
                </td>
                <td><span className="badge bg-success-subtle text-success">{cv.matchScore} Match</span></td>
                <td>
                  <button className="btn btn-sm btn-light border d-inline-flex align-items-center gap-1">
                    <FaThumbsUp className="text-primary" /> {cv.likes}
                  </button>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1">
                    <FaEye /> View Profile (Read-Only)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};