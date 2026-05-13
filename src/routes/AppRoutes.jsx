import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import Prayers from "../pages/Prayers";
import Documents from "../pages/Documents";
import Contact from "../pages/Contact";
import ScrollToTop from "../components/ScrollToTop";

function AppRoutes() {
  return (
    <>
    <ScrollToTop/>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/prayers" element={<Prayers />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
    </>
  );
}

export default AppRoutes;