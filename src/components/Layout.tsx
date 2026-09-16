import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import ScrollToTopButton from "./layout/ScrollToTopButton";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    let id: string;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const scroll = () => {
      const target = document.getElementById(id);
      if (!target) return false;
      target.scrollIntoView({ behavior: "instant", block: "start" });
      return true;
    };
    if (scroll()) return;
    const observer = new MutationObserver(() => {
      if (scroll()) observer.disconnect();
    });
    observer.observe(document.getElementById("root")!, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [location.pathname, location.hash]);

  return (
    <div
      className={`min-h-screen flex flex-col ${location.pathname.startsWith("/product/") ? "pb-24 lg:pb-0" : ""}`}
    >
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[10000] -translate-y-20 bg-heading px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 pt-[75px]">
        <Outlet />
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
