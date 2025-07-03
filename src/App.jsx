import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import EmailTemplateGallery from "@/components/organisms/EmailTemplateGallery";
import LeadsPage from "@/components/pages/LeadsPage";
import CampaignBuilderPage from "@/components/pages/CampaignBuilderPage";
import AccountsPage from "@/components/pages/AccountsPage";
import AnalyticsPage from "@/components/pages/AnalyticsPage";
import SettingsPage from "@/components/pages/SettingsPage";
import CampaignsPage from "@/components/pages/CampaignsPage";
import InboxPage from "@/components/pages/InboxPage";
import AbTestingPage from "@/components/pages/AbTestingPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
<Routes>
          <Route path="/" element={<CampaignsPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/new" element={<CampaignBuilderPage />} />
          <Route path="/campaigns/:id/edit" element={<CampaignBuilderPage />} />
          <Route path="/templates" element={<EmailTemplateGallery />} />
          <Route path="/ab-testing" element={<AbTestingPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </div>
  );
}

export default App;