import { Button, Typography } from '@mui/material'
//import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import Colors from './Colors.jsx';
import logo from '../Images/logo2.png';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/AuthSlice';

const Header = () => {

    //const [logueado, setLogueado] = useState(false);
    const token = useSelector(state => state.auth.token);
    const logueado = !!token;
    //Esto es necesario hacerlo asi porque todo lo referido a login/logout y token esta almacenado en la slice de redux, no se puede hacer con state o context

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const abrirMenu = () => {
        console.log('abrir menu');
    }

    const inicioSesion = () => {
        navigate("/login");
    }

    const cerrarSesion = () => {
        dispatch(logout());
        navigate("/");
    }

    const registro = () => {
        navigate("/register");
    }


    return (
        <div style={{ backgroundColor: Colors.azul, width: '100%', padding: '10px 20px', boxSizing: 'border-box' }}>

            {logueado ?
                <div style={{ flex: 1, justifyContent: 'center', alignContent: 'center', display: 'flex' }}>
                    <div style={{ flex: 0.2, justifyContent: 'center', alignContent: 'center' }}>
                        {/*Acá lo que vaya en el header logueado*/}
                        <Button onClick={() => cerrarSesion()} variant='contained' sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', height: 'auto', color: Colors.azul, backgroundColor: Colors.naranjaOscuro }}>Cerrar Sesión</Button>

                    </div>
                </div>
                :
                <div style={{ justifyContent: 'center', alignContent: 'center', display: 'flex' }}>

                    <div style={{ flex: 0.05, justifyContent: 'center', alignContent: 'center' }}>
                        <Button style={{ width: '100%', borderRadius: 20 }} onClick={() => abrirMenu()}>
                            <MenuIcon sx={{ fontSize: 30, color: Colors.naranjaOscuro }} />
                        </Button>
                    </div>
                    <Button onClick={() => navigate("/")} style={{ flex: 0.2 }} >
                        <div style={{ justifyContent: 'center', alignContent: 'center' }}>
                            <img  src={logo} alt="Logo" style={{ width: 'auto', height: '7vh', objectFit: 'contain', }} />
                        </div>
                    </Button>

                    <div style={{ flex: 0.75, alignContent: 'center', justifyContent: 'flex-end', width: '100%', display: 'flex' }}>
                        <div style={{ alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
                            <Button variant='text' sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', height: 'auto', color: 'white' }} >
                                Nosotros
                            </Button>
                        </div>
                        <div style={{ alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
                            <Button variant='text' sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', color: 'white' }}>
                                Contacto
                            </Button>
                        </div>
                        <div style={{ alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
                            <Button onClick={() => inicioSesion()} variant='contained' sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', height: 'auto', color: Colors.azul, backgroundColor: Colors.naranjaOscuro }}>
                                <Typography variant='body1'>Iniciar Sesión</Typography>
                            </Button>
                        </div>
                        <div style={{ alignContent: 'center', marginLeft: 10, marginRight: 10 }}>
                            <Button onClick={() => registro()} variant='outlined' sx={{ borderRadius: 15, justifyContent: 'center', alignContent: 'center', color: Colors.naranjaOscuro, borderColor: Colors.naranjaOscuro, borderWidth: 3, fontWeight: '600' }}>
                                Registro
                            </Button>
                        </div>

                    </div>
                </div>
            }
        </div>
    )
}

export default Header