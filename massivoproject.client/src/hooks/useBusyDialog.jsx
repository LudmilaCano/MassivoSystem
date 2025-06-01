import { useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const BusyDialog = ({ open }) => (
  <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
    open={open}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
);

export function useBusyDialog() {
  const [busy, setBusy] = useState(false);

  const Busy = <BusyDialog open={busy} />;

  return [busy, setBusy, Busy];
}