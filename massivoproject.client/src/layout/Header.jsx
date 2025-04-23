import { Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import Colors from './Colors.jsx';
import logo from '../Images/logo.png';
import { useNavigate } from 'react-router';

const Header = () => {

    const [logueado, setLogueado] = useState(false);

    const navigate = useNavigate();

    const abrirMenu = () => {
        console.log('abrir menu');
    }

    const inicioSesion = () => {
        navigate("/login");
    }

    const profile = () => {
        navigate("/profile");
    }




    return (
        <div style={{ backgroundColor: Colors.azul, width: '100%', padding: '10px 20px', boxSizing: 'border-box'}}>

            {logueado ?
                <div style={{ flex: 1, justifyContent: 'center', alignContent: 'center', display: 'flex' }}>
                    <div style={{ flex: 0.2, justifyContent: 'center', alignContent: 'center' }}>
                        Acá lo que vaya en el header logueado
                    </div>
                </div>
                :
                <div style={{ justifyContent: 'center', alignContent: 'center', display: 'flex' }}>

                    <div style={{ flex: 0.05, justifyContent: 'center', alignContent: 'center' }}>
                        <Button style={{ width: '100%', borderRadius: 20 }} onClick={() => abrirMenu()}>
                            <MenuIcon sx={{ fontSize: 30, color: Colors.naranjaOscuro }} />
                        </Button>
                    </div>
                    <div style={{ flex: 0.2, justifyContent: 'center', alignContent: 'center' }}>
                        <img src={logo} alt="Logo" style={{ width: 'auto', height: '7vh', objectFit: 'contain', }} />
                    </div>

                    <div style={{ flex: 0.75, alignContent: 'center', justifyContent: 'flex-end', width: '100%', display: 'flex' }}>
                        <div style={{  alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
                            <Button variant='text' sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', height: 'auto', color: 'white' }} >
                                Nosotros
                            </Button>
                        </div>
                        <div style={{alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
                            <Button variant='text' sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', color: 'white' }}>
                                Contacto
                            </Button>
                        </div>
                        <div style={{  alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
                            <Button onClick={() => inicioSesion()} variant='contained' sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', height: 'auto', color: Colors.azul, backgroundColor: Colors.naranjaOscuro }}>
                                <Typography variant='body1'>Iniciar Sesión</Typography>
                            </Button>
                        </div>
                        <div style={{  alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
                            <Button variant='outlined' sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', color: Colors.naranjaOscuro, borderColor: Colors.naranjaOscuro, borderWidth: 3, fontWeight: '600' }}>
                                Registro
                            </Button>
                        </div>
                        <div style={{  alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
                            <Button onClick={() => profile()} variant='outlined' sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', color: Colors.naranjaOscuro, borderColor: Colors.naranjaOscuro, borderWidth: 3, fontWeight: '600' }}>
                                Profile
                            </Button>
                        </div>

                    </div>
                </div>
            }
        </div>
    )
}

export default Header