import api from './AxiosBaseConnection';

//conexion a los endpoints de AuthenticationController.cs

export const AuthenticationService = async (dniOrEmail, password) => {
    const response = await api.post('/authentication/Authenticate',
        {
            dniOrEmail: dniOrEmail,
            password: password,
        },
    );
    if (response.status === 200) {
        return response.data;  
    } else {
        return { token: "", recoveryMode: false, message: "Error de autenticación" };
    }

}


export const ForgotPasswordService = async (email) => {
  const response = await api.post('/authentication/forgot-password', { email });

  if (response.status === 200) {
    return true;
  } else {
    throw new Error('Error al enviar solicitud de recuperación');
  }
};

export const ResetPasswordService = async (email,recoveryCode,newPassword) => {
  const response = await api.post('/authentication/reset-password', { email, recoveryCode, newPassword });

  if (response.status === 200) {
    return true;
  } else {
    throw new Error('Error al enviar solicitud de reseteo de contraseña');
  }
};

export const ActivateAccountService = async (email,recoveryCode) => {
  const response = await api.post('/authentication/activate', { email, recoveryCode });

  if (response.status === 200) {
    return true;
  } else {
    throw new Error('Error al enviar solicitud de activación');
  }
};