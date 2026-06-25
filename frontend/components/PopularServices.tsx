import Image from "next/image";
import { Wrench, Snowflake, Zap, ArrowRight, Droplets, Wind, Hammer } from "lucide-react";

export default function PopularServices() {
    const services = [
        {
            id: 1,
            title: "Plumbing",
            description: "Fix leaks, installations & maintenance by expert plumbers",
            image: "/images/service1.png",
            icon: (
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#D08931] flex items-center justify-center mb-3 sm:mb-4">
                    <Wrench className="text-[#D08931] w-4 h-4 sm:w-5 sm:h-5 absolute top-2.5 left-3 sm:top-3 sm:left-4" strokeWidth={1.5} />
                    <Droplets className="text-[#D08931] w-3.5 h-3.5 sm:w-4 sm:h-4 absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3" strokeWidth={1.5} />
                </div>
            ),
        },
        {
            id: 2,
            title: "AC Repair",
            description: "AC installation, repair & regular maintenance services",
            image: "/images/service2.png",
            icon: (
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#D08931] flex items-center justify-center mb-3 sm:mb-4">
                    <Snowflake className="text-[#D08931] w-4 h-4 sm:w-5 sm:h-5 absolute top-2.5 left-2.5 sm:top-3 sm:left-3" strokeWidth={1.5} />
                    <Wind className="text-[#D08931] w-4 h-4 sm:w-5 sm:h-5 absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3" strokeWidth={1.5} />
                </div>
            ),
        },
        {
            id: 3,
            title: "Electrical",
            description: "Wiring, installations & electrical repairs by certified experts",
            image: "/images/service3.png",
            icon: (
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#D08931] flex items-center justify-center mb-3 sm:mb-4">
                    <Zap className="text-[#D08931] w-4 h-4 sm:w-5 sm:h-5 absolute top-2.5 left-2.5 sm:top-3 sm:left-3" strokeWidth={1.5} />
                    <Hammer className="text-[#D08931] w-3.5 h-3.5 sm:w-4 sm:h-4 absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3" strokeWidth={1.5} />
                </div>
            ),
        },
    ];

    return (
        <section className="w-full mx-auto pt-16 sm:pt-24 pb-20 sm:pb-32 lg:pb-48 px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center bg-transparent">
            <div className="w-full h-full flex flex-col max-w-[1400px]">
                {/* Header Section */}
                <div className="flex justify-center items-center flex-col gap-3 sm:gap-4 text-center">
                    <p className="text-[#D08931] font-sans text-[10px] sm:text-xs md:text-sm font-medium tracking-[4px] sm:tracking-[5.12px] uppercase">
                        Popular Services
                    </p>
                    <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-normal leading-tight">
                        Services for every need
                    </h2>
                    <p className="text-gray-400 font-sans text-xs sm:text-sm md:text-base font-light">
                        Quality professional across a wide range of services.
                    </p>
                </div>

                {/* Spacer */}
                <div className="h-8 sm:h-12 lg:h-24 w-full"></div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-16 w-full">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="rounded-2xl border border-[#D08931]/30 overflow-hidden flex flex-col sm:flex-row h-auto sm:h-[220px] lg:h-[260px] bg-[#111111] hover:border-[#D08931]/60 transition-colors duration-300"
                        >
                            {/* Left Image Section */}
                            <div className="w-full h-[160px] sm:w-[60%] sm:h-full relative shrink-0">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 30vw, 20vw"
                                />
                            </div>

                            {/* Right Content Section */}
                            <div className="w-full sm:w-[40%] p-5 sm:p-4 flex flex-col justify-center items-center text-center relative min-h-[160px] sm:min-h-0">
                                <div className="flex flex-col items-center justify-center w-full">
                                    {service.icon}
                                    <h3 className="text-white font-serif text-sm sm:text-base lg:text-xl mb-1 lg:mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-400 text-[10px] sm:text-[11px] lg:text-[13px] leading-relaxed max-w-[140px] lg:max-w-[160px]">
                                        {service.description}
                                    </p>
                                </div>
                                <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-4 lg:bottom-5 lg:right-5">
                                    <button className="text-[#D08931] text-[10px] sm:text-[11px] lg:text-[13px] flex items-center hover:opacity-80 transition-opacity group">
                                        Search
                                        <ArrowRight className="ml-1 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}