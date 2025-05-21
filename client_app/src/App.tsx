import './index.css'
import { Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/layouts/default/Layout.tsx'
import Loader from './components/Loader.tsx'

const Home = lazy(() => import('./pages/Home'))
const UserProfile = lazy(() => import('./pages/user/UserProfile.tsx'))
const LoginUser = lazy(() => import('./pages/LoginUser.tsx'))
const RegistrUser = lazy(() => import('./pages/RegistrUser.tsx'))
const GoogleRegisterUser = lazy(() => import('./pages/GoogleRegisterUser.tsx'))
const AdminRoutes = lazy(() => import('./routes/adminRoutes'))

function App() {
  return (
    <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<UserProfile />} />
        </Route>

        <Route path="/google-register" element={<GoogleRegisterUser />} />
        <Route path="/login/*" element={<LoginUser />} />
        <Route path="/registr/*" element={<RegistrUser />} />

        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Suspense>
  )
}

export default App
