import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="navbar-brand d-flex align-items-center p-0"> 
      {/* p-0 যোগ করায় লিংকের নিজস্ব সব প্যাডিং চলে যাবে এবং লোগো সর্বোচ্চ জায়গা পাবে */}
      <img 
        src="/icons4.png"    
        alt="DynoCv Logo" 
        className="img-fluid me-2"
        style={{ 
          height: "52px", // এখান থেকে উচ্চতা বাড়িয়ে নিজের পছন্দমতো সেট করুন
          width: "auto",
          objectFit: "contain" // ইমেজটি যাতে চ্যাপ্টা না হয়ে সুন্দরভাবে ফিট হয়
        }} 
      />
    <h1 className="fs-4 mb-0 text-darkfw-bold">
        Dyno<span className="text-success">CV</span>
      </h1> 
    </Link>
  );
};

export default Logo;