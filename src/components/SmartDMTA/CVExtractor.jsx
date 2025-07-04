import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Modal,
  Tab,
  Tabs,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import BackButton from "../backbutton";

const EducationalAndExperienceModal = ({ open, onClose, data }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Educational Qualifications" />
          <Tab label="Past Experience" />
        </Tabs>

        {activeTab === 0 && (
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Degree</TableCell>
                  <TableCell>Institute</TableCell>
                  <TableCell>Year</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.education.map((edu, index) => (
                  <TableRow key={index}>
                    <TableCell>{edu.degree}</TableCell>
                    <TableCell>{edu.institute}</TableCell>
                    <TableCell>{edu.year}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 1 && (
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Years</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.experience.map((exp, index) => (
                  <TableRow key={index}>
                    <TableCell>{exp.company}</TableCell>
                    <TableCell>{exp.role}</TableCell>
                    <TableCell>{exp.years}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Modal>
  );
};

const CVExtractor = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ education: [], experience: [] });

  const handleUploadResume = () => {
    //console.log("Resume uploaded.");
  };

  const handleDownloadExcel = () => {
    //console.log("Downloaded as Excel.");
  };

  const handleViewDetails = () => {
    setModalData({
      education: [
        { degree: "B.Tech", institute: "ABC University", year: "2015" },
        { degree: "M.Tech", institute: "XYZ University", year: "2018" },
      ],
      experience: [
        { company: "Company A", role: "Developer", years: "3" },
        { company: "Company B", role: "Team Lead", years: "2" },
      ],
    });
    setModalOpen(true);
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
          Resume Extractor 
        </Typography>
      </div>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleUploadResume}
          sx={{ textTransform: "none" }}
        >
          Upload Resume
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadExcel}
          sx={{ textTransform: "none" }}
        >
          Download as Excel
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john.doe@example.com</TableCell>
              <TableCell>123-456-7890</TableCell>
              <TableCell>
                <Button
                  variant="text"
                  onClick={handleViewDetails}
                  sx={{ textTransform: "none" }}
                >
                  View Educational Qualification
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <EducationalAndExperienceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={modalData}
      />
    </div>
  );
};

export default CVExtractor;
