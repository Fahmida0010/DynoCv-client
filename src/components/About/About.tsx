import React from "react";
import { 
  FaRocket, 
  FaCogs, 
  FaLayerGroup, 
  FaUserTie, 
  FaUserGraduate, 
  FaUsers, 
  FaBriefcase, 
  FaClock,
  FaShieldAlt, 
  FaLock 
} from "react-icons/fa";

export const About: React.FC = () => {
  const killerFeatures = [
    {
      icon: <FaLayerGroup className="text-primary fs-3" />,
      title: "Reusable Attribute Library",
      description: "Define professional attributes once (e.g., IELTS, Tech Stack, Remote Availability) and reuse them seamlessly across multiple positions and dynamic CVs."
    },
    {
      icon: <FaCogs className="text-primary fs-3" />,
      title: "Customizable Templates",
      description: "Recruiters can architect position-specific dynamic CV templates on the fly by picking required criteria directly from the global attribute pool."
    },
    {
      icon: <FaRocket className="text-primary fs-3" />,
      title: "Automated CV Snapshot Assembly",
      description: "No manual compilation needed! The platform automatically extracts candidate profile metrics and matches them with recruiter specifications into an unmodifiable JSON snapshot."
    }
  ];

  const coreRoles = [
    {
      icon: <FaUserGraduate className="text-primary fs-4" />,
      title: "Candidates",
      description: "Maintain a dynamic professional profile, track projects using interactive Markdown descriptions, and generate tailored CV snapshots for accessible open positions."
    },
    {
      icon: <FaUserTie className="text-primary fs-4" />,
      title: "Recruiters",
      description: "Manage a shared pool of job positions and attributes, customize requirements templates, and leverage full-text search to review candidate pipelines in read-only mode."
    }
  ];

  const stats = [
    { icon: <FaUsers className="text-primary fs-3 mb-2" />, count: "10,000+", label: "Verified Candidates" },
    { icon: <FaBriefcase className="text-primary fs-3 mb-2" />, count: "500+", label: "Active Job Postings" },
    { icon: <FaClock className="text-primary fs-3 mb-2" />, count: "60%", label: "Reduction in Time-to-Hire" }
  ];

  return (
    <div className="container py-5" style={{ maxWidth: "1000px" }}>
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="fw-extrabold text-dark display-5 mb-3">
          About <span className="text-primary fw-bold">DynoCV</span>
        </h1>
        <p className="text-muted mx-auto fs-5" style={{ maxWidth: "750px", lineHeight: "1.6" }}>
          A next-generation web-based recruitment platform built to eliminate repetitive resume building. 
          DynoCV empowers candidates with reusable profiles and provides recruiters with highly structured, automated evaluation tools.
        </p>
      </div>

      {/* 🚀 Platform Features Section */}
      <div className="my-5 pt-4 p-4">
        <h3 className="fw-bold mb-4 text-center text-dark">Platform Features</h3>
        <div className="row g-4">
          {killerFeatures.map((feature, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="card h-100 border-0 shadow-sm p-4 text-center bg-white rounded-3">
                <div className="mb-3 d-inline-block p-3 bg-primary-subtle rounded-circle mx-auto">
                  {feature.icon}
                </div>
                <h5 className="fw-bold card-title mb-2 text-dark">{feature.title}</h5>
                <p className="card-text text-muted small mb-0" style={{ lineHeight: "1.5" }}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 👥 Role Architecture */}
      <div className="my-5 pt-4 p-4">
        <h3 className="fw-bold mb-4 text-center text-dark">Robust Role Architecture</h3>
        <div className="row g-4 justify-content-center">
          {coreRoles.map((role, idx) => (
            <div className="col-md-6" key={idx}>
              <div className="card h-100 border-0 shadow-sm p-2 bg-white rounded-3">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="p-2 bg-primary-subtle rounded-3 text-primary d-flex align-items-center justify-content-center">
                      {role.icon}
                    </div>
                    <h5 className="fw-bold mb-0 text-dark">{role.title}</h5>
                  </div>
                  <p className="card-text text-muted small mb-0" style={{ lineHeight: "1.5" }}>{role.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📊 Impact & Stats Section */}
      <div className="my-5 py-4 p-4 bg-light rounded-3 shadow-sm text-center border-0">
        <div className="row g-4 justify-content-center">
          {stats.map((stat, idx) => (
            <div className="col-md-4 col-sm-6" key={idx}>
              <div className="p-2">
                {stat.icon}
                <h3 className="fw-bold text-dark mb-0">{stat.count}</h3>
                <span className="text-muted small fw-semibold">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🛡️ Enterprise Trust & Security Section */}
      <div className="my-5 p-4 bg-white border border-light shadow-sm rounded-3">
        <div className="row align-items-center g-4">
          <div className="col-md-4 text-center text-md-start ps-md-3">
            <span className="badge bg-primary-subtle text-primary mb-2 px-3 py-1.5 rounded-pill fw-semibold small">Enterprise Grade</span>
            <h4 className="fw-bold text-dark mb-2">Data Integrity & Security</h4>
            <p className="text-muted small mb-0">
              We ensure that candidate talent profiles and recruiter pipelines are tamper-proof and highly secure.
            </p>
          </div>
          <div className="col-md-8">
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="d-flex gap-3 align-items-start p-2">
                  <div className="text-primary mt-1"><FaLock className="fs-5" /></div>
                  <div>
                    <h6 className="fw-bold mb-1 text-dark">Immutable Snapshots</h6>
                    <p className="text-muted small mb-0" style={{ fontSize: "0.85rem" }}>CV metrics are locked in JSON format once submitted, preventing alteration.</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex gap-3 align-items-start p-2">
                  <div className="text-primary mt-1"><FaShieldAlt className="fs-5" /></div>
                  <div>
                    <h6 className="fw-bold mb-1 text-dark">Read-Only Pipeline</h6>
                    <p className="text-muted small mb-0" style={{ fontSize: "0.85rem" }}>Recruiter features strict role-based access control to safeguard privacy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* 🎯 Our Vision Section */}
<div 
  className="my-5 p-5 rounded-3 shadow text-center" 
  style={{ backgroundColor: "#FFF0F5", border: "1px solid #FFE4E1" }} 
>
  <h3 className="fw-bold mb-3 text-dark">The Vision Behind DynoCV</h3>
  <p className="mx-auto text-secondary fs-6 mb-0" style={{ maxWidth: "750px", lineHeight: "1.7", fontSize: "0.95rem" }}>
    Traditional recruitment is broken by repetitive applications and unstructured PDF resumes that ATS software fails to read accurately. 
    <strong> DynoCV</strong> bridges this gap by turning static resumes into structural, queryable data models. 
    We make hiring completely transparent, data-driven, and lightning-fast for global-scale enterprises and scaling startups alike.
  </p>
</div>
    </div>
  );
};