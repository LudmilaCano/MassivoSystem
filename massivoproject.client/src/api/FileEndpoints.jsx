import api from './AxiosBaseConnection';

export const uploadFile = async (file, entityType = 'profile') => {
    if (!file) {
        throw new Error('No file provided');
    }

    if (!entityType) {
        throw new Error('Entity type is required');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
    }

    const maxSize = 10 * 1024 * 1024; 
    if (file.size > maxSize) {
        throw new Error('File size exceeds 5MB limit');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post(`/File/upload/${entityType}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('File upload error:', error);

        if (error.response?.status === 400) {
            const errorMsg = error.response?.data?.title || 'Invalid file or request';
            throw new Error(errorMsg);
        }

        throw new Error('Failed to upload file');
    }
};