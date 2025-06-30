import React from 'react';
import { Paper, Typography } from '@mui/material';

const InfoBox = ({ label, value }) => {
  return (
    <Paper elevation={3} style={{ padding: 10, backgroundColor: 'rgba(3, 3, 62, 0.9)' ,}}>
      <Typography variant="body1" style={{ color: 'white', fontWeight: 'bold' ,padding:"2px",fontSize:'18px',display:'flex',justifyContent:'center',alignItems:'center'}}>
        {label}
      </Typography>
      <hr></hr>
      <Typography variant="body1" style={{ color: 'white' ,display:'flex',justifyContent:'center' ,fontSize:'18px',alignItems:'center'}}>
        {value}
      </Typography>
    </Paper>
  );
};

export default InfoBox;
