import React, { useEffect, useState } from "react";
import { FaFileAlt, FaEdit, FaTrash, FaEye, FaSearch, FaSpinner } from "react-icons/fa";

interface SystemCV {
  id: string;
  version: number;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
  position: {
    title: string;
  };
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/admin/cvs`;
 

export const AllCVs: React.FC = () => {
  const [cvsList, setCvsList] = useState<SystemCV[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch CVs with or without query
  const fetchCVs = async (query = "") => {
    try {
      setLoading(true);
      const url = query ? `${API_BASE_URL}?search=${encodeURIComponent(query)}` : API_BASE_URL;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to load CVs from system");
      const data = await response.json();
      setCvsList(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCVs(searchQuery);
  };

  // Force Delete Action
  const handleForceDelete = async (id: string) => {
    if (!window.confirm("Are you absolutely sure you want to FORCE DELETE this CV from the system?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete the CV");

      setCvsList((prev) => prev.filter((cv) => cv.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading && cvsList.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <FaSpinner className="spinner-border text-primary" style={{ animation: "spin 1s linear infinite" }} />
        <span className="ms-2">Loading System CVs...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-md-4 py-3">
      {/* Upper Information */}
      <div className="mb-4">
        <h2 className="fw-bold">All System CVs (Global Access)</h2>
        <p className="text-muted">
          As an Administrator, you have full owner-level permissions to modify, fix typos, and manage every candidate's CV.
        </p>
      </div>

      {/* Dynamic Global Search Form */}
      <form onSubmit={handleSearchSubmit} className="input-group mb-4" style={{ maxWidth: "450px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by Candidate Name or Position..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary d-flex align-items-center">
          <FaSearch />
        </button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Table & Cards Holder */}
      <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
        
        {/* Desktop Layout - visible from md screen */}
        <div className="table-responsive d-none d-md-block">
          <table className="table table-hover align-middle border-0 mb-0">
            <thead className="table-light text-uppercase fs-7">
              <tr>
                <th className="ps-4 py-3">Candidate Name</th>
                <th className="py-3">Target Position</th>
                <th className="py-3">Version Tracker</th>
                <th className="py-3">Last Updated</th>
                <th className="text-end pe-4 py-3">Owner-Privilege Actions</th>
              </tr>
            </thead>
            <tbody>
              {cvsList.map((cv) => (
                <tr key={cv.id}>
                  <td className="ps-4 py-3 fw-semibold text-dark">
                    {`${cv.user.firstName} ${cv.user.lastName}`}
                  </td>
                  <td className="py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaFileAlt className="text-secondary" />
                      <span>{cv.position.title}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="badge bg-dark rounded-sm">v{cv.version}</span>
                  </td>
                  <td className="py-3">
                    <small className="text-muted">
                      {new Date(cv.updatedAt).toLocaleDateString()}
                    </small>
                  </td>
                  <td className="text-end pe-4 py-3">
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-sm btn-light border" title="View CV">
                        <FaEye />
                      </button>
                      <button className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1" title="Edit as Owner">
                        <FaEdit /> Edit as Owner
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Force Delete"
                        onClick={() => handleForceDelete(cv.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cvsList.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">No CVs found matching criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card Layout - visible below md screen */}
        <div className="d-block d-md-none p-3">
          {cvsList.map((cv) => (
            <div key={cv.id} className="card mb-3 border-light-subtle shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold mb-0 text-dark">{`${cv.user.firstName} ${cv.user.lastName}`}</h6>
                  <span className="badge bg-dark">v{cv.version}</span>
                </div>

                <div className="d-flex align-items-center gap-2 my-2 text-secondary small">
                  <FaFileAlt />
                  <span className="fw-medium">{cv.position.title}</span>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block">
                    Last Saved: {new Date(cv.updatedAt).toLocaleString()}
                  </small>
                </div>

                <div className="d-flex gap-2 w-100">
                  <button className="btn btn-sm btn-light border flex-grow-1 d-flex align-items-center justify-content-center">
                    <FaEye /> View
                  </button>
                  <button className="btn btn-sm btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-1 small text-nowrap">
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                    onClick={() => handleForceDelete(cv.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {cvsList.length === 0 && (
            <div className="text-center py-3 text-muted">No CVs found matching criteria.</div>
          )}
        </div>

      </div>
    </div>
  );
};