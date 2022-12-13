import React from 'react';
import { Chip, ChipProps } from '@mui/material';

import { OrderStatus } from '../lib/storeApi/orders';

type StatusChipProps = ChipProps & {
  status: OrderStatus;
};

export const StatusChip: React.FC<StatusChipProps> = ({ status, ...rest }) => {
  const getInfo = (): {
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    label: string;
  } => {
    switch (status) {
      case OrderStatus.processing:
        return {
          color: 'default',
          label: 'processing',
        };
      case OrderStatus.confirmed:
        return {
          color: 'info',
          label: 'confirmed',
        };

      case OrderStatus.inProgress:
        return {
          color: 'primary',
          label: 'in progress',
        };

      case OrderStatus.done:
        return {
          color: 'success',
          label: 'done',
        };
      default:
        return {
          color: 'error',
          label: 'canceled',
        };
    }
  };

  const info = getInfo();

  return <Chip label={info.label} color={info.color} size="small" {...rest} />;
};
