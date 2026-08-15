import React, { useEffect, useState } from "react";
import { FaFileAlt, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiossecure";
import Swal from "sweetalert2";

interface CVItem {
  id: string;
  userId: string;
  positionId: string;
  content: any;
  version: number;
  createdAt: string;
  updatedAt: string;
  position: {
    id: string;
    title: string;
    isActive: boolean;
  };
}

export const MyCVs: React.FC = () => {
  const [cvList, setCvList] = useState<CVItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure
      .get("dashboard/my-cvs")
      .then((res) => {
        setCvList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [axiosSecure]);

  const handleDeleteCV = async (cvId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this dynamic CV snapshot!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`dashboard/my-cvs/${cvId}`);
          
          setCvList((prev) => prev.filter((cv) => cv.id !== cvId));

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Your CV has been deleted successfully.",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Something went wrong while deleting the CV.",
          });
        }
      }
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My CVs</h2>
          <p className="text-muted">Manage your tailored CVs for different positions.</p>
        </div>
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
            {loading ? (
              // Table Skeleton Loader Rows (5 Rows)
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="placeholder-glow">
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="placeholder col-1 rounded" style={{ height: "18px" }}></span>
                      <span className="placeholder col-8 rounded"></span>
                    </div>
                  </td>
                  <td>
                    <span className="placeholder col-6 rounded"></span>
                  </td>
                  <td>
                    <span className="placeholder col-4 rounded-pill"></span>
                  </td>
                  <td>
                    <span className="placeholder col-5 rounded-pill"></span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <span className="placeholder col-2 rounded" style={{ height: "28px", width: "32px" }}></span>
                      <span className="placeholder col-2 rounded" style={{ height: "28px", width: "32px" }}></span>
                      <span className="placeholder col-2 rounded" style={{ height: "28px", width: "32px" }}></span>
                    </div>
                  </td>
                </tr>
              ))
            ) : cvList.length > 0 ? (
              cvList.map((cv) => (
                <tr key={cv.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <FaFileAlt className="text-primary" />
                      <span className="fw-semibold">{cv.position?.title || "Untitled Position"}</span>
                    </div>
                  </td>
                  <td>{new Date(cv.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <span className="badge bg-secondary">v{cv.version}</span>
                  </td>
                  <td>
                    <span className={`badge ${cv.position?.isActive ? "bg-success" : "bg-warning text-dark"}`}>
                      {cv.position?.isActive ? "Active Hiring" : "Inactive"}
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
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        title="Delete CV"
                        onClick={() => handleDeleteCV(cv.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-5 text-muted">
                  No tailored CVs found. Create one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};