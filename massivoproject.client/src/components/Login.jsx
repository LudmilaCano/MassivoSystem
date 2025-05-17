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
import Logo2 from '../images/logo2.png';
import CircularProgress from '@mui/material/CircularProgress';
//import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthenticationService } from '../api/AuthenticationEndPoints';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/AuthSlice';
import useSwalAlert from '../hooks/useSwalAlert';



const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [dniOrEmail, setDniOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showAlert } = useSwalAlert();


    const handleLogin = async (e) => {
        e.preventDefault();
        let hasError = false;

        setEmailError('');
        setPasswordError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión para habilitar solo mail en este campo.
        if (!dniOrEmail) {
            setEmailError('Debe ingresar este campo');
            hasError = true;
        } else if (!emailRegex.test(dniOrEmail)) {
            setEmailError('Formato de email inválido');
            hasError = true;
        }

        if (password && !dniOrEmail) {
            setEmailError('Debe ingresar este campo');
            hasError = true;
        }

        if (!password) {
            setPasswordError('Debe ingresar este campo');
            hasError = true;
        }

        if (hasError) return;
        setLoading(true);

        try {
            const token = await AuthenticationService(dniOrEmail, password);
            console.log(token)
            if (token) {
                dispatch(setToken(token));
                navigate('/');
                
                showAlert('Bienvenido', 'success');
            } 
        } catch (err) {
           
            showAlert('Usuario o contraseña incorrectos', 'error');

            setDniOrEmail("");
            setPassword("");
        }finally {
        setLoading(false); 
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
                            error={!!emailError}
                            helperText={emailError}
                            sx={{
                                width: { xs: '50vw', md: '20vw' },
                                '& label.Mui-focused': { color: '#139AA0' },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: '#139AA0' }
                                }
                            }}
                            value={dniOrEmail}
                            onChange={(e) => setDniOrEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            error={!!passwordError}
                            helperText={passwordError}
                            sx={{
                                width: { xs: '50vw', md: '20vw' },
                                '& label.Mui-focused': { color: '#139AA0' },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: '#139AA0' }
                                }
                            }}
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
                            value={password}
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