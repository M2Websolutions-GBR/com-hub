import React, { useEffect, useState } from "react";

import axios from "axios";
import { useSideMenuOpen } from "../contexts/SideMenuContext";
import { useUserContext } from "../contexts/UserContext";

export default function AboutUs() {
  const { sideMenuOpen } = useSideMenuOpen();
  const { setAvatarUrl, setUserData } = useUserContext();
  const [language, setLanguage] = useState("en"); 

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_AUTH}/api/auth/getprofile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data.data;
      setUserData((prevData) => ({
        ...prevData,
        channelName: userData.channelName,
      }));
      if (userData.avatarUrl) {
        setAvatarUrl(userData.avatarUrl);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "de" : "en");
  };

  return (
    <div
      className={`flex items-center justify-center flex-col h-screen transition-all duration-300 ${
        sideMenuOpen ? "ml-60" : ""
      }`}
    >
      <div className="flex-1 sm:w-[90%] lg:w-[80%] xl:w-[70%] p-5">
        <h1 className="mb-4 text-3xl font-bold">
          {language === "en" ? "About Us" : "Über Uns"}
        </h1>
        {language === "en" ? (
          <div>
          <p className="mb-2">
            Welcome to <strong>ComHub</strong>, a community-driven streaming
            platform where users can share and enjoy content. Our team of seven
            passionate developers came together with a shared vision to create
            a space that fosters creativity, connection, and community.
          </p>
          <p className="mb-2">
            Each of us brings a unique set of skills and experiences to the
            table, and together, we have built ComHub from the ground up. We
            believe in the power of technology to bring people together, and we
            are committed to continually improving and expanding our platform
            to better serve our users.
          </p>
          <p className="mb-2">
            Thank you for being a part of ComHub. We are excited to have you
            with us on this journey.
          </p>
          <p className="mt-4 font-semibold">- The ComHub Team</p>
        </div>
        ) : (
          <div>
          <p className="mb-2">
            Willkommen bei <strong>ComHub</strong>, einer von der Community
            betriebenen Streaming-Plattform, auf der Nutzer Inhalte teilen und
            genießen können. Unser Team von sieben leidenschaftlichen
            Entwicklern hat sich zusammengetan, um eine Plattform zu schaffen,
            die Kreativität, Verbindung und Gemeinschaft fördert.
          </p>
          <p className="mb-2">
            Jeder von uns bringt einzigartige Fähigkeiten und Erfahrungen mit,
            und gemeinsam haben wir ComHub von Grund auf aufgebaut. Wir glauben
            an die Kraft der Technologie, Menschen zusammenzubringen, und sind
            bestrebt, unsere Plattform kontinuierlich zu verbessern und zu
            erweitern, um unseren Nutzern besser zu dienen.
          </p>
          <p className="mb-2">
            Vielen Dank, dass Sie Teil von ComHub sind. Wir freuen uns, Sie auf
            dieser Reise dabei zu haben.
          </p>
          <p className="mt-4 font-semibold">- Das ComHub-Team</p>
        </div>
        )}
        <div className="absolute top-20 right-5">
          <div className="bg-gray-200 p-2 rounded-md">
            <button onClick={handleLanguageToggle}>
              {language === "de" ? "EN" : "DE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}