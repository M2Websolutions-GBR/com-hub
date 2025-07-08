import { FaBars, FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdLogout, MdUpload } from "react-icons/md";
import React, { useCallback, useEffect, useState } from "react";

import SideMenu from "./SideMenu";
import UploadVideo from "./UploadVideo";
import VideoService from "../services/VideoService";
import axios from "axios";
import comhub from "../assets/comhub.png";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";
import { useSideMenuOpen } from "../contexts/SideMenuContext";
import { useUserContext } from "../contexts/UserContext";
import { useVideoContext } from "../contexts/VideoContext";

const Navbar = ({ setSearchResults }) => {
  const { sideMenuOpen, setSideMenuOpen, toggleSideMenu } = useSideMenuOpen();
  const { setPublicVideoData, setPrivateVideoData } = useVideoContext();
  const { avatarUrl } = useUserContext();

  const [searchText, setSearchText] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  // const [prevUrl, setPrevUrl] = useState("/home");
  const [isFocused, setIsFocused] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  console.log("isUploadOpen", isUploadOpen);

  const handleUploadClick = () => {
    setIsUploadOpen(true);
  };

  const toggleUploadModal = () => {
    setUploadModalOpen(!uploadModalOpen);
  };

  const { setUserData } = useUserContext();

  const handleLogout = () => {
    setSideMenuOpen(false);
    localStorage.removeItem("token");
    setUserData(null);
    navigate("/");
    console.log("logged out successfully");
    toast.success("Logged out successfully!", {
      theme: "colored",
    });
  };

  const fetchSearchResults = async (text) => {
    if (text) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL_DATA}/api/data/search`,
          { text }
        );
        setSearchResults(response.data.data);
        navigate("/search-results");
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      // console.log("Previous URL found:", prevUrl);
      // navigate(prevUrl);
    }
  };

  const debouncedFetchSearchResults = useCallback(
    debounce(fetchSearchResults, 300),
    [location, setSearchResults]
  );

  const handleSearchInputChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    debouncedFetchSearchResults(text);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    debouncedFetchSearchResults.cancel(); // Cancel any ongoing debounce
    fetchSearchResults(searchText);
  };

  const handleFocus = () => {
    if (!isFocused) {
      setSearchText("");
      setIsFocused(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleNewVideo = (newVideo) => {
  console.log("newVideo", newVideo);

  if (newVideo.status === "public") {
    setPublicVideoData((prevData) => ({
      count: (prevData?.count || 0) + 1,
      data: [newVideo, ...(prevData?.data || [])],
    }));

    setTimeout(async () => {
      try {
        await VideoService.getAllPublicVideos(setPublicVideoData, 1);
      } catch (error) {
        console.error("Error fetching updated public videos:", error);
      }
    }, 3000);
  } else if (newVideo.status === "private") {
    setPrivateVideoData((prevData) => ({
      count: (prevData?.count || 0) + 1,
      data: [newVideo, ...(prevData?.data || [])],
    }));

    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        await VideoService.getAllPrivateVideos(setPrivateVideoData, 1, token);
      } catch (error) {
        console.error("Error fetching updated private videos:", error);
      }
    }, 3000);
  } else {
    console.error("Unsupported video type:", newVideo.status);
  }
};


  return (
    <nav className="bg-[#155e75] text-white p-4 shadow-md relative min-h-[72px] flex align-center mb-4">
      <div className="container flex items-center justify-between mx-auto">
        <div className="flex items-center">
          {location.pathname !== "/" &&
            location.pathname !== "/login" &&
            location.pathname !== "/register" && (
              <FaBars
                id="navbar-button"
                className="mr-4 text-xl cursor-pointer hover:text-cyan-500"
                onClick={toggleSideMenu}
              />
            )}
          <Link to="/home" className="text-2xl font-bold">
            <img className="w-20" src={comhub} alt="" />
          </Link>
        </div>
        {location.pathname !== "/" &&
          location.pathname !== "/login" &&
          location.pathname !== "/register" && (
            <form className="flex items-center" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={handleSearchInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-64 h-10 p-2 text-black border border-gray-300 rounded-l-md"
              />
              <button
                type="submit"
                className="bg-[#0e4a5d] text-white p-2 rounded-r-md h-10 flex items-center justify-center hover:text-cyan-500"
              >
                <FaSearch />
              </button>
            </form>
          )}
        {location.pathname !== "/" &&
          location.pathname !== "/login" &&
          location.pathname !== "/register" && (
            <div className="flex items-center">
              <MdUpload
                id="upload-button"
                className="w-6 h-6 text-xl cursor-pointer text-[#FFFFFF] hover:text-cyan-500 mr-4"
                onClick={() => {
                  handleUploadClick();
                  toggleUploadModal();
                }}
              />
              <div className="w-8 h-8 mr-6">
                <Link to="/profile">
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="object-cover w-full h-full rounded-full"
                  />
                </Link>
              </div>
              <MdLogout
                onClick={handleLogout}
                id="logout-button"
                className="w-6 h-6 cursor-pointer hover:text-cyan-500"
              />
            </div>
          )}
      </div>
      <SideMenu isOpen={sideMenuOpen} />
      {uploadModalOpen && (
        <UploadVideo
          isOpen={uploadModalOpen}
          onClose={toggleUploadModal}
          onNewVideo={handleNewVideo}
        />
      )}
    </nav>
  );
};

export default Navbar;
