"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const OrbitalVerse = dynamic(() => import("~/components/OrbitalVerse"), {
  ssr: false,
});

export default function App() {
  return (
    <div 
      className="orbital-verse min-h-screen"
      style={{ 
        paddingTop: 'env(safe-area-inset-top, 0px)', 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {/* Navigation Bar */}
      <nav 
        className="space-nav sticky z-50"
        style={{ 
          top: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800 data-glow">OrbitalVerse</h1>
              <div className="hidden md:flex items-center gap-6">
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  Home
                </Link>
                <Link 
                  href="/tokens" 
                  className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  Token Charts
                </Link>
                <Link 
                  href="/trade" 
                  className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  Trade
                </Link>
              </div>
            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <div className="flex items-center gap-4">
                <Link 
                  href="/tokens" 
                  className="futuristic-button px-4 py-2 text-sm"
                >
                  Charts
                </Link>
                <Link 
                  href="/trade" 
                  className="futuristic-button px-4 py-2 text-sm bg-green-500 hover:bg-green-600"
                >
                  Trade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <OrbitalVerse />
      </main>
    </div>
  );
}
