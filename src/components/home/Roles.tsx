const roles = [
  {
    title: "Candidate",
    icon: "👨‍💻",
    color: "primary",
    features: [
      "Manage Personal Profile",
      "Generate CV",
      "Manage Projects",
      "Join Discussions",
    ],
  },
  {
    title: "Recruiter",
    icon: "💼",
    color: "success",
    features: [
      "Create Positions",
      "Manage Templates",
      "View Candidate CVs",
      "Manage Attribute Library",
    ],
  },
 
];

const Roles = () => {
  return (
    <>
      <style>{`
        .role-card{
          border:none;
          border-radius:18px;
          box-shadow:0 10px 25px rgba(0,0,0,.08);
          transition:.3s;
          height:100%;
        }

        .role-card:hover{
          transform:translateY(-8px);
        }

        .role-icon{
          font-size:3rem;
        }

        .role-card ul{
          padding-left:20px;
        }

        .role-card li{
          margin-bottom:10px;
        }
      `}</style>

      <section className="py-5 bg-light">

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              User Roles
            </h2>

            <p className="text-muted">
              Different roles with different permissions.
            </p>

          </div>

          <div className="row g-4">

            {roles.map((role) => (

              <div className="col-md-6 col-lg-4" key={role.title}>

                <div className="card role-card">

                  <div className="card-body p-4">

                    <div className="role-icon mb-3">
                      {role.icon}
                    </div>

                    <h3 className={`text-${role.color}`}>
                      {role.title}
                    </h3>

                    <ul className="mt-4">

                      {role.features.map((feature) => (

                        <li key={feature}>
                          {feature}
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