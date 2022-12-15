import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridEventListener, GridRowsProp } from '@mui/x-data-grid';
import { format } from 'date-fns';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Page, StatusChip } from '../../components';
import { NotificationContext } from '../../lib/notifications';
import { UserProfileOrder, fetchUserOrders } from '../../lib/storeApi/orders';
import { handleError } from '../../lib/storeApi/utils';
import { ROUTES } from '../../routes';

export const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [isOrdersLoading, setIsOrdersLoading] = React.useState(false);
  const [orders, setOrders] = React.useState<UserProfileOrder[]>([]);
  const { notifyError } = React.useContext(NotificationContext);

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

  const rows: GridRowsProp = orders.map((o) => ({
    id: o.id,
    itemsCount: o.items.length,
    createdAt: format(new Date(o.createdAt), 'dd MMMM yyyy'),
    price: o.totalPrice,
    status: o.status,
  }));

  const columns: GridColDef[] = [
    { field: 'createdAt', headerName: 'Created at', flex: 1 },
    { field: 'itemsCount', headerName: 'Total books', flex: 1 },
    { field: 'price', headerName: 'Price, UAH', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: ({ value }) => <StatusChip status={value} />,
    },
  ];

  const handleRowClick: GridEventListener<'rowClick'> = ({ id }) => {
    navigate(ROUTES.ORDER.createPath(id as string));
  };

  return (
    <Page>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" mb={3}>
          Orders history
        </Typography>
      </Box>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        onRowClick={handleRowClick}
        loading={isOrdersLoading}
        sx={{
          '& .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
      />
    </Page>
  );
};
