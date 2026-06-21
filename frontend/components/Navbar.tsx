"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    window.location.href = "/login";
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
          {/* Logo */}
          <div className="flex shrink-0 z-10">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl md:text-3xl font-black italic tracking-wide text-white uppercase select-none transition-transform group-hover:scale-[1.02]">
                SERV
                <span className="text-gold font-extrabold text-glow">
                  EASE
                </span>
              </span>
            </Link>
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
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-[#333] hover:border-gold transition-colors focus:outline-none"
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
                        className="px-4 py-2 text-[15px] text-left text-red-500 hover:bg-red-500/10 transition-colors font-serif"
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
                    href="/admin/dashboard"
                    className="relative inline-flex items-center justify-center rounded-full border border-gold py-2 px-6 tracking-wide text-base md:text-[17px] lg:text-lg font-serif font-bold text-gold hover:bg-gold/10 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                ) : userRole === "MODERATOR" ? (
                  <Link
                    href="/admin/dashboard"
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
                  href="/login"
                  className="text-[16px] lg:text-[18px] font-serif font-normal text-white hover:text-gold transition-colors duration-200"
                >
                  Login
                </Link>

                <Link
                  href="/partners/becomePartner"
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
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 block w-full text-center rounded-full border border-gold py-2 px-5 tracking-wide text-[17px] font-bold text-gold hover:bg-gold/10 transition-colors"
                >
                  Admin Dashboard
                </Link>
              ) : userRole === "MODERATOR" ? (
                <Link
                  href="/admin/dashboard"
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
                }}
                className="mt-4 block w-full text-center rounded-full border border-red-500 py-2 px-5 tracking-wide text-[17px] font-bold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-[18px] font-normal text-[#D4D2CD] hover:text-white transition-colors"
              >
                Login
              </Link>

              <Link
                href="/partners/becomePartner"
                onClick={() => setIsOpen(false)}
                className="mt-4 block w-full text-center rounded-full border border-gold py-2 px-5 tracking-wide text-[17px] font-bold text-gold hover:bg-gold/10 transition-colors"
              >
                Become a partner
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}