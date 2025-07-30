import "./index.css";
import "./index.scss";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/layouts/default/Layout.tsx";
import Loader from "./components/Loader.tsx";
import RequireAdmin from "./routes/guards/RequireAdmin.tsx";
import AuthWatcher from "./components/AuthWatcher";

const Home = lazy(() => import("./pages/Home"));
const UserProfile = lazy(() => import("./pages/user/UserProfile.tsx"));
const LoginUser = lazy(() => import("./pages/LoginUser.tsx"));
const RegistrUser = lazy(() => import("./pages/RegistrUser.tsx"));
const GoogleRegisterUser = lazy(() => import("./pages/GoogleRegisterUser.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const AdminRoutes = lazy(() => import("./routes/adminRoutes"));
const NotFoundPage = lazy(() => import("./pages/common/NotFoundPage.tsx"));

function App() {
  return (
    <>
      <AuthWatcher />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="registr/*" element={<RegistrUser />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="login/*" element={<LoginUser />} />
           <Route path="google-register" element={<GoogleRegisterUser />} />

          <Route path="/admin/*" element={<RequireAdmin />}>
            <Route path="*" element={<AdminRoutes />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
