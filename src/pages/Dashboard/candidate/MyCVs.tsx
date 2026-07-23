import React, { useEffect, useState } from "react";
import { FaFileAlt, FaEdit, FaTrash, FaEye} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiossecure";
import Swal from "sweetalert2";

// প্রিসমা স্কিমা অনুযায়ী ইন্টারফেস ডিজাইন
interface CVItem {
  id: string;
  userId: string;
  positionId: string;
  content: any; // Snapshot Json
  version: number;
  createdAt: string;
  updatedAt: string;
  // রিলেশন পপুলেট হয়ে আসলে টাইপ যেমন হবে:
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

  // ১. ডাইনামিক ডাটা লোড (Fetch CVs)
  useEffect(() => {
    axiosSecure
      .get("dashboard/my-cvs") // আপনার নির্দিষ্ট এন্ডপয়েন্ট
      .then((res) => {
        setCvList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [axiosSecure]);

  // ২. ডাইনামিক ডিলিট হ্যান্ডলার (Delete CV with Swal Confirmation)
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
          
          // স্টেট থেকে রিমুভ করা
          setCvList((prev) => prev.filter((cv) => cv.id !== cvId));

          // 🟢 সাকসেস Swal
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

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My CVs</h2>
          <p className="text-muted">Manage your tailored CVs for different positions.</p>
        </div>
       
      </div>

      <div className="table-responsive">
        {cvList.length > 0 ? (
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
                      {/* স্কিমা রিলেশন অনুযায়ী Dynamic Title */}
                      <span className="fw-semibold">{cv.position?.title || "Untitled Position"}</span>
                    </div>
                  </td>
                  {/* Dynamic formatted Date string */}
                  <td>{new Date(cv.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <span className="badge bg-secondary">v{cv.version}</span>
                  </td>
                  <td>
                    {/* স্কিমার Position.isActive স্টেটাসের ওপর ভিত্তি করে ডাইনামিক ব্যাজ */}
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
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center p-5 border rounded bg-light">
            <p className="text-muted mb-0">No tailored CVs found. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};