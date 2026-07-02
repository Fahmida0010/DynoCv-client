import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="navbar-brand">
      <img 
        src="/logo.jpg"    
        alt="DynoCv Logo" 
        className="img-fluid"
        style={{ height: "45px", width: "auto" }} 
      />
    </Link>
  );
};

export default Logo;