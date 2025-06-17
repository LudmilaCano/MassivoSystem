import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Accordion,
  AccordionSummary
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getReviewsByEventVehicle, deleteReview } from '../api/ReviewEndpoints';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';

const ReviewList = ({ eventVehicleId }) => {
  const [reviews, setReviews] = useState([]);
  const [listModalOpen, setListModalOpen] = useState(false);
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
      <Typography variant="h6" sx={{ mb: 1 }}>Reseñas</Typography>

      <Rating value={averageScore} precision={0.1} readOnly sx={{ mb: 2 }} />

      {authLoading ? null : userId ? (
        !ownReview ? (
          <Button variant="contained" onClick={handleNew} sx={{ mb: 2 }}>
            Dejar una reseña
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => handleEdit(ownReview)} sx={{ mb: 2 }}>
            Editar mi reseña
          </Button>
        )
      ) : (
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Inicia sesión para dejar una reseña.
        </Typography>
      )}

      <Accordion elevation={1} sx={{ cursor: 'pointer' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={() => setListModalOpen(true)}
        >
          <Typography>Ver reseñas ({reviews.length})</Typography>
        </AccordionSummary>
      </Accordion>

      <Dialog
        open={listModalOpen}
        onClose={() => setListModalOpen(false)}
        fullWidth maxWidth="sm"
      >
        <DialogTitle>Todas las reseñas</DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              maxHeight: 400,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {reviews.length === 0 ? (
              <Typography>No hay reseñas todavía.</Typography>
            ) : (
              reviews.map(r => (
                <ReviewItem
                  key={r.reviewId}
                  review={r}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setListModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        fullWidth maxWidth="sm"
      >
        <DialogTitle>{editingReview ? 'Editar reseña' : 'Escribir reseña'}</DialogTitle>
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
          <Button onClick={() => setEditModalOpen(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewList;
