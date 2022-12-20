import { UploadFileRounded } from '@mui/icons-material';
import { CircularProgress, IconButton } from '@mui/material';
import React from 'react';

type SelectFilesTriggerProps = {
  onUploadTriggerClick: () => void;
  onInputValueChange: React.ChangeEventHandler;
  disableUploadTrigger?: boolean;
  acceptedFormat?: string;
  loading?: boolean;
};

export const SelectFilesTrigger = React.forwardRef<
  HTMLInputElement | null,
  SelectFilesTriggerProps
>(
  (
    { onInputValueChange, onUploadTriggerClick, disableUploadTrigger, acceptedFormat, loading },
    ref,
  ) => {
    return (
      <IconButton color="primary" onClick={onUploadTriggerClick} disabled={disableUploadTrigger}>
        {loading ? <CircularProgress size={25} /> : <UploadFileRounded />}
        <input
          ref={ref}
          type="file"
          accept={acceptedFormat}
          onChange={onInputValueChange}
          style={{
            position: 'absolute',
            width: '100%',
            visibility: 'hidden',
          }}
        />
      </IconButton>
    );
  },
);
