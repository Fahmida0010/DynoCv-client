import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import business from "../../../assets/business.jpg";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiossecure";

export const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Profile & Dynamic Attributes States
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal Control States
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showSalesforceModal, setShowSalesforceModal] = useState<boolean>(false);
  const [sfLoading, setSfLoading] = useState<boolean>(false);

  // Form Field States
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    location: "",
    photoUrl: "",
    bio: "",
    techStack: "",
    experience: "",
    jobPreference: "FULL_TIME",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // Salesforce Form State
  const [salesforceForm, setSalesforceForm] = useState({
    companyName: "",
    phone: "",
    description: "",
  });

  const loadCompleteProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);

      // axiosSecure axios instance ব্যবহার করায় .data থেকে রেজাল্ট আসবে
      const profileRes = await axiosSecure.get("/profile/me");
      const profile = profileRes.data;

      const attrRes = await axiosSecure.get("/profile/attributes");
      const attributes = attrRes.data;

      const attrMap: any = {};
      if (Array.isArray(attributes)) {
        attributes.forEach((item: any) => {
          if (item.attribute && item.attribute.label) {
            attrMap[item.attribute.label.toLowerCase()] = item.value;
          }
        });
      }

      const fullData = {
        ...profile,
        bio: attrMap["bio"] || "",
        techStack: attrMap["techstack"] || "",
        experience: attrMap["experience"] || "",
        jobPreference: attrMap["jobpreference"] || "FULL_TIME",
      };

      setProfileData(fullData);

      setEditForm({
        firstName: fullData.firstName || user.firstName || "",
        lastName: fullData.lastName || user.lastName || "",
        location: fullData.location || "",
        photoUrl: fullData.photoUrl || user.photo || "",
        bio: fullData.bio,
        techStack: fullData.techStack,
        experience: fullData.experience,
        jobPreference: fullData.jobPreference,
      });

      setSalesforceForm((prev) => ({
        ...prev,
        description: fullData.bio || "",
      }));
    } catch (err: any) {
      console.error("Failed to load profile context:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompleteProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h3>User not found!</h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <h5 className="mt-2">Loading Profile Specifications...</h5>
      </div>
    );
  }

  const isCandidate = user.role === "CANDIDATE";
  const isRecruiter = user.role === "RECRUITER";
  const isAdmin = user.role === "ADMIN";

  // ২. প্রোফাইল আপডেট সাবমিট হ্যান্ডলার (axiosSecure ব্যবহার করা হয়েছে)
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosSecure.put("/profile/update", editForm);

      Swal.fire({
        icon: "success",
        title: "Profile Updated Successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowProfileModal(false);
      loadCompleteProfile();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  // ৩. পাসওয়ার্ড পরিবর্তন সাবমিট হ্যান্ডলার (axiosSecure ব্যবহার করা হয়েছে)
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosSecure.put("/profile/change-password", passwordForm);

      Swal.fire({
        icon: "success",
        title: "Password Changed!",
        text: "Credentials updated security verified.",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Security Alert",
        text: err.response?.data?.message || "Current password mismatch or invalid input",
      });
    }
  };

  // ৪. Salesforce CRM ইম্পোর্ট/সিংকিং হ্যান্ডলার
  const handleSalesforceSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setSfLoading(true);

    try {
      const payload = {
        firstName: profileData?.firstName || user.firstName || "User",
        lastName: profileData?.lastName || user.lastName || "Name",
        email: user.email,
        companyName: salesforceForm.companyName,
        phone: salesforceForm.phone,
        description: salesforceForm.description,
      };

      const response = await axiosSecure.post("/salesforce/sync", payload);
      const data = response.data;

      Swal.fire({
        icon: "success",
        title: "Synced with Salesforce!",
        text: `Account ID: ${data.accountId} | Contact ID: ${data.contactId}`,
      });

      setShowSalesforceModal(false);
      setSalesforceForm({ companyName: "", phone: "", description: "" });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Salesforce Integration Error",
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setSfLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        {/* Cover Image */}
        <img
          src={business}
          alt="Cover"
          className="card-img-top"
          style={{ height: "280px", objectFit: "cover" }}
        />

        <div className="card-body text-center position-relative">
          {/* Profile Image */}
          <img
            src={profileData?.photoUrl || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt="Profile"
            className="rounded-circle border border-4 border-white shadow position-absolute start-50 translate-middle-x"
            style={{
              width: "140px",
              height: "140px",
              objectFit: "cover",
              top: "-70px",
              background: "#fff",
            }}
          />

          <div style={{ marginTop: "80px" }}>
            <h2 className="fw-bold mb-1">
              {profileData?.firstName} {profileData?.lastName}
            </h2>
            <p className="text-muted mb-2">{user.email}</p>

            {/* Role Badge */}
            <span className={`badge fs-6 px-3 py-2 mb-2 ${isAdmin ? "bg-danger" : isRecruiter ? "bg-warning text-dark" : "bg-success"}`}>
              {user.role}
            </span>

            {profileData?.location && (
              <p className="text-secondary small mt-1">
                <i className="bi bi-geo-alt-fill me-1"></i> {profileData.location}
              </p>
            )}
          </div>

          <hr className="my-4" />

          {/* ক্যান্ডিডেটের ডাইনামিক অ্যাট্রিবিউট ডেটা প্রোফাইল পেজে প্রদর্শন */}
          {isCandidate && profileData && (
            <div className="text-start bg-light p-4 rounded-3 mb-4 mx-md-4 border border-light-subtle">
              <h5 className="fw-bold mb-3 text-dark border-bottom pb-2">Professional Specifications</h5>

              <div className="mb-3">
                <h6 className="fw-bold text-primary mb-1">Biography / About</h6>
                <p className="text-muted mb-0">{profileData.bio || "No summary added yet."}</p>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <h6 className="fw-bold text-primary mb-1">Tech Stack Keywords</h6>
                  <p className="text-muted mb-0">{profileData.techStack || "Not added"}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold text-primary mb-1">Experience Level</h6>
                  <p className="text-muted mb-0">
                    {profileData.experience ? `${profileData.experience} Years` : "Not specified"}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold text-primary mb-1">Job Preference</h6>
                  <p className="mb-0">
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1">
                      {profileData.jobPreference ? profileData.jobPreference.replace("_", " ") : "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* User ID Core Details */}
          <div className="row text-start px-md-4">
            <div className="col-md-6 mb-3">
              <h6 className="fw-bold text-primary">User ID</h6>
              <p className="text-muted small">{user.id}</p>
            </div>
            <div className="col-md-6 mb-3">
              <h6 className="fw-bold text-primary">Role Permissions</h6>
              <p className="text-muted">{user.role}</p>
            </div>
          </div>

          {/* Buttons Area */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            {(isCandidate || isAdmin) && (
              <button className="btn btn-primary px-4" onClick={() => setShowProfileModal(true)}>
                <i className="bi bi-pencil-square me-2"></i> Update Profile
              </button>
            )}

            <button className="btn btn-outline-secondary px-4" onClick={() => setShowPasswordModal(true)}>
              <i className="bi bi-key me-2"></i> Change Password
            </button>

            {/* Salesforce Integration Action (Accessible for any user or admin) */}
            <button className="btn btn-info text-white px-4" onClick={() => setShowSalesforceModal(true)}>
              <i className="bi bi-cloud-arrow-up-fill me-2"></i> Sync to Salesforce CRM
            </button>

            {isRecruiter && (
              <button className="btn btn-warning text-dark px-4" onClick={() => navigate("/dashboard/positions")}>
                <i className="bi bi-briefcase-fill me-2"></i> Manage Positions
              </button>
            )}
          </div>
        </div>
      </div>

      {/* -------------------- ১. PROFILE UPDATE MODAL -------------------- */}
      {showProfileModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">Edit Profile Specifications</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowProfileModal(false)}></button>
              </div>
              <form onSubmit={handleProfileUpdate}>
                <div className="modal-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-secondary">First Name</label>
                      <input type="text" className="form-control" required value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-secondary">Last Name</label>
                      <input type="text" className="form-control" required value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-secondary">Location</label>
                      <input type="text" className="form-control" placeholder="e.g. Dhaka, Bangladesh" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-secondary">Photo URL</label>
                      <input type="url" className="form-control" placeholder="Image web link" value={editForm.photoUrl} onChange={(e) => setEditForm({ ...editForm, photoUrl: e.target.value })} />
                    </div>

                    {isCandidate && (
                      <>
                        <div className="col-12">
                          <label className="form-label small fw-bold text-secondary">Bio / About Profile</label>
                          <textarea className="form-control" rows={3} placeholder="Write a summary about your skills..." value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}></textarea>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-secondary">Tech Stack</label>
                          <input type="text" className="form-control" placeholder="React.js, Node.js, Next.js" value={editForm.techStack} onChange={(e) => setEditForm({ ...editForm, techStack: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-secondary">Years of Experience</label>
                          <input type="number" min="0" className="form-control" placeholder="e.g. 3" value={editForm.experience} onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })} />
                        </div>
                        <div className="col-12">
                          <label className="form-label small fw-bold text-secondary">Job Preference Type</label>
                          <select className="form-select" value={editForm.jobPreference} onChange={(e) => setEditForm({ ...editForm, jobPreference: e.target.value })}>
                            <option value="REMOTE">Remote Job</option>
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="CONTRACTUAL">Contractual</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Update Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- ২. CHANGE PASSWORD MODAL -------------------- */}
      {showPasswordModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">Update Account Password</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPasswordModal(false)}></button>
              </div>
              <form onSubmit={handlePasswordUpdate}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Current Security Password</label>
                    <input type="password" required className="form-control" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">New Target Password</label>
                    <input type="password" required minLength={6} className="form-control" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Close</button>
                  <button type="submit" className="btn btn-dark px-4">Commit Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- ৩. SALESFORCE CRM INTEGRATION MODAL -------------------- */}
      {showSalesforceModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title fw-bold">Sync Profile with Salesforce CRM</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowSalesforceModal(false)}></button>
              </div>
              <form onSubmit={handleSalesforceSync}>
                <div className="modal-body p-4">
                  <p className="small text-muted mb-3">
                    This action creates an Account & linked Contact record inside Salesforce for <strong>{user.email}</strong>.
                  </p>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Company / Organization Name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Acme Corp / Self Employee"
                      value={salesforceForm.companyName}
                      onChange={(e) => setSalesforceForm({ ...salesforceForm, companyName: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Contact Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+8801700000000"
                      value={salesforceForm.phone}
                      onChange={(e) => setSalesforceForm({ ...salesforceForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Account Description / Notes</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Additional details for CRM notes..."
                      value={salesforceForm.description}
                      onChange={(e) => setSalesforceForm({ ...salesforceForm, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowSalesforceModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-info text-white px-4" disabled={sfLoading}>
                    {sfLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Syncing...
                      </>
                    ) : (
                      "Send to Salesforce"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
