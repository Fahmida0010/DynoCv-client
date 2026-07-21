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

  // মেথড: ব্যাকএন্ড থেকে CV ডেটা ফেচ করা
  const fetchCVs = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get("http://localhost:5000/api/candidate-cvs", {
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

  // মেthod: ড্রপডাউনের জন্য পজিশন লিস্ট লোড করা
  const fetchPositions = async () => {
    try {
      const response = await axiosSecure.get("http://localhost:5000/api/candidate-cvs/positions");
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
    <div>
      <div className="mb-4">
        <h2>Candidate CVs (Pool)</h2>
        <p className="text-muted">Read-only view of all candidate profiles. Search via positions or directly.</p>
      </div>

      {/* Full-Text Search and Filter Section */}
      <form onSubmit={handleFilterSubmit} className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Full-text search (e.g., React, IELTS 7.5)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select"
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
          >
            <option value="">All Positions</option>
            {positions.map((pos) => (
              <option key={pos.id} value={pos.id}>{pos.title}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-secondary w-100">Filter</button>
        </div>
      </form>

      {/* CV List */}
      <div className="table-responsive">
        {loading ? (
          <div className="text-center my-4">Loading CVs...</div>
        ) : (
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
              {cvs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted">No CVs found.</td>
                </tr>
              ) : (
                cvs.map((cv) => (
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
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};