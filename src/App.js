import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import '@fontsource/montserrat';
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import Home from './pages/Home';
import Login from "./pages/Login";
import Register from "./pages/Register"
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
