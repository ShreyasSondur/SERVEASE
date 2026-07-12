"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import api from "@/lib/api";

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const maxMessageLength = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill in all fields.");
      setSuccessMsg("");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const response = await api.post("/contact/submit", {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setSuccessMsg(response.data.detail || "Inquiry submitted successfully!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      console.error("Failed to submit contact inquiry:", err);
      setErrorMsg(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0b0a0a] flex flex-col w-full font-sans text-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center w-full max-w-[1100px] mx-auto px-4 sm:px-8 pt-28 pb-12">
        <div className="w-full flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* Left Column - Typography & Info */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-wide mb-6">
              Let's start a <br />
              <span className="text-[#d4933a] italic">conversation.</span>
            </h1>
            <p className="text-[#888] text-[15px] leading-relaxed mb-12 max-w-md font-light">
              Whether you're looking for a service, interested in partnering, or just have a question, our team is ready to provide you with the answers you need.
            </p>

            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-5 group">
                <Mail className="w-5 h-5 text-[#d4933a] mt-0.5 shrink-0 transition-transform group-hover:-translate-y-1" />
                <div className="flex flex-col">
                  <span className="text-[#555] text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Email</span>
                  <a href="mailto:info@servizuae.com" className="text-white text-[15px] hover:text-[#d4933a] transition-colors">
                    info@servizuae.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <Phone className="w-5 h-5 text-[#d4933a] mt-0.5 shrink-0 transition-transform group-hover:-translate-y-1" />
                <div className="flex flex-col">
                  <span className="text-[#555] text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Phone</span>
                  <a href="tel:+97143450870" className="text-white text-[15px] hover:text-[#d4933a] transition-colors">
                    +971 43450870
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <MapPin className="w-5 h-5 text-[#d4933a] mt-0.5 shrink-0 transition-transform group-hover:-translate-y-1" />
                <div className="flex flex-col">
                  <span className="text-[#555] text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Headquarters</span>
                  <span className="text-white text-[15px] leading-relaxed">
                    Dubailand Dubai, UAE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Editorial Form */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center">
            <div className="bg-[#111] border border-[#222] p-6 sm:p-12 rounded-2xl shadow-xl">
              <h2 className="text-xl font-medium text-white mb-8">Send Inquiry</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-[#888] text-[11px] font-semibold tracking-wider uppercase">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-transparent border-b border-[#333] focus:border-[#d4933a] py-2 text-white outline-none transition-colors text-[15px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-[#888] text-[11px] font-semibold tracking-wider uppercase">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-transparent border-b border-[#333] focus:border-[#d4933a] py-2 text-white outline-none transition-colors text-[15px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[#888] text-[11px] font-semibold tracking-wider uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-[#333] focus:border-[#d4933a] py-2 text-white outline-none transition-colors text-[15px]"
                  />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[#888] text-[11px] font-semibold tracking-wider uppercase">
                      Message
                    </label>
                    <span className={`text-[11px] font-sans ${message.length >= maxMessageLength ? "text-red-500 font-medium" : "text-[#555]"}`}>
                      {message.length} / {maxMessageLength}
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your needs..."
                    value={message}
                    maxLength={maxMessageLength}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-transparent border-b border-[#333] focus:border-[#d4933a] py-2 text-white outline-none transition-colors text-[15px] resize-none placeholder:text-[#444]"
                  ></textarea>
                </div>

                {successMsg && (
                  <div className="text-green-500 text-sm font-medium bg-green-500/10 border border-green-500/20 p-3.5 rounded-xl">
                    {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="text-red-500 text-sm font-medium bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group self-start flex items-center gap-3 bg-white hover:bg-[#d4933a] disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed text-black hover:text-white font-bold tracking-widest uppercase py-3.5 px-8 rounded-full mt-4 transition-all duration-300 text-[11px] cursor-pointer"
                >
                  <span>{submitting ? "Submitting..." : "Submit Request"}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
