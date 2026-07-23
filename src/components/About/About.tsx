import React from "react";
import { 
  FaRocket, 
  FaCogs, 
  FaLayerGroup, 
  FaUserTie, 
  FaUserShield, 
  FaUserGraduate, 
  FaCode, 
  FaDatabase, 
  FaShieldAlt 
} from "react-icons/fa";

export const About: React.FC = () => {
  const killerFeatures = [
    {
      icon: <FaLayerGroup className="text-primary fs-3" />,
      title: "Reusable Attribute Library",
      description: "Define professional attributes once (e.g., IELTS, Tech Stack, Remote Availability) and reuse them seamlessly across multiple positions and dynamic CVs."
    },
    {
      icon: <FaCogs className="text-success fs-3" />,
      title: "Customizable Templates",
      description: "Recruiters can architect position-specific dynamic CV templates on the fly by picking required criteria directly from the global attribute pool."
    },
    {
      icon: <FaRocket className="text-warning fs-3" />,
      title: "Automated CV Snapshot Assembly",
      description: "No manual compilation needed! The platform automatically extracts candidate profile metrics and matches them with recruiter specifications into an unmodifiable JSON snapshot."
    }
  ];

  const coreRoles = [
    {
      icon: <FaUserGraduate className="text-info fs-4" />,
      title: "Candidates",
      description: "Maintain a dynamic professional profile, track projects using interactive Markdown descriptions, and generate tailored CV snapshots for accessible open positions."
    },
    {
      icon: <FaUserTie className="text-primary fs-4" />,
      title: "Recruiters",
      description: "Manage a shared pool of job positions and attributes, customize requirements templates, and leverage full-text search to review candidate pipelines in read-only mode."
    },
    {
      icon: <FaUserShield className="text-danger fs-4" />,
      title: "Administrators",
      description: "Unrestricted systemic access with masquerading capabilities to view, audit, and modify any user profile, positions, or roles to maintain platform integrity."
    }
  ];

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="text-center mb-5 pb-3">
        <h1 className="fw-bold text-dark display-5">
          About <span className="text-primary">DynoCV</span>
        </h1>
        <p className="text-muted mx-auto fs-5" style={{ maxWidth: "700px" }}>
          A next-generation web-based recruitment platform built to eliminate repetitive resume building. DynoCV empowers candidates with reusable profiles and provides recruiters with highly structured, automated evaluation tools.
        </p>
      </div>

      <hr className="my-5" />

      {/* 🚀 Killer Features Section */}
      <div className="mb-5">
        <h3 className="fw-bold mb-4 text-center">Platform Killer Features</h3>
        <div className="row g-4">
          {killerFeatures.map((feature, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="card h-100 border-0 shadow-sm p-3 text-center bg-white">
                <div className="mb-3 d-inline-block p-3 bg-light rounded-circle mx-auto">
                  {feature.icon}
                </div>
                <h5 className="fw-bold card-title">{feature.title}</h5>
                <p className="card-text text-muted small">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-5" />

      {/* 👥 Role Architecture */}
      <div className="mb-5">
        <h3 className="fw-bold mb-4 text-center">Robust Role Architecture</h3>
        <div className="row g-4">
          {coreRoles.map((role, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="card h-100 border-top border-4 border-dark-subtle shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    {role.icon}
                    <h5 className="fw-bold mb-0">{role.title}</h5>
                  </div>
                  <p className="card-text text-muted small">{role.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-5" />

      {/* 💻 Technical Specifications */}
      <div>
        <h3 className="fw-bold mb-4 text-center">Advanced System Integrity</h3>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card bg-dark text-light p-4 shadow">
              <h5 className="text-primary fw-bold mb-3 d-flex align-items-center gap-2">
                <FaCode /> Modern Tech Stack Integration
              </h5>
              <p className="small text-white-50">
                DynoCV leverages <strong className="text-light">React (TypeScript)</strong> and <strong className="text-light">Bootstrap</strong> on the frontend for building type-safe, fluid responsive layouts. The enterprise-grade backend is engineered using <strong className="text-light">NestJS</strong>, utilizing <strong className="text-light">Prisma ORM</strong> and <strong className="text-light">PostgreSQL</strong> for highly secure data transactions.
              </p>
              
              <div className="row mt-4 pt-3 border-top border-secondary g-3">
                <div className="col-md-6 d-flex align-items-start gap-2">
                  <FaShieldAlt className="text-warning mt-1" />
                  <div>
                    <h6 className="mb-1 text-light">Optimistic Locking & Auto-Save</h6>
                    <p className="small text-white-50 mb-0">Profile states are securely continuously tracked locally and auto-saved using an explicit versioning engine to safely intercept data concurrency conflicts.</p>
                  </div>
                </div>
                <div className="col-md-6 d-flex align-items-start gap-2">
                  <FaDatabase className="text-info mt-1" />
                  <div>
                    <h6 className="mb-1 text-light">JSON Data Isolation</h6>
                    <p className="small text-white-50 mb-0">Dynamic submissions are completely isolated as atomic PostgreSQL Json snapshots, preventing historic CVs from breaking when user profiles change.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};