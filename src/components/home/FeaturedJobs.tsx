import { Link } from "react-router-dom";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions Ltd.",
    location: "Remote",
    type: "Full Time",
    deadline: "30 Aug 2026",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CodeNest",
    location: "Dhaka",
    type: "Full Time",
    deadline: "05 Sep 2026",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "InnovateX",
    location: "Hybrid",
    type: "Full Time",
    deadline: "15 Sep 2026",
  },
];

const FeaturedJobs = () => {
  return (
    <>
      <style>{`
        .job-card{
          border:none;
          border-radius:16px;
          transition:.3s;
          box-shadow:0 10px 25px rgba(0,0,0,.08);
        }

        .job-card:hover{
          transform:translateY(-8px);
        }

        .job-badge{
          font-size:.8rem;
        }
      `}</style>

      <section className="py-5 bg-light">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">Featured Positions</h2>
            <p className="text-muted">
              Discover the latest career opportunities.
            </p>
          </div>

          <div className="row g-4">

            {jobs.map((job) => (
              <div className="col-md-6 col-lg-4" key={job.id}>

                <div className="card job-card h-100">

                  <div className="card-body">

                    <span className="badge bg-primary job-badge mb-3">
                      {job.type}
                    </span>

                    <h4>{job.title}</h4>

                    <p className="text-muted mb-2">
                      🏢 {job.company}
                    </p>

                    <p className="text-muted mb-2">
                      📍 {job.location}
                    </p>

                    <p className="text-muted">
                      ⏳ Deadline: {job.deadline}
                    </p>

                    <Link
                      to="/positions"
                      className="btn btn-primary w-100 mt-3"
                    >
                      View Position
                    </Link>

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

export default FeaturedJobs;