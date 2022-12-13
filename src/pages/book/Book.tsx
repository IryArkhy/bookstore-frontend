import { Box, Container, Typography } from '@mui/material';
import { DataGrid, GridRowsProp, GridEventListener, GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, StatusChip } from '../../components';
import { NotificationContext } from '../../lib/notifications';
import { fetchOrderByID, OrderInfo } from '../../lib/storeApi/orders';
import { handleError } from '../../lib/storeApi/utils';
import { ROUTES } from '../../routes';

export const Order: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ orderID: string }>();
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

  const handleRowClick: GridEventListener<'rowClick'> = ({ id }) => {
    navigate(ROUTES.ORDER.createPath(id as string));
  };

  return (
    <Box>
      <Header />
      <Container sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" mb={3}>
            Orders details
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gridTemplateRows: 'auto',
          }}
        >
          <Box>1</Box>
          <Box>2</Box>
        </Box>
      </Container>
    </Box>
  );
};
