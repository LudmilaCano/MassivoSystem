import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadFile } from '../../api/FileEndpoints'; 

const FileUploader = ({ onFileUploaded = () => { }, initialImage = null, entityType = 'user' }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(initialImage);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            setError('Por favor selecciona una imagen válida');
            return;
        }

        setError(null);
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setError(null);

        try {
            const { url } = await uploadFile(selectedFile, entityType);
            onFileUploaded(url);
        } catch (err) {
            setError(err.message || 'Error al subir la imagen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%', my: 2 }}>
            {preview && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '200px',
                            objectFit: 'contain',
                            borderRadius: '4px'
                        }}
                    />
                </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="contained-button-file"
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                        Seleccionar Imagen
                    </Button>
                </label>

                {selectedFile && (
                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Subir Imagen'}
                    </Button>
                )}

                {error && <Alert severity="error">{error}</Alert>}
            </Box>
        </Box>
    );
};

export default FileUploader;
