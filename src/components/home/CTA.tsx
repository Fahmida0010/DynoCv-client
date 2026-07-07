import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <>
      <style>{`
        .cta-section{
          background:linear-gradient(135deg,#0d6efd,#4f8dfd);
          color:white;
          border-radius:25px;
          overflow:hidden;
        }

        .cta-btn{
          border-radius:12px;
          padding:14px 35px;
          font-weight:600;
          transition:.3s;
        }

        .cta-btn:hover{
          transform:translateY(-3px);
        }

        @media(max-width:768px){
          .cta-section{
            text-align:center;
          }

          .cta-btn{
            width:100%;
          }
        }
      `}</style>

      <section className="py-5">

        <div className="container">

          <div className="cta-section p-5">

            <div className="row align-items-center g-4">

              <div className="col-lg-8">

                <h2 className="fw-bold mb-3">
                  Ready to Build Your Professional Career?
                </h2>

                <p className="mb-0 fs-5 opacity-75">
                  Join thousands of candidates and recruiters using our smart recruitment platform to build professional profiles and generate tailored CVs.
                </p>

              </div>

              <div className="col-lg-4 text-lg-end">

                <Link
                  to="/register"
                  className="btn btn-light btn-lg cta-btn me-lg-3 mb-3 mb-lg-0"
                >
                  Get Started
                </Link>

                <Link
                  to="/positions"
                  className="btn btn-outline-light btn-lg cta-btn"
                >
                  Browse Jobs
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>
    </>
  );
};

export default CTA;