import { SendRounded, ShoppingCartRounded } from '@mui/icons-material';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import CheckIcon from '@mui/icons-material/Check';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { meanBy } from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';

import BookSVG from '../../assets/book.svg';
import { Page, SelectFilesTrigger } from '../../components';
import { useCart } from '../../lib/cart';
import { NotificationContext } from '../../lib/notifications';
import { BookDetails, fetchBookByID, postBookComment, uploadImage } from '../../lib/storeApi/books';
import { handleError } from '../../lib/storeApi/utils';
import { getAdjustedImageSize } from '../../lib/styles';
import { useSelector } from '../../redux/hooks';
import { getUser } from '../../redux/user/selectors';

export const Book: React.FC = () => {
  const user = useSelector(getUser);
  const params = useParams<{ bookID: string; authorID: string }>();
  const [isBookLoading, setIsBookLoading] = React.useState(false);
  const [isCommentLoading, setIsCommentLoading] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [userRating, setUserRating] = React.useState<number | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);
  const emojiPickerRef = React.useRef<HTMLDivElement | null>(null);
  const uploadInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isImageLoading, setIsImageLoading] = React.useState(false);

  const [book, setBook] = React.useState<BookDetails | null>(null);
  const { notifyError } = React.useContext(NotificationContext);
  const { cartItems, cartActions } = useCart();

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

  React.useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setIsEmojiPickerOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  if (isBookLoading) {
    return (
      <Page>
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
      </Page>
    );
  }

  if (!book) {
    return (
      <Page>
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
      </Page>
    );
  }

  const imageProperties = book.bookAssest
    ? getAdjustedImageSize(
        { height: book.bookAssest.height, width: book.bookAssest.width },
        { property: 'width', value: 300 },
      )
    : { width: 300, height: 475 };

  const averageRating = meanBy(book.bookComments, (comment) => comment.rating ?? 0);

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setComment((current) => current.concat(emoji.emoji));
  };

  const handleCommentSubmit = async () => {
    setIsCommentLoading(true);
    try {
      const response = await postBookComment({
        bookID: book.id,
        authorID: book.authorID,
        comment,
        rating: userRating,
      });
      setBook((current) =>
        current ? { ...current, bookComments: response.data.comments } : current,
      );
    } catch (error) {
      notifyError(handleError(error).message);
    }
    setIsCommentLoading(false);
    setComment('');
    setUserRating(null);
  };

  const handleBuyClick = () => {
    if (Boolean(cartItems[book.id])) {
      cartActions.removeBookFromCart(book.id);
    } else {
      cartActions.addBookToCart(book);
    }
  };

  const handleImageUpload = async ({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
    if (currentTarget.files?.length) {
      const selectedFilesList = [...currentTarget.files];

      try {
        setIsImageLoading(true);
        const {
          data: { imageDetails },
        } = await uploadImage(book.id, book.authorID, selectedFilesList[0]);
        setBook((current) =>
          current
            ? {
                ...current,
                asset: imageDetails.secure_url,
                bookAssest: {
                  width: imageDetails.width,
                  height: imageDetails.height,
                  id: imageDetails.asset_id,
                  url: imageDetails.url,
                  secureUrl: imageDetails.secure_url,
                  assetID: imageDetails.asset_id,
                  bookID: book.id,
                  publicID: imageDetails.public_id,
                },
              }
            : current,
        );
      } catch (error) {
        notifyError(handleError(error).message);
      } finally {
        setIsImageLoading(false);
      }
    }
  };

  function handleUploadClick() {
    if (uploadInputRef.current) {
      uploadInputRef.current.value = '';
    }

    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  }

  return (
    <Page>
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

                transform: (book.asset ?? BookSVG) === BookSVG ? 'scale(0.9)' : undefined,
                objectFit: (book.asset ?? BookSVG) === BookSVG ? 'contain' : 'cover',
              }}
            />
            <Stack gap={2}>
              <Stack gap={0}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">{book.title}</Typography>
                  {user?.role === 'ADMIN' && (
                    <SelectFilesTrigger
                      loading={isImageLoading}
                      ref={uploadInputRef}
                      onInputValueChange={handleImageUpload}
                      onUploadTriggerClick={handleUploadClick}
                      acceptedFormat="image/*"
                    />
                  )}
                </Box>
                <Typography color="GrayText" variant="body2">
                  By {book.author.name} {book.author.surname}
                </Typography>
                <Typography color="GrayText" variant="body2">
                  {book.year} year
                </Typography>
              </Stack>
              <Rating name="book-rating" value={averageRating} readOnly precision={0.2} />

              <Typography variant="subtitle1">Annotation</Typography>
              <Box flex={1}>
                <Typography variant="body2" align="justify">
                  {book.description}
                </Typography>
              </Box>
              <Box display="flex" py={2} justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Chip label="In stock" color="info" />
                  {book.genres.map(({ genre }) => (
                    <Chip key={genre.id} label={genre.name} />
                  ))}
                </Box>

                <Box display="flex" gap={2} alignItems="center">
                  <Typography variant="h6" fontWeight={600} color="darkcyan">
                    {book.price} ₴
                  </Typography>
                  <Button
                    color={cartItems[book.id] ? 'secondary' : 'primary'}
                    variant="contained"
                    startIcon={cartItems[book.id] ? <CheckIcon /> : <ShoppingCartRounded />}
                    onClick={handleBuyClick}
                  >
                    {cartItems[book.id] ? 'In cart' : 'Buy'}
                  </Button>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack gap={3}>
              <Box>
                <Box display="flex" gap={2} alignItems="center" mb={2}>
                  <Avatar sizes="small" />
                  <Stack gap={1}>
                    <Typography variant="body2">Leave your review</Typography>
                    <Rating
                      size="medium"
                      value={userRating}
                      onChange={(_, val) => setUserRating(val)}
                    />
                  </Stack>
                </Box>

                <Stack
                  sx={{
                    width: 0.6,
                    gap: 1,
                  }}
                >
                  <TextField
                    label="Comment"
                    placeholder="Leave your comment.."
                    multiline
                    value={comment}
                    onChange={({ target }) => setComment(target.value)}
                    rows={3}
                    sx={{ width: 1 }}
                  />
                  <Box
                    display="flex"
                    gap={2}
                    width={1}
                    justifyContent="flex-end"
                    position="relative"
                  >
                    <IconButton onClick={() => setIsEmojiPickerOpen(true)} size="small">
                      <AddReactionIcon />
                    </IconButton>

                    <LoadingButton
                      loading={isCommentLoading}
                      disabled={!userRating || !comment}
                      loadingPosition="start"
                      startIcon={<SendRounded />}
                      variant="outlined"
                      onClick={handleCommentSubmit}
                    >
                      Send
                    </LoadingButton>
                  </Box>
                  {isEmojiPickerOpen && (
                    <Box
                      ref={emojiPickerRef}
                      sx={{
                        position: 'absolute',
                        left: 0,
                        bottom: '-27px',
                        zIndex: 999,
                        transform: 'translate(50%, 100%)',
                      }}
                    >
                      <EmojiPicker
                        height={150}
                        searchDisabled
                        onEmojiClick={handleEmojiClick}
                        previewConfig={{ showPreview: false }}
                      />
                    </Box>
                  )}
                </Stack>
              </Box>
              <Divider sx={{ width: 0.6 }} />
              {book.bookComments.length ? (
                book.bookComments.map((comment) => (
                  <React.Fragment key={comment.id}>
                    <Stack width={0.6} gap={1}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ width: 24, height: 24 }} />
                        <Typography>{comment.user.username}</Typography>
                      </Box>
                      <Stack gap={1} px={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="body2" color="GrayText">
                            {format(new Date(comment.createdAt), 'dd MMM yyyy')}
                          </Typography>
                          <Rating
                            name="user-book-rating"
                            value={comment.rating}
                            readOnly
                            size="small"
                          />
                        </Box>

                        <Typography align="justify">{comment.comment}</Typography>
                      </Stack>
                    </Stack>
                    <Divider sx={{ width: 0.6 }} />
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="GrayText">
                  There're no comments yet. Create the first one!
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Page>
  );
};
