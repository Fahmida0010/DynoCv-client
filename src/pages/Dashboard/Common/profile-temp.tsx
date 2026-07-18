import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import business from "../../../assets/business.jpg"
const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h3>User not found!</h3>
      </div>
    );
  }

  const isCandidate = user.role === "CANDIDATE";
  const isRecruiter = user.role === "RECRUITER";
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">

        {/* Cover Image */}
        <img
          src={business}
          alt="Cover"
          className="card-img-top"
          style={{ height: "280px", objectFit: "cover" }}
        />

        <div className="card-body text-center">

          {/* Profile Image */}
          <img
            src={
              user.photo ??
              "https://i.ibb.co/4pDNDk1/avatar.png"
            }
            alt="Profile"
            className="rounded-circle border border-4 border-white shadow"
            style={{
              width: "140px",
              height: "140px",
              objectFit: "cover",
              marginTop: "-90px",
              background: "#fff",
            }}
          />

          <h2 className="fw-bold mt-3">
            {user.firstName} {user.lastName}
          </h2>

          <p className="text-muted mb-3">{user.email}</p>

          {/* Role Badge */}
          <span
            className={`badge fs-6 px-3 py-2 ${
              isAdmin
                ? "bg-danger"
                : isRecruiter
                ? "bg-warning text-dark"
                : "bg-success"
            }`}
          >
            {user.role}
          </span>

          <hr className="my-4" />

          {/* User Info */}
          <div className="row text-start">

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold text-primary">User ID</h6>
              <p className="text-muted">{user.id}</p>
            </div>

            <div className="col-md-6 mb-3">
              <h6 className="fw-bold text-primary">Role</h6>
              <p className="text-muted">{user.role}</p>
            </div>

          </div>

          {/* Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">

            {(isCandidate || isAdmin) && (
              <button
                className="btn btn-primary px-4"
                onClick={() => navigate("/dashboard/update-profile")}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Update Profile
              </button>
            )}

            <button
              className="btn btn-outline-secondary px-4"
              onClick={() => navigate("/dashboard/update-password")}
            >
              <i className="bi bi-key me-2"></i>
              Change Password
            </button>

            {isRecruiter && (
              <button
                className="btn btn-warning text-dark px-4"
                onClick={() => navigate("/dashboard/positions")}
              >
                <i className="bi bi-briefcase-fill me-2"></i>
                Manage Positions
              </button>
            )}

            {isAdmin && (
              <button
                className="btn btn-danger px-4"
                onClick={() => navigate("/dashboard/manage-users")}
              >
                <i className="bi bi-people-fill me-2"></i>
                Manage Users
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;