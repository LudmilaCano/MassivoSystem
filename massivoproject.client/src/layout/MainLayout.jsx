import React from 'react'
import Header from './Header.jsx'
import Home from '../components/Home.jsx'
import Footer from './Footer.jsx'

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header>
        <Header />
      </header>
      
      <main style={{ flex: 1 }}>
        <Home />
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default MainLayout;
