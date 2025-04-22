"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getCookie, deleteCookie } from "cookies-next";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = getCookie("authToken");
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    deleteCookie("authToken");
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-serif tracking-wide hover:text-blue-200 transition-colors">
          BookQuizard
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/about" className="hover:text-blue-200 transition-colors">
            About
          </Link>
          
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-blue-100 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link 
              href="/login" 
              className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-blue-100 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}