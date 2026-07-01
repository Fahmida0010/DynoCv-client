import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-auto">

      <div className="container">

        <div className="row">

          <div className="col-md-4 mb-4">

            <Logo />

            <p className="mt-3 text-light">
              Professional Recruitment Platform
              for Candidates, Recruiters,
              and Administrators.
            </p>

          </div>

          <div className="col-md-4 mb-4">

            <h5>Quick Links</h5>

            <ul className="list-unstyled">

              <li>Home</li>
              <li>Positions</li>
              <li>Profile</li>
              <li>Contact</li>

            </ul>

          </div>

          <div className="col-md-4">

            <h5>Contact</h5>

            <p>Email: support@cvbuilder.com</p>

            <p>Phone: +880 1700000000</p>

          </div>

        </div>

        <hr />

        <div className="text-center">
          © 2026 DynoCV. All Rights Reserved.
        </div>

      </div>

    </footer>
  );
};

export default Footer;