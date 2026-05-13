import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import Prayers from "../pages/Prayers";
import Documents from "../pages/Documents";
import Contact from "../pages/Contact";
import ScrollToTop from "../components/ScrollToTop";
import GiaoXuDetail from "../pages/GiaoXuDetail";
import NotFound from "../pages/NotFound";
import Hymns from "../pages/Hymns";
import GiaoLyPremium from "../pages/GiaoLyHonNhan";

function AppRoutes() {
  return (
    <>
    <ScrollToTop/>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/giao-ly/du-tong" element={<Courses />} />
        <Route path="/giao-ly/hon-nhan" element={<GiaoLyPremium />} />
        <Route path="/prayers" element={<Prayers />} />
        <Route path="/prayers/thanh-ca" element={<Hymns />} />
        <Route path="/giao-xu" element={<GiaoXuDetail />} />
        <Route path="/tai-lieu" element={<Documents />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </>
  );
}

export default AppRoutes;