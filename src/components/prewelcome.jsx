import React from "react";
import { Box, Typography, Button, Grid, Container } from "@mui/material";
import { motion } from "framer-motion";
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import { useNavigate } from "react-router-dom";

const Prewelcome = () => {
    const navigate = useNavigate();

    const menus = [
        {
            name: "Manufacturing Execution System",
            icon: <PrecisionManufacturingIcon sx={{ fontSize: '5rem' }} />,
            path: "/welcome",
            description: "REAL time monitoring and control of Production, Energy utilization and Machine efficiencies.",
            btnName: "Access MES Dashboard"
        },
        {
            name: "Smart Document Management",
            icon: <DynamicFormIcon sx={{ fontSize: '5rem' }} />,
            path: "/dmta/home",
            description: "Information extraction from documents for further Analytics to support better decision making.",
            btnName: "Access SDM Processing"
        },
    ];

    // Container animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    // Individual menu item animation
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200
            }
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)",
                position: "relative",
                overflow: "hidden",
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle at 30% 30%, rgba(31, 174, 197, 0.1) 0%, transparent 50%)',
                    transform: 'rotate(-45deg)',
                    zIndex: 1,
                    pointerEvents: 'none'
                }
            }}
        >
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            color: "#555",
                            marginBottom: 4,
                            fontWeight: 300,
                            maxWidth: '700px',
                            margin: '0 auto',
                            lineHeight: 1.6
                        }}
                    >
                        Welcome To
                    </Typography>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: "bold",
                            color: "#32053d",
                            marginBottom: 2,
                            textShadow: "0 3px 6px rgba(0,0,0,0.1)",
                            letterSpacing: '0.05em'
                        }}
                    >
                        Digineous Technologies Pvt. Ltd.
                    </Typography>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid
                        container
                        spacing={4}
                        justifyContent="center"
                        alignItems="stretch"
                    >
                        {menus.map((menu, index) => (
                            <Grid item xs={12} sm={12} md={6} key={index} sx={{ display: 'flex' }}>
                                <motion.div
                                    variants={itemVariants}
                                    style={{ width: '100%' }}
                                >
                                    <Box
                                        component={motion.div}
                                        whileHover={{
                                            scale: 1.05,
                                            transition: { duration: 0.2 }
                                        }}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'white',
                                            borderRadius: '20px',
                                            boxShadow: '0 12px 24px rgba(31, 174, 197, 0.15)',
                                            padding: '2rem',
                                            textAlign: 'center',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                boxShadow: '0 16px 32px rgba(31, 174, 197, 0.2)',
                                            }
                                        }}
                                    >
                                        <motion.div
                                            animate={{
                                                rotate: [0, 10, -10, 0],
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                repeat: Infinity,
                                                repeatDelay: 2
                                            }}
                                            style={{
                                                marginBottom: '1rem',
                                                color: '#8FD7E1',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {menu.icon}
                                        </motion.div>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                marginBottom: '0.5rem',
                                                fontWeight: 'bold',
                                                color: '#1fafc4'
                                            }}
                                        >
                                            {menu.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#1fafc4',
                                                maxWidth: '250px'
                                            }}
                                        >
                                            {menu.description}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate(menu.path)}
                                            sx={{
                                                marginTop: '1rem',
                                                backgroundColor: "#1fafc4",
                                                color: "#fff",
                                                textTransform: "none",
                                                borderRadius: "10px",
                                                '&:hover': {
                                                    backgroundColor: "#1fafc4"
                                                }
                                            }}
                                        >
                                            {menu.btnName}
                                        </Button>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Prewelcome;