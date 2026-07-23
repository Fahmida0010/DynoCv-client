import React, { useEffect, useState } from "react";
import { FaBriefcase, FaEye, FaFileMedical, FaSearch } from "react-icons/fa";
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

export const AvailablePositions: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const axiosSecure = useAxiosSecure();

  // ১. ডাটাবেজ থেকে অ্যাক্টিভ পজিশনগুলো লোড করা
  useEffect(() => {
    axiosSecure
      .get("positions") // আপনার ব্যাকএন্ডের পজিশন এন্ডপয়েন্ট
      .then((res) => {
        // শুধুমাত্র অ্যাক্টিভ পজিশন ফিল্টার করে রাখা (স্কিমা অনুযায়ী isActive)
        const activePositions = res.data.filter((pos: Position) => pos.isActive);
        setPositions(activePositions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching positions:", err);
        setLoading(false);
      });
  }, [axiosSecure]);

  // ২. অটোমেটিক সিভি জেনারেশন এবং সাবমিশন প্রসেস
  const handleApplyPosition = async (position: Position) => {
    try {
      Swal.fire({
        title: "Compiling Profile Data...",
        text: "Please wait while we gather your profile attributes.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // ক্যান্ডিডেটের প্রোফাইল, কাস্টম অ্যাট্রিবিউট এবং প্রজেক্ট ডেটা একসাথে ফেচ করা
      const [profileRes, attributesRes, projectsRes] = await Promise.all([
        axiosSecure.get("profile/me"),
        axiosSecure.get("profile/attributes"),
        axiosSecure.get("profile/projects"),
      ]);

      const profileData = profileRes.data;
      const userAttributes = attributesRes.data;
      const projectsData = projectsRes.data;

      // 🧠 Killer Feature Logic: পজিশন টেমপ্লেটের সাথে ইউজারের ডেটা ফিল্টার করা
      const requiredAttributeIds = position.templates.map((t) => t.attribute.id);
      
      const filteredAttributes = userAttributes.filter((attr: any) =>
        requiredAttributeIds.includes(attr.attributeId)
      );

      // ফাইনাল JSON Snapshot অবজেক্ট তৈরি (Prisma-র Json content ফিল্ডের জন্য)
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

      // 🎨 Swal এর মাধ্যমে ডাইনামিক সিভি প্রিভিউ জেনারেট করা
      Swal.fire({
        title: `Tailored CV Preview`,
        html: `
          <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 10px; border: 1px solid #eee;">
            <h5 style="color:#0d6efd;">${cvSnapshot.me.firstName} ${cvSnapshot.me.lastName}</h5>
            <p className="text-muted">📍 ${cvSnapshot.me.location}</p>
            <hr/>
            <h6><strong>Position Specific Attributes:</strong></h6>
            ${
              cvSnapshot.info.length > 0
                ? cvSnapshot.info.map((i: any) => `<p><strong>${i.label}:</strong> ${i.value}</p>`).join("")
                : "<p className='text-muted small'>No custom attributes required for this role.</p>"
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
            // ব্যাকএন্ডে CV স্কিমা অনুযায়ী ডাটা পোস্ট করা
            await axiosSecure.post("dashboard/my-cvs", {
              positionId: position.id,
              content: cvSnapshot, // JSON snapshot object
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

  // সার্চ ফিল্টার লজিক
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
    <div>
      <div className="mb-4">
        <h2>Available Positions</h2>
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
            <div className="col-md-6 mb-4" key={pos.id}>
              <div className="card h-100 border-start border-primary border-4 shadow-sm">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title fw-bold text-dark d-flex align-items-center gap-2">
                      <FaBriefcase className="text-muted" /> {pos.title}
                    </h5>
                    <p className="card-text text-muted small mt-2">{pos.description}</p>

                    <div className="mb-3">
                      {pos.templates.map((t, idx) => (
                        <span key={idx} className="badge bg-light text-dark border me-1">
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
          <div className="text-center p-5 text-muted">No active positions match your criteria.</div>
        )}
      </div>
    </div>
  );
};