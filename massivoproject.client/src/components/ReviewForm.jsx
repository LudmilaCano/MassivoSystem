import { useState, useEffect } from 'react';
import { createReview, updateReview } from '../api/ReviewEndpoints';
import { Button, TextField, Box, Rating } from '@mui/material';

const ReviewForm = ({ eventVehicleId, existingReview, onSuccess }) => {
  const [score, setScore] = useState(existingReview?.score || 0);
  const [comments, setComments] = useState(existingReview?.comments || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setScore(existingReview?.score || 0);
    setComments(existingReview?.comments || '');
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (existingReview) {
        await updateReview(existingReview.reviewId, { score, comments });
      } else {
        await createReview({ eventVehicleId, score, comments });
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      // Podés manejar el error con un mensaje para el usuario
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Rating
        name="score"
        value={score}
        onChange={(event, newValue) => setScore(newValue || 0)}
      />
      <TextField
        label="Comentarios"
        multiline
        rows={3}
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />
      <Button variant="contained" type="submit" disabled={loading}>
        {existingReview ? 'Actualizar' : 'Agregar'} Reseña
      </Button>
    </Box>
  );
};

export default ReviewForm;
