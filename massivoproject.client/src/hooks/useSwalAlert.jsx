import { useState } from 'react';
import { showAlert as alertHelper } from './AlertHelper'; 

const useSwalAlert = () => {
    const [alertState, setAlertState] = useState({ text: '', type: 'success' });

    const showAlert = (text, type = 'success') => {
        setAlertState({ text, type });
        alertHelper(text, type);
    };

    return { showAlert };
};

export default useSwalAlert;
