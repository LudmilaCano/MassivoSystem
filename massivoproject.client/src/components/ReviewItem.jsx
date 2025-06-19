
import { useSelector } from 'react-redux';
import { Button, Card, CardContent, Typography, Rating, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ReviewItem = ({ review, onDelete, onEdit }) => {
  const userId = useSelector(state => state.auth.userId);
  const isOwn = String(review.userId) === String(userId);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Nombre del autor */}
        <Typography variant="subtitle2" color="text.secondary">
          {review.userName || 'Anónimo'}
        </Typography>

        {/* Comentarios */}
        <Typography variant="body1" gutterBottom>
          {review.comments}
        </Typography>

        {/* Estrellas */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Rating value={review.score} readOnly size="small" />
          <Typography variant="caption">{review.score} / 5</Typography>
        </Box>

        {/* Edit/Delete solo si es propia */}
        {isOwn && (
          <Box display="flex" gap={1}>
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
