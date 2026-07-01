import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      className="navbar-brand fw-bold fs-3 text-primary"
    >
      CV<span className="text-dark">Builder</span>
    </Link>
  );
};

export default Logo;