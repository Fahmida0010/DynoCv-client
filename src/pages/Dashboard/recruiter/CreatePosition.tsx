import React, { useState } from "react";
import { FaSave, FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const CreatePosition: React.FC = () => {
  const navigate = useNavigate();
  
  // ডেমো লাইব্রেরি অ্যাট্রিবিউটস (টোগল বা সিলেক্ট করার জন্য)
  const availableAttributes = [
    { id: "attr-1", label: "IELTS Score", category: "Info" },
    { id: "attr-2", label: "Remote Work Availability", category: "Info" },
    { id: "attr-3", label: "Presentation Skills", category: "Info" },
    { id: "attr-4", label: "GitHub Profile URL", category: "Social" },
  ];

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-light border btn-sm" onClick={() => navigate("/dashboard/positions")}>
          <FaArrowLeft /> Back
        </button>
        <h2 className="mb-0">Create New Position</h2>
      </div>

      <div className="row">
        {/* Left Side: Position Details */}
        <div className="col-lg-7 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Position Details</div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Position Title</label>
                <input type="text" className="form-control" placeholder="e.g., Senior Node.js Developer" />
              </div>
              <div className="mb-3">
                <label className="form-label">Job Description</label>
                <textarea className="form-control" rows={5} placeholder="Write position requirements..."></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Access Rules (Allowed Candidates/Groups)</label>
                <select className="form-select">
                  <option>Public (All Authenticated Candidates)</option>
                  <option>Internal/Restricted Group</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: CV Template Configuration */}
        <div className="col-lg-5 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Configure CV Template (Select Attributes)</div>
            <div className="card-body">
              <p className="text-muted small">Choose which attributes from the library are required for this position's CV.</p>
              
              <div className="list-group mb-4">
                {availableAttributes.map((attr) => (
                  <label className="list-group-item d-flex gap-2" key={attr.id}>
                    <input className="form-check-input flex-shrink-0" type="checkbox" value="" />
                    <span>
                      <strong>{attr.label}</strong>
                      <small className="d-block text-muted">{attr.category}</small>
                    </span>
                  </label>
                ))}
              </div>

              <button className="btn btn-outline-secondary btn-sm w-100 mb-3 d-flex align-items-center justify-content-center gap-2">
                <FaPlus /> Create Custom Attribute
              </button>

              <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                <FaSave /> Save Position & Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};