import './index.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layouts/default/Layout.tsx'
import Home from './pages/Home'
import { AdminRoutes } from './routes/adminRoutes'
import RegistrUser from "./pages/RegistrUser.tsx";
import LoginUser from "./pages/LoginUser.tsx";
import GoogleRegisterUser from './pages/GoogleRegisterUser.tsx'


function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} /> 
          <Route path="/google-register" element={<GoogleRegisterUser />} />            
        </Route>
        <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/registr/*" element={<RegistrUser />} />
          <Route path="/login/*" element={<LoginUser />} />
      </Routes>
    </>
  )
}

export default App
