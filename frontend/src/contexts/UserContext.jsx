import React, { createContext, useContext, useEffect, useState } from "react";

import ProfileService from "../services/ProfileService";
import avatar from "../assets/avatar.jpg";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [aboutText, setAboutText] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(avatar);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await ProfileService.getProfile(setAboutText, setUserData, setAvatarUrl);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        aboutText,
        setAboutText,
        avatarUrl,
        setAvatarUrl,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
