import {
  Autocomplete,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  FormControl,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { isEqual } from 'lodash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import BookSVG from '../../assets/book.svg';
import { ReactComponent as EmptyCart } from '../../assets/empty-cart.svg';
import { Page, StatusChip } from '../../components';
import { calculateTotalPrice, useCart } from '../../lib/cart';
import { NotificationContext } from '../../lib/notifications';
import { OrderInfo } from '../../lib/storeApi/orders';
import { handleError } from '../../lib/storeApi/utils';
import { ROUTES } from '../../routes';

import { CreditCard } from './CreditCard';

type CardFormValues = {
  name: string;
  number: string;
  cvc: string;
  expiry: string;
};

type Focused = 'name' | 'number' | 'expiry' | 'cvc';

type FormKeys = keyof CardFormValues;

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { cartItems, cartActions, cartItemsCount } = useCart();
  const [name, setName] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [cvc, setCvc] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [focused, setFocused] = React.useState<Focused>();
  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      city: '',
      postNumber: '',
      name: '',
      surname: '',
      phoneNumber: '',
    },
  });

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
            <Stack
              gap={2}
              mb={3}
              sx={{ maxHeight: '60vh', overflowY: 'scroll' }}
              position="relative"
            >
              <Box
                display="flex"
                alignItems="center"
                position="sticky"
                top="0px"
                sx={{ background: palette.background.paper, zIndex: 999 }}
              >
                <Box flex={2}>
                  <Typography align="center">Item</Typography>
                  <Divider orientation="vertical" />
                </Box>
                <Box flex={1}>
                  <Typography align="center">Quantity</Typography>
                  <Divider orientation="vertical" />
                </Box>
                <Box flex={1}>
                  <Typography align="center">Price</Typography>
                  <Divider orientation="vertical" />
                </Box>
                <Divider />
              </Box>
              {Object.values(cartItems).map(({ id, amount, author, asset, title, price }) => (
                <React.Fragment key={id}>
                  <ButtonBase
                    onClick={() => navigate(ROUTES.BOOK.createPath(id, author.id))}
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
                      <Box display="flex" gap={2} alignItems="center" flex={2}>
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

                      <Box flex={1}>quantity</Box>
                      <Box flex={1}>
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
              <CreditCard name={name} number={number} cvc={cvc} expiry={expiry} focused={focused} />
              <Typography>Payment details</Typography>
              <FormControl variant="standard">
                <TextField
                  size="small"
                  value={number}
                  onChange={({ target }) => setNumber(target.value)}
                  onFocus={() => setFocused('number')}
                  onBlur={() => setFocused(undefined)}
                  label="Card number"
                  inputProps={{
                    pattern: '[d| ]{16,22}',
                  }}
                />
              </FormControl>
              <FormControl variant="standard">
                <TextField
                  size="small"
                  value={name}
                  onChange={({ target }) => setName(target.value)}
                  label="Holder name"
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(undefined)}
                />
              </FormControl>
              <FormControl variant="standard">
                <TextField
                  size="small"
                  value={expiry}
                  onChange={({ target }) => setExpiry(target.value)}
                  label="Expiry date"
                  onFocus={() => setFocused('expiry')}
                  onBlur={() => setFocused(undefined)}
                  inputProps={{
                    pattern: 'dd/dd',
                  }}
                />
              </FormControl>
              <FormControl variant="standard">
                <TextField
                  size="small"
                  value={cvc}
                  onChange={({ target }) => setCvc(target.value)}
                  onFocus={() => setFocused('cvc')}
                  onBlur={() => setFocused(undefined)}
                  label="CVC"
                  inputProps={{
                    pattern: 'd{3,4}',
                  }}
                />
              </FormControl>
              <Typography>Shipping details</Typography>
              {/* <Controller
                name="city"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <FormControl variant="standard">
                    <Autocomplete
                      options={[
                        'Kyiv',
                        'Odesa',
                        // { label: 'Kyiv', value: 'Kyiv' },
                        // { label: 'Odesa', value: 'Odesa' },
                        // { label: 'Kharkiv', value: 'Kharkiv' },
                        // { label: 'Poltava', value: 'Poltava' },
                        // { label: 'Chernivtsi', value: 'Chernivtsi' },
                        // { label: 'Lutsk', value: 'Lutsk' },
                      ]}
                      onChange={(_, value) => onChange(value)}
                      {...rest}
                      isOptionEqualToValue={(o, v) => isEqual(o, v)}
                      renderInput={() => <TextField size="small" label="City" />}
                    />
                  </FormControl>
                )}
              /> */}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};
