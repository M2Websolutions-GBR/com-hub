import React, { useState } from "react";

import { Link } from "react-router-dom";
import comhublogo from "../assets/comhublogo.png";
import { useSideMenuOpen } from "../contexts/SideMenuContext";

export default function LandingView() {
  const { sideMenuOpen } = useSideMenuOpen();
  const [language, setLanguage] = useState("en");

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "de" : "en");
  };

  return (
    <div
      className={`container mx-auto p-4 flex flex-col h-screen transition-all duration-300 ${
        sideMenuOpen ? "ml-60" : ""
      }`}
    >
      <div className="flex flex-row items-center justify-center gap-10">
        <div className="w-48">
          <img src={comhublogo} alt="" />
        </div>
        <div className="w-1/2">
          {language === "en" ? (
            <>
              <h2 className="text-2xl font-bold">Welcome to ComHub</h2>
              <br />
              <h3 className="font-bold text-l">Connect | Share | Inspire</h3>
              <p>
                The streaming platform for the community, where families and
                colleagues can create private channels and share videos
                privately!
              </p>
              <p>
                Watch videos, upload your own, and share them with your loved
                ones!
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Willkommen bei ComHub</h2>
              <br />
              <h3 className="font-bold text-l">
                Verbinde | Teile | Inspiriere
              </h3>
              <p>
                Die Streaming Plattform für die Community, wo Familien und
                Kollegen private Channel bilden und Videos privat teilen können!
              </p>
              <p>
                Schauen Sie Videos, laden Sie auch welche hoch und teilen Sie
                diese mit Ihren Lieben!
              </p>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <Link
          to="/login"
          className="bg-[#155e75] text-white px-4 py-2 rounded-lg mb-6"
        >
          {language === "en" ? "Start NOW!" : "Starte JETZT!"}
        </Link>
      </div>
      {/* Pseudo-Kundenbewertungen */}
      <div className="flex flex-col items-center w-full">
        <div className="w-full max-w-3xl">
          {language === "en" ? (
            <>
              <Testimonial
                quote="Great platform that helps me and my family share videos and progress with each other."
                author="Marco Bäcker"
              />
              <Testimonial
                quote="As a teacher, I use ComHub to securely share class videos with my students. The platform is easy to use and reliable."
                author="Anna Müller"
              />
            </>
          ) : (
            <>
              <Testimonial
                quote="Tolle Platform, die mir und meiner Familie hilft 
              untereinander Videos und Entwicklungsstände zu teilen."
                author="Marco Bäcker"
              />
              <Testimonial
                quote="Als Lehrerin nutze ich ComHub, um Klassenvideos sicher mit meinen
              Schüler*innen zu teilen. Die Plattform ist einfach zu bedienen und
              zuverlässig."
              author="Anna Müller"
            />
          </>
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
    </div>
  );
}

const Testimonial = ({ quote, author }) => (
  <div className="p-4 mb-6 border border-gray-300 rounded-md">
    <p className="text-lg font-semibold">"{quote}"</p>
    <p className="mt-2 text-sm">- {author}</p>
  </div>
);
