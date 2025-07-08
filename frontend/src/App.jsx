import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import AboutUs from "./views/AboutUsView";
import ChannelView from "./views/ChannelView";
import ContactUs from "./views/ContactUsView";
import FeelingsView from "./views/FeelingsView";
import HistoryListView from "./views/HistoryListView";
import HomeView from "./views/HomeView";
import LandingView from "./views/LandingView";
import LogInView from "./views/LogInView";
import ForgotPasswordView from "./views/ForgotPasswordView";
import ResetPasswordView from "./views/ResetPasswordView";
import Navbar from "./components/NavBar";
import PlayView from "./views/PlayView";
import PrivateRoute from "./components/PrivateRoute";
import ProfileView from "./views/ProfileView";
import Register from "./components/Register";
import SearchResultView from "./views/SearchResultView";
import SettingsView from "./views/SettingsView";
import { SideMenuProvider } from "./contexts/SideMenuContext";
import SubscriptionsView from "./views/SubscriptionView";
import { ToastContainer } from "react-toastify";
import { UserContextProvider } from "./contexts/UserContext";
import { VideoContextProvider } from "./contexts/VideoContext";

function App() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <SideMenuProvider>
      <UserContextProvider>
        <VideoContextProvider>
          <div className="flex flex-col h-screen">
            <Navbar setSearchResults={setSearchResults} />
            <Routes>
              <Route path="/" element={<LandingView />} />
              <Route path="/login" element={<LogInView />} />
              <Route path="/forgot-password" element={<ForgotPasswordView />} />
              <Route path="/resetpassword/:token" element={<ResetPasswordView />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <HomeView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/play/:id"
                element={
                  <PrivateRoute>
                    <PlayView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfileView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <SettingsView />
                    </PrivateRoute>
                }
              />
              <Route
                path="/liked"
                element={
                  <PrivateRoute>
                    <FeelingsView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <PrivateRoute>
                    <SubscriptionsView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/search-results"
                element={
                  <PrivateRoute>
                    <SearchResultView results={searchResults} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/channel/:channelId"
                element={
                  <PrivateRoute>
                    <ChannelView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <HistoryListView />
                  </PrivateRoute>
                }
              />
              <Route
                path="about"
                element={
                  <PrivateRoute>
                    <AboutUs />
                  </PrivateRoute>
                }
              />
              <Route
                path="contact"
                element={
                  <PrivateRoute>
                    <ContactUs />
                  </PrivateRoute>
                }
              />
            </Routes>
            <ToastContainer position="bottom-right" />
          </div>
        </VideoContextProvider>
      </UserContextProvider>
    </SideMenuProvider>
  );
}

export default App;
