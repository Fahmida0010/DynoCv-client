import FAQ from "../components/home/FAQ";
import { FeaturedJobs } from "../components/home/FeaturedJobs";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import LatestCV from "../components/home/LatestCV";
import Roles from "../components/home/Roles";

const Home = () => {
  return (
    <>
      <Hero />

      <LatestCV/>

       <FeaturedJobs />

       <HowItWorks/>
       <Roles/>
       <FAQ/>
       

  
    </>
  );
};

export default Home;