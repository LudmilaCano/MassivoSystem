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
        console.log('Login success!', token)
        return token;
    } else {
        console.log('login failed :(')
        return null;
    }

}