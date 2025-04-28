import './index.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { AdminRoutes } from './routes/adminRoutes'
import RegistrUser from "./pages/RegistrUser.tsx";

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/registr/*" element={<RegistrUser />} />
      </Routes>
    </>
  )
}

export default App
