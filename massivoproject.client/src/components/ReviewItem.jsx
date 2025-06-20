import { useSelector } from 'react-redux';
import { Button, Card, CardContent, Typography, Rating, Box, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ReviewItem = ({ review, onDelete, onEdit, showDetails = false }) => {
  const userId = useSelector(state => state.auth.userId);
  const isOwn = String(review.userId) === String(userId);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Nombre del autor */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {review.userName || 'Anónimo'}
        </Typography>

        {/* Comentarios */}
        <Typography variant="body1" gutterBottom>
          {review.comments || "Sin comentario"}
        </Typography>

        {/* Estrellas */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Rating value={review.score} readOnly size="small" />
          <Typography variant="caption">{review.score} / 5</Typography>
        </Box>

        {/* Mostrar detalles solo si showDetails es true */}
        {showDetails && (
          <>
            <Divider sx={{ my: 1 }} />

            {/* Info vehículo */}
            <Box mb={1}>
              <Typography variant="subtitle2">Vehículo:</Typography>
              <Typography variant="body2">Nombre: {review.vehicleName || "Desconocido"}</Typography>
              <Typography variant="body2">Patente: {review.licensePlate || "-"}</Typography>
            </Box>

            {/* Info evento */}
            <Box mb={1}>
              <Typography variant="subtitle2">Evento:</Typography>
              <Typography variant="body2">Nombre: {review.eventName || "Desconocido"}</Typography>
              {review.date && (
                <Typography variant="body2">
                  Fecha: {new Date(review.date).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </>
        )}

        {/* Edit/Delete solo si es propia */}
        {isOwn && (
          <Box display="flex" gap={1} mt={1}>
            <Button size="small" onClick={() => onEdit(review)}>
              Editar
            </Button>
            <IconButton size="small" onClick={() => onDelete(review)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewItem;
