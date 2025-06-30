import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  tableCellClasses,styled
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BackButton from "../backbutton";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1FAEC5",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
const ElectricityzBIllInsight = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedData, setProcessedData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload and processing
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploading(false);
          // Simulate server response
          setProcessedData({
            documentType: "Aadhar Card",
            name: "John Doe",
            id: "123456789",
            dob: "01/01/1990",
            address: "123 Main Street, City, Country",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(to right, rgb(0, 93, 114), rgb(79, 223, 255))",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          color: "white",
        }}
      >
        <BackButton background={"transparent"} iconColor="#fff" />
        <Typography
          variant="h5"
          style={{
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Electricity Bill Insight
        </Typography>
      </div>
      <Box sx={{ border: "5px solid black", borderRadius: "10px", padding: "20px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 4,
            gap: 4,
            height: "70vh",
            background: "linear-gradient(to bottom, #f1f5f9, #e2e8f0)",
          }}
        >
          {/* Left Section: Upload Button and Image Preview */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed #1FAEC5",
              borderRadius: "12px",
              padding: 4,
              textAlign: "center",
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Document Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  marginBottom: "20px",
                }}
              />
            ) : (
              <CloudUploadIcon sx={{ fontSize: 64, color: "#1FAEC5" }} />
            )}

            <Typography
              variant="h6"
              sx={{ marginTop: 2, color: "#333", fontWeight: "bold" }}
            >
              Upload Electricity Bill (PDF)
            </Typography>
            <Button
              variant="contained"
              component="label"
              sx={{
                marginTop: 3,
                backgroundColor: "#1FAEC5",
                color: "#fff",
                padding: "12px 24px",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#17a2b3",
                },
              }}
            >
              Choose File
              <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
            </Button>
            {uploading && (
              <Box sx={{ width: "100%", marginTop: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#1FAEC5",
                    },
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Right Section: Processed Data in Table */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}
            >
            Electricity Bill Details
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}
            >
            Review your billing details and calcutate potential savings.
            </Typography>

            {processedData ? (
              <Card
                sx={{
                  padding: 2,
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                }}
              >
                <CardContent>
                  <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
                    <Table>
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell sx={{ fontWeight: "bold", color: "#1FAEC5" }}>Field</StyledTableCell>
                          <StyledTableCell sx={{ fontWeight: "bold", color: "#1FAEC5" }}>Value</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        <StyledTableRow>
                          <StyledTableCell>Consumer No</StyledTableCell>
                          <StyledTableCell>{processedData.documentType}</StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell>Consumer Name</StyledTableCell>
                          <StyledTableCell>{processedData.id}</StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell>Address</StyledTableCell>
                          <StyledTableCell>{processedData.name}</StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell>Village</StyledTableCell>
                          <StyledTableCell>{processedData.dob}</StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell>Pin Code</StyledTableCell>
                          <StyledTableCell>{processedData.address}</StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell>Contract Demand (KVA)</StyledTableCell>
                          <StyledTableCell>75% of Contract Demand (KVA)</StyledTableCell>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ) : (
              <Typography
                variant="body1"
                sx={{ textAlign: "center", color: "#999" }}
              >
                No data available. Upload a document to see results.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default ElectricityzBIllInsight;
