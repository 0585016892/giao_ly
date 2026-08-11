import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import Prayers from "../pages/Prayers";
import Documents from "../pages/Documents";
import Contact from "../pages/Contact";
import GiaoXuDetail from "../pages/GiaoXuDetail";
import NotFound from "../pages/NotFound";
import Hymns from "../pages/Hymns";
import ExamPage from "../pages/ExamPage";
import GiaoLyPremium from "../pages/GiaoLyHonNhan";
import EventPage from "../pages/EventPage";
import NewsPage from "../pages/NewsPage";
import ExamPrayerPage from "../pages/ExamPrayerPage";
import ExamSearchPage from "../pages/ExamSearchPage";
import TermsPage from "../pages/TermsPage";
import GiaoHoPage from "../pages/GiaoHoPage";
import GuidePage from "../pages/GuidePage";
import HoiDoan from "../pages/HoiDoan";
import CommunitySchedulePage from "../pages/CommunitySchedulePage";

import EventDetail from "../components/EventDetail";
import NewsPageDetail from "../components/NewsPageDetail";
import GroupDetail from "../components/GroupDetail";
import ScrollToTop from "../components/ScrollToTop";
import MainLayout from "../components/layout/MainLayout";
import EventPopup from "../components/EventPopup";
import SearchPageQuestion from "../components/SearchPageQuestion";

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <EventPopup />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/giao-ly/du-tong" element={<Courses />} />
          <Route path="/giao-ly/hon-nhan" element={<GiaoLyPremium />} />
          <Route path="/prayers" element={<Prayers />} />
          <Route path="/prayers/thanh-ca" element={<Hymns />} />
          <Route path="/gioi-thieu" element={<GiaoXuDetail />} />
          <Route path="/tai-lieu" element={<Documents />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/su-kien" element={<EventPage />} />
          <Route path="/su-kien/:slug" element={<EventDetail />} />
          <Route path="/bang-tin" element={<NewsPage />} />
          <Route path="/bang-tin/:slug" element={<NewsPageDetail />} />
          <Route path="/hoi-doan" element={<HoiDoan />} />
          <Route path="/hoi-doan/:slug" element={<GroupDetail />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/exam-search" element={<ExamSearchPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/giao-ho" element={<GiaoHoPage />} />
          <Route path="/exam-prayer" element={<ExamPrayerPage />} />
          <Route path="/search-question" element={<SearchPageQuestion />} />
          <Route path="/lich-phung-vu" element={<CommunitySchedulePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;
