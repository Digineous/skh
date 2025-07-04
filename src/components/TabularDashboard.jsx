
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { apiGetCBMDetail } from "../api/api.getCBMDetail";

import { apiGetEnergyDetail } from "../api/api.getEnergyDetail";

const TabularDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let result;
        if (tabIndex === 0) {
          result = await apiGetCBMDetail();
        } else {
          result = await apiGetEnergyDetail();
        }
        //console.log("Data:", result.data.data);
        setData(result.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tabIndex]);

    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

  if (error) {
    return (
      <Typography color="error" align="center">
        Error: {error}
      </Typography>
    );
  }

  return (
    <div
      style={{
        padding: "20px 20px 20px 20px",
        width: "100%",
        marginBottom: "40px",
      }}
    >
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          p: 3,
          bgcolor: "background.paper",
        }}
      >
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab
            label="CBM Data"
            sx={{
              bgcolor: tabIndex === 0 ? "#1FAEC5" : "grey",
              color: "white !important",
              fontWeight: "bold",
              "&:hover": { bgcolor: tabIndex === 0 ? "#1FAEC5" : "#333" },
            }}
          />
          <Tab
            label="Energy Data"
            sx={{
              bgcolor: tabIndex === 1 ? "#1FAEC5" : "grey",
              color: "white !important",
              fontWeight: "bold",
              "&:hover": { bgcolor: tabIndex === 1 ? "#1FAEC5" : "#333" },
            }}
          />
        </Tabs>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "none", maxHeight: 500 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.main" }}>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#1FAEC5",
                    padding:'10px !important'
                  }}
                >
                  Parameter Name
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#1FAEC5",
                    padding:'10px !important'

                  }}
                >
                  Location 1
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#1FAEC5",
                    padding:'10px !important'

                  }}
                >
                  Location 2
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#1FAEC5",
                    padding:'10px !important'

                  }}
                >
                  Location 3
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#1FAEC5",
                    padding:'10px !important'

                  }}
                >
                  Location 4
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#1FAEC5",
                    padding:'10px !important'

                  }}
                >
                  Location 5
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row,) => (
                <TableRow
                  key={row.sNo}
                  sx={{ "&:nth-of-type(odd)": { bgcolor: "action.hover" } }}
                >
                  <TableCell sx={{padding:'10px !important'}}>
                    {row.cbmParameter || row.energyParameter}
                  </TableCell>
                  <TableCell sx={{padding:'10px !important'}}>
                  
                    <span
                    style={{
                      backgroundColor: row.alertCbm1 || row.alertEnergy1 || "transparent",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      display: "inline-block",
                      fontWeight: "bold",
                      color: ['red', 'green'].includes(row.alertCbm1||row.alertEnergy1)? 'white' : 'black'
                    }}
                    >
                      {row.valueCbm1 !== null && row.valueCbm1 !== undefined
                        ? `${row.valueCbm1} ${row.unitCbm}`
                        : row.valueEnergy1 !== null &&
                          row.valueEnergy1 !== undefined
                        ? `${row.valueEnergy1} ${row.unitEnergy}`
                        : "0"}
                    </span>
                  </TableCell>
                  <TableCell sx={{padding:'10px !important'}}>

                    <span
                      style={{
                        backgroundColor:
                          row.alertCbm3  || "transparent",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        display: "inline-block",
                        fontWeight: "bold",
                         color: ['red', 'green'].includes(row.alertCbm3) ? 'white' : 'black'
                      }}
                    >
                      {row.valueCbm3 !== null && row.valueCbm3 !== undefined
                        ? `${row.valueCbm3} ${row.unitCbm}`
                       
                        : ""}
                    </span>
                  </TableCell>
                  <TableCell sx={{padding:'10px !important'}}>

                    <span
                      style={{
                        backgroundColor:
                          row.alertCbm4  || "transparent",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        display: "inline-block",
                        fontWeight: "bold",
                         color: ['red', 'green'].includes(row.alertCbm4) ? 'white' : 'black'
                      }}
                    >
                      {row.valueCbm4 !== null && row.valueCbm4 !== undefined
                        ? `${row.valueCbm4} ${row.unitCbm}`
                       
                        : ""}
                    </span>
                  </TableCell>
                  <TableCell sx={{padding:'10px !important'}}>

                    <span
                      style={{
                        backgroundColor:
                          row.alertCbm5  || "transparent",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        display: "inline-block",
                        fontWeight: "bold",
                         color: ['red', 'green'].includes(row.alertCbm5) ? 'white' : 'black'
                      }}
                    >
                      {row.valueCbm5 !== null && row.valueCbm5 !== undefined
                        ? `${row.valueCbm5} ${row.unitCbm}`
                       
                        : ""}
                    </span>
                  </TableCell>
                  <TableCell sx={{padding:'10px !important'}}>

                    <span
                      style={{
                        backgroundColor:
                          row.alertCbm2  || "transparent",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        display: "inline-block",
                        fontWeight: "bold",
                         color: ['red', 'green'].includes(row.alertCbm2) ? 'white' : 'black'
                      }}
                    >
                      {row.valueCbm2 !== null && row.valueCbm2 !== undefined
                        ? `${row.valueCbm2} ${row.unitCbm}`
                       
                        : ""}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default TabularDashboard;
