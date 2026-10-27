import React, { useState } from 'react';
import { loginStyles } from '../assets/dummyStyles';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin, API_URL = "http://localhost:4000" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async (token) => {
    if (!token) return null;
    const res = await axios.get(`${API_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const persistAuth = (profile, token) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    try {
      if (token) storage.setItem("token", token);
      if (profile) storage.setItem("user", JSON.stringify(profile));
    } catch (err) {
      console.error("Storage Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}/api/user/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data || {};
      const token = data.token || null;
      
      let profile = data.user ?? null;
      const copy = { ...data };
      delete copy.token;
      delete copy.user;

      if (Object.keys(copy).length) {
        profile = copy;
      }

      if (!profile && token) {
        try {
          profile = await fetchProfile(token);
        } catch (fetchErr) {
          console.warn("Could not fetch profile after login token:", fetchErr);
          profile = { email };
        }
      }

      if (!profile) {
        profile = { email };
      }

      persistAuth(profile, token);

      if (typeof onLogin === "function") {
        try {
          onLogin(profile, rememberMe, token);
        } catch (callErr) {
          console.warn("onLogin threw:", callErr);
          navigate("/");
        }
      } else {
        navigate("/");
      }

      setPassword("");
    } catch (err) {
      console.error("Login error:", err?.response || err);
      const serverMsg =
        err.response?.data?.message ||
        (err.response?.data ? JSON.stringify(err.response.data) : null) ||
        err.message ||
        "Login failed";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={loginStyles.pageContainer}>
      <div className={loginStyles.cardContainer}>
        <div className={loginStyles.header}>
          <div className={loginStyles.avatar}>
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className={loginStyles.headerTitle}>Welcome Back</h1>
          <p className={loginStyles.headerSubtitle}>
            Sign in to your ExpenseTracker account
          </p>
        </div>

        <div className={loginStyles.formContainer}>
          {error && (
            <div className={loginStyles.errorContainer}>
              <div className={loginStyles.errorIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className={loginStyles.errorText}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className={loginStyles.label}>
                Email Address
              </label>
              <div className={loginStyles.inputContainer}>
                <div className={loginStyles.inputIcon}>
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={loginStyles.input}
                  placeholder="your@example.com"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className={loginStyles.label}>
                Password
              </label>
              <div className={loginStyles.inputContainer}>
                <div className={loginStyles.inputIcon}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={loginStyles.passwordInput}
                  placeholder="••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={loginStyles.submitButton || "w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition duration-200 disabled:opacity-50"}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;