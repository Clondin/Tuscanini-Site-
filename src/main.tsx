import { lazy, StrictMode, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "motion/react";
import Layout from "./components/Layout";
import RouteMetadata from "./components/RouteMetadata";
import { initializeCmsContent } from "./data/cms";
import "./index.css";

const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function AdminRedirect() {
  useEffect(() => {
    window.location.replace("https://kayco-sites-admin.vercel.app");
  }, []);

  return <div className="min-h-screen bg-surface" aria-label="Opening Kayco Sites admin" />;
}

const cmsInitialization = initializeCmsContent();

function App() {
  const [cmsVersion, setCmsVersion] = useState(0);

  useEffect(() => {
    let active = true;
    void cmsInitialization.finally(() => {
      if (active) setCmsVersion((version) => version + 1);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <RouteMetadata contentVersion={cmsVersion} />
      <Suspense fallback={<div className="min-h-screen bg-surface" role="status" aria-label="Loading page" />}>
        <Routes>
          <Route path="/admin" element={<AdminRedirect />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </MotionConfig>
  );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
);
