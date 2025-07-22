import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import ProfileService from "../services/ProfileService";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useUserContext } from "../contexts/UserContext";

const LogIn = () => {
  const navigate = useNavigate();
  const { setUserData, setAboutText, setAvatarUrl } = useUserContext();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = loginData;

  const onChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL_AUTH}/api/auth/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res && res.data) {
        const token = res.data.token;
        localStorage.setItem("token", token);

        try {
          const profile = await ProfileService.getProfile(
            setAboutText,
            setUserData,
            setAvatarUrl
          );
          setUserData(profile);
          toast.success("Logged in successfully!", {
            theme: "colored",
          });
          navigate("/home");
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
          toast.error("Failed to fetch user profile.");
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Login failed.");
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL_AUTH}/api/auth/googlelogin`,
        { tokenId: credentialResponse.credential },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res && res.data) {
        localStorage.setItem("token", res.data.token);
        try {
          const profile = await ProfileService.getProfile(
            setAboutText,
            setUserData,
            setAvatarUrl
          );
          setUserData(profile);
          toast.success("Logged in successfully!", {
            theme: "colored",
          });
          navigate("/home");
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
          toast.error("Failed to fetch user profile.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  const onGoogleError = () => {
    toast.error("Google login failed");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form
          onSubmit={onSubmit}
          className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md"
        >
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Email"
            />
          </div>
          <div className="mb-6">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              id="login-button"
              className="bg-[#155e75] hover:text-cyan-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Log In
            </button>
            <Link to="/register" className="text-[#155e75] hover:text-cyan-600">
              Click here to register
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Link to="/forgot-password" className="text-[#155e75] hover:text-cyan-600">
              Forgot password?
            </Link>
            <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
