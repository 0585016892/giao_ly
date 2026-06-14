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
import ExamPage from "../pages/ExamPage";
import GiaoLyPremium from "../pages/GiaoLyHonNhan";
import EventPage from "../pages/EventPage";
import NewsPage from "../pages/NewsPage";

import EventDetail from "../components/EventDetail";
import NewsPageDetail from "../components/NewsPageDetail";
import HoiDoan from "../pages/HoiDoan";
import GroupDetail from "../components/GroupDetail";
import SchedulePage from "../pages/SchedulePage";

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/giao-ly/du-tong" element={<Courses />} />
          <Route path="/giao-ly/hon-nhan" element={<GiaoLyPremium />} />
          <Route path="/thu-vien/kinh-nguyen" element={<Prayers />} />
          <Route path="/thu-vien/thanh-ca" element={<Hymns />} />
          <Route path="/gioi-thieu" element={<GiaoXuDetail />} />
          <Route path="/tai-lieu" element={<Documents />} />
          <Route path="/lien-he" element={<Contact />} />
          <Route path="/su-kien" element={<EventPage />} />
          <Route path="/su-kien/:slug" element={<EventDetail />} />
          <Route path="/bang-tin" element={<NewsPage />} />
          <Route path="/bang-tin/:slug" element={<NewsPageDetail />} />
          <Route path="/hoi-doan" element={<HoiDoan />} />
          <Route path="/hoi-doan/:slug" element={<GroupDetail />} />
          <Route path="/giao-ly/trac-nghiem" element={<ExamPage />} />
          <Route path="/lich-le" element={<SchedulePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;
