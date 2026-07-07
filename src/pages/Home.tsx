import Footer from "../components/Footer/Footer";
import CTA from "../components/home/CTA";
import FAQ from "../components/home/FAQ";
import FeaturedJobs from "../components/home/FeaturedJobs";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import LatestCV from "../components/home/LatestCV";
import Roles from "../components/home/Roles";

const Home = () => {
  return (
    <>
      <Hero />

      {/* Statistics */}

      <LatestCV/>

       <FeaturedJobs />

       <HowItWorks/>
       <Roles/>
       <FAQ/>
       <CTA/>

      {/* User Roles */}

      {/* Testimonials */}

      {/* FAQ */}

      <Footer />
    </>
  );
};

export default Home;