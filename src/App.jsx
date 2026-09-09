import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar/Navbar";

import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import Aboutus from "./pages/Aboutus/Aboutus";
import Careers from "./pages/Careers/Careers";
import News from "./pages/News/News";
import Genai from "./pages/Genai/Genai";
import Web from "./pages/Web/Web";
import CyberSecurity from "./pages/CyberSecurity/CyberSecurity";
import AIforSmallBusinesshero from "./pages/Aiforsmallbussiness/Aiforsmallbussiness";
import Blockchain from "./pages/BlockChain/Blockchain";
import AGICountdown from "./pages/AgiCountdown/AGIEvolution";
import Jobs from "./pages/Jobs/Jobs";
import MyApplications from "./pages/Myapplication/MyApplications";
import AdminApplication from "./pages/Adminapplication/AdminApplication";
import AdminAddJob from "./pages/Adminaddjob/AdminAddJob";

import EnterpriseAgileDevelopment from "./pages/EnterpriseAgileDevelopment/EnterpriseAgileDevelopment";
import EnterpriseTech from "./pages/EnterpriseTech/EnterpriseTech";
import CaseStudy from "./pages/CaseStudy/CaseStudy";
import Portfolio from "./pages/Portfolio/Portfolio";
import ResourceAugmentation from "./pages/Resourcepage/ResourceAugmentation";
import Agi from "./pages/Agi/Agi";

// Insights pages
import Insights from "./pages/Insights/Insights";
import InsightArticle from "./pages/InsightArticle/InsightArticle";
import AdminInsights from "./pages/AdminInsights/AdminInsights";

import Service from "./components/Service/Service";
import Execution from "./components/Execution/Execution";

import Landingslider from "./pages/LandingSlider/LandingSlider";

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* Landing page */}
        <Route path="/" element={<Landingslider />} />

        {/* Main Website */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />

              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/aboutus" element={<Aboutus />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/news" element={<News />} />
                <Route path="/genai" element={<Genai />} />
                <Route path="/web" element={<Web />} />
                <Route path="/cybersecurity" element={<CyberSecurity />} />
                <Route path="/aiforsmallbusiness" element={<AIforSmallBusinesshero />} />
                <Route path="/blockchain" element={<Blockchain />} />
                <Route path="/enterpriseagiledevelopment" element={<EnterpriseAgileDevelopment />} />
                <Route path="/enterprisetech" element={<EnterpriseTech />} />
                <Route path="/casestudy" element={<CaseStudy />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/resourceaugmentation" element={<ResourceAugmentation />} />
                <Route path="/agi" element={<Agi />} />
                <Route path="/agi-countdown" element={<AGICountdown />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/my-applications" element={<MyApplications />} />
                <Route path="/admin-application" element={<AdminApplication />} />
                <Route path="/admin-add-job" element={<AdminAddJob />} />

                {/* Insights Routes */}
                <Route path="/insights" element={<Insights />} />
                <Route path="/insights/:slug" element={<InsightArticle />} />
                <Route path="/admin/insights" element={<AdminInsights />} />

                <Route path="/service" element={<Service />} />
                <Route path="/execution" element={<Execution />} />
              </Routes>
            </>
          }
        />

      </Routes>
    </>
  );
}

export default App;
