import React, { useEffect, useState } from "react";
import axios from "axios";

interface CVData {
  id: string;
  content: {
    me: {
      firstName: string;
      lastName: string;
      location?: string;
    };
    info: Array<{ label: string; value: string; type: string }>;
    projects: Array<{ name: string; description: string; tags: string[] }>;
  };
  user: {
    firstName: string;
    lastName: string;
    photo?: string | null;
  };
  position: {
    title: string;
  };
}

const LatestCV: React.FC = () => {
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // এখানে আপনার প্রজেক্টের আসল ব্যাকএন্ড বেস ইউআরএল (যেমন: http://localhost:5000/api/) চেক করে বসিয়ে দিন
    axios
      .get("http://localhost:5000/api/dashboard/my-cvs/latest?limit=3") 
      .then((res) => {
        // রেসপন্স ডাটা অ্যারে কিনা চেক করা হচ্ছে, অবজেক্ট হলে .data প্রোপার্টি থেকে অ্যারে খোঁজা হচ্ছে
        const incomingData = Array.isArray(res.data)
          ? res.data
          : (res.data?.data && Array.isArray(res.data.data) ? res.data.data : []);

        setCvs(incomingData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching latest CVs:", err);
        setCvs([]); // এরর হলেও অ্যাপ ক্র্যাশ করবে না, খালি অ্যারে সেট হবে
        setLoading(false);
      });
  }, []); // ডিপেনডেন্সি অ্যারে ক্লিন রাখা হলো

  if (loading) {
    return (
      <div className="text-center p-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Latest CVs...</span>
        </div>
      </div>
    );
  }

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

        .avatar-box{
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
          overflow: hidden;
        }
        
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>

      <section className="py-5 bg-light-subtle">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Latest Generated CVs</h2>
            <p className="text-muted">Recently generated professional resumes tailored to specific roles.</p>
          </div>

          <div className="row g-4">
            {Array.isArray(cvs) && cvs.length > 0 ? (
              cvs.map((cv) => {
                const fullName = `${cv.user?.firstName || ""} ${cv.user?.lastName || ""}`;
                
                // JSON কনটেন্টে প্রজেক্টের যে ট্যাগগুলো আছে সেগুলোকে স্কিলস হিসেবে স্ট্রিং বানানোর লজিক
                const allTags = cv.content?.projects?.flatMap(p => p.tags) || [];
                const distinctTags = Array.from(new Set(allTags)).slice(0, 4); 
                const skillsDisplay = distinctTags.length > 0 ? distinctTags.join(" • ") : "Custom Compiled Attributes";

                return (
                  <div className="col-md-6 col-lg-4" key={cv.id}>
                    <div className="card cv-card bg-white">
                      <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                        <div>
                          <div className="avatar-box">
                            {cv.user?.photo ? (
                              <img src={cv.user.photo} alt={fullName} className="avatar-img" />
                            ) : (
                              cv.user?.firstName?.charAt(0) || "U"
                            )}
                          </div>

                          <h4 className="mt-3 text-dark fw-semibold">
                            {fullName}
                          </h4>

                          <span className="badge bg-primary mb-3 px-3 py-2 rounded-pill">
                            {cv.position?.title || "Position"}
                          </span>

                          <p className="text-muted small text-truncate">
                            {skillsDisplay}
                          </p>
                        </div>

                        <button className="btn btn-outline-primary w-100 mt-3">
                          View CV
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-5 text-muted col-12">No CVs generated yet.</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default LatestCV;