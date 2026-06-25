"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#1a1a1a] border border-[#333] rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#777] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 font-serif">Access Required</h2>
          <p className="text-[#A3A3A3] text-sm">
            Please log in or create an account to become a partner and access exclusive features.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            href="/login"
            className="w-full flex items-center justify-center bg-[#d4933a] hover:bg-[#c28532] text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-lg"
          >
            Login
          </Link>
          <Link 
            href="/signup"
            className="w-full flex items-center justify-center bg-[#222] hover:bg-[#333] border border-[#333] text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-lg"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
