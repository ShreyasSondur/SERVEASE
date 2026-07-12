import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#131313] border-t border-white/5">
      {/* Main Footer Content */}
      <div className="w-full mx-auto px-6 lg:px-12 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="text-2xl font-black italic tracking-wide text-white uppercase select-none">
                SERV
                <span className="text-gold font-extrabold text-glow">IZ</span>
              </span>
            </Link>
            <p className="text-white/40 font-sans text-sm leading-relaxed max-w-[280px]">
              Find trusted professionals for every services you&apos;re looking.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-serif text-lg font-medium">
              Quick Links
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/"
                className="text-white/50 hover:text-gold text-sm font-sans transition-colors"
              >
                Home
              </Link>
              <Link
                href="/services"
                className="text-white/50 hover:text-gold text-sm font-sans transition-colors"
              >
                Services
              </Link>
              <Link
                href="/deals"
                className="text-white/50 hover:text-gold text-sm font-sans transition-colors"
              >
                Deals
              </Link>
              <Link
                href="/contact"
                className="text-white/50 hover:text-gold text-sm font-sans transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-serif text-lg font-medium">
              Contact Us
            </h3>
            <div className="flex flex-col gap-2">
              <p className="text-white/50 text-sm font-sans">
                Phone:{" "}
                <a
                  href="tel:+97143450870"
                  className="text-white/70 hover:text-gold transition-colors"
                >
                  +971 43450870
                </a>
              </p>
              <p className="text-white/50 text-sm font-sans">
                Email:{" "}
                <a
                  href="mailto:info@servizuae.com"
                  className="text-white/70 hover:text-gold transition-colors"
                >
                  info@servizuae.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="w-full mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs font-sans">
            © 2026 SERVIZ. All rights reserved
          </p>
          <Link
            href="/privacy"
            className="text-white/30 hover:text-white/60 text-xs font-sans transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
