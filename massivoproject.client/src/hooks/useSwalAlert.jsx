import { useState } from 'react';
import Swal from 'sweetalert2';

const useSwalAlert = () => {
  const [alertState, setAlertState] = useState({
    text: '',
    type: 'success', // default to success
  });

  const showAlert = (text, type = 'success') => {
    setAlertState({ text, type });
    Swal.fire({
      title: type === 'success' ? 'Éxito' : 'Error',
      text,
      icon: type,
    });
  };

  return {
    showAlert,
  };
};

export default useSwalAlert;