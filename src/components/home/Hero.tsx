import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #f8f9fa, #eef4ff);
          padding: 60px 0;
          overflow: hidden;
          min-height: calc(100vh - 80px); /* স্ক্রিনের সাথে সমান্তরাল রাখার জন্য */
          display: flex;
          align-items: center;
        }

        .hero-title {
          font-size: clamp(2rem, 3.5vw, 3.2rem); /* ফন্ট সাইজ রিঅ্যাডজাস্ট করা হয়েছে */
          font-weight: 800;
          line-height: 1.25;
        }

        .hero-text {
          font-size: clamp(0.95rem, 1.5vw, 1.1rem);
          color: #6c757d;
          line-height: 1.7;
        }

        .hero-btn {
          border-radius: 12px;
          padding: 12px 28px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .hero-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.2);
        }

        .hero-image-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .hero-image {
          width: 100%;
          max-width: 550px;
          height: auto;
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }

        .stat-card h3 {
          color: #0d6efd;
          font-weight: 700;
          margin-bottom: 2px;
          font-size: clamp(1.4rem, 2vw, 1.8rem);
        }

        /* Mobile & Tablet Responsiveness */
        @media (max-width: 991px) {
          .hero-section {
            padding: 40px 0;
            min-height: auto;
            text-align: center;
          }

          .hero-image {
            max-width: 100%;
          }

          .hero-btn-group {
            justify-content: center;
          }
        }

        @media (max-width: 576px) {
          .hero-btn {
            width: 100%;
          }
        }
      `}</style>

      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center gy-4 gy-lg-0">
            {/* Text Content (Left on Desktop, Bottom on Mobile) */}
            <div className="col-12 col-lg-6 order-2 order-lg-1">
              <h1 className="hero-title mb-3">
                Build Your Professional Profile &{" "}
                <span className="text-primary">Generate Tailored CVs</span>
              </h1>

              <p className="hero-text mb-4">
                Create reusable professional profiles, manage projects, explore
                opportunities and generate customized CVs automatically for every job
                position.
              </p>

              <div className="d-grid d-sm-flex gap-3 mb-4 hero-btn-group">
                <Link to="/register" className="btn btn-primary hero-btn">
                  Get Started
                </Link>
                <Link
                  to="/available-positions"
                  className="btn btn-outline-primary hero-btn"
                >
                  Browse Positions
                </Link>
              </div>

              <div className="row text-center text-lg-start g-3 pt-2">
                <div className="col-4 stat-card">
                  <h3>10K+</h3>
                  <small className="text-muted fw-medium">Generated CVs</small>
                </div>

                <div className="col-4 stat-card">
                  <h3>250+</h3>
                  <small className="text-muted fw-medium">Positions</small>
                </div>

                <div className="col-4 stat-card">
                  <h3>1500+</h3>
                  <small className="text-muted fw-medium">Candidates</small>
                </div>
              </div>
            </div>

            {/* Image (Right on Desktop, Top on Mobile) */}
            <div className="col-12 col-lg-6 order-1 order-lg-2">
              <div className="hero-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                  alt="Business Meeting"
                  className="img-fluid hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;