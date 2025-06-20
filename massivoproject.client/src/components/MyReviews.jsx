import { useEffect, useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useSelector } from "react-redux";
import { getReviewsByUser, deleteReview } from "../api/ReviewEndpoints";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";

const MyReviews = () => {
    const [myReviews, setMyReviews] = useState([]);
    const [editingReview, setEditingReview] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const { userId } = useSelector((state) => state.auth);
    const fetchMyReviews = async () => {
        try {
            const reviews = await getReviewsByUser(userId);
            console.log("Mis reseñas con detalles:", reviews);  // no hagas destructuring
            setMyReviews(Array.isArray(reviews) ? reviews : []);
        } catch (error) {
            console.error("Error al obtener reseñas del usuario:", error);
            setMyReviews([]);
        }
    };
    useEffect(() => {
        if (userId) {
            fetchMyReviews();
        }
    }, [userId]);

    const handleEdit = (review) => {
        setEditingReview(review);
        setEditModalOpen(true);
    };

    const handleDelete = async (review) => {
        if (!confirm("¿Seguro que querés eliminar esta reseña?")) return;
        await deleteReview(review.reviewId);
        fetchMyReviews();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Mis Reseñas</Typography>

            {myReviews.length === 0 ? (
                <Typography>No has escrito reseñas todavía.</Typography>
            ) : (

                myReviews.map((review) => (
                    <ReviewItem
                        key={review.reviewId}
                        review={review}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        showDetails={true} // si querés que muestre detalles acá
                    />
                ))
            )}

            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Editar Reseña</DialogTitle>
                <DialogContent dividers>
                    <ReviewForm
                        existingReview={editingReview}
                        eventVehicleId={editingReview?.eventVehicleId}
                        onSuccess={() => {
                            setEditModalOpen(false);
                            fetchMyReviews();
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

export default MyReviews;
