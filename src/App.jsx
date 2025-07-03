import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/contexts/AuthContext";
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
import LoginPage from "@/components/auth/LoginPage";
import SignupPage from "@/components/auth/SignupPage";
import EmailVerificationPage from "@/components/auth/EmailVerificationPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          
          {/* Protected Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />
        </Routes>
        
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
    </AuthProvider>
  );
}

export default App;