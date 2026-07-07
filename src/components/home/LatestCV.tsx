const cvs = [
  {
    name: "John Doe",
    position: "Frontend Developer",
    skills: "React • TypeScript • Bootstrap",
  },
  {
    name: "Sarah Khan",
    position: "Backend Developer",
    skills: "NestJS • Prisma • PostgreSQL",
  },
  {
    name: "David Smith",
    position: "Full Stack Developer",
    skills: "React • NestJS • Docker",
  },
];

const LatestCV = () => {
  return (
    <>
      <style>{`
        .cv-card{
          border:none;
          border-radius:18px;
          box-shadow:0 10px 25px rgba(0,0,0,.08);
          transition:.3s;
          height:100%;
        }

        .cv-card:hover{
          transform:translateY(-8px);
        }

        .avatar{
          width:70px;
          height:70px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#0d6efd;
          color:#fff;
          font-size:28px;
          font-weight:bold;
          margin:auto;
        }
      `}</style>

      <section className="py-5">

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              Latest Generated CVs
            </h2>

            <p className="text-muted">
              Recently generated professional resumes.
            </p>

          </div>

          <div className="row g-4">

            {cvs.map((cv) => (

              <div className="col-md-6 col-lg-4" key={cv.name}>

                <div className="card cv-card">

                  <div className="card-body p-4 text-center">

                    <div className="avatar">
                      {cv.name.charAt(0)}
                    </div>

                    <h4 className="mt-3">
                      {cv.name}
                    </h4>

                    <span className="badge bg-primary mb-3">
                      {cv.position}
                    </span>

                    <p className="text-muted">
                      {cv.skills}
                    </p>

                    <button className="btn btn-outline-primary w-100">
                      View CV
                    </button>

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

export default LatestCV;