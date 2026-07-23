import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
      <style>{`
        .hero-section{
          background:linear-gradient(135deg,#f8f9fa,#eef4ff);
          padding:80px 0;
          overflow:hidden;
        }

        .hero-title{
          font-size:clamp(2.2rem,5vw,4.3rem);
          font-weight:800;
          line-height:1.2;
        }

        .hero-text{
          font-size:clamp(1rem,2vw,1.15rem);
          color:#6c757d;
          line-height:1.8;
        }

        .hero-btn{
          border-radius:12px;
          padding:12px 28px;
          font-weight:600;
          transition:.3s;
        }

        .hero-btn:hover{
          transform:translateY(-3px);
        }

        .hero-image{
          width:100%;
          max-width:600px;
          border-radius:20px;
          box-shadow:0 15px 40px rgba(0,0,0,.12);
          animation:float 4s ease-in-out infinite;
        }

        @keyframes float{
          0%{transform:translateY(0)}
          50%{transform:translateY(-12px)}
          100%{transform:translateY(0)}
        }

        .stat-card h3{
          color:#0d6efd;
          font-weight:700;
          margin-bottom:4px;
        }

        @media (max-width:991px){

          .hero-section{
            text-align:center;
            padding:60px 0;
          }

          .hero-image{
            margin-bottom:30px;
          }

        }

        @media (max-width:576px){

          .hero-btn{
            width:100%;
          }

        }
      `}</style>

      <section className="hero-section">
        <div className="container">

          <div className="row align-items-center gy-5">

            {/* Image First on Mobile */}
            <div className="col-12 col-lg-6 order-1 order-lg-2 text-center">

              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="Business Meeting"
                className="img-fluid hero-image"
              />

            </div>

            {/* Text */}
            <div className="col-12 col-lg-6 order-2 order-lg-1">

              <span className="badge bg-primary px-3 py-2 mb-3 fs-6">
                🚀 AI Powered Recruitment Platform
              </span>

              <h1 className="hero-title mb-4">
                Build Your Professional Profile &
                <span className="text-primary">
                  {" "}Generate Tailored CVs
                </span>
              </h1>

              <p className="hero-text mb-4">
                Create reusable professional profiles, manage projects,
                explore opportunities and generate customized CVs
                automatically for every job position.
              </p>

              <div className="d-grid d-sm-flex gap-3 mb-5">

                <Link
                  to="/register"
                  className="btn btn-primary hero-btn"
                >
                  Get Started
                </Link>

                <Link
                  to="/available-positions"
                  className="btn btn-outline-primary hero-btn"
                >
                  Browse Positions
                </Link>

              </div>

              <div className="row text-center g-4">

                <div className="col-4 stat-card">
                  <h3>10K+</h3>
                  <small className="text-muted">
                    Generated CVs
                  </small>
                </div>

                <div className="col-4 stat-card">
                  <h3>250+</h3>
                  <small className="text-muted">
                    Positions
                  </small>
                </div>

                <div className="col-4 stat-card">
                  <h3>1500+</h3>
                  <small className="text-muted">
                    Candidates
                  </small>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>
    </>
  );
};

export default Hero;