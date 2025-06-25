import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { getReviewsByUser, deleteReview } from "../api/ReviewEndpoints";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";

const ReviewListByUser = () => {
  const [reviews, setReviews] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const { userId } = useSelector((state) => state.auth);

  const fetchUserReviews = async () => {
    try {
      const data = await getReviewsByUser(userId);
      setReviews(data || []);
      console.log("User Reviews:", data);
    } catch (error) {
      console.error("Error al obtener las reseñas del usuario:", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserReviews();
    }
  }, [userId]);

  const handleDelete = async (reviewId) => {
    if (!confirm("¿Seguro que quieres eliminar esta reseña?")) return;
    await deleteReview(reviewId);
    fetchUserReviews();
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditModalOpen(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Mis Reseñas
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Paper variant="outlined" sx={{ maxHeight: 500, overflow: "auto", p: 2 }}>
        {reviews.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No has escrito ninguna reseña todavía.
          </Typography>
        ) : (
          reviews.map((review, index) => (
            <Box key={review.reviewId}>
              <ReviewItem
                review={review}
                onDelete={() => handleDelete(review.reviewId)}
                onEdit={handleEdit}
              />
              {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))
        )}
      </Paper>

      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar reseña</DialogTitle>
        <DialogContent dividers>
          <ReviewForm
            eventVehicleId={editingReview?.eventVehicleId}
            existingReview={editingReview}
            onSuccess={() => {
              setEditModalOpen(false);
              fetchUserReviews();
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

export default ReviewListByUser;
