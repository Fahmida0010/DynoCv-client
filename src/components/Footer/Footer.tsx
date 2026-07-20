import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <div className="container">
        <div className="row text-center text-md-start">
          
          {/* Section 1: Logo & About */}
          <div className="col-md-4 mb-4 mb-md-0">
            <Logo />
            <p className="mt-3 text-secondary" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
              Professional Recruitment Platform for Candidates and Recruiters. Discover opportunities and build your career seamlessly.
            </p>
            
            {/* Social Media Icons */}
            <div className="d-flex justify-content-center justify-content-md-start gap-3 mt-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-light fs-4 transition-icon">
                <i className="bi bi-github"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-light fs-4 transition-icon">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-light fs-4 transition-icon">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="text-uppercase fw-bold mb-3 custom-border-bottom pb-2" style={{ letterSpacing: "1px" }}>
              Quick Links
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <a href="/home" className="text-secondary text-decoration-none hover-link">Home</a>
              </li>
              <li>
                <a href="/positions" className="text-secondary text-decoration-none hover-link">Positions</a>
              </li>
              <li>
                <a href="/profile" className="text-secondary text-decoration-none hover-link">Profile</a>
              </li>
              <li>
                <a href="/about" className="text-secondary text-decoration-none hover-link">About</a>
              </li>
            </ul>
          </div>

          {/* Section 3: Contact */}
          <div className="col-md-4">
            <h5 className="text-uppercase fw-bold mb-3 custom-border-bottom pb-2" style={{ letterSpacing: "1px" }}>
              Contact
            </h5>
            <p className="text-secondary mb-2">
              <i className="bi bi-envelope-fill me-2"></i> support@cvbuilder.com
            </p>
            <p className="text-secondary">
              <i className="bi bi-telephone-fill me-2"></i> +880 1700000000
            </p>
          </div>

        </div>

        {/* Divider */}
        <hr className="bg-secondary my-4" />

        {/* Copyright */}
        <div className="text-center text-secondary" style={{ fontSize: "0.9rem" }}>
          © 2026 <span className="text-white fw-semibold">DynoCV</span>. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;