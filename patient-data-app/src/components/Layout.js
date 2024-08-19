// src/components/Layout.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

function Layout({ children }) {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Patient Monitoring System
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12}>
          <Paper style={{ padding: '20px' }}>
            {children}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Layout;
