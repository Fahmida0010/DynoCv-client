import React, { useEffect, useState } from "react";
import { FaBriefcase, FaFileMedical } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiossecure";

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
}

export const FeaturedJobs: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure
      .get("positions")
      .then((res) => {
        const activePositions = res.data.filter((pos: Position) => pos.isActive);

        setPositions(activePositions.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching positions:", err);
        setLoading(false);
      });
  }, [axiosSecure]);

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
            ${cvSnapshot.info.length > 0
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

  if (loading) {
    return (
      <div className="text-center p-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Featured Jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* সেকশন হেডার */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Featured Job Positions</h2>
        <p className="text-muted">Explore some of our most popular open roles and apply instantly.</p>
      </div>

      {/* পজিশন গ্রিড */}
      <div className="row">
        {positions.length > 0 ? (
          positions.map((pos) => (
            <div className="col-md-6 mb-4" key={pos.id}>
              <div className="card h-100 border-start border-primary border-4 shadow-sm bg-white">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title fw-bold text-dark d-flex align-items-center gap-2">
                      <FaBriefcase className="text-primary" /> {pos.title}
                    </h5>
                    <p className="card-text text-muted small mt-2">
                      {pos.description.length > 150
                        ? `${pos.description.substring(0, 150)}...`
                        : pos.description}
                    </p>

                    <div className="mb-3">
                      {pos.templates.map((t, idx) => (
                        <span key={idx} className="badge bg-light text-dark border me-1 small">
                          {t.attribute.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                    <button
                      className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                      onClick={() => handleApplyPosition(pos)}
                    >
                      <FaFileMedical /> Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-5 text-muted col-12">No featured jobs available right now.</div>
        )}
      </div>
    </div>
  );
};