"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import AuthModal from "./AuthModal";

// Country configuration with custom SVG flags
const IndiaFlag = (
  <svg className="w-5 h-3.5 rounded-sm object-cover" viewBox="0 0 3 2">
    <rect width="3" height="0.67" fill="#FF9933" />
    <rect y="0.67" width="3" height="0.67" fill="#FFF" />
    <rect y="1.34" width="3" height="0.67" fill="#138808" />
    <circle cx="1.5" cy="1" r="0.18" fill="#000080" />
  </svg>
);

const KSAFlag = (
  <svg className="w-5 h-3.5 rounded-sm object-cover" viewBox="0 0 3 2">
    <rect width="3" height="2" fill="#006C35" />
    <path d="M 0.6 1.3 L 2.4 1.3 M 0.9 1.1 L 0.9 1.5" stroke="#FFF" strokeWidth="0.1" strokeLinecap="round" />
  </svg>
);

const OmanFlag = (
  <svg className="w-5 h-3.5 rounded-sm object-cover" viewBox="0 0 3 2">
    <rect width="3" height="2" fill="#D21034" />
    <rect y="0" x="0.75" width="2.25" height="0.67" fill="#FFF" />
    <rect y="1.33" x="0.75" width="2.25" height="0.67" fill="#008000" />
  </svg>
);

const UAEFlag = (
  <svg className="w-5 h-3.5 rounded-sm object-cover" viewBox="0 0 3 2">
    <rect width="3" height="2" fill="#00732F" />
    <rect y="0.66" width="3" height="1.34" fill="#FFF" />
    <rect y="1.33" width="3" height="0.67" fill="#000" />
    <rect width="0.75" height="2" fill="#FF0000" />
  </svg>
);

