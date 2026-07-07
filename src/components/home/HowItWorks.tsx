const steps = [
  {
    id: 1,
    icon: "👤",
    title: "Create Account",
    desc: "Register as a Candidate or Recruiter."
  },
  {
    id: 2,
    icon: "📝",
    title: "Complete Profile",
    desc: "Fill your profile, skills, attributes and projects."
  },
  {
    id: 3,
    icon: "📄",
    title: "Generate CV",
    desc: "Automatically create tailored CVs for every position."
  },
  {
    id: 4,
    icon: "🚀",
    title: "Apply & Get Hired",
    desc: "Submit your CV and connect with recruiters."
  }
];

const HowItWorks = () => {
  return (
    <>
      <style>{`
        .step-card{
          border:none;
          border-radius:18px;
          padding:35px 20px;
          text-align:center;
          transition:.3s;
          height:100%;
          box-shadow:0 10px 25px rgba(0,0,0,.08);
        }

        .step-card:hover{
          transform:translateY(-8px);
        }

        .step-icon{
          width:80px;
          height:80px;
          margin:auto;
          border-radius:50%;
          background:#0d6efd;
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:2rem;
          margin-bottom:20px;
        }
      `}</style>

      <section className="py-5">

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              How It Works
            </h2>

            <p className="text-muted">
              Build your profile and generate professional CVs in four simple steps.
            </p>

          </div>

          <div className="row g-4">

            {steps.map((step) => (

              <div
                className="col-md-6 col-lg-3"
                key={step.id}
              >

                <div className="step-card">

                  <div className="step-icon">
                    {step.icon}
                  </div>

                  <h4 className="mb-3">
                    {step.title}
                  </h4>

                  <p className="text-muted mb-0">
                    {step.desc}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>
    </>
  );
};

export default HowItWorks;