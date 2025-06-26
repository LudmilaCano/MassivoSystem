
import Swal from 'sweetalert2';

export const showAlert = (text, type = 'success') => {
    let title = '';

    switch (type) {
        case 'success':
            title = 'Éxito';
            break;
        case 'error':
            title = 'Error';
            break;
        case 'warning':
            title = 'Advertencia';
            break;
        default:
            title = '';
    }

    Swal.fire({
        title,
        text,
        icon: type,
    });
};