const countries = [
  { name: "UAE", code: "AE", domain: "servizuae.com", flag: UAEFlag },
  { name: "India", code: "IN", domain: "servizind.com", flag: IndiaFlag },
  { name: "KSA", code: "SA", domain: "servizksa.com", flag: KSAFlag },
  { name: "Oman", code: "OM", domain: "servizoman.com", flag: OmanFlag },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const profileRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const [activeCountry, setActiveCountry] = useState(countries[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<typeof countries[0] | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize active country based on hostname
  useEffect(() => {
    const hostname = window.location.hostname;
    let detected = countries[0]; // default UAE

    if (hostname.includes("servizind.com")) {
      detected = countries.find(c => c.name === "India") || countries[0];
    } else if (hostname.includes("servizksa.com")) {
      detected = countries.find(c => c.name === "KSA") || countries[0];
    } else if (hostname.includes("servizoman.com")) {
      detected = countries.find(c => c.name === "Oman") || countries[0];
    } else if (hostname.includes("servizuae.com")) {
      detected = countries.find(c => c.name === "UAE") || countries[0];
    } else {
      // Local development fallback
      const local = localStorage.getItem("serviz_local_country");
      if (local) {
        detected = countries.find(c => c.name === local) || countries[0];
      }
    }
    setActiveCountry(detected);
  }, []);

  // Detect user country and prompt redirect if domain mismatch
  useEffect(() => {
    const dismissed = localStorage.getItem("serviz_country_choice_dismissed");
    if (dismissed === "true") return;

    const detectCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const countryCode = data.country_code; // e.g., "IN", "SA", "OM", "AE"

        const matchedCountry = countries.find(c => c.code === countryCode);
        if (matchedCountry) {
          checkAndShowPrompt(matchedCountry);
        } else {
          fallbackTimezoneDetection();
        }
      } catch (err) {
        console.warn("Geo-IP detection failed, attempting timezone fallback", err);
        fallbackTimezoneDetection();
      }
    };

    const fallbackTimezoneDetection = () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let matchedCountry = countries[0]; // default
        if (tz.includes("Kolkata") || tz.includes("Calcutta")) {
          matchedCountry = countries.find(c => c.name === "India")!;
        } else if (tz.includes("Riyadh")) {
          matchedCountry = countries.find(c => c.name === "KSA")!;
        } else if (tz.includes("Muscat")) {
          matchedCountry = countries.find(c => c.name === "Oman")!;
        } else if (tz.includes("Dubai")) {
          matchedCountry = countries.find(c => c.name === "UAE")!;
        } else {
          return;
        }
        checkAndShowPrompt(matchedCountry);
      } catch (e) {
        console.error("Timezone fallback failed", e);
      }
    };

    const checkAndShowPrompt = (matched: typeof countries[0]) => {
      const hostname = window.location.hostname;
      let currentCountryName = "UAE";
      if (hostname.includes("servizind.com")) currentCountryName = "India";
      else if (hostname.includes("servizksa.com")) currentCountryName = "KSA";
      else if (hostname.includes("servizoman.com")) currentCountryName = "Oman";
      else if (hostname.includes("servizuae.com")) currentCountryName = "UAE";
      else {
        currentCountryName = localStorage.getItem("serviz_local_country") || "UAE";
      }

      if (matched.name !== currentCountryName) {
        setDetectedCountry(matched);
        setShowRedirectModal(true);
      }
    };

    const timer = setTimeout(() => {
      detectCountry();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCountrySelect = (country: typeof countries[0]) => {
    localStorage.setItem("serviz_country_choice_dismissed", "true");
    const pathname = window.location.pathname;
    const search = window.location.search;
    window.location.href = `https://${country.domain}${pathname}${search}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    // Check auth status
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Fetch user role
      import("@/lib/api").then(({ default: api }) => {
        api.get("/auth/me")
          .then((res) => {
            setUserRole(res.data.role);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Failed to fetch user role in navbar", err);
            // If token is invalid, log them out
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setIsLoading(false);
          });
      });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const isHomePage = pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || !isHomePage
        ? "bg-[#0b0a0a]/95 backdrop-blur-md shadow-lg border-b border-white/5"
        : "bg-transparent"
        }`}
    >
      {/* Main Container */}
      <div className="w-full mx-auto px-6 lg:px-12 relative">
        <div
          className={`flex items-center justify-between w-full transition-all duration-300 ${isScrolled ? "h-16" : "h-20"
            }`}
        >
          {/* Logo and Country Dropdown */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0 z-10">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl md:text-3xl font-black italic tracking-wide text-white uppercase select-none transition-transform group-hover:scale-[1.02]">
                SERV
                <span className="text-gold font-extrabold text-glow">
                  IZ
                </span>
              </span>
            </Link>

            {/* Country Selector Dropdown */}
            <div className="relative" ref={countryDropdownRef}>
              <button
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#141414]/90 hover:bg-[#202020]/90 text-white px-2.5 py-1.5 rounded-full border border-white/10 hover:border-gold/30 transition-all text-xs font-serif font-semibold cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-1.5">
                  {activeCountry.flag}
                  <span className="hidden sm:inline text-[#D4D2CD] group-hover:text-white font-sans tracking-wide">{activeCountry.name}</span>
                  <span className="sm:hidden text-[#D4D2CD] group-hover:text-white font-sans tracking-wide">{activeCountry.code}</span>
                </div>
                <svg className={`w-3 h-3 text-white/45 transition-transform duration-250 ${isCountryDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCountryDropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-[#121212]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl py-1.5 flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {countries.map((country) => (
                    <button
                      key={country.name}
                      onClick={() => handleCountrySelect(country)}
                      className={`flex items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors cursor-pointer w-full hover:bg-gold/10 hover:text-gold ${
                        activeCountry.name === country.name
                          ? "bg-white/5 text-gold font-bold"
                          : "text-[#D4D2CD]"
                      }`}
                    >
                      {country.flag}
                      <span className="font-sans text-xs tracking-wider">{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation - Absolutely Centered */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-0">
            <nav className="flex items-center gap-8 lg:gap-10 text-[16px] lg:text-[18px] font-semibold font-serif font-normal tracking-wide">
              <Link
                href="/"
                className={`${pathname === "/" ? "text-gold" : "text-[#D4D2CD] hover:text-white"} transition-colors duration-200`}
              >
                Home
              </Link>

              <Link
                href="/services"
                className={`${pathname === "/services" ? "text-gold" : "text-[#D4D2CD] hover:text-white"} transition-colors duration-200`}
              >
                Services
              </Link>

              <Link
                href="/deals"
                className={`${pathname === "/deals" ? "text-gold" : "text-[#D4D2CD] hover:text-white"} transition-colors duration-200`}
              >
                Deals
              </Link>

              <Link
                href="/contact"
                className={`${pathname === "/contact" ? "text-gold" : "text-[#D4D2CD] hover:text-white"} transition-colors duration-200`}
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 z-10">
            {isLoading ? (
              <div className="text-white/40 text-sm font-serif">Loading...</div>
            ) : isLoggedIn ? (
              <>
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-[#333] hover:border-gold transition-colors focus:outline-none cursor-pointer"
                  >
                    <User className="w-5 h-5 text-white" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-[#151515] border border-[#333] rounded-xl shadow-xl py-2 flex flex-col z-50">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="px-4 py-2 text-[15px] text-[#D4D2CD] hover:text-white hover:bg-[#222] transition-colors font-serif"
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="px-4 py-2 text-[15px] text-left text-red-500 hover:bg-red-500/10 transition-colors font-serif cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {userRole === "PARTNER" ? (
                  <Link
                    href="/partners/dashboard"
                    className="relative inline-flex items-center justify-center rounded-full border border-gold py-2 px-6 tracking-wide text-base md:text-[17px] lg:text-lg font-serif font-bold text-gold hover:bg-gold/10 transition-colors"
                  >
                    Partner Dashboard
                  </Link>
                ) : userRole === "ADMIN" ? (
                  <Link
                    href="/zQ8pL3mX9vN2/dashboard"
                    className="relative inline-flex items-center justify-center rounded-full border border-gold py-2 px-6 tracking-wide text-base md:text-[17px] lg:text-lg font-serif font-bold text-gold hover:bg-gold/10 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                ) : userRole === "MODERATOR" ? (
                  <Link
                    href="/zQ8pL3mX9vN2/dashboard"
                    className="relative inline-flex items-center justify-center rounded-full border border-gold py-2 px-6 tracking-wide text-base md:text-[17px] lg:text-lg font-serif font-bold text-gold hover:bg-gold/10 transition-colors"
                  >
                    Mod Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/partners/becomePartner"
                    className="relative inline-flex items-center justify-center rounded-full border border-gold py-2 px-6 tracking-wide text-base md:text-[17px] lg:text-lg font-serif font-bold text-gold hover:bg-gold/10 transition-colors"
                  >
                    Become a partner
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href={`/login?redirect=${pathname}`}
                  className="text-[16px] lg:text-[18px] font-serif font-normal text-white hover:text-gold transition-colors duration-200"
                >
                  Login
                </Link>

                <Link
                  href="/login?redirect=/partners/becomePartner"
                  className="relative inline-flex items-center justify-center rounded-full border border-gold py-2 px-6 tracking-wide text-base md:text-[17px] lg:text-lg font-serif font-bold text-gold hover:bg-gold/10 transition-colors"
                >
                  Become a partner
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-[#D4D2CD] hover:bg-neutral-900 hover:text-white focus:outline-none transition-all cursor-pointer"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>

              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#0b0a0a]/95 backdrop-blur-lg border-b border-white/5 transition-all duration-300 ease-in-out origin-top ${isOpen
          ? "opacity-100 scale-y-100 visible h-auto"
          : "opacity-0 scale-y-0 invisible h-0"
          }`}
        id="mobile-menu"
      >
        <div className="space-y-5 px-6 py-6 pb-8 font-serif">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`block text-[18px] font-normal ${pathname === "/" ? "text-gold" : "text-[#D4D2CD] hover:text-white"} transition-colors`}
          >
            Home
          </Link>

          <Link
            href="/services"
            onClick={() => setIsOpen(false)}
            className={`block text-[18px] font-normal ${pathname === "/services" ? "text-gold" : "text-[#D4D2CD] hover:text-white"} transition-colors`}
          >
            Services
          </Link>

          <Link
            href="/deals"
            onClick={() => setIsOpen(false)}
            className={`block text-[18px] font-normal ${pathname === "/deals" ? "text-gold" : "text-[#D4D2CD] hover:text-white"} transition-colors`}
          >
            Deals
          </Link>

          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className={`block text-[18px] font-normal ${pathname === "/contact" ? "text-gold" : "text-[#D4D2CD] hover:text-white"} transition-colors`}
          >
            Contact Us
          </Link>

          <div className="h-px bg-white/10 my-4" />

          {isLoading ? (
            <div className="text-white/40 text-sm font-serif py-2">Loading...</div>
          ) : isLoggedIn ? (
            <>
              {userRole === "PARTNER" ? (
                <Link
                  href="/partners/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 block w-full text-center rounded-full border border-gold py-2 px-5 tracking-wide text-[17px] font-bold text-gold hover:bg-gold/10 transition-colors"
                >
                  Partner Dashboard
                </Link>
              ) : userRole === "ADMIN" ? (
                <Link
                  href="/zQ8pL3mX9vN2/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 block w-full text-center rounded-full border border-gold py-2 px-5 tracking-wide text-[17px] font-bold text-gold hover:bg-gold/10 transition-colors"
                >
                  Admin Dashboard
                </Link>
              ) : userRole === "MODERATOR" ? (
                <Link
                  href="/zQ8pL3mX9vN2/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 block w-full text-center rounded-full border border-gold py-2 px-5 tracking-wide text-[17px] font-bold text-gold hover:bg-gold/10 transition-colors"
                >
                  Mod Dashboard
                </Link>
              ) : (
                <Link
                  href="/partners/becomePartner"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 block w-full text-center rounded-full border border-gold py-2 px-5 tracking-wide text-[17px] font-bold text-gold hover:bg-gold/10 transition-colors"
                >
                  Become a partner
                </Link>
              )}

              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="mt-4 block text-[18px] font-normal text-[#D4D2CD] hover:text-white transition-colors"
              >
                View Profile
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                  window.location.reload();
                }}
                className="block text-[18px] font-normal text-red-500 hover:text-red-400 transition-colors text-left w-full cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href={`/login?redirect=${pathname}`}
                onClick={() => setIsOpen(false)}
                className="block text-[18px] font-normal text-[#D4D2CD] hover:text-white transition-colors"
              >
                Login
              </Link>

              <Link
                href="/login?redirect=/partners/becomePartner"
                onClick={() => setIsOpen(false)}
                className="mt-4 block w-full text-center rounded-full border border-gold py-2 px-5 tracking-wide text-[17px] font-bold text-gold hover:bg-gold/10 transition-colors"
              >
                Become a partner
              </Link>
            </>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Switch Country Redirect Modal */}
      {showRedirectModal && detectedCountry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-[#000]/75 backdrop-blur-md transition-opacity duration-300"
            onClick={() => {
              localStorage.setItem("serviz_country_choice_dismissed", "true");
              setShowRedirectModal(false);
            }}
          />
          
          {/* Modal Content Card */}
          <div className="relative bg-[#151515] border border-gold/30 rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl z-10 flex flex-col text-center items-center transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
            {/* Country Flag Circle */}
            <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center bg-[#1e1e1e] shadow-inner mb-5">
              <div className="scale-[2.2]">
                {detectedCountry.flag}
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-3">
              Are you visiting from {detectedCountry.name}?
            </h3>
            
            <p className="text-[#D4D2CD] text-sm md:text-base leading-relaxed mb-6 font-sans">
              We detected your location is {detectedCountry.name}. Would you like to switch to our local site <span className="text-gold font-semibold">{detectedCountry.domain}</span> to get localized services, partner support, and special deals?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button
                onClick={() => {
                  localStorage.setItem("serviz_country_choice_dismissed", "true");
                  const pathname = window.location.pathname;
                  const search = window.location.search;
                  window.location.href = `https://${detectedCountry.domain}${pathname}${search}`;
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gold hover:bg-gold-hover hover:scale-[1.02] text-black font-bold rounded-full transition-all duration-200 cursor-pointer shadow-lg font-serif text-[15px]"
              >
                Go to {detectedCountry.domain}
              </button>
              
              <button
                onClick={() => {
                  localStorage.setItem("serviz_country_choice_dismissed", "true");
                  setShowRedirectModal(false);
                }}
                className="w-full sm:w-auto px-6 py-3 border border-white/20 hover:border-white/50 text-[#D4D2CD] hover:text-white rounded-full transition-all duration-200 cursor-pointer font-serif text-[15px]"
              >
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
