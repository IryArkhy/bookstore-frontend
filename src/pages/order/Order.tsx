import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Divider,
  CardMedia,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Header, StatusChip } from '../../components';
import { NotificationContext } from '../../lib/notifications';
import { fetchOrderByID, OrderInfo } from '../../lib/storeApi/orders';
import { handleError } from '../../lib/storeApi/utils';
import BookSVG from '../../assets/book.svg';
import { ROUTES } from '../../routes';

export const Order: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ orderID: string }>();
  const { palette } = useTheme();
  const [isOrderLoading, setIsOrderLoading] = React.useState(false);
  const [order, setOrder] = React.useState<OrderInfo | null>(null);
  const { notifyError } = React.useContext(NotificationContext);

  React.useEffect(() => {
    setIsOrderLoading(true);
    if (params.orderID) {
      fetchOrderByID(params.orderID)
        .then((res) => {
          setOrder(res.data.order);
        })
        .catch((error) => {
          const errorData = handleError(error);
          notifyError(errorData.message);
        })
        .finally(() => {
          setIsOrderLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!order) {
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

  // const handleRowClick: GridEventListener<'rowClick'> = ({ id }) => {
  //   navigate(ROUTES.ORDER.createPath(id as string));
  // };

  const orderHash = () => {
    const arr = order.id.split('-');
    return arr[arr.length - 1];
  };

  return (
    <Box>
      <Header />
      <Container sx={{ py: 5 }}>
        {isOrderLoading ? (
          <CircularProgress />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gridTemplateRows: 'auto',
              columnGap: 3,
            }}
          >
            <Card>
              <CardContent>
                <Typography align="left" variant="subtitle1" fontWeight={600}>
                  Order #{orderHash()}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography mb={2} align="left" variant="subtitle1" fontWeight={600}>
                  Purchased books
                </Typography>
                <Stack gap={2} mb={3} sx={{ maxHeight: '60vh', overflowY: 'scroll' }}>
                  {order.items.map(({ book, id, amount }) => (
                    <React.Fragment key={id}>
                      <Box display="flex" alignItems="center">
                        <Box display="flex" gap={2} alignItems="center" flex={1}>
                          <Box
                            sx={{
                              overflow: 'hidden',
                              width: 70,
                              borderRadius: '4px',
                              background: palette.grey[100],
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="100"
                              image={book.asset ?? BookSVG}
                              alt="book-cover"
                            />
                          </Box>
                          <Box>
                            <Typography align="left" variant="body1">
                              {book.title}
                            </Typography>
                            <Typography align="left" variant="body2">
                              By {book.author.name} {book.author.surname}
                            </Typography>
                            <Typography color="darkcyan" align="left" variant="caption">
                              Quantity: {amount}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography>{book.price} ₴</Typography>
                        </Box>
                      </Box>

                      <Divider />
                    </React.Fragment>
                  ))}
                </Stack>
                <Stack gap={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="GrayText">
                      Shipping
                    </Typography>
                    <Typography variant="body2" color="GrayText">
                      0 ₴
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="GrayText">
                      Taxes
                    </Typography>
                    <Typography variant="body2" color="GrayText">
                      0 ₴
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={600}>
                      Total
                    </Typography>
                    <Typography variant="h6" color="darkcyan" fontWeight={600}>
                      {order.totalPrice} ₴
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}
      </Container>
    </Box>
  );
};
