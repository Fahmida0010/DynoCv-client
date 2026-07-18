import React from "react";
import { FaBriefcase, FaEye, FaFileMedical, FaSearch } from "react-icons/fa";

interface Position {
  id: string;
  title: string;
  description: string;
  tags: string[];
  isOpen: boolean;
}

export const AvailablePositions: React.FC = () => {
  const positions: Position[] = [
    {
      id: "pos-1",
      title: "Backend Developer (NestJS/PostgreSQL)",
      description: "Looking for an expert backend engineer to architecture robust microservices...",
      tags: ["NestJS", "Node.js", "Docker"],
      isOpen: true,
    },
    {
      id: "pos-2",
      title: "UI/UX Engineer (Tailwind/React)",
      description: "Transform Figma components into pixel-perfect responsive web interfaces...",
      tags: ["React", "TypeScript", "Tailwind"],
      isOpen: true,
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <h2>Available Positions</h2>
        <p className="text-muted">Browse active recruitment positions and create tailored profiles.</p>
      </div>

      {/* Search Filter Bar */}
      <div className="input-group mb-4" style={{ maxWidth: "400px" }}>
        <input type="text" className="form-control" placeholder="Search positions..." />
        <button className="btn btn-outline-secondary" type="button">
          <FaSearch />
        </button>
      </div>

      {/* Positions Grid */}
      <div className="row">
        {positions.map((pos) => (
          <div className="col-md-6 mb-4" key={pos.id}>
            <div className="card h-100 border-start border-primary border-4 shadow-sm">
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title fw-bold text-dark d-flex align-items-center gap-2">
                    <FaBriefcase className="text-muted" /> {pos.title}
                  </h5>
                  <p className="card-text text-muted small mt-2">{pos.description}</p>
                  
                  <div className="mb-3">
                    {pos.tags.map((tag, idx) => (
                      <span key={idx} className="badge bg-light text-dark border me-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                  <button className="btn btn-sm btn-light border d-flex align-items-center gap-1">
                    <FaEye /> Details
                  </button>
                  <button className="btn btn-sm btn-primary d-flex align-items-center gap-1">
                    <FaFileMedical /> Apply / Create CV
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};