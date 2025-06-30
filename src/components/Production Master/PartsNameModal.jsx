import React from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PartNamesModal = ({ open, handleClose, partNames }) => {
  const partNamesArray = partNames.split(',').map(name => name.trim());

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="part-names-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 0,
        maxHeight: '80vh',
        borderRadius: "10px",
        overflow: 'hidden',
      }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography 
          id="part-names-modal-title" 
          variant="h6" 
          component="h2" 
          sx={{ 
            textAlign: 'center', 
            backgroundColor: '#1FAEC5', 
            color: 'white', 
            p: 2,
            fontWeight: 'bold',
          }}
        >
          Part Names
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 440, boxShadow: 'none', marginTop: '0' }}>
          <Table stickyHeader aria-label="part names table">
            <TableBody>
              {Array(Math.ceil(partNamesArray.length / 3)).fill().map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {partNamesArray.slice(rowIndex * 3, rowIndex * 3 + 3).map((partName, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      sx={{
                        border: '1px solid rgba(224, 224, 224, 1)',
                        padding: '12px',
                        textAlign: 'center',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        width: '33.33%',
                        fontWeight: '600'
                      }}
                    >
                      {partName}
                    </TableCell>
                  ))}
                  {rowIndex === Math.ceil(partNamesArray.length / 3) - 1 && 
                    [...Array(3 - (partNamesArray.length % 3 || 3))].map((_, index) => (
                      <TableCell 
                        key={`empty-${index}`}
                        sx={{
                          border: '1px solid rgba(224, 224, 224, 1)',
                          padding: '12px',
                          width: '33.33%',
                        }}
                      />
                    ))
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

export default PartNamesModal;