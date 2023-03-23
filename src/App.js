import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function formatNumber(num) {
  if (num === undefined || num === null) {
    return "";
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

app.use(express.static('public'));

function App() {
  const [makes, setMakes] = useState([]);
  const [models1, setModels1] = useState([]);
  const [years1, setYears1] = useState([]);
  const [models2, setModels2] = useState([]);
  const [years2, setYears2] = useState([]);
  const [selectedMake1, setSelectedMake1] = useState(null);
  const [selectedModel1, setSelectedModel1] = useState(null);
  const [selectedYear1, setSelectedYear1] = useState(null);
  const [selectedMake2, setSelectedMake2] = useState(null);
  const [selectedModel2, setSelectedModel2] = useState(null);
  const [selectedYear2, setSelectedYear2] = useState(null);
  const [vehicleData1, setVehicleData1] = useState(null);
  const [vehicleData2, setVehicleData2] = useState(null);
  const [trims1, setTrims1] = useState([]);
  const [selectedTrim1, setSelectedTrim1] = useState(null);
  const [trims2, setTrims2] = useState([]);
  const [selectedTrim2, setSelectedTrim2] = useState(null);

  console.log("Years1:", years1);
  console.log("Years2:", years2);


useEffect(() => {
  async function fetchMakes() {
    try {
      const response = await axios.get("http://localhost:5000/api/getMakes");
      setMakes(response.data.makes);
      console.log('Makes:', response.data.makes);
    } catch (error) {
      console.error("Error fetching makes data:", error);
    }
  }

  fetchMakes();
}, []);


useEffect(() => {
  async function fetchModels(make) {
    if (!make) return [];

    try {
      const response = await axios.get(`http://localhost:5000/api/getModels?make=${make}`);
      console.log(`Fetched models for make ${make}:`, response.data.models);
      return response.data.models;
    } catch (error) {
      console.error("Error fetching models data:", error);
      return [];
    }
  }

  if (selectedMake1) {
    fetchModels(selectedMake1.make_id).then((models) => setModels1(models));
  } else {
    setModels1([]);
  }

  if (selectedMake2) {
    fetchModels(selectedMake2.make_id).then((models) => setModels2(models));
  } else {
    setModels2([]);
  }
}, [selectedMake1, selectedMake2]);


useEffect(() => {
async function fetchYears(make, modelName, setYears) {
  if (!make || !modelName) return;

  try {
    const response = await axios.get(
      `http://localhost:5000/api/getYears?make=${make}&model=${encodeURIComponent(modelName)}`
    );
    console.log(`Fetched years for make ${make} and model ${modelName}:`, response.data); // Log the response data
    setYears(response.data); // Set the years state variable
  } catch (error) {
    console.error("Error fetching years data:", error);
    setYears([]); // Set the years state variable to an empty array
  }
}


if (selectedMake1 && selectedModel1) {
  fetchYears(selectedMake1.make_id, selectedModel1.model_name, setYears1);
}

if (selectedMake2 && selectedModel2) {
  fetchYears(selectedMake2.make_id, selectedModel2.model_name, setYears2);
}

}, [selectedMake1, selectedModel1, selectedMake2, selectedModel2, setYears1, setYears2]);


useEffect(() => {
  async function fetchTrims(make, modelName, year, setTrims, setVehicleData, selectedTrim) {
    if (!make || !modelName || !year) return;

    const yearAsNumber = parseInt(year, 10);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/getTrims?make=${make}&model=${encodeURIComponent(modelName)}&year=${yearAsNumber}`
      );
      console.log(`Fetched trims for make ${make}, model ${modelName}, and year ${year}:`, response.data);

      const filteredTrims = response.data.filter((trim) => trim.model_year === yearAsNumber);
      console.log("Fetched and filtered trims:", filteredTrims);
      setTrims(filteredTrims);

      // Fetch vehicle specs when trim is selected
      if (selectedTrim) {
        const selectedTrimData = response.data.find(trim => trim.model_trim === selectedTrim.model_trim);
        setVehicleData(selectedTrimData);
      }

    } catch (error) {
      console.error("Error fetching trims data:", error);
      setTrims([]); // Set the trims state variable to an empty array
    }
  }

if (selectedMake1 && selectedModel1 && selectedYear1) {
  fetchTrims(selectedMake1.make_id, selectedModel1.model_name, selectedYear1, setTrims1, setVehicleData1, selectedTrim1);
}

if (selectedMake2 && selectedModel2 && selectedYear2) {
  fetchTrims(selectedMake2.make_id, selectedModel2.model_name, selectedYear2, setTrims2, setVehicleData2, selectedTrim2);
}

}, [selectedMake1, selectedModel1, selectedYear1, selectedMake2, selectedModel2, selectedYear2, selectedTrim1, selectedTrim2]);


function handleCompareClick() {
  console.log('Comparing vehicles:');
  console.log('Vehicle 1 data:', vehicleData1);
  console.log('Vehicle 2 data:', vehicleData2);

  // You can add any additional logic to compare the vehicles here.
}



function renderVehicleData(vehicleData) {
  if (!vehicleData) {
    return <p>No vehicle data available</p>; // Display a message when no vehicle data is available
  }

  const vehicleSpecifications = [
    { label: 'Make', value: vehicleData.make_display },
    { label: 'Model', value: vehicleData.model_name },
    { label: 'Year', value: vehicleData.year },
    { label: 'Price', value: formatNumber(vehicleData.price) },
    { label: 'Body Style', value: vehicleData.body },
    { label: 'Doors', value: vehicleData.doors },
    { label: 'Fuel Economy (City)', value: vehicleData.fuel_city },
    { label: 'Fuel Economy (Highway)', value: vehicleData.fuel_highway },
    { label: 'Drive', value: vehicleData.drive },
    { label: 'Transmission', value: vehicleData.transmission },
    { label: 'Engine', value: vehicleData.engine },
    { label: 'Horsepower', value: vehicleData.horsepower },
    { label: 'Torque', value: vehicleData.torque },
    { label: 'Fuel Type', value: vehicleData.fuel_type },
    { label: 'Cylinders', value: vehicleData.cylinders },
    { label: 'Weight', value: vehicleData.weight },
    { label: 'Length', value: vehicleData.length },
    { label: 'Width', value: vehicleData.width },
    { label: 'Height', value: vehicleData.height },
    { label: 'Wheelbase', value: vehicleData.wheelbase },
    { label: 'Ground Clearance', value: vehicleData.ground_clearance },
    { label: 'Cargo Volume', value: vehicleData.cargo_volume },
    { label: 'Towing Capacity', value: vehicleData.towing_capacity },
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Specification</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicleSpecifications.map((spec) => (
            <TableRow key={spec.label}>
              <TableCell>{spec.label}</TableCell>
              <TableCell>{spec.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}



  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* Vehicle 1 Dropdowns */}
          <Autocomplete
            options={makes || []}
            getOptionLabel={(option) => option.make_display}
            value={selectedMake1}
            onChange={(event, newValue) => setSelectedMake1(newValue)}
            renderInput={(params) => <TextField {...params} label="Make 1" />}
          />
          <Autocomplete
            options={models1 || []}
            isOptionEqualToValue={(option, value) => option.model_name === value.model_name}
            getOptionLabel={(option) => option.model_name}
            value={selectedModel1}
            onChange={(event, newValue) => setSelectedModel1(newValue)}
            renderInput={(params) => <TextField {...params} label="Model 1" />}
          />
<Autocomplete
  options={years1 || []}
  getOptionLabel={(option) => (option ? option.toString() : "")}
  value={selectedYear1}
  onChange={(event, newValue) => setSelectedYear1(newValue)}
  renderInput={(params) => <TextField {...params} label="Year 1" />}
/>
<Autocomplete
  options={trims1 || []}
  getOptionLabel={(option) => option.model_trim}
  value={selectedTrim1}
  onChange={(event, newValue) => {
    console.log("Selected Trim 1:", newValue); // Add this line
    setSelectedTrim1(newValue);
  }}
  renderInput={(params) => <TextField {...params} label="Trim 1" />}
/>
     </Grid>

        <Grid item xs={6}>
          {/* Vehicle 2 Dropdowns */}
          <Autocomplete
            options={makes || []}
            getOptionLabel={(option) => option.make_display}
            value={selectedMake2}
            onChange={(event, newValue) => setSelectedMake2(newValue)}
            renderInput={(params) => <TextField {...params} label="Make 2" />}
          />
          <Autocomplete
            options={models2 || []}
            isOptionEqualToValue={(option, value) => option.model_name === value.model_name}
            getOptionLabel={(option) => option.model_name}
            value={selectedModel2}
            onChange={(event, newValue) => setSelectedModel2(newValue)}
            renderInput={(params) => <TextField {...params} label="Model 2" />}
          />
<Autocomplete
  options={years2 || []}
  getOptionLabel={(option) => (option ? option.toString() : "")}
  value={selectedYear2}
  onChange={(event, newValue) => setSelectedYear2(newValue)}
  renderInput={(params) => <TextField {...params} label="Year 2" />}
/>
<Autocomplete
  options={trims2 || []}
  getOptionLabel={(option) => option.model_trim}
  value={selectedTrim2}
  onChange={(event, newValue) => {
    console.log("Selected Trim 2:", newValue); // Add this line
    setSelectedTrim2(newValue);
  }}
  renderInput={(params) => <TextField {...params} label="Trim 2" />}
/>
        </Grid>
      </Grid>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleCompareClick}>
          Compare
        </Button>
      </Box>
<Grid container spacing={2}>
      <Grid item xs={6}>
        {vehicleData1 && renderVehicleData(vehicleData1)}
      </Grid>
      <Grid item xs={6}>
        {vehicleData2 && renderVehicleData(vehicleData2)}
      </Grid>
  </Grid>
</div>
  );
}

export default App;
