import { ShoppingCartRounded } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import BookSVG from '../../assets/book.svg';
import { ReactComponent as Empty } from '../../assets/empty.svg';
import { Header } from '../../components';
import { useCart } from '../../lib/cart';
import { NotificationContext } from '../../lib/notifications';
import { BooksList, BooksListItem, fetchBooks, searchBook } from '../../lib/storeApi/books';
import { Genre, fetchGenres } from '../../lib/storeApi/genres';
import { handleError } from '../../lib/storeApi/utils';
import { getAdjustedImageSize } from '../../lib/styles';
import { ROUTES } from '../../routes';

type GenreFormValues = {
  [genreName: Genre['name']]: boolean;
};

export const Books: React.FC = () => {
  const { notifyError } = React.useContext(NotificationContext);
  const [searchValue, setSearchValue] = React.useState('');
  const [genres, setGenres] = React.useState<Genre[]>([]);
  const [year, setYear] = React.useState('');
  const {
    control,
    handleSubmit: onSubmit,
    getValues,
    setValue,
    reset,
  } = useForm<GenreFormValues>();
  const [limit, setLimit] = React.useState(20);
  const [isBooksLoading, setIsBooksLoading] = React.useState(false);
  const [isGenresLoading, setIsGenresLoading] = React.useState(false);
  const [books, setBooks] = React.useState<null | BooksList>();
  const loadMoreRef = React.useRef(null);
  const [searchedBooks, setSearchedBooks] = React.useState<Pick<
    BooksList,
    'books' | 'count'
  > | null>(null);

  const handleSearchValueChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setSearchValue(target.value);
  };

  const limitOptions = [40, 20, 10];

  React.useEffect(() => {
    setIsGenresLoading(true);
    fetchGenres()
      .then((res) => {
        setGenres(res.data.genres);
        res.data.genres.forEach((genre) => setValue(genre.name, false));
      })
      .catch((error) => notifyError(handleError(error).message))
      .finally(() => setIsGenresLoading(false));

    handleFetchBooks(getValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchBooks = (values: GenreFormValues, newOffset: number = 0) => {
    setIsBooksLoading(true);
    fetchBooks({
      offset: newOffset,
      limit,
      genres: Object.entries(values)
        .filter(([_, value]) => value)
        .map(([genre]) => genre),
      year: year ? parseInt(year) : undefined,
    })
      .then((res) => {
        setBooks(res.data);
        setSearchedBooks(null);
      })
      .catch((error) => notifyError(handleError(error).message))
      .finally(() => setIsBooksLoading(false));
  };

  const handleApplyFilters = (values: GenreFormValues) => {
    handleFetchBooks(values);
  };

  const handleSearch = () => {
    setIsBooksLoading(true);
    searchBook(searchValue)
      .then((res) => {
        setSearchedBooks(res.data);
        setBooks(null);
        handleResetFilters();
      })
      .catch((error) => notifyError(handleError(error).message))
      .finally(() => setIsBooksLoading(false));
  };

  const handleObserver: IntersectionObserverCallback = React.useCallback(
    async (entries) => {
      const [target] = entries;

      if (target.isIntersecting && !isBooksLoading && books && books.offset) {
        setIsBooksLoading(true);
        try {
          const { data } = await fetchBooks({
            offset: books?.offset,
            limit,
            genres: Object.entries(getValues())
              .filter(([_, value]) => value)
              .map(([genre]) => genre),
            year: year ? parseInt(year) : undefined,
          });
          setBooks((current) =>
            current ? { ...data, books: [...current.books, ...data.books] } : current,
          );
        } catch (error) {
          notifyError(handleError(error).message);
        } finally {
          setIsBooksLoading(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [books, getValues, isBooksLoading, limit, year],
  );

  React.useEffect(() => {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, option);

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [handleObserver]);

  const handleResetFilters = () => {
    reset(
      genres.reduce((obj, item) => {
        obj[item.name] = false;
        return obj;
      }, {} as GenreFormValues),
    );
    setLimit(20);
    setYear('');

    if (!searchedBooks) {
      handleFetchBooks(getValues(), 0);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setSearchedBooks(null);
    handleFetchBooks(getValues(), 0);
  };

  const booksForRendering = (books ?? searchedBooks ?? { books: [] }).books;

  return (
    <Box>
      <Header
        includeSearch
        searchValue={searchValue}
        onSearchChange={handleSearchValueChange}
        onSearchSubmit={handleSearch}
        onClearSearchInput={handleClearSearch}
      />
      <Box sx={{ p: 5 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
          }}
        >
          <Box flex={1}>
            <Stack gap={2} position="fixed" width={0.2}>
              <Box display="flex" gap={1} justifyContent="space-between" width={1}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={onSubmit(handleApplyFilters)}
                  sx={{ flex: 1 }}
                >
                  Apply
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleResetFilters}
                  sx={{ flex: 1 }}
                >
                  Clear
                </Button>
              </Box>
              <Card sx={{ overflow: 'hidden', pb: 2 }}>
                <Typography px={2} pt={2} pb={1} fontWeight={600} variant="subtitle1">
                  Genres
                </Typography>
                <CardContent
                  sx={{
                    maxHeight: '25vh',
                    overflowY: 'scroll',
                    py: 2,
                    pt: 0,
                    pb: 2,
                  }}
                >
                  {isGenresLoading ? (
                    <Stack alignItems="center">
                      <CircularProgress />
                    </Stack>
                  ) : (
                    <FormControl>
                      {genres.map((genre) => (
                        <Controller
                          key={genre.id}
                          name={genre.name}
                          control={control}
                          render={({ field: { value, ...rest } }) => (
                            <FormControlLabel
                              control={<Checkbox checked={value} {...rest} />}
                              label={genre.name}
                            />
                          )}
                        />
                      ))}
                    </FormControl>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography pb={1} fontWeight={600} variant="subtitle1">
                    Year
                  </Typography>
                  <TextField
                    size="small"
                    type="number"
                    value={year}
                    onChange={({ target }) => setYear(target.value)}
                  />
                </CardContent>
              </Card>
              <Card>
                <Typography px={2} pt={2} pb={1} fontWeight={600} variant="subtitle1">
                  Items limit
                </Typography>
                <CardContent>
                  <Autocomplete
                    size="small"
                    value={limit}
                    getOptionLabel={(o) => o.toString()}
                    options={limitOptions}
                    onChange={(_, value) => setLimit(value ?? 20)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </CardContent>
              </Card>
            </Stack>
          </Box>
          <Box flex={3}>
            <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
              {!!booksForRendering.length &&
                booksForRendering.map((book) => <MultiActionAreaCard key={book.id} book={book} />)}

              {!isBooksLoading && !booksForRendering.length && (
                <Stack alignItems="center" gap={3} mt={5}>
                  <Empty
                    style={{
                      height: 150,
                    }}
                  />
                  <Typography variant="body2" color="GrayText">
                    No books found
                  </Typography>
                </Stack>
              )}

              <Box
                ref={loadMoreRef}
                width="100%"
                zIndex={1}
                sx={{
                  visibility: 'hidden',
                }}
              />
            </Box>
            {isBooksLoading && <LinearProgress />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default function MultiActionAreaCard({ book }: { book: BooksListItem }) {
  const navigate = useNavigate();
  const { cartItems, cartActions } = useCart();

  const img = book.bookAssest?.secureUrl ?? BookSVG;
  const imageRatio = book.bookAssest
    ? getAdjustedImageSize(
        { height: book.bookAssest.height, width: book.bookAssest.width },
        { property: 'width', value: 375 },
      )
    : { width: 375, height: 500 };

  const handleBuyClick = () => {
    if (Boolean(cartItems[book.id])) {
      cartActions.removeBookFromCart(book.id);
    } else {
      const { id, author, title, price, bookAssest } = book;
      cartActions.addBookToCart({ id, author, title, price, asset: bookAssest?.secureUrl ?? null });
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 375,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardActionArea
        sx={{ flex: 1 }}
        onClick={() => navigate(ROUTES.BOOK.createPath(book.id, book.author.id))}
      >
        <CardMedia
          component="img"
          height={imageRatio.height}
          image={img}
          alt="green iguana"
          sx={{
            width: imageRatio.width,
            transform: img === BookSVG ? 'scale(0.9)' : undefined,
            objectFit: img === BookSVG ? 'contain' : 'cover',
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {book.author.name} {book.author.surname}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}
      >
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
      </CardActions>
    </Card>
  );
}
