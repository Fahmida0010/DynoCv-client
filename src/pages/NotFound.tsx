import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="display-1 fw-bold text-danger">404</h1>

          <h2 className="mb-3 fw-semibold">Page Not Found</h2>

          <p className="text-muted mb-4">
            Oops! The page you are looking for doesn't exist or has been moved.
                     </p>

          <button
            className="btn btn-primary btn-lg shadow-sm px-4"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;