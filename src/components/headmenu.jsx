import React, { useState } from 'react';
import '../assets/css/menubar.css'; // Import your CSS file for styling

function HeadMenu() {
    const [selectedPlant, setSelectedPlant] = useState('');
    const [selectedLine, setSelectedLine] = useState('');
    const [selectedMachine, setSelectedMachine] = useState('');
    const [selectedShift, setSelectedShift] = useState('');
  
    const handlePlantChange = (event) => {
      setSelectedPlant(event.target.value);
    };
  
    const handleLineChange = (event) => {
      setSelectedLine(event.target.value);
    };
  
    const handleMachineChange = (event) => {
      setSelectedMachine(event.target.value);
    };
  
    const handleShiftChange = (event) => {
      setSelectedShift(event.target.value);
    };
  
    return (
      <div className="vertical-menu">
        <select className="dropdown-select" value={selectedPlant} onChange={handlePlantChange}>
          <option value="">Select Plant</option>
          <option value="plant1">Plant 1</option>
          <option value="plant2">Plant 2</option>
          <option value="plant3">Plant 3</option>
        </select>
  
        <select className="dropdown-select" value={selectedLine} onChange={handleLineChange}>
          <option value="">Select Line</option>
          <option value="line1">Line 1</option>
          <option value="line2">Line 2</option>
          <option value="line3">Line 3</option>
        </select>
  
        <select className="dropdown-select" value={selectedMachine} onChange={handleMachineChange}>
          <option value="">Select Machine</option>
          <option value="machine1">Machine 1</option>
          <option value="machine2">Machine 2</option>
          <option value="machine3">Machine 3</option>
        </select>
  
        <select className="dropdown-select" value={selectedShift} onChange={handleShiftChange}>
          <option value="">Select Shift</option>
          <option value="shift1">Shift 1</option>
          <option value="shift2">Shift 2</option>
          <option value="shift3">Shift 3</option>
        </select>
      </div>
    );
  }
  

export default HeadMenu;
