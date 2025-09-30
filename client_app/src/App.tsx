import "./index.css";
import "./index.scss";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/layouts/default/Layout.tsx";
import Loader from "./components/Loader.tsx";
import RequireAdmin from "./routes/guards/RequireAdmin.tsx";
import AuthWatcher from "./components/AuthWatcher";
import CartProtectedRoute from "./routes/сartRoutes.tsx";
import { ToastContainer } from "react-toastify";
import AboutUsPage from "./pages/About";
import ReturnsPage from "./pages/ReturnsPage";
import ProductQualityPage from "./pages/ProductQualityPage";
import ScrollToTop from "./components/ScrollTop/ScrollToTop.tsx";

const Home = lazy(() => import("./pages/Home"));
const UserProfile = lazy(() => import("./pages/user/UserProfile.tsx"));
const OrderPage = lazy(() => import("./pages/user/orders/OrderPage.tsx"));
const LoginUser = lazy(() => import("./pages/LoginUser.tsx"));
const ConfirmEmailPage = lazy(() => import("./pages/ConfirmEmailPage.tsx"));
const RegistrUser = lazy(() => import("./pages/RegistrUser.tsx"));
const GoogleRegisterUser = lazy(() => import("./pages/GoogleRegisterUser.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const AdminRoutes = lazy(() => import("./routes/adminRoutes"));
const NotFoundPage = lazy(() => import("./pages/common/NotFoundPage.tsx"));
const PasswordUpdatedPage = lazy(
  () => import("./pages/PasswordUpdatedPage.tsx")
);
const ProductDetails = lazy(() => import("./pages/ProductDetails.tsx"));
const CatalogPage = lazy(() => import("./pages/CatalogPage.tsx"));
const CommentsPage = lazy(() => import("./pages/CommentsPage.tsx"));
const OrderSuccess = lazy(() => import("./pages/user/orders/OrderSuccess.tsx"));
const OrderHistoryPage = lazy(
  () => import("./pages/user/orders/OrderHistoryPage.tsx")
);
const UserFavorites = lazy(() => import("./pages/user/UserFavorites.tsx"));
const DeleteAccountPage = lazy(
  () => import("./pages/user/DeleteAccountPage.tsx")
);

function App() {
  return (
    <>
     <ScrollToTop /> {/* 👈 вставляється над усіма маршрутами */}
      <AuthWatcher />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/quality" element={<ProductQualityPage />} />
            <Route index element={<Home />} />
            <Route path="profile">
              <Route index element={<UserProfile />} />
              <Route path="wishlist" element={<UserFavorites />} />
              <Route path="delete" element={<DeleteAccountPage />} />

            </Route>
            <Route
              path="orders"
              element={
                <CartProtectedRoute>
                  <OrderPage />
                </CartProtectedRoute>
              }
            />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="product">
              <Route path="details/:id" element={<ProductDetails />} />
              <Route path=":id/comments" element={<CommentsPage />} />
            </Route>
            <Route path="category/:id" element={<CatalogPage />} />
            {/* <Route path="/catalog/:id" element={<CatalogPage />} /> */}

            

          </Route>

          <Route path="login/*" element={<LoginUser />} />
          <Route path="registr/*" element={<RegistrUser />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="/password-updated" element={<PasswordUpdatedPage />} />
          <Route path="google-register" element={<GoogleRegisterUser />} />
          <Route path="confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/admin/*" element={<RequireAdmin />}>
            <Route path="*" element={<AdminRoutes />} />
          </Route>
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        aria-label="notification"
        limit={1}
      />
    </>
  );
}

export default App;
