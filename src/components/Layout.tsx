import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import ScrollToTopButton from "./layout/ScrollToTopButton";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-[72px]">
        <Outlet />
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
