import React from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

const MainLayout = ({children}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header>
        <Header />
      </header>
      
      <main style={{ flex: 1 }}>
        {children}
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default MainLayout;
