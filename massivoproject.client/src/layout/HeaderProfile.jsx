import React from 'react'
import { Button, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import Colors from './Colors.jsx'
import logo from '../Images/logo.png'
import { logout } from '../redux/AuthSlice' // Asegúrate de importar la acción logout de Redux

const HeaderPerfil = () => {
  const { fullName, role } = useSelector(state => state.auth) // Usamos los datos del estado de Redux
  const dispatch = useDispatch() // Para despachar la acción de logout
  const navigate = useNavigate()

  
    const handleBackToHome = () => {
      navigate('/');  // Esto navegará a la ruta principal (Home)
    };

  const handleLogout = () => {
    dispatch(logout()) // Despachamos la acción de logout
    navigate("/login") // Redirigimos al usuario a la pantalla de login
  }

  return (
    <div style={{ backgroundColor: Colors.azul, width: '100%', padding: '10px 20px', boxSizing: 'border-box' }}>
      <div style={{ justifyContent: 'center', alignContent: 'center', display: 'flex' }}>
        <div style={{ flex: 0.2, justifyContent: 'center', alignContent: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: 'auto', height: '7vh', objectFit: 'contain' }} />
        </div>

        <div style={{ flex: 0.75, alignContent: 'center', justifyContent: 'flex-end', width: '100%', display: 'flex' }}>
          <div style={{ alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
            <Typography variant="body1" style={{ color: 'white', fontWeight: 'bold' }}>
              {fullName} - {role}
            </Typography>
          </div>

          {role === 'Admin' && (
            <div style={{ alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
              <Button variant="outlined" sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', color: Colors.naranjaOscuro, borderColor: Colors.naranjaOscuro, borderWidth: 3, fontWeight: '600' }} onClick={() => navigate("/admin")}>
                Panel Admin
              </Button>
            </div>
          )}

          <div style={{ alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
            <Button variant="outlined" sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', color: Colors.naranjaOscuro, borderColor: Colors.naranjaOscuro, borderWidth: 3, fontWeight: '600' }} onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <div style={{ alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
            <Button variant="outlined" sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', color: Colors.naranjaOscuro, borderColor: Colors.naranjaOscuro, borderWidth: 3, fontWeight: '600' }} onClick={handleBackToHome}>
              MENU
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default HeaderPerfil
