import React, { useState } from 'react';
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
  Grid,
  styled 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { invoiceMacthingApi } from '../../api/SmartDMTA/api.getInvoiceDetails';

// Styled components (keeping original styling)
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function formatCamelCase(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: '#4DD0E1',
    color: theme.palette.common.white,
    fontWeight: 'bold',
    padding: '12px 16px',
    borderRight:'1px solid white',
    borderBottom:'1px solid white'
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
    padding: '12px 16px',
    borderRight:'1px solid white',
    borderBottom:'1px solid white'
  },
}));

const StyledTableRow = styled(TableRow)(({ status }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: status === 'Match' ? '#white' : '#white',
    color:status==='Macth'?'black':'white'
  },
  '&:nth-of-type(even)': {
    backgroundColor: status === 'Match' ? '#white' : '#white',
    color:status==='Macth'?'black':'white'

  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: '100%',
  margin: '20px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
}));

const StatusIcon = ({ status }) => {
  return status === 'Match' ? (
    <CheckCircleIcon color="success" sx={{ ml: 1, fontSize: 20 }} />
  ) : (
    <ErrorIcon color="error" sx={{ ml: 1, fontSize: 20 }} />
  );
};

const InvoiceMatching = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [comparisonData, setComparisonData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const response = await invoiceMacthingApi.getInvoiceMatching(formData);
      //console.log(invoiceMacthingApi);
      clearInterval(uploadInterval);
      setComparisonData(response.data);
      setUploading(false);
      setUploadProgress(100);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const renderComparisonResults = () => {
    if (!comparisonData) return null;

    return (
      <StyledCard>
        <CardContent>
          {/* Parameter Comparison Table */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1FAEC5' }}>
            Parameter Comparison
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Parameter</StyledTableCell>
                  <StyledTableCell>Invoice Data</StyledTableCell>
                  <StyledTableCell>DB Data</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(comparisonData.comparison_results).map(([key, value]) => (
                  <StyledTableRow key={key} status={value.Status}>
                    <StyledTableCell>{formatCamelCase(key)}</StyledTableCell>
                    <StyledTableCell>{value['invoice data']}</StyledTableCell>
                    <StyledTableCell>{value['db data']}</StyledTableCell>
                    <StyledTableCell>
                      {value.Status}
                      <StatusIcon status={value.Status} />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Product Comparisons Table */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1FAEC5' }}>
            Product Comparisons
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Product </StyledTableCell>
                  <StyledTableCell>Description (Invoice/DB)</StyledTableCell>
                  <StyledTableCell>Part No (Invoice/DB)</StyledTableCell>
                  <StyledTableCell>Quantity (Invoice/DB)</StyledTableCell>
                  <StyledTableCell>Rate (Invoice/DB)</StyledTableCell>
                  <StyledTableCell>Amount (Invoice/DB)</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comparisonData.product_comparisons.map((product, index) => {
                  const lineStatus = Object.values(product).some(
                    item => item.Status && item.Status === 'Mismatch'
                  ) ? 'Mismatch' : 'Match';

                  return (
                    <StyledTableRow key={index} status={lineStatus}>
                      <StyledTableCell>Product {index + 1}</StyledTableCell>
                      <StyledTableCell>
                        <div>{product.description['invoice data']}</div>
                        <div >{product.description['db data']}</div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div>{product.partNo['invoice data']}</div>
                        <div >{product.partNo['db data']}</div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div>{product.qty['invoice data']}</div>
                        <div >{product.qty['db data']}  <StatusIcon status={product.qty.Status} /></div>
                      
                      </StyledTableCell>
                      <StyledTableCell>
                        <div>{product.rate['invoice data']}</div>
                        <div >{product.rate['db data']}  <StatusIcon status={product.rate.Status} /></div>
                      
                      </StyledTableCell>
                      <StyledTableCell>
                        <div>{product.amount['invoice data']}</div>
                        <div >{product.amount['db data']} <StatusIcon status={product.amount.Status} /></div>
                       
                      </StyledTableCell>
                      <StyledTableCell>
                        {lineStatus}
                        <StatusIcon status={lineStatus} />
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>
    );
  };

  return (
    <div style={{padding:'20px'}}>
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
        <Typography
          variant="h4"
          style={{
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Invoice Matching
        </Typography>
      </div>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 1
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ color:'white',
              backgroundColor: '#1FAEC5', 
              '&:hover': { 
                backgroundColor: '#17a2b8' 
              } 
            }}
          >
            Upload Invoice 
            <VisuallyHiddenInput 
              type="file" 
              accept=".pdf"
              onChange={handleFileUpload} 
            />
          </Button>

          {uploading && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ textAlign: 'center', mt: 1 }}
              >
                {`Uploading: ${uploadProgress}%`}
              </Typography>
            </Box>
          )}

          {imagePreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">Uploaded Bill: {fileName}</Typography>
            </Box>
          )}
        </Box>

        {comparisonData && renderComparisonResults()}
      </Box>
    </div>
  );
};

export default InvoiceMatching;