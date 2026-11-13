import FeaturesSection from "@/components/Features";
import Hero from "@/components/Hero";
import PricingSection from "@/components/Pricing";
import Navbar from "@/components/ui/Navbar";


const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <PricingSection />
    </div>
  );
};

export default page;