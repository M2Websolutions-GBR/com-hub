import React, { useEffect, useState } from "react";

import axios from "axios";
import { useSideMenuOpen } from "../contexts/SideMenuContext";
import { useUserContext } from "../contexts/UserContext";

export default function ContactUs() {
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
          {language === "en" ? "Contact Us" : "Kontakt"}
        </h1>
        {language === "en" ? (
          <div>
            <p className="mb-2">
              Thank you for your interest in <strong>ComHub</strong>. If you have
              any questions or need further information, please do not hesitate
              to contact us.
            </p>
            <p className="mb-2">
              You can reach us at the following email address:{" "}
              <a
                href="mailto:support@comhub.com"
                className="text-cyan-800 hover:text-cyan-600"
              >
                support@comhub.com
              </a>
            </p>
            <p className="mb-2">
              Or follow us on our social media channels to get the latest
              updates:
            </p>
            <ul className="mb-2 list-disc list-inside">
              <li>
                <a
                  href="https://twitter.com/comhub"
                  className="text-cyan-800 hover:text-cyan-600"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/comhub"
                  className="text-cyan-800 hover:text-cyan-600"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/comhub"
                  className="text-cyan-800 hover:text-cyan-600"
                >
                  Instagram
                </a>
              </li>
            </ul>
            <p className="mt-4 font-semibold">- The ComHub Team</p>
          </div>
        ) : (
          <div>
            <p className="mb-2">
              Wir freuen uns über Ihr Interesse an <strong>ComHub</strong>. Wenn
              Sie Fragen haben oder weitere Informationen benötigen, zögern Sie
              bitte nicht, uns zu kontaktieren.
            </p>
            <p className="mb-2">
              Sie können uns unter der folgenden E-Mail-Adresse erreichen:{" "}
              <a
                href="mailto:support@comhub.com"
                className="text-cyan-800 hover:text-cyan-600"
              >
                support@comhub.com
              </a>
            </p>
            <p className="mb-2">
              Oder folgen Sie uns auf unseren Social-Media-Kanälen, um die
              neuesten Updates zu erhalten:
            </p>
            <ul className="mb-2 list-disc list-inside">
              <li>
                <a
                  href="https://twitter.com/comhub"
                  className="text-cyan-800 hover:text-cyan-600"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/comhub"
                  className="text-cyan-800 hover:text-cyan-600"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/comhub"
                  className="text-cyan-800 hover:text-cyan-600"
                >
                  Instagram
                </a>
              </li>
            </ul>
            <p className="mt-4 font-semibold">- The ComHub Team</p>
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
