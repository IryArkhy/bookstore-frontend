import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { differenceInDays, format } from 'date-fns';
import { styled, useTheme } from '@mui/material/styles';
import React from 'react';
import { Header, StatusChip } from '../../components';
import { ReactComponent as ProfileInfo } from '../../assets/personal-info.svg';
import { ReactComponent as Celebrate } from '../../assets/celebrate.svg';
import { useSelector } from '../../redux/hooks';
import { getUser } from '../../redux/user/selectors';
import { fetchUserOrders, UserProfileOrder } from '../../lib/storeApi/orders';
import { handleError } from '../../lib/storeApi/utils';
import { NotificationContext } from '../../lib/notifications';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const UserProfile: React.FC = () => {
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const [isOrdersLoading, setIsOrdersLoading] = React.useState(false);
  const [orders, setOrders] = React.useState<UserProfileOrder[]>([]);
  const { notifyError } = React.useContext(NotificationContext);
  const { palette } = useTheme();
  const now = new Date();

  const lastOrders = orders.slice(0, 2);

  React.useEffect(() => {
    setIsOrdersLoading(true);
    fetchUserOrders()
      .then((res) => {
        setOrders(res.data.orders);
      })
      .catch((error) => {
        const errorData = handleError(error);
        notifyError(errorData.message);
      })
      .finally(() => {
        setIsOrdersLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalDays = differenceInDays(now, new Date(user!.createdAt));

  const renderLastOrders = () => {
    return (
      <>
        {isOrdersLoading ? (
          <Box my={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box display="flex" gap={2} my={3}>
            {!!orders.length ? (
              lastOrders.map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    borderRadius: 4,
                    backgroundColor: palette.grey[200],
                    py: 1,
                    px: 2,
                    flex: 1,
                  }}
                >
                  <Stack gap={2} width={1}>
                    <Typography variant="subtitle2" fontWeight={600} align="left">
                      {format(new Date(order.createdAt), 'dd MMMM yyyy')}
                    </Typography>

                    <Typography variant="body2" align="left">
                      {order.items.length} books in the order
                    </Typography>

                    <Box display="flex" gap={2} mb={1}>
                      <Chip label={`${order.totalPrice} UAH`} color="success" size="small" />
                      <StatusChip status={order.status} />
                    </Box>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        size="small"
                        onClick={() => navigate(ROUTES.ORDER.createPath(order.id))}
                      >
                        details
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              ))
            ) : (
              <Typography variant="body2" m={2}>
                You have no orders yet. Create your first one!
              </Typography>
            )}
          </Box>
        )}
      </>
    );
  };

  return (
    <Box>
      <Header />
      <Container sx={{ py: 3 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Item>
              <Stack gap={4}>
                <ProfileInfo
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                />
                <Typography textAlign="left" variant="subtitle1" fontWeight={600}>
                  User information
                </Typography>
                <Box width={0.6}>
                  <Box display="flex" justifyContent="space-around" alignItems="center">
                    <Typography
                      color={palette.text.primary}
                      flex={1}
                      variant="subtitle1"
                      textAlign="left"
                    >
                      Username
                    </Typography>
                    <Typography flex={2} textAlign="left">
                      {user?.username}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-around" alignItems="center">
                    <Typography
                      color={palette.text.primary}
                      flex={1}
                      variant="subtitle1"
                      textAlign="left"
                    >
                      Email
                    </Typography>
                    <Typography flex={2} textAlign="left">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Stack gap={4}>
              <Item>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography textAlign="left" variant="subtitle1" fontWeight={600}>
                    Your recent purchases
                  </Typography>
                  {!!orders.length && (
                    <Button size="small" onClick={() => navigate(ROUTES.ORDER_LIST)}>
                      View all
                    </Button>
                  )}
                </Box>

                {renderLastOrders()}
              </Item>
              <Item sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Celebrate
                  style={{
                    height: 150,
                    flex: 1,
                  }}
                />
                <Typography flex={2} textAlign="left">
                  You are with us {totalDays} full days!
                </Typography>
              </Item>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
