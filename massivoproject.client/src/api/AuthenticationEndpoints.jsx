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
        const token = response.data;        
        return token;
    } else {
        return null;
    }

}