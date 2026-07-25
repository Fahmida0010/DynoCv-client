import React, { useEffect, useState } from "react";
import { FaBriefcase, FaEye, FaFileMedical, FaSearch, FaThumbsUp } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiossecure";

interface Position {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  likesCount?: number; 
  isLikedByUser?: boolean;
  templates: Array<{
    attribute: {
      id: string;
      label: string;
      type: string;
    };
  }>;
}

export const AvailablePositions: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure
      .get("positions")
      .then((res) => {
        const activePositions = res.data.filter((pos: Position) => pos.isActive);
        setPositions(activePositions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching positions:", err);
        setLoading(false);
      });
  }, [axiosSecure]);

  // লাইক টগল করার হ্যান্ডলার মেথড
  const handleToggleLike = async (positionId: string) => {
    try {
      const response = await axiosSecure.post(`positions/${positionId}/like`);
      const { liked } = response.data;

      // লোকাল স্টেট আপডেট যাতে রিয়েল-টাইমে UI-তে লাইক কাউন্ট বাড়ে/কমে
      setPositions((prevPositions) =>
        prevPositions.map((pos) => {
          if (pos.id === positionId) {
            const currentLikes = pos.likesCount || 0;
            return {
              ...pos,
              isLikedByUser: liked,
              likesCount: liked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
            };
          }
          return pos;
        })
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while processing your request.",
      });
    }
  };

  const handleApplyPosition = async (position: Position) => {
    try {
      Swal.fire({
        title: "Compiling Profile Data...",
        text: "Please wait while we gather your profile attributes.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const [profileRes, attributesRes, projectsRes] = await Promise.all([
        axiosSecure.get("profile/me"),
        axiosSecure.get("profile/attributes"),
        axiosSecure.get("profile/projects"),
      ]);

      const profileData = profileRes.data;
      const userAttributes = attributesRes.data;
      const projectsData = projectsRes.data;

      const requiredAttributeIds = position.templates.map((t) => t.attribute.id);
      
      const filteredAttributes = userAttributes.filter((attr: any) =>
        requiredAttributeIds.includes(attr.attributeId)
      );

      const cvSnapshot = {
        me: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          location: profileData.location || "Not Provided",
          photoUrl: profileData.photoUrl || "",
        },
        info: filteredAttributes.map((attr: any) => ({
          label: attr.attribute.label,
          value: attr.value,
          type: attr.attribute.type,
        })),
        projects: projectsData.map((proj: any) => ({
          name: proj.name,
          description: proj.description,
          tags: proj.tags,
        })),
      };

      Swal.fire({
        title: `Tailored CV Preview`,
        html: `
          <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 10px; border: 1px solid #eee;">
            <h5 style="color:#0d6efd;">${cvSnapshot.me.firstName} ${cvSnapshot.me.lastName}</h5>
            <p class="text-muted">📍 ${cvSnapshot.me.location}</p>
            <hr/>
            <h6><strong>Position Specific Attributes:</strong></h6>
            ${
              cvSnapshot.info.length > 0
                ? cvSnapshot.info.map((i: any) => `<p><strong>${i.label}:</strong> ${i.value}</p>`).join("")
                : "<p class='text-muted small'>No custom attributes required for this role.</p>"
            }
            <hr/>
            <h6><strong>Included Projects:</strong></h6>
            ${cvSnapshot.projects.map((p: any) => `<div><strong>${p.name}</strong><br/><small>${p.tags.join(", ")}</small></div>`).join("<br/>")}
          </div>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Confirm & Submit Application",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axiosSecure.post("dashboard/my-cvs", {
              positionId: position.id,
              content: cvSnapshot, 
            });

            Swal.fire({
              icon: "success",
              title: "Application Submitted!",
              text: `Your dynamic CV for ${position.title} has been generated and saved successfully.`,
              timer: 3000,
              showConfirmButton: false,
            });
          } catch (postErr: any) {
            console.error(postErr);
            Swal.fire({
              icon: "error",
              title: "Submission Failed",
              text: postErr.response?.data?.message || "You might have already applied for this position.",
            });
          }
        }
      });
    } catch (fetchErr) {
      console.error(fetchErr);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to assemble your profile data. Please ensure your profile setup is complete.",
      });
    }
  };

  const filteredPositions = positions.filter((pos) =>
    pos.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pos.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="container-fluid px-3 py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Available Positions</h2>
        <p className="text-muted">Browse active recruitment positions and create tailored profiles.</p>
      </div>

      {/* Search Filter Bar */}
      <div className="input-group mb-4" style={{ maxWidth: "400px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search positions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-outline-secondary" type="button">
          <FaSearch />
        </button>
      </div>

      {/* Positions Grid */}
      <div className="row">
        {filteredPositions.length > 0 ? (
          filteredPositions.map((pos) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={pos.id}>
              <div className="card h-100 border-start border-primary border-4 shadow-sm">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <h5 className="card-title fw-bold text-dark d-flex align-items-center gap-2 mb-0">
                        <FaBriefcase className="text-muted flex-shrink-0" /> {pos.title}
                      </h5>
                      
                      {/* লাইক বাটন ইন্টারফেস */}
                      <button
                        onClick={() => handleToggleLike(pos.id)}
                        className={`btn btn-sm d-inline-flex align-items-center gap-1.5 border rounded-pill px-2.5 py-1 transition-all ${
                          pos.isLikedByUser 
                            ? "btn-primary border-primary text-white" 
                            : "btn-light border-secondary-subtle text-secondary"
                        }`}
                        title={pos.isLikedByUser ? "Unlike this position" : "Like this position"}
                      >
                        <FaThumbsUp />
                        <span className="fw-semibold small">{pos.likesCount || 0}</span>
                      </button>
                    </div>

                    <p className="card-text text-muted small mt-3 mb-3">{pos.description}</p>

                    <div className="mb-3 d-flex flex-wrap gap-1">
                      {pos.templates.map((t, idx) => (
                        <span key={idx} className="badge bg-light text-dark border">
                          {t.attribute.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                    <button className="btn btn-sm btn-light border d-flex align-items-center gap-1">
                      <FaEye /> Details
                    </button>
                    <button
                      className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                      onClick={() => handleApplyPosition(pos)}
                    >
                      <FaFileMedical /> Apply / Create CV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center p-5 text-muted">No active positions match your criteria.</div>
        )}
      </div>
    </div>
  );
};