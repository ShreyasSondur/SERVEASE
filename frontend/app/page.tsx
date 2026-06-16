import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PopularServices from "@/components/PopularServices";
import BecomePartner from "@/components/BecomePartner";
import CustomerFeedback from "@/components/CustomerFeedback";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#101010] flex flex-col overflow-x-hidden w-full">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <div className="w-full h-4 sm:h-6 lg:h-8"></div>
        <PopularServices />
        <div className="w-full h-4 sm:h-6 lg:h-8"></div>
        <BecomePartner />
        <div className="w-full h-4 sm:h-6 lg:h-8"></div>
        <CustomerFeedback />
      </main>
      <Footer />
    </div>
  );
}