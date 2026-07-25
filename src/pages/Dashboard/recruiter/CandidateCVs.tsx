import React, { useState, useEffect } from "react";
import { FaFileAlt, FaSearch, FaEye, FaThumbsUp } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiossecure";

interface CandidateCV {
  id: string;
  candidateName: string;
  positionApplied: string;
  matchScore: string;
  likes: number;
}

interface Position {
  id: string;
  title: string;
}

export const CandidateCVs: React.FC = () => {
  const [cvs, setCvs] = useState<CandidateCV[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const axiosSecure = useAxiosSecure();

  const fetchCVs = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/api/candidate-cvs`, {
        params: {
          search: search,
          positionId: selectedPosition,
        },
      });
      setCvs(response.data);
    } catch (error) {
      console.error("Error fetching CVs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/api/candidate-cvs/positions`);
      setPositions(response.data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  useEffect(() => {
    fetchPositions();
    fetchCVs();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCVs();
  };

  return (
    <div className="container-xl px-2 px-sm-3 px-lg-4 py-3 py-md-4">
      {/* Top Header Section */}
      <div className="mb-4">
        <h2 className="fs-3 fs-md-2 text-dark fw-bold mb-1">Candidate CVs (Pool)</h2>
        <p className="text-muted small mb-0">
          Read-only view of all candidate profiles. Search via positions or directly.
        </p>
      </div>

      {/* Filter Form - Perfectly grid-aligned for Mobile, Tablet, Desktop */}
      <form onSubmit={handleFilterSubmit} className="row g-2 g-md-3 mb-4">
        {/* Full-text search (Full width on Mobile, Half on Laptop+) */}
        <div className="col-12 col-md-6 col-lg-6">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input 
              type="text" 
              className="form-control border-start-0 ps-0 shadow-none" 
              placeholder="Full-text search (e.g., React, IELTS 7.5)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        {/* Dropdown (Full width on Mobile, 8/12 on Tablet, 4/12 on Desktop) */}
        <div className="col-12 col-sm-8 col-md-4 col-lg-4">
          <select 
            className="form-select shadow-none"
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
          >
            <option value="">All Positions</option>
            {positions.map((pos) => (
              <option key={pos.id} value={pos.id}>{pos.title}</option>
            ))}
          </select>
        </div>

        {/* Filter Button (Full width on Mobile, 4/12 on Tablet, 2/12 on Desktop) */}
        <div className="col-12 col-sm-4 col-md-2 col-lg-2">
          <button type="submit" className="btn btn-secondary w-100 fw-semibold shadow-sm">
            Filter
          </button>
        </div>
      </form>

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-secondary mb-2" role="status"></div>
          <div className="text-muted fw-medium">Loading CVs...</div>
        </div>
      ) : cvs.length === 0 ? (
        <div className="card text-center p-5 border-light-subtle shadow-sm">
          <p className="text-muted mb-0 fs-6">No CVs found matching the filter criteria.</p>
        </div>
      ) : (
        <>
          {/* 1. MOBILE & TABLET VIEW: Displays as fluid cards (Hidden on desktop) */}
          <div className="d-block d-lg-none">
            <div className="row g-3">
              {cvs.map((cv) => (
                <div key={cv.id} className="col-12 col-sm-6">
                  <div className="card h-100 shadow-sm border-light-subtle p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h3 className="fs-6 fw-bold text-dark mb-0">{cv.candidateName}</h3>
                        <small className="text-muted" style={{ fontSize: "11px" }}>ID: {cv.id.substring(0, 8)}...</small>
                      </div>
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                        {cv.matchScore} Match
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2 my-2 text-secondary small">
                      <FaFileAlt className="opacity-75" />
                      <span>{cv.positionApplied}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                      <button className="btn btn-sm btn-light border d-flex align-items-center gap-1 py-1 px-2.5">
                        <FaThumbsUp className="text-primary" />
                        <span className="fw-semibold text-secondary small">{cv.likes}</span>
                      </button>
                      <button className="btn btn-sm btn-primary d-flex align-items-center gap-1 py-1.5 px-3">
                        <FaEye /> <span>View Profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. LAPTOP & DESKTOP VIEW: Displays as a clean structured Table (Hidden on mobile/tablet) */}
          <div className="d-none d-lg-block card shadow-sm border border-light-subtle rounded-3 overflow-hidden">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light border-bottom">
                <tr>
                  <th className="px-4 py-3 text-secondary small fw-bold">Candidate</th>
                  <th className="px-4 py-3 text-secondary small fw-bold">Target Position</th>
                  <th className="px-4 py-3 text-secondary small fw-bold">Template Match</th>
                  <th className="px-4 py-3 text-secondary small fw-bold">Likes</th>
                  <th className="px-4 py-3 text-secondary small fw-bold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cvs.map((cv) => (
                  <tr key={cv.id}>
                    <td className="px-4 py-3.5">
                      <div className="fw-bold text-dark">{cv.candidateName}</div>
                      <small className="text-muted d-block" style={{ fontSize: "11px" }}>ID: {cv.id}</small>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="d-flex align-items-center gap-2">
                        <FaFileAlt className="text-secondary opacity-75" />
                        <span className="text-secondary fw-medium">{cv.positionApplied}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="badge bg-success-subtle text-success px-2.5 py-1.5 fw-semibold border border-success-subtle">
                        {cv.matchScore} Match
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="btn btn-sm btn-light border d-inline-flex align-items-center gap-1.5 px-2.5 py-1 text-secondary">
                        <FaThumbsUp className="text-primary" /> 
                        <span className="fw-semibold">{cv.likes}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-end">
                      <button className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1.5 px-3 py-1.5 fw-medium shadow-none">
                        <FaEye /> <span>View Profile (Read-Only)</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};