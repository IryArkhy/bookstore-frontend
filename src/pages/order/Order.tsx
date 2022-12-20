import {
  Box,
  ButtonBase,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BookSVG from '../../assets/book.svg';
import OrderCancelled from '../../assets/order-cancelled.svg';
import OrderConfirmed from '../../assets/order-confirmed.svg';
import OrderDone from '../../assets/order-done.svg';
import OrderInProgress from '../../assets/order-in-progress.svg';
import OrderProcessing from '../../assets/order-processing.svg';
import { Page, StatusChip } from '../../components';
import { NotificationContext } from '../../lib/notifications';
import { OrderInfo, fetchOrderByID } from '../../lib/storeApi/orders';
import { handleError } from '../../lib/storeApi/utils';
import { getAdjustedImageSize } from '../../lib/styles';
import { ROUTES } from '../../routes';

const ORDER_STATUS_IMAGES = {
  PROCESSING: {
    img: OrderProcessing,
    width: 924,
    height: 377.61325,
  },
  CONFIRMED: {
    img: OrderConfirmed,
    width: 816.21532,
    height: 621,
  },
  IN_PROGRESS: {
    img: OrderInProgress,
    width: 829,
    height: 364.82907,
  },
  CANCELED: {
    img: OrderCancelled,
    width: 586.47858,
    height: 659.29778,
  },
  DONE: {
    img: OrderDone,
    width: 618.67538,
    height: 487.32493,
  },
};

export const Order: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ orderID: string }>();
  const { palette } = useTheme();
  const [isOrderLoading, setIsOrderLoading] = React.useState(false);
  const [order, setOrder] = React.useState<OrderInfo | null>(null);
  const { notifyError } = React.useContext(NotificationContext);

  React.useEffect(() => {
    if (params.orderID) {
      setIsOrderLoading(true);
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

  if (isOrderLoading) {
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

  if (!order) {
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

  const orderHash = () => {
    const arr = order.id.split('-');
    return arr[arr.length - 1];
  };

  const getOrderStatusImage = () => {
    const orderImageData = { ...ORDER_STATUS_IMAGES[order.status] };

    const size = getAdjustedImageSize(
      { width: orderImageData.width, height: orderImageData.height },
      { property: 'width', value: 370 },
    );

    orderImageData.width = size.width;
    orderImageData.height = size.height;

    return orderImageData;
  };

  const orderStatusImage = getOrderStatusImage();

  return (
    <Page>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gridTemplateRows: 'auto',
          columnGap: 3,
        }}
      >
        <Card>
          <CardContent sx={{ height: 1, overflow: 'hidden' }}>
            <Stack gap={2} height={1}>
              <Typography align="left" variant="subtitle1" fontWeight={600}>
                Order #{orderHash()}
              </Typography>
              <Typography align="left" variant="body2" color="GrayText">
                {format(new Date(order.createdAt), 'dd MMM yyyy')}
              </Typography>
              <Box>
                <StatusChip status={order.status} />
              </Box>
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <CardMedia
                  component="img"
                  height={orderStatusImage.height}
                  image={orderStatusImage.img}
                  alt={`Order status: ${order.status}`}
                  sx={{
                    width: orderStatusImage.width,
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography mb={2} align="left" variant="subtitle1" fontWeight={600}>
              Purchased books
            </Typography>
            <Stack gap={2} mb={3} sx={{ maxHeight: '60vh', overflowY: 'scroll' }}>
              {order.items.map(({ book, id, amount, bookId }) => (
                <React.Fragment key={id}>
                  <ButtonBase
                    onClick={() => navigate(ROUTES.BOOK.createPath(bookId, book.authorID))}
                    sx={{
                      width: 1,
                      display: 'block',
                      transition: 'transform 200ms ease-in 100ms',
                      '&:hover': {
                        transform: 'scale(0.98)',
                        transition: 'transform 200ms ease-out',
                      },
                    }}
                  >
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
                            sx={{
                              width: 70,
                              transform: !book.asset ? 'scale(0.9)' : undefined,
                              objectFit: !book.asset ? 'contain' : 'cover',
                            }}
                          />
                        </Box>
                        <Stack>
                          <Typography align="left" variant="body1">
                            {book.title}
                          </Typography>
                          <Typography align="left" variant="body2">
                            By {book.author.name} {book.author.surname}
                          </Typography>
                          <Typography color="darkcyan" align="left" variant="caption">
                            Quantity: {amount}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box>
                        <Typography>{book.price} ₴</Typography>
                      </Box>
                    </Box>
                  </ButtonBase>

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
    </Page>
  );
};
