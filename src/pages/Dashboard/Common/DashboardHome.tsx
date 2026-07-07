
// src/pages/Dashboard/Common/DashboardHome.tsx

type Role = "ADMIN" | "RECRUITER" | "CANDIDATE";

// Temporary user
// Later replace with Auth Context / Redux
const user = {
  name: "John Doe",
  role: "CANDIDATE" as Role,
};

const candidateCards = [
  {
    title: "Profile Completion",
    value: "80%",
    icon: "bi bi-person-check",
    color: "primary",
  },
  {
    title: "My CVs",
    value: "4",
    icon: "bi bi-file-earmark-person",
    color: "success",
  },
  {
    title: "Available Positions",
    value: "26",
    icon: "bi bi-briefcase",
    color: "warning",
  },
  {
    title: "Projects",
    value: "7",
    icon: "bi bi-kanban",
    color: "info",
  },
];

const recruiterCards = [
  {
    title: "Total Positions",
    value: "18",
    icon: "bi bi-briefcase",
    color: "primary",
  },
  {
    title: "Active Positions",
    value: "10",
    icon: "bi bi-check-circle",
    color: "success",
  },
  {
    title: "Templates",
    value: "12",
    icon: "bi bi-layout-text-window",
    color: "warning",
  },
  {
    title: "Candidate CVs",
    value: "245",
    icon: "bi bi-file-earmark-text",
    color: "info",
  },
];

const adminCards = [
  {
    title: "Users",
    value: "520",
    icon: "bi bi-people",
    color: "primary",
  },
  {
    title: "Recruiters",
    value: "25",
    icon: "bi bi-person-workspace",
    color: "success",
  },
  {
    title: "Candidates",
    value: "480",
    icon: "bi bi-person",
    color: "warning",
  },
  {
    title: "Positions",
    value: "60",
    icon: "bi bi-briefcase",
    color: "danger",
  },
];

export default function DashboardHome() {
  const cards =
    user.role === "ADMIN"
      ? adminCards
      : user.role === "RECRUITER"
      ? recruiterCards
      : candidateCards;

  return (
    <div className="container-fluid">

      {/* Welcome */}

      <div className="mb-4">
        <h2 className="fw-bold">
          Welcome, {user.name} 👋
        </h2>

        <p className="text-muted mb-0">
          Here is an overview of your dashboard.
        </p>
      </div>

      {/* Cards */}

      <div className="row g-4">

        {cards.map((card) => (

          <div
            className="col-lg-3 col-md-6"
            key={card.title}
          >
            <div className="card shadow-sm border-0 h-100">

              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="text-muted mb-2">
                      {card.title}
                    </p>

                    <h2 className="fw-bold">
                      {card.value}
                    </h2>

                  </div>

                  <div
                    className={`bg-${card.color} text-white rounded-circle d-flex align-items-center justify-content-center`}
                    style={{
                      width: "60px",
                      height: "60px",
                    }}
                  >
                    <i
                      className={`${card.icon} fs-3`}
                    ></i>
                  </div>

                </div>

              </div>

            </div>
          </div>

        ))}

      </div>

      {/* Recent Activity */}

      <div className="card border-0 shadow-sm mt-5">

        <div className="card-header bg-white">
          <h5 className="mb-0">
            Recent Activity
          </h5>
        </div>

        <div className="card-body">

          <ul className="list-group list-group-flush">

            <li className="list-group-item">
              ✅ Profile updated successfully.
            </li>

            <li className="list-group-item">
              📄 New CV created.
            </li>

            <li className="list-group-item">
              💼 New Position added.
            </li>

            <li className="list-group-item">
              🔔 You have 3 new notifications.
            </li>

          </ul>

        </div>

      </div>

    </div>
  );
}

