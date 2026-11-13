import FeaturesSection from "@/components/Features";
import Hero from "@/components/Hero";
import Navbar from "@/components/ui/Navbar";


const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturesSection />
    </div>
  );
};

export default page;