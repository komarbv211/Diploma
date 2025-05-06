import './index.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layouts/default/Layout.tsx'
import Home from './pages/Home'
import { AdminRoutes } from './routes/adminRoutes'
import RegistrUser from "./pages/RegistrUser.tsx";
import UserProfile from './pages/user/UserProfile.tsx'
import LoginUser from "./pages/LoginUser.tsx";
import GoogleRegisterUser from './pages/GoogleRegisterUser.tsx'


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<UserProfile />} />
        </Route>

        <Route path="/google-register" element={<GoogleRegisterUser />} />
        <Route path="/login/*" element={<LoginUser />} />
        <Route path="/registr/*" element={<RegistrUser />} />

        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes >
    </>
  )
}

export default App
