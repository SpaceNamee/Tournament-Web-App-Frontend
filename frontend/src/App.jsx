import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Home/Header/Header";
import LoginMain from "./components/Login/LoginMain";
import LoginEmailVerification from "./components/Login/LoginEmailVerification";
import SignIn from "./components/Registration/Register";
import SignInEmailVerification from "./components/Registration/RegisterEmailVerification";
import Age from "./components/Registration/Age";
import Tournaments from "./components/Home/Tournaments/Tournaments";
import Teams from "./components/Home/Teams/Teams";
import CreateTournament from "./components/Home/CreateTournament/CreateTournament";
import CreateTeam from "./components/Home/CreateTeam/CreateTeam";
import ChangeTournamentDetails from "./components/Home/Tournaments/ChangeTournamentDetails";
import ViewTournamentDetails from "./components/Home/Tournaments/ViewTournamentDetails";
import ChangeTeamDetails from "./components/Home/Teams/ChangeTeamDetails";
import ViewTeamDetails from "./components/Home/Teams/ViewTeamDetails";
import Profile from "./components/Home/Header/Profile/Profile";
import EditProfile from "./components/Home/Header/Profile/EditProfile";
import TeamManagement from "./components/Home/Header/EditTeam/TeamManagement";
import TeamSettings from "./components/Home/Header/EditTeam/TeamSettings";
import TeamSettingsLogo from "./components/Home/Header/EditTeam/TeamSettingsLogo";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  useEffect(() => {
    const handleUnload = () => localStorage.clear();
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (!isEmailVerified) return <Navigate to="/login-email-verification" replace />;
    return children;
  };

  return (
    <>
      {isLoggedIn && isEmailVerified && (
        <Header
          setIsLoggedIn={setIsLoggedIn}
          setIsEmailVerified={setIsEmailVerified}
        />
      )}

      <Routes>
        {/* ROOT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <LoginMain
                setIsLoggedIn={setIsLoggedIn}
                setIsEmailVerified={setIsEmailVerified}
              />
            ) : (
              <Navigate to="/tournaments" replace />
            )
          }
        />

        {/* LOGIN EMAIL VERIFICATION */}
        <Route
          path="/login-email-verification"
          element={
            isLoggedIn && !isEmailVerified ? (
              <LoginEmailVerification
                setIsEmailVerified={setIsEmailVerified}
              />
            ) : (
              <Navigate to="/tournaments" replace />
            )
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            !isLoggedIn ? (
              <SignIn
                setIsLoggedIn={setIsLoggedIn}
                setIsEmailVerified={setIsEmailVerified}
              />
            ) : (
              <Navigate to="/tournaments" replace />
            )
          }
        />
        <Route
          path="/verify-email"
          element={
            !isEmailVerified ? (
              <SignInEmailVerification
                setIsEmailVerified={setIsEmailVerified}
                redirectTo="/verify-age"
              />
            ) : (
              <Navigate to="/verify-age" replace />
            )
          }
        />

        {/* AGE */}
        <Route
          path="/verify-age"
          element={
            !isAgeVerified ? (
              <Age setIsAgeVerified={setIsAgeVerified} />
            ) : (
              <Navigate to="/tournaments" replace />
            )
          }
        />
        <Route path="/tournaments" element={<ProtectedRoute><Tournaments /></ProtectedRoute>} />
        <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
        <Route path="/create-tournament" element={<ProtectedRoute><CreateTournament /></ProtectedRoute>} />
        <Route path="/create-team" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
        <Route path="/change-tournament-details" element={<ProtectedRoute><ChangeTournamentDetails /></ProtectedRoute>} />
        <Route path="/tournament-details" element={<ProtectedRoute><ViewTournamentDetails /></ProtectedRoute>} />
        <Route path="/change-team-details" element={<ProtectedRoute><ChangeTeamDetails /></ProtectedRoute>} />
        <Route path="/team-details" element={<ProtectedRoute><ViewTeamDetails /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/team-management" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
        <Route path="/team-settings" element={<ProtectedRoute><TeamSettings /></ProtectedRoute>} />
        <Route path="/team-settings-logo" element={<ProtectedRoute><TeamSettingsLogo /></ProtectedRoute>} />
        <Route path="*" element={<h1 className="text-white text-center mt-20">404 - Page Not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
