import React, { useEffect, useState } from "react";
import { FaBriefcase, FaEye, FaFileMedical, FaSearch, FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiossecure";
import Swal from "sweetalert2";
import Loading from "../../../components/Loader/loading";

interface Position {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  templates: Array<{
    attribute: {
      id: string;
      label: string;
      type: string;
    };
  }>;
  likes?: Array<{ userId: string }>; // ইউজারের লাইক ট্র্যাক করার জন্য
}

export const AvailablePositions: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>(""); // লগইন করা ইউজারের আইডি রাখার জন্য
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    // পজিশন ডেটা এবং কারেন্ট ইউজার একসাথে ফেচ করা
    const fetchData = async () => {
      try {
        const [positionsRes, userRes] = await Promise.all([
          axiosSecure.get("positions"),
          axiosSecure.get("profile/me") // ইউজার আইডি জানার জন্য
        ]);

        const activePositions = positionsRes.data.filter((pos: Position) => pos.isActive);
        setPositions(activePositions);
        
        // ব্যাকএন্ড থেকে আসা ইউজার আইডি সেট করা
        if (userRes.data?.userId) {
          setCurrentUserId(userRes.data.userId);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    
    fetchData();
  }, [axiosSecure]);

  // ❤️ লাইক দেওয়ার ডাইনামিক ফাংশন
  const handleToggleLike = async (positionId: string) => {
    try {
      // সঠিক প্রোডাকশন রাউট এপিআই কল (404 এরর ফিক্স করার জন্য)
      const res = await axiosSecure.post(`positions/${positionId}/like`);
      
      // লাইক সাকসেসফুল হলে ফ্রন্টএন্ড স্টেট আপডেট করা
      setPositions((prevPositions) =>
        prevPositions.map((pos) => {
          if (pos.id === positionId) {
            const hasLiked = pos.likes?.some((l) => l.userId === currentUserId);
            const updatedLikes = hasLiked
              ? pos.likes?.filter((l) => l.userId !== currentUserId) || []
              : [...(pos.likes || []), { userId: currentUserId }];
            return { ...pos, likes: updatedLikes };
          }
          return pos;
        })
      );
    } catch (err: any) {
      console.error("Error toggling like:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message || "Something went wrong while processing your like request.",
      });
    }
  };

  // ২. অটোমেটিক সিভি জেনারেশন এবং সাবমিশন প্রসেস
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

      const profileData = profileRes.data || {};
      const userAttributes = attributesRes.data || [];
      const projectsData = projectsRes.data || [];

      // Safe matching logic
      const requiredAttributeIds = position.templates?.map((t) => t.attribute?.id?.toString().trim()) || [];
      
      const filteredAttributes = userAttributes.filter((attr: any) => {
        const attrIdFromUser = attr.attributeId?.toString().trim();
        const innerAttrId = attr.attribute?.id?.toString().trim();
        return requiredAttributeIds.includes(attrIdFromUser) || requiredAttributeIds.includes(innerAttrId);
      });

      const cvSnapshot = {
        me: {
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          location: profileData.location || "Not Provided",
          photoUrl: profileData.photoUrl || "",
        },
        info: filteredAttributes.map((attr: any) => ({
          label: attr.attribute?.label || "N/A",
          value: attr.value || "",
          type: attr.attribute?.type || "TEXT",
        })),
        projects: projectsData.map((proj: any) => ({
          name: proj.name || "Untitled Project",
          description: proj.description || "",
          tags: proj.tags || [],
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
            ${cvSnapshot.projects.map((p: any) => `<div><strong>${p.name}</strong><br/><small>${(p.tags || []).join(", ")}</small></div>`).join("<br/>")}
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

  return (
    <div>
      <div className="mb-4">
        <h2>Available Positions</h2>
        <p className="text-muted">Browse active recruitment positions and create tailored profiles.</p>
      </div>

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

      <div className="row">
        {filteredPositions.length > 0 ? (
          filteredPositions.map((pos) => {
            // চেক করা ইউজার অলরেডি লাইক দিয়েছে কিনা
            const hasLiked = pos.likes?.some((like) => like.userId === currentUserId);

            return (
              <div className="col-md-6 mb-4" key={pos.id}>
                <div className="card h-100 border-start border-primary border-4 shadow-sm">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title fw-bold text-dark d-flex align-items-center gap-2">
                          <FaBriefcase className="text-muted" /> {pos.title}
                        </h5>
                        
                        {/* ❤️ লাইক বাটন ইন্টারফেস */}
                        <button 
                          className={`btn btn-sm ${hasLiked ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-1`}
                          onClick={() => handleToggleLike(pos.id)}
                        >
                          {hasLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                          <span>{pos.likes?.length || 0}</span>
                        </button>
                      </div>

                      <p className="card-text text-muted small mt-2">{pos.description}</p>

                      <div className="mb-3">
                        {pos.templates?.map((t, idx) => (
                          <span key={idx} className="badge bg-light text-dark border me-1">
                            {t.attribute?.label}
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
            );
          })
        ) : (
          <div className="text-center p-5 text-muted">No active positions match your criteria.</div>
        )}
      </div>
    </div>
  );
};