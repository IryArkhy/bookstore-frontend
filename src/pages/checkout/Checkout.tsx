import {
  Box,
  Button,
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
import { ReactComponent as EmptyCart } from '../../assets/empty-cart.svg';
import { Page, StatusChip } from '../../components';
import { calculateTotalPrice, useCart } from '../../lib/cart';
import { NotificationContext } from '../../lib/notifications';
import { OrderInfo } from '../../lib/storeApi/orders';
import { handleError } from '../../lib/storeApi/utils';
import { ROUTES } from '../../routes';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { cartItems, cartActions, cartItemsCount } = useCart();
  const [isOrderLoading, setIsOrderLoading] = React.useState(false);
  const [order, setOrder] = React.useState<OrderInfo | null>(null);
  const { notifyError } = React.useContext(NotificationContext);

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

  if (!cartItemsCount) {
    return (
      <Page>
        <Stack gap={2} alignItems="center">
          <Typography variant="h6">Oops! You seem to be lost.</Typography>
          <Box display="flex" gap={1} alignItems="center">
            <Typography>Navigate back</Typography>
            <Button onClick={() => navigate(ROUTES.BOOKS_LIST)}>Home</Button>
          </Box>
          <EmptyCart height={300} />
        </Stack>
      </Page>
    );
  }

  return (
    <Page>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: 'auto',
          columnGap: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography mb={2} align="left" variant="subtitle1" fontWeight={600}>
              Shopping Bag
            </Typography>
            <Stack gap={2} mb={3} sx={{ maxHeight: '60vh', overflowY: 'scroll' }}>
              {Object.values(cartItems).map(({ id, amount, author, asset, title, price }) => (
                <React.Fragment key={id}>
                  <ButtonBase
                    onClick={() => navigate(ROUTES.BOOK.createPath(id, author.id))}
                    sx={{
                      width: 1,
                      display: 'block',
                      transition: 'transform 200ms ease-in 100ms',
                      '&:hover': {
                        transform: 'scale(0.9)',
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
                            image={asset ?? BookSVG}
                            alt="book-cover"
                          />
                        </Box>
                        <Stack>
                          <Typography align="left" variant="body1">
                            {title}
                          </Typography>
                          <Typography align="left" variant="body2">
                            By {author.name} {author.surname}
                          </Typography>
                          <Typography color="darkcyan" align="left" variant="caption">
                            Quantity: {amount}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box>
                        <Typography>{price} ₴</Typography>
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
                  {calculateTotalPrice(Object.values(cartItems))} ₴
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack gap={2}>
              <Typography align="left" variant="subtitle1" fontWeight={600}>
                Checkout
              </Typography>
              <Typography align="left" variant="body2" color="GrayText">
                Something
              </Typography>
              <Box>Something</Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};
