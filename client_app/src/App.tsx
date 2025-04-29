import './index.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layouts/default/Layout.tsx'
import Home from './pages/Home'
import { AdminRoutes } from './routes/adminRoutes'
import RegistrUser from "./pages/RegistrUser.tsx";
import LoginPage from './pages/LoginPage.tsx'

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />          
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/registr/*" element={<RegistrUser />} />
      </Routes>
    </>
  )
}

export default App
