import React from "react";
import { FaChartPie, FaFileAlt, FaUsers, FaBriefcase, FaClock } from "react-icons/fa";

export const Statistics: React.FC = () => {
  return (
    <div>
      <div className="mb-4">
        <h2>System Statistics</h2>
        <p className="text-muted">Real-time overview of platform activity and public metrics.</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white shadow-sm">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-uppercase small mb-1">Total Candidates</h6>
                <h3 className="mb-0 fw-bold">1,240</h3>
              </div>
              <FaUsers className="fs-1 opacity-50" />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white shadow-sm">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-uppercase small mb-1">Active Positions</h6>
                <h3 className="mb-0 fw-bold">45</h3>
              </div>
              <FaBriefcase className="fs-1 opacity-50" />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white shadow-sm">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-uppercase small mb-1">Total CVs Generated</h6>
                <h3 className="mb-0 fw-bold">3,820</h3>
              </div>
              <FaFileAlt className="fs-1 opacity-50" />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark shadow-sm">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-uppercase small mb-1">New CVs (Last 24h)</h6>
                <h3 className="mb-0 fw-bold">10</h3>
              </div>
              <FaClock className="fs-1 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* System Activity Log Demo */}
      <div className="card shadow-sm">
        <div className="card-header bg-white fw-bold d-flex align-items-center gap-2">
          <FaChartPie className="text-primary" /> Recent Platform Activity
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between align-items-center small">
              Candidate John Doe generated a tailored CV for "Full-Stack Web Engineer"
              <span className="text-muted">5 mins ago</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center small">
              Recruiter Alex Mercer duplicated position "Frontend Developer"
              <span className="text-muted">1 hour ago</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center small">
              New registration: candidate_user_99@example.com
              <span className="text-muted">2 hours ago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};