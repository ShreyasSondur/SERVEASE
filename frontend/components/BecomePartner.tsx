"use client";

import Image from "next/image";
import { User, ShoppingCart, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";

export default function BecomePartner() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleJoinClick = (e: React.MouseEvent) => {
        if (!isLoggedIn) {
            e.preventDefault();
            window.location.href = "/login?redirect=/partners/becomePartner";
        }
    };
    return (
        <section className="w-full mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-12 flex justify-center bg-transparent">
            <div className="relative w-full max-w-[1200px] rounded-2xl sm:rounded-[20px] overflow-hidden border border-white/5 bg-[#131313] min-h-[450px] sm:min-h-[500px] lg:min-h-[600px] flex items-stretch">

                {/* Background Image Layer */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <div className="absolute inset-0 md:left-[45%] md:w-[55%] h-full">
                        <Image
                            src="/images/partnersection.png"
                            alt="Professional working"
                            fill
                            className="object-cover object-[center_30%]"
                            sizes="(max-width: 768px) 100vw, 55vw"
                            priority
                        />
                        {/* Mobile/Tablet: Strong gradient for readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/85 to-[#131313]/30 md:hidden"></div>
                        {/* Desktop: Left-edge gradient blend */}
                        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-[#131313] via-[#131313]/80 to-transparent"></div>
                        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32 bg-[#131313]"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 w-full md:w-[65%] lg:w-[60%] flex flex-col justify-end sm:justify-start px-4 sm:pl-8 md:pl-10 lg:pl-16 pr-4 sm:pr-6 pb-6 sm:pb-12 pt-6 sm:pt-12 md:pt-16">
                    <p className="text-[#C58434] font-sans text-[10px] sm:text-xs lg:text-[13px] font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-10">
                        Become a Partner
                    </p>
                    <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-serif font-normal leading-tight lg:leading-[1.1] mb-3 sm:mb-6">
                        Grow your business.<br />
                        Reach <span className="text-[#C58434]">more customers.</span>
                    </h2>
                    <p className="text-[#A3A3A3] font-sans text-xs sm:text-sm lg:text-[15px] font-light max-w-[480px] leading-relaxed mb-6 sm:mb-12 lg:mb-24">
                        List your services on our platform and get discovered by people who need professionals like you
                    </p>

                    {/* Features Row */}
                    <div className="flex flex-row items-start justify-between w-full max-w-[340px] sm:max-w-[480px] mb-6 sm:mb-4 lg:mb-12">
                        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 flex-1 px-1">
                            <User className="text-[#C58434] w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" strokeWidth={1.5} />
                            <span className="text-[#A3A3A3] text-[10px] sm:text-[12px] lg:text-[13px] font-light leading-snug">Create your profile</span>
                        </div>

                        <div className="w-[1px] h-8 sm:h-10 bg-white/10 mt-1 shrink-0"></div>

                        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 flex-1 px-1">
                            <ShoppingCart className="text-[#C58434] w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" strokeWidth={1.5} />
                            <span className="text-[#A3A3A3] text-[10px] sm:text-[12px] lg:text-[13px] font-light leading-snug">Choose a listing plan</span>
                        </div>

                        <div className="w-[1px] h-8 sm:h-10 bg-white/10 mt-1 shrink-0"></div>

                        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 flex-1 px-1">
                            <TrendingUp className="text-[#C58434] w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" strokeWidth={1.5} />
                            <span className="text-[#A3A3A3] text-[10px] sm:text-[12px] lg:text-[13px] font-light leading-snug">Get quality leads</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex">
                        <Link 
                            href="/partners/becomePartner" 
                            onClick={handleJoinClick}
                            className="bg-[#C58434] hover:bg-[#b3752c] text-white font-medium transition-colors flex items-center justify-center gap-3 sm:gap-4 group shadow-lg cursor-pointer px-8 sm:px-14 py-3 sm:py-4 text-base sm:text-xl rounded-[10px]"
                        >
                            Join as partner
                            <ArrowRight className="transition-transform group-hover:translate-x-2 w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                        </Link>
                    </div>
                </div>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </section>
    );
}
