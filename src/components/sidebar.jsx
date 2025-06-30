// import React, { useState } from "react";
// import Drawer from "@mui/material/Drawer";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Collapse from "@mui/material/Collapse";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import SettingsIcon from "@mui/icons-material/Settings";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import { Link } from "react-router-dom";
// import '../assets/css/sidebar.css'
// import { Box } from "@mui/material";
// const drawerWidth = 240;

// const Sidebar = () => {
//   const [open, setOpen] = useState(false);
//   const [plantArchitectureOpen, setPlantArchitectureOpen] = useState(false);
//   const [UATOpen, setUATOpen] = useState(false);
//   const [rawDataOpen, setrawDataOpen] = useState(false);

  


//   const handleClick = () => {
//     setOpen(!open);
//   };

//   const handlePlantArchitectureClick = () => {
//     setPlantArchitectureOpen(!plantArchitectureOpen);
//   };
//   const handleUATClick = () => {
//     setUATOpen(!UATOpen);
//   };

//   const handleRawDataClick = () => {
//     setrawDataOpen(!rawDataOpen);
//   };


//   return (
//     <Box sx={{ marginTop: '64px' }}>
//     <Drawer
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: drawerWidth,
//           marginTop:"130px"
//         },
//       }}
//       variant="permanent"
//       anchor="left"
//     >
//       <List>
//         <ListItem Button component={Link} to="/pathredi_ope">
//           <ListItemIcon>
//             <InboxIcon />
//           </ListItemIcon>
//           <ListItemText primary="Pathredi Ope" />
//         </ListItem>
//         <ListItem Button component={Link} to="/ghaziabad_ope">
//           <ListItemIcon>
//             <InboxIcon />
//           </ListItemIcon>
//           <ListItemText primary="Ghaziabad Ope" />
//         </ListItem>
//         <ListItem Button onClick={handleClick}>
//           <ListItemIcon>
//             <SettingsIcon />
//           </ListItemIcon>
//           <ListItemText primary="Settings" />
//           {open ? <ExpandLess /> : <ExpandMore />}
//         </ListItem>
//         <Collapse in={open} timeout="auto" unmountOnExit>
//           <List component="div" disablePadding>
//             <ListItem Button onClick={handlePlantArchitectureClick}>
//               <ListItemText primary="Plant Architecture" />
//               {plantArchitectureOpen ? <ExpandLess /> : <ExpandMore />}
//             </ListItem>
//             <Collapse in={plantArchitectureOpen} timeout="auto" unmountOnExit>
//               <List component="div" disablePadding>
//                 <ListItem Button component={Link} to="/plant_architecture/plant_master">
//                   <ListItemText primary="Plant Master" />
//                 </ListItem>
//                 <ListItem Button component={Link} to="/plant_architecture/line_master">
//                   <ListItemText primary="Line Master" />
//                 </ListItem>
//                 <ListItem Button component={Link} to="/plant_architecture/machine_master">
//                   <ListItemText primary="Machine Master" />
//                 </ListItem>
//                 <ListItem Button component={Link} to="/plant_architecture/part_master">
//                   <ListItemText primary="Part Master" />
//                 </ListItem>
//                 <ListItem Button component={Link} to="/plant_architecture/frdc_master">
//                   <ListItemText primary="FRDC Master" />
//                 </ListItem>
//               </List>
//             </Collapse>
//           </List>
//         </Collapse>
//         <ListItem Button component={Link} to="/raw_data">
//         {open ? <ExpandLess /> : <ExpandMore />}
        
//           <ListItemIcon>
//             <InboxIcon />
//           </ListItemIcon>
//           <ListItemText primary="Raw Data" />
//         </ListItem>
//         <ListItem Button component={Link} to="/uat">
//           <ListItemIcon>
//             <InboxIcon />
//           </ListItemIcon>
//           <ListItemText primary="UAT" />
//         </ListItem>
//         <ListItem Button component={Link} to="/hourly_bucket_data">
//           <ListItemIcon>
//             <InboxIcon />
//           </ListItemIcon>
//           <ListItemText primary="Hourly Bucket Data" />
//         </ListItem>
//       </List>
//     </Drawer>
//     </Box>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import '../assets/css/sidebar.css'
import { Box } from "@mui/material";

const drawerWidth = 240;

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [plantArchitectureOpen, setPlantArchitectureOpen] = useState(false);
  const [UATOpen, setUATOpen] = useState(false);
  const [rawDataOpen, setRawDataOpen] = useState(false);
  const [uatReportsOpen, setUatReportsOpen] = useState(false);
  const [uatTestingOpen, setUatTestingOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handlePlantArchitectureClick = () => {
    setPlantArchitectureOpen(!plantArchitectureOpen);
  };

  const handleUATClick = () => {
    setUATOpen(!UATOpen);
  };

  const handleRawDataClick = () => {
    setRawDataOpen(!rawDataOpen);
  };

  const handleUatReportsClick = () => {
    setUatReportsOpen(!uatReportsOpen);
  };

  const handleUatTestingClick = () => {
    setUatTestingOpen(!uatTestingOpen);
  };

  return (
    <Box className="sidebar" sx={{ marginTop: '64px' }} >
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            marginTop:"130px",
            backgroundColor: 'white' // Adding white background to the sidebar
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List sx={{ backgroundColor: '#1FAEC5' }}> {/* Adding background color to the List */}
          <ListItem    sx={{ backgroundColor: 'green' }}  Button component={Link} to="/pathredi_ope">
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Pathredi Ope" />
          </ListItem>
          <ListItem Button component={Link} to="/ghaziabad_ope">
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Ghaziabad Ope" />
          </ListItem>
          <ListItem Button onClick={handleClick}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem Button onClick={handlePlantArchitectureClick}>
                <ListItemText primary="Plant Architecture" />
                {plantArchitectureOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={plantArchitectureOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem Button component={Link} to="/plant_architecture/plant_master">
                    <ListItemText primary="Plant Master" />
                  </ListItem>
                  {/* Add more submenus for Plant Architecture if needed */}
                </List>
              </Collapse>
            </List>
          </Collapse>
          <ListItem Button onClick={handleUATClick}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="UAT" />
            {UATOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={UATOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem Button onClick={handleUatReportsClick}>
                <ListItemText primary="UAT Reports" />
                {uatReportsOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={uatReportsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {/* Add submenus for UAT Reports */}
                </List>
              </Collapse>
              <ListItem Button onClick={handleUatTestingClick}>
                <ListItemText primary="UAT Testing" />
                {uatTestingOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={uatTestingOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {/* Add submenus for UAT Testing */}
                </List>
              </Collapse>
            </List>
          </Collapse>
          <ListItem Button onClick={handleRawDataClick}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Raw Data" />
            {rawDataOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={rawDataOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Add submenus for Raw Data */}
            </List>
          </Collapse>
          <ListItem Button component={Link} to="/hourly_bucket_data">
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Hourly Bucket Data" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
