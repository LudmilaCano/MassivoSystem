// import React from 'react'
// import Colors from '../layout/Colors'
// import { Paper } from '@mui/material'
// import logo from '../images/logo2.png'

// const Login = () => {
//   return (
//     <div style={{ backgroundColor: Colors.azul, width: '100%', boxSizing: 'border-box', height: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>{/*Acá un fondo?*/}
//       <Paper elevation={5} sx={{ width: '55%', boxSizing: 'border-box', height: '75vh', borderRadius: 10, display: 'flex', overflow: 'hidden' }}>
//         <div style={{ flex: 0.5, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
//           <div style={{ height: '80%', width: '80%' }}>
//             <div style={{ height: '30%', width: '100%' }}>
//               <div style={{ height: '40%', width: '100%' }}>
//                 <img src={logo} alt="Logo" style={{ width: 'auto', height: '7vh', objectFit: 'contain', }} />
//               </div>
//               <div style={{ height: '40%', width: '100%' }}>
//                 <p style={{ fontSize: 25, fontWeight: 'bold', textTransform: 'uppercase'}}>Bienvenido!</p>
//               </div>
//               <div style={{ height: '20%', width: '100%', display: 'flex' }}>
//                 <div style={{ width: '100%', height: '90%', borderWidth: 1, borderRadius: 15, borderColor: 'grey', alignContent: 'center' }}>
//                   <p>Iniciar sesión con Google?</p>
//                 </div>
//               </div>
//             </div>
//             <div style={{ height: '55%', width: '100%' }}>
//               <div style={{ height: '20%', width: '100%' }}>
//               </div>
//               <div style={{ height: '20%', width: '100%' }}></div>
//               <div style={{ height: '20%', width: '100%' }}></div>
//               <div style={{ height: '20%', width: '100%' }}></div>
//               <div style={{ height: '20%', width: '100%' }}></div>

//             </div>
//             <div style={{ height: '15%', width: '100%' }}>
//               <div style={{ height: '50%', width: '100%' }}></div>
//               <div style={{ height: '50%', width: '100%' }}></div>

//             </div>
//           </div>
//         </div>
//         <div style={{ flex: 0.5, backgroundColor: '#F3F3F3', alignContent: 'center' }}>
//           Acá una imagen ?
//         </div>
//       </Paper>
//     </div>
//   )
// }

// export default Login


import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  Paper,
  Link,
} from '@mui/material';
import Grid from '@mui/material/Grid'
import GoogleIcon from '@mui/icons-material/Google';
import Colors from '../layout/Colors';

export default function LoginPage() {
  return (
    <div style={{ backgroundColor: Colors.azul, width: '100%', boxSizing: 'border-box', height: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>{/*Acá un fondo?*/}
      <Grid container sx={{ minHeight: '80vh', maxWidth: '80vw' }}>
        {/* Left side (Form) */}
        <Grid item xs={12} md={6} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" gutterBottom>Welcome Back</Typography>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{ mb: 2 }}
            >
              Log in with Google
            </Button>

            <Divider sx={{ width: '100%', my: 2 }}>OR LOGIN WITH EMAIL</Divider>

            <TextField
              margin="normal"
              fullWidth
              label="Email Address"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
            />

            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Keep me logged in"
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>

            <Link href="#" variant="body2">
              Forgot your password?
            </Link>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Don't have an account? <Link href="#">Sign up</Link>
            </Typography>
          </Box>
        </Grid>

        {/* Right side (Image or Illustration) */}
        <Grid
          item
          xs={false}
          md={6}
          sx={{
            backgroundImage: `url('/path/to/your/image.svg')`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Grid>
    </div>
  );
}
