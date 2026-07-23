import React from "react";
import {FaUserShield, FaSave } from "react-icons/fa";

export const Settings: React.FC = () => {
  const handleRemoveAdminRole = () => {
    const confirm = window.confirm("Are you sure you want to remove your own Administrator role? You will lose all admin access.");
    if (confirm) {
      alert("Admin role removed. Demoting account to Candidate mode...");
      // এখানে পরবর্তীতে আপনার API কল ট্রিপার করবে
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2>System Settings</h2>
        <p className="text-muted">Configure core recruitment engine platforms and account privileges.</p>
      </div>

      <div className="row">
        {/* Left Side: Global Config */}
        <div className="col-md-7 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Platform Configuration</div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Auto-Save Throttle Interval (Seconds)</label>
                <input type="number" className="form-control" defaultValue={7} />
              </div>
              <div className="mb-3">
                <label className="form-label">Social Login Providers Enabled</label>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked id="googleAuth" />
                  <label className="form-check-label" htmlFor="googleAuth">Google OAuth</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked id="fbAuth" />
                  <label className="form-check-label" htmlFor="fbAuth">Facebook Auth</label>
                </div>
              </div>
              <button className="btn btn-primary d-flex align-items-center gap-2">
                <FaSave /> Save System Configurations
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Danger Zone (Self Demotion) */}
        <div className="col-md-5 mb-4">
          <div className="card border-danger shadow-sm">
            <div className="card-header bg-danger text-white fw-bold">Danger Zone</div>
            <div className="card-body text-center py-4">
              <FaUserShield className="fs-1 text-danger mb-3" />
              <h5>Manage Your Admin Role</h5>
              <p className="text-muted small">
                Per requirements, administrators have the permission to forfeit their privileges and remove their own Admin status.
              </p>
              <button onClick={handleRemoveAdminRole} className="btn btn-outline-danger w-100 mt-2">
                Remove My Administrator Role
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};