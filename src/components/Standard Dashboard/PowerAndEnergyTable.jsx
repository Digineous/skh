import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  FormControl,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BackButton from '../backbutton';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.header': {
    backgroundColor: theme.palette.grey[100],
    fontWeight: 600
  },
  '&.total-kwh': {
    color: theme.palette.primary.main,
    fontWeight: 500
  },
  '&.total-kvah': {
    color: theme.palette.success.main,
    fontWeight: 500
  },
  '&.md-value': {
    fontWeight: 500
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const PowerEnergyDashboard = () => {
  const data = [
    {
      date: '26 Oct 2024',
      powerFactor: 0.953,
      zones: [0, 0, 75, 0],
      totalKWh: 248.38,
      totalKVAh: 261,
      kWhLag: 48,
      kWhLead: 18,
      mdKW: 56,
      mdKVA: 61
    },
    {
      date: '25 Oct 2024',
      powerFactor: 0.912,
      zones: [165, 357, 163, 138],
      totalKWh: 821.12,
      totalKVAh: 901,
      kWhLag: 286,
      kWhLead: 51,
      mdKW: 62,
      mdKVA: 72
    },
    {
      date: '24 Oct 2024',
      powerFactor: 0.962,
      zones: [193, 311, 149, 130],
      totalKWh: 781.19,
      totalKVAh: 812,
      kWhLag: 96,
      kWhLead: 82,
      mdKW: 58,
      mdKVA: 60
    },
    {
      date: '23 Oct 2024',
      powerFactor: 0.943,
      zones: [204, 358, 166, 164],
      totalKWh: 889.50,
      totalKVAh: 943,
      kWhLag: 219,
      kWhLead: 54,
      mdKW: 67,
      mdKVA: 74
    },
    {
      date: '22 Oct 2024',
      powerFactor: 0.945,
      zones: [189, 393, 165, 168],
      totalKWh: 912.25,
      totalKVAh: 965,
      kWhLag: 223,
      kWhLead: 58,
      mdKW: 71,
      mdKVA: 78
    }
  ];

  return (
    <Box sx={{ p: 4 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(to right, rgb(0, 93, 114), rgb(79, 223, 255))",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          color: "white",
          marginBottom: "20px"
        }}
      >
        <BackButton background={"transparent"} iconColor="#fff" />
        <Typography
          variant="h4"
          style={{
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Power and Energy Consumption Dashboard
        </Typography>
      </div>
      
      <Grid container spacing={2} alignItems="center" justifyContent="flex-start" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth >
            <TextField
              label="Start Date"
              name="fromDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              // value={rawData.fromDate}
              // onChange={handleInputChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth >
            <TextField
              label="End Date"
              name="toDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              // value={rawData.toDate}
              // onChange={handleInputChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            sx={{color:'white'}}
            
            // onClick={handleAddSubmit}
          >
            OK
          </Button>
        </Grid>
      </Grid>
      
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell style={{background:'#1FAEC5',color:'white'}} className="header">Date</StyledTableCell>
              <StyledTableCell style={{background:'#1FAEC5',color:'white'}} className="header" align="right">Avg Power Factor</StyledTableCell>
              <StyledTableCell style={{background:'#1FAEC5',color:'white'}} className="header" align="right">Zone 1</StyledTableCell>
              <StyledTableCell style={{background:'#1FAEC5',color:'white'}} className="header" align="right">Zone 2</StyledTableCell>
              <StyledTableCell style={{background:'#1FAEC5',color:'white'}} className="header" align="right">Zone 3</StyledTableCell>
              <StyledTableCell style={{background:'#1FAEC5',color:'white'}} className="header" align="right">Zone 4</StyledTableCell>
              <StyledTableCell style={{background:'#1FAEC5',color:'white'}} className="header" align="right">Total (kWh)</StyledTableCell>
              <StyledTableCell style={{background:'#1FAEC5',color:'white'}} className="header" align="right">Total (kVAh)</StyledTableCell>
              <StyledTableCell style={{background:'#1FAEC5',color:'white'}} className="header" align="right">kVAh (Lag)</StyledTableCell>
              <StyledTableCell style={{background:'#1FAEC5',color:'white'}} className="header" align="right">kVAh (Lead)</StyledTableCell>
              <StyledTableCell style={{background:'#1FAEC5',color:'white'}} className="header" align="right">MD(kW)</StyledTableCell>
              <StyledTableCell style={{background:'#1FAEC5',color:'white'}} className="header" align="right">MD(kVA)</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.reverse().map((row) => (
              <StyledTableRow key={row.date}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  {row.powerFactor.toFixed(3)}
                </TableCell>
                {row.zones.map((zone, index) => (
                  <TableCell key={index} align="right">
                    {zone}
                  </TableCell>
                ))}
                <StyledTableCell align="right" className="total-kwh">
                  {row.totalKWh.toFixed(2)}
                </StyledTableCell>
                <StyledTableCell align="right" className="total-kvah">
                  {row.totalKVAh}
                </StyledTableCell>
                <TableCell align="right">
                  {row.kWhLag}
                </TableCell>
                <TableCell align="right">
                  {row.kWhLead}
                </TableCell>
                <StyledTableCell align="right" className="md-value">
                  {row.mdKW}
                </StyledTableCell>
                <StyledTableCell align="right" className="md-value">
                  {row.mdKVA}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PowerEnergyDashboard;