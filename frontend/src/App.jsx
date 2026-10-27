import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/income";
import Login from "./pages/Login";
import Signup from "./components/Signup";
import axios from "axios";
import Expense from "./pages/Expense";
import Profile from "./pages/Profile";

const API_URL = "http://localhost:4000";

const getTransactionsFromStorage = () => {
  const saved = localStorage.getItem("transactions");
  return saved ? JSON.parse(saved) : [];
};

const ProtectedRoute = ({ user, children }) => {
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  const hasToken = localToken || sessionToken;

  if (!user || !hasToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const persistAuth = (userData, tokenFromApi, remember = false) => {
    const storage = remember ? localStorage : sessionStorage;
    try {
      if (tokenFromApi) {
        storage.setItem("token", tokenFromApi);
        setToken(tokenFromApi);
      }
      if (userData) {
        storage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      console.error("Error saving auth data:", error);
    }
  };

  const clearAuth = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
    setUser(null);
    setToken(null);
  };

  const updateUserData = (updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const localUserRaw = localStorage.getItem("user");
        const sessionUserRaw = sessionStorage.getItem("user");
        const localToken = localStorage.getItem("token");
        const sessionToken = sessionStorage.getItem("token");

        const storedUser = localUserRaw
          ? JSON.parse(localUserRaw)
          : sessionUserRaw
          ? JSON.parse(sessionUserRaw)
          : null;

        const storedToken = localToken || sessionToken || null;
        const tokenFromLocal = !!localToken;

        if (storedUser) {
          setUser(storedUser);
          setToken(storedToken);
        } else if (storedToken) {
          try {
            const res = await axios.get(`${API_URL}/api/user/me`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            const profile = res.data;
            persistAuth(profile, storedToken, tokenFromLocal);
          } catch (fetchErr) {
            console.warn("Could not fetch profile with the stored token:", fetchErr);
            clearAuth();
          }
        }
      } catch (error) {
        console.error("error bootstrapping auth:", error);
      } finally {
        setIsLoading(false);
        try {
          setTransactions(getTransactionsFromStorage());
        } catch (txErr) {
          console.error("Error loading transactions:", txErr);
        }
      }
    })();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    } catch (err) {
      console.error("error saving transactions:", err);
    }
  }, [transactions]);

  const handleLogin = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  };

  const handleSignup = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const addTransaction = (newTransaction) =>
    setTransactions((p) => [newTransaction, ...p]);

  const editTransaction = (id, updatedTransaction) =>
    setTransactions((p) =>
      p.map((t) => (t.id === id ? { ...updatedTransaction, id } : t))
    );

  const deleteTransaction = (id) =>
    setTransactions((p) => p.filter((t) => t.id !== id));

  const refreshTransactions = () =>
    setTransactions(getTransactionsFromStorage());

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login API_URL={API_URL} onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup API_URL={API_URL} onSignup={handleSignup} />} />

        {/* Protected Layout Routes */}
        <Route
          element={
            <ProtectedRoute user={user || localStorage.getItem("user") || sessionStorage.getItem("user")}>
              <Layout 
                user={user} 
                onLogout={handleLogout}
                transactions={transactions}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            </ProtectedRoute>
          }
        >
          <Route 
            path="/" 
            element={
              <Dashboard 
                transactions={transactions} 
                addTransaction={addTransaction} 
                deleteTransaction={deleteTransaction} 
              />
            } 
          />
          <Route 
            path="/income" 
            element={
              <Income 
                transactions={transactions}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            } 
          />
          <Route 
            path="/expenses" 
            element={
              <Expense 
                transactions={transactions}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            } 
          />
          <Route 
            path="/profile" 
            element={
              <Profile 
                user={user} 
                onUpdateProfile={updateUserData} 
                onLogout={handleLogout} 
              />
            } 
          />
        </Route>

        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </>
  );
};

export default App;