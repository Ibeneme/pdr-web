import { ContactSection } from "../../landing_page/ContactSection";
import HeroScreen from "../../landing_page/Hero";
import { HowItWorks, ImpactSection } from "../../landing_page/HowItWorks";
import { TrustSection } from "../../landing_page/TrustSection";

const Home = () => {
  return (
    <div>
      <HeroScreen />
      <HowItWorks />
      <ImpactSection />
      <TrustSection />
      <ContactSection />
    </div>
  );
};

export default Home;
