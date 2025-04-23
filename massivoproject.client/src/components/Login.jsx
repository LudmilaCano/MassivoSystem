import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Divider,
    Paper,
    Link,
    InputAdornment,
    IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid'
import LoginIcon from '@mui/icons-material/Login';
import Colors from '../layout/Colors';
import loginIllustration from '../images/login.svg';
import Logo2 from '../images/logo2.png'
//import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {AuthenticationService} from '../api/AuthenticationEndPoints';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/authSlice';



const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [dniOrEmail, setDniOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const token = await AuthenticationService(dniOrEmail, password);
            if (token) {
                dispatch(setToken(token));
                navigate('/'); // provisorio, navega a home después del login sin importar el rol de usuario
            }
        } catch (err) {
            console.error('Login error', err);
        }
    };

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }


    return (
        <div style={{ backgroundColor: Colors.azul, width: '100%', boxSizing: 'border-box', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>{/*Acá un fondo?*/}
            <Grid container sx={{ maxHeight: '80vh', maxWidth: '60vw' }}>
                <Grid item xs={12} md={6} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            mt: 4,
                            mb: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            component="img"
                            src={Logo2}
                            alt="Logo"
                            sx={{ width: { xs: '30vw', md: '15vw' }, mb: '5vh' }}
                        />

                        <Typography variant="h4" gutterBottom>Inicio de Sesión</Typography>


                        <TextField
                            margin="normal"
                            label="Email"
                            autoComplete="email"
                            sx={{ width: { xs: '50vw', md: '20vw', '& label.Mui-focused': { color: '#139AA0' }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#139AA0' } } } }}
                            onChange={(e) => setDniOrEmail(e.target.value)}

                        />
                        <TextField
                            margin="normal"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            sx={{ width: { xs: '50vw', md: '20vw', '& label.Mui-focused': { color: '#139AA0' }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#139AA0' } } } }}

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handlePasswordVisibility}
                                            edge="end"
                                            aria-label="change password visibility"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            onChange={(e) => setPassword(e.target.value)}

                        />

                        <Box sx={{ width: { xs: '50vw', md: '20vw' }, display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Link href="#" variant="body2" sx={{ color: '#139AA0' }}>
                                Olvidé mi contraseña
                            </Link>
                        </Box>

                        <Button onClick={handleLogin}
                            variant="contained"
                            sx={{ width: { xs: '50vw', md: '20vw' }, mt: 3, mb: 2, backgroundColor: '#139AA0' }}
                            endIcon={<LoginIcon />}
                        >
                            INGRESAR
                        </Button>


                        <Typography variant="body2" sx={{ mt: 2 }}>
                            No tenés una cuenta? <Link href="#" sx={{ color: '#139AA0' }}>REGISTRARME</Link>
                        </Typography>

                        <Divider sx={{ width: '100%', my: 2, borderColor: (theme) => theme.palette.grey[500] }}></Divider>

                        {/*esto queda comentado provisoriamente porque necesita una configuracion extra*/}


                        {/*<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">*/}
                        {/*    <GoogleLogin*/}
                        {/*        onSuccess={credentialResponse => {*/}
                        {/*            console.log(credentialResponse);*/}
                        {/*        }}*/}
                        {/*        onError={() => {*/}
                        {/*            console.log('Login Failed');*/}
                        {/*        }}*/}
                        {/*        size='large'*/}
                        {/*        ux_mode='redirect'*/}
                        {/*        width={'100%'}*/}
                        {/*    />*/}
                        {/*</GoogleOAuthProvider>*/}

                    </Box>
                </Grid>

                <Grid
                    item
                    xs={false}
                    md={6}
                    sx={{
                        backgroundImage: `url(${loginIllustration})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
        </div>
    );

}

export default Login;

//import React, { useState } from 'react'
//import { useDispatch } from 'react-redux';
//import { setToken } from '../redux/authSlice';
//import { AuthenticationService } from '../services/authentication/EndPoints';
//import { useNavigate } from 'react-router';

//const Login = () => {
//    const [dniOrEmail, setDniOrEmail] = useState('');
//    const [password, setPassword] = useState('');

//    const navigate = useNavigate();
//    const dispatch = useDispatch();

//    const handleLogin = async (event) => {
//        event.preventDefault();
//        try {
//            const token = await AuthenticationService(dniOrEmail, password);
//            if (token) {
//                dispatch(setToken(token));
//                navigate('/'); // provisorio, navega a home después del login sin importar el rol de usuario
//            }
//        } catch (err) {
//            console.error('Login error', err);
//        }
//    };

//    return (
//        <form onSubmit={handleLogin}>
//            <label>dni o email:</label>
//            <input
//                placeholder="dni or email..."
//                value={dniOrEmail}
//                onChange={(e) => setDniOrEmail(e.target.value)}
//            />
//            <label>password:</label>
//            <input
//                type="password"
//                placeholder="password..."
//                value={password}
//                onChange={(e) => setPassword(e.target.value)}
//            />
//            <button type="submit">Iniciar Sesión</button>
//        </form>
//    );
//};


//export default Login;