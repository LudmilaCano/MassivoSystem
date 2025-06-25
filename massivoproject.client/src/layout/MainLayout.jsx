import React from "react";
//import { useLocation } from 'react-router-dom'
import Header from "./Header.jsx";
import HeaderPerfil from "./HeaderProfile.jsx";
import Footer from "./Footer.jsx";

const MainLayout = ({ children }) => {
  //const location = useLocation()

  // Comprobamos si estamos en la página de perfil para usar el HeaderPerfil
  //const isProfilePage = location.pathname === '/profile'

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header>
        <HeaderPerfil />
        {/*{isProfilePage ? <HeaderPerfil /> : <Header />}*/}
        {/*  <Header/> */}
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      {/* <footer>
        <Footer />
      </footer> */}
    </div>
  );
};

export default MainLayout;
