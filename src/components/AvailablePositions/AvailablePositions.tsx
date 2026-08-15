import React, { useEffect, useState } from "react";
import { FaBriefcase, FaFileMedical, FaSearch, FaThumbsUp } from "react-icons/fa";
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
          <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 12px; border: 1px solid #e9ecef; border-radius: 8px; background-color: #f8f9fa;">
            <h5 style="color:#0d6efd; margin-bottom: 2px;">${cvSnapshot.me.firstName} ${cvSnapshot.me.lastName}</h5>
            <p class="text-muted small">📍 ${cvSnapshot.me.location}</p>
            <hr/>
            <h6><strong>Position Specific Attributes:</strong></h6>
            ${
              cvSnapshot.info.length > 0
                ? cvSnapshot.info.map((i: any) => `<p class="mb-1"><strong>${i.label}:</strong> ${i.value}</p>`).join("")
                : "<p class='text-muted small'>No custom attributes required for this role.</p>"
            }
            <hr/>
            <h6><strong>Included Projects:</strong></h6>
            ${cvSnapshot.projects
              .map(
                (p: any) =>
                  `<div class="mb-2"><strong>${p.name}</strong><br/><small class="text-muted">${p.tags.join(", ")}</small></div>`
              )
              .join("")}
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

  const filteredPositions = positions.filter(
    (pos) =>
      pos.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Available Positions</h2>
        <p className="text-muted">Browse active recruitment positions and create tailored profiles.</p>
      </div>

      {/* Search Filter Bar */}
      <div className="input-group mb-4 shadow-sm rounded" style={{ maxWidth: "420px" }}>
        <span className="input-group-text bg-white border-end-0 text-muted">
          <FaSearch />
        </span>
        <input
          type="text"
          className="form-control border-start-0 ps-0 shadow-none"
          placeholder="Search positions by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Positions Grid */}
      <div className="row g-4">
        {loading ? (
          // Skeleton Loading UI (6 Cards)
          Array.from({ length: 6 }).map((_, idx) => (
            <div className="col-12 col-md-6 col-lg-4" key={idx}>
              <div className="card h-100 border-0 shadow-sm p-3" aria-hidden="true">
                <div className="card-body p-0 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="placeholder col-7 placeholder-lg rounded"></span>
                      <span className="placeholder col-2 placeholder-lg rounded-pill"></span>
                    </div>
                    <p className="card-text placeholder-glow mb-3">
                      <span className="placeholder col-11 rounded mb-1"></span>
                      <span className="placeholder col-8 rounded mb-1"></span>
                      <span className="placeholder col-5 rounded"></span>
                    </p>
                    <div className="d-flex gap-1 mb-3">
                      <span className="placeholder col-3 placeholder-sm rounded-pill"></span>
                      <span className="placeholder col-3 placeholder-sm rounded-pill"></span>
                      <span className="placeholder col-2 placeholder-sm rounded-pill"></span>
                    </div>
                  </div>
                  <div className="pt-3 border-top d-flex justify-content-end">
                    <span className="placeholder col-6 placeholder-lg rounded-3"></span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : filteredPositions.length > 0 ? (
          filteredPositions.map((pos) => (
            <div className="col-12 col-md-6 col-lg-4" key={pos.id}>
              <div className="card h-100 border-0 shadow-sm rounded-3 hover-shadow transition-all">
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    {/* Header: Title & Like Button */}
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <h5 className="card-title fw-bold text-dark d-flex align-items-center gap-2 mb-0 fs-6">
                        <FaBriefcase className="text-primary flex-shrink-0" /> {pos.title}
                      </h5>

                      {/* Like Button */}
                      <button
                        onClick={() => handleToggleLike(pos.id)}
                        className={`btn btn-sm d-inline-flex align-items-center gap-1 border-0 rounded-pill px-3 py-1 transition-all ${
                          pos.isLikedByUser
                            ? "bg-primary text-white shadow-sm"
                            : "bg-light text-secondary hover-bg-secondary"
                        }`}
                        title={pos.isLikedByUser ? "Unlike this position" : "Like this position"}
                      >
                        <FaThumbsUp className={pos.isLikedByUser ? "text-white" : "text-secondary"} />
                        <span className="fw-semibold small">{pos.likesCount || 0}</span>
                      </button>
                    </div>

                    {/* Description */}
                    <p className="card-text text-secondary small mt-2 mb-3 lh-sm">
                      {pos.description}
                    </p>

                    {/* Attribute Badges */}
                    <div className="mb-3 d-flex flex-wrap gap-1.5">
                      {pos.templates.map((t, idx) => (
                        <span
                          key={idx}
                          className="badge bg-light text-secondary border border-light-subtle rounded-pill fw-normal px-2.5 py-1"
                        >
                          {t.attribute.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-3 border-top mt-auto">
                    <button
                      className="btn btn-success btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-medium shadow-sm"
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
          <div className="col-12 text-center py-5">
            <div className="text-muted fs-5">No active positions match your criteria.</div>
          </div>
        )}
      </div>
    </div>
  );
};