import React, { useEffect, useState } from "react";
import { FaBriefcase, FaEdit, FaCopy, FaTrash, FaPlus, FaComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiossecure";
import Swal from "sweetalert2";

interface PositionItem {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  templates: {
    attribute: {
      label: string;
    };
  }[];
  discussions?: {
    id: string;
  }[];
  _count: {
    cvs: number;
  };
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/positions`;  

export const Positions: React.FC = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [positionsList, setPositionsList] = useState<PositionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit Modal State
  const [selectedPosition, setSelectedPosition] = useState<PositionItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState(true);

  // ডাটা ফেচ করার ফাংশন
  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get<PositionItem[]>(API_BASE_URL);
      setPositionsList(response.data);
    } catch (error) {
      console.error("Error fetching positions:", error);
      Swal.fire("Error!", "Failed to fetch data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // ডুপ্লিকেট করার ফাংশন
  const handleDuplicate = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to duplicate this position?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, duplicate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.post(`${API_BASE_URL}/${id}/duplicate`, {});
          Swal.fire("Duplicated!", "Position has been duplicated successfully.", "success");
          fetchPositions();
        } catch (error) {
          Swal.fire("Error!", "Failed to duplicate position.", "error");
        }
      }
    });
  };

  // ডিলিট করার ফাংশন
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`${API_BASE_URL}/${id}`);
          setPositionsList(positionsList.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "Position has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete position.", "error");
        }
      }
    });
  };

  // এডিট বাটন ক্লিক হ্যান্ডলার
  const openEditModal = (pos: PositionItem) => {
    setSelectedPosition(pos);
    setEditTitle(pos.title);
    setEditDescription(pos.description || "");
    setEditStatus(pos.isActive);
  };

  // আপডেট সাবমিট করার ফাংশন
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosition) return;

    try {
      await axiosSecure.put(`${API_BASE_URL}/${selectedPosition.id}`, {
        title: editTitle,
        description: editDescription,
        isActive: editStatus,
      });

      Swal.fire("Updated!", "Position data has been updated.", "success");
      setSelectedPosition(null);
      fetchPositions();
    } catch (error) {
      Swal.fire("Error!", "Failed to update position.", "error");
    }
  };

  if (loading) {
    return <div className="text-center my-5"><h5>Loading Positions...</h5></div>;
  }

  return (
    <div className="position-relative container-fluid px-2 px-md-3">
      {/* হেডার সেকশন */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="mb-1 fs-3 fw-bold">Manage Positions</h2>
          <p className="text-muted small mb-0">All recruiters share access to modify and manage these positions.</p>
        </div>
        <button onClick={() => navigate("/dashboard/create-position")} className="btn btn-primary d-flex align-items-center justify-content-center gap-2 w-100 w-md-auto">
          <FaPlus /> Create Position
        </button>
      </div>

      {positionsList.length === 0 ? (
        <div className="text-center text-muted py-5 border rounded bg-white">No positions found.</div>
      ) : (
        <>
          {/* ================= 1. MOBILE DEVICE CARD VIEW ================= */}
          <div className="d-block d-md-none">
            <div className="row g-3">
              {positionsList.map((pos) => (
                <div key={pos.id} className="col-12">
                  <div className="card shadow-sm border border-light-subtle rounded-3 p-3 bg-white">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <FaBriefcase className="text-primary flex-shrink-0" />
                        <h6 className="fw-bold mb-0 text-dark text-wrap">{pos.title}</h6>
                      </div>
                      <span className={`badge px-2 py-1 ${pos.isActive ? "bg-success" : "bg-warning text-dark"}`}>
                        {pos.isActive ? "Active" : "Draft"}
                      </span>
                    </div>

                    <div className="mb-3 small text-muted">
                      <div className="mb-1">
                        <strong>Template:</strong> {pos.templates?.[0]?.attribute?.label || "No Template"}
                      </div>
                      <div>
                        <strong>CVs Received:</strong> <span className="badge bg-info text-dark ms-1">{pos._count?.cvs || 0} Applicants</span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 border-top pt-2">
                      <button 
                     onClick={() => {
  const discId = pos.discussions?.[0]?.id;
  if (discId) {
    navigate(`/dashboard/discussions?id=${discId}`);
  } else {
    Swal.fire("Notice", "No discussion thread available for this position.", "info");
  }
}}
                        className="btn btn-sm btn-light border" 
                        title="Discussion Thread"
                      >
                        <FaComments className="text-info" />
                      </button>
                      <button 
                        onClick={() => handleDuplicate(pos.id)} 
                        className="btn btn-sm btn-light border" 
                        title="Duplicate"
                      >
                        <FaCopy className="text-secondary" />
                      </button>
                      <button 
                        onClick={() => openEditModal(pos)} 
                        className="btn btn-sm btn-light border" 
                        title="Edit"
                      >
                        <FaEdit className="text-primary" />
                      </button>
                      <button 
                        onClick={() => handleDelete(pos.id)} 
                        className="btn btn-sm btn-light border" 
                        title="Delete"
                      >
                        <FaTrash className="text-danger" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= 2. DESKTOP/LAPTOP TABLE VIEW ================= */}
          <div className="d-none d-md-block card shadow-sm border-0 rounded-3">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
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
                          <FaBriefcase className="text-primary flex-shrink-0" />
                          <span className="fw-semibold">{pos.title}</span>
                        </div>
                      </td>
                      <td>{pos.templates?.[0]?.attribute?.label || "No Template"}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {pos._count?.cvs || 0} Applicants
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${pos.isActive ? "bg-success" : "bg-warning text-dark"}`}>
                          {pos.isActive ? "Active" : "Draft"}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button 
                           onClick={() => {
  const discId = pos.discussions?.[0]?.id;
  if (discId) {
      navigate(`/dashboard/discussions?id=${discId}`);
  } else {
    Swal.fire("Notice", "No discussion thread available for this position.", "info");
  }
}}
                            className="btn btn-sm btn-outline-info" 
                            title="Discussion Thread"
                          >
                            <FaComments />
                          </button>
                          <button onClick={() => handleDuplicate(pos.id)} className="btn btn-sm btn-outline-secondary" title="Duplicate Position"><FaCopy /></button>
                          <button onClick={() => openEditModal(pos)} className="btn btn-sm btn-outline-primary" title="Edit"><FaEdit /></button>
                          <button onClick={() => handleDelete(pos.id)} className="btn btn-sm btn-outline-danger" title="Delete"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ================= EDIT MODAL OVERLAY ================= */}
      {selectedPosition && (
        <div className="modal show d-block px-2" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fs-5">Edit Position</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedPosition(null)}></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body p-3 p-md-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Position Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description</label>
                    <textarea 
                      className="form-control" 
                      rows={4} 
                      value={editDescription} 
                      onChange={(e) => setEditDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold small">Status</label>
                    <select 
                      className="form-select" 
                      value={editStatus ? "true" : "false"} 
                      onChange={(e) => setEditStatus(e.target.value === "true")}
                    >
                      <option value="true">Active</option>
                      <option value="false">Draft</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-sm btn-secondary px-3" onClick={() => setSelectedPosition(null)}>Cancel</button>
                  <button type="submit" className="btn btn-sm btn-primary px-3">Update Position</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};