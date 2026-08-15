import React from "react";

const roles = [
  {
    title: "Candidate",
    icon: "👨‍💻",
    badgeColor: "primary",
    accentBg: "rgba(13, 110, 253, 0.08)",
    features: [
      "Manage Personal Profile",
      "Generate Tailored CVs",
      "Manage Dynamic Projects",
      "Join Platform Discussions",
    ],
  },
  {
    title: "Recruiter",
    icon: "💼",
    badgeColor: "success",
    accentBg: "rgba(25, 135, 84, 0.08)",
    features: [
      "Create & Manage Positions",
      "Design CV Templates",
      "View Candidate Profiles",
      "Manage Attribute Library",
    ],
  },
];

const Roles: React.FC = () => {
  return (
    <>
      <style>{`
        .roles-section {
          background: linear-gradient(180deg, #f8f9fa 0%, #edf2f7 100%);
          padding: 80px 0;
        }

        .role-card {
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 24px;
          background: #ffffff;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          height: 100%;
          position: relative;
        }

        .role-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .role-icon-wrapper {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          margin-bottom: 24px;
          transition: transform 0.3s ease;
        }

        .role-card:hover .role-icon-wrapper {
          transform: scale(1.08) rotate(-4deg);
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          font-size: 0.98rem;
          color: #4a5568;
          font-weight: 500;
        }

        .check-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (max-width: 576px) {
          .roles-section {
            padding: 50px 0;
          }
          
          .role-card {
            border-radius: 18px;
          }
        }
      `}</style>

      <section className="roles-section">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-5 max-w-lg mx-auto">
            <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill mb-2">
              Ecosystem Roles
            </span>
            <h2 className="fw-extrabold text-dark display-6 mb-2">
              Tailored for Every User
            </h2>
            <p className="text-muted fs-6">
              Empowering candidates and recruiters with specialized tools and features.
            </p>
          </div>

          {/* Cards Grid (Centered layout for 2 or 3 items) */}
          <div className="row g-4 justify-content-center">
            {roles.map((role) => (
              <div className="col-12 col-md-6 col-lg-5 col-xl-4" key={role.title}>
                <div className="card role-card">
                  <div className="card-body p-4 p-md-5 d-flex flex-column">
                    {/* Icon */}
                    <div
                      className="role-icon-wrapper"
                      style={{ backgroundColor: role.accentBg }}
                    >
                      {role.icon}
                    </div>

                    {/* Title */}
                    <h3 className={`fw-bold mb-3 text-${role.badgeColor}`}>
                      {role.title}
                    </h3>

                    {/* Divider */}
                    <hr className="my-3 opacity-10" />

                    {/* Features List */}
                    <ul className="feature-list mt-2">
                      {role.features.map((feature) => (
                        <li className="feature-item" key={feature}>
                          <span
                            className={`check-icon bg-${role.badgeColor}-subtle text-${role.badgeColor}`}
                          >
                            ✓
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Roles;