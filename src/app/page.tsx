import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Belief from "@/components/sections/Belief";
import Beginning from "@/components/sections/Beginning";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <>
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Belief />
        <Beginning />
        <WaitlistForm />
      </main>
      <Footer />
    </>
  );
}
