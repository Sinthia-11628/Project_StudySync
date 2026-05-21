import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import "./App.css";

/* Lazy Loaded Pages */
const Home = lazy(() => import("./components/home/Home"));
const LoginForm = lazy(() => import("./components/auth/login/Login"));
const RegistrationForm = lazy(
  () => import("./components/auth/registration/Registration"),
);
const ForgotPasswordForm = lazy(
  () => import("./components/auth/forget_pass/ForgetPassword"),
);
const VerifyCode = lazy(
  () => import("./components/auth/forget_pass/VerifyCode"),
);
const ResetPassword = lazy(
  () => import("./components/auth/forget_pass/ResetPassword"),
);
const UserProfile = lazy(() => import("./components/profile/UserProfile"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));

/* Navbar Import */
import ProtectedNavbar from "./components/home/section/ProtectedNavbar";

// ==========================================
// 🎨 SIMPLE NAVBAR LAYOUT (কোনো লগ-ইন চেক নেই)
// ==========================================
const NavbarLayout = () => {
  return (
    <>
      <ProtectedNavbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  );
};

function App() {
  const location = useLocation();

  /* Scroll to top on route change */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
          Loading StudySync...
        </div>
      }
    >
      <Routes>
        {/* 🌎 Home */}
        <Route path="/" element={<Home />} />

        {/* 🚪 Authentication */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route
          path="/register"
          element={<Navigate to="/registration" replace />}
        />

        {/* 🔑 Password Recovery */}
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🖥️ Pages with ProtectedNavbar (No Restrictions) */}
        <Route element={<NavbarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* ⚠️ Optional 404 Route */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen text-center">
              <div>
                <h1 className="text-5xl font-bold mb-4">404</h1>
                <p className="text-gray-600">Page Not Found</p>
              </div>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
