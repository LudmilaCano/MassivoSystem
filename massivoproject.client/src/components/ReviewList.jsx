import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Divider,
  Paper
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getReviewsByEventVehicle, deleteReview } from '../api/ReviewEndpoints';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';

const ReviewList = ({ eventVehicleId }) => {
  const [reviews, setReviews] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const { userId, loading: authLoading } = useSelector(state => state.auth);

  const fetchReviews = async () => {
    try {
      const { reviews } = await getReviewsByEventVehicle(eventVehicleId);
      setReviews(reviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchReviews();
    }
  }, [eventVehicleId, authLoading]);

  const handleDelete = async (review) => {
    if (!confirm('¿Seguro que quieres eliminar esta reseña?')) return;
    await deleteReview(review.reviewId);
    fetchReviews();
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditModalOpen(true);
  };

  const handleNew = () => {
    setEditingReview(null);
    setEditModalOpen(true);
  };

  const ownReview = !authLoading && userId !== null
    ? reviews.find(r => String(r.userId) === String(userId))
    : null;

  const averageScore =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.score || 0), 0) / reviews.length
      : 0;

  return (
    <Box sx={{ p: 2 }}>
      {/* Header con título, rating y botón */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Reseñas ({reviews.length})</Typography>
          <Rating value={averageScore} precision={0.1} readOnly size="small" />
        </Box>

        {!authLoading && userId && (
          <Box>
            {!ownReview ? (
              <Button
                variant="contained"
                onClick={handleNew}
                size="small"
                sx={{ bgcolor: 'primary.main' }}
              >
                Escribir reseña
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => handleEdit(ownReview)}
                size="small"
              >
                Editar mi reseña
              </Button>
            )}
          </Box>
        )}
      </Box>

      {!authLoading && !userId && (
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontStyle: 'italic' }}>
          Inicia sesión para dejar una reseña.
        </Typography>
      )}

      <Divider sx={{ mb: 2 }} />

      {/* Lista scrolleable de reseñas */}
      <Paper
        variant="outlined"
        sx={{
          maxHeight: 400,
          overflow: 'auto',
          p: 2,
          bgcolor: 'grey.50'
        }}
      >
        {reviews.length === 0 ? (
          <Box sx={{
            textAlign: 'center',
            py: 4,
            color: 'text.secondary'
          }}>
            <Typography variant="body1">No hay reseñas todavía.</Typography>
            <Typography variant="body2">¡Sé el primero en escribir una!</Typography>
          </Box>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {reviews.map((review, index) => (
              <Box key={review.reviewId}>
                <ReviewItem
                  review={review}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
                {index < reviews.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Modal para crear/editar reseñas */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingReview ? 'Editar reseña' : 'Escribir reseña'}
        </DialogTitle>
        <DialogContent dividers>
          <ReviewForm
            eventVehicleId={eventVehicleId}
            existingReview={editingReview}
            onSuccess={() => {
              setEditModalOpen(false);
              fetchReviews();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewList;