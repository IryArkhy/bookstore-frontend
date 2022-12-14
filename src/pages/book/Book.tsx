import { SendRounded } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridEventListener, GridRowsProp } from '@mui/x-data-grid';
import { format } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BookSVG from '../../assets/book.svg';
import { Header, StatusChip } from '../../components';
import { NotificationContext } from '../../lib/notifications';
import { BookDetails, fetchBookByID } from '../../lib/storeApi/books';
import { handleError } from '../../lib/storeApi/utils';
import { getAdjustedImageSize } from '../../lib/styles';
import { ROUTES } from '../../routes';

export const Book: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ bookID: string; authorID: string }>();
  const [isBookLoading, setIsBookLoading] = React.useState(false);
  const [book, setBook] = React.useState<BookDetails | null>(null);
  const { notifyError } = React.useContext(NotificationContext);

  React.useEffect(() => {
    setIsBookLoading(true);
    if (params.authorID && params.bookID) {
      fetchBookByID(params.bookID, params.authorID)
        .then((res) => {
          setBook(res.data.book);
        })
        .catch((error) => {
          const errorData = handleError(error);
          notifyError(errorData.message);
        })
        .finally(() => {
          setIsBookLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isBookLoading) {
    return (
      <Box>
        <Header />
        <Container sx={{ py: 5 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (!book) {
    return (
      <Box>
        <Header />
        <Container sx={{ py: 5 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" mb={3}>
              No data
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  const imageProperties = getAdjustedImageSize(
    { height: book.bookAssest.height, width: book.bookAssest.width },
    { property: 'width', value: 300 },
  );
  return (
    <Box>
      <Header />
      <Container sx={{ py: 5 }}>
        <Stack gap={3}>
          <Card>
            <CardContent sx={{ display: 'flex', gap: 3 }}>
              <CardMedia
                component="img"
                height={imageProperties.height}
                image={book.asset ?? BookSVG}
                alt="book-cover"
                sx={{
                  width: imageProperties.width,
                  borderRadius: '4px',
                }}
              />
              <Stack>
                <Typography>{book.title}</Typography>
                <Typography>
                  By {book.author.name} {book.author.surname}
                </Typography>
                <Typography> {book.year} year</Typography>

                <Typography>Annotation</Typography>
                <Box flex={1}>
                  <Typography>{book.description}</Typography>
                </Box>
                <Box display="flex" py={2} justifyContent="space-between" alignItems="center">
                  <Chip label="In stock" />
                  <Box display="flex" gap={2} alignItems="center">
                    <Typography variant="h6" fontWeight={600} color="darkcyan">
                      {book.price} ₴
                    </Typography>
                    <Button color="primary" variant="contained">
                      Buy
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Box>
                <Avatar />
                <TextField
                  label="Comment"
                  placeholder="Leave your comment.."
                  multiline
                  // value={}
                  onChange={() => {}}
                  rows={4}
                />
                <EmojiPicker />
                <Button startIcon={<SendRounded />}>Send</Button>
              </Box>
              {book.bookComments.length ? (
                book.bookComments.map((comment) => (
                  <React.Fragment key={comment.id}>
                    <Stack>
                      <Box>
                        <Avatar />
                        <Typography>{comment.user.username}</Typography>
                        <Typography>{format(new Date(comment.createdAt), 'dd MM yyyy')}</Typography>
                      </Box>
                      <Rating
                        name="read-only"
                        disabled={!comment.rating}
                        value={comment.rating}
                        readOnly
                      />
                      <Typography>{comment.comment}</Typography>
                    </Stack>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Typography>There're no comments yet. Create the first one!</Typography>
              )}
            </CardContent>
          </Card>
        </Stack>
        {/* <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gridTemplateRows: 'auto',
          }}
        >
          <Box>1</Box>
          <Box>2</Box>
        </Box> */}
      </Container>
    </Box>
  );
};
