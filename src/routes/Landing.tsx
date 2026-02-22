import Hero from '../components/sections/Hero';
import HowItWorks from '../components/sections/HowItWorks';
import Subjects from '../components/sections/Subjects';
import AiTutorSection from '../components/sections/AiTutorSection';
import Testimonials from '../components/sections/Testimonials';
import SecretChallenge from '../components/challenge/SecretChallenge';
import CallToAction from '../components/sections/CallToAction';

const Landing: React.FC = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Subjects />
      <AiTutorSection />
      <Testimonials />
      <SecretChallenge />
      <CallToAction />
    </>
  );
};

export default Landing;
