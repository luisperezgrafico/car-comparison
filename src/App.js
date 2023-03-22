import React, { useState, useEffect } from "react";
import axios from "axios";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

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
    if (!make) return;

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
  }

  if (selectedMake2) {
    fetchModels(selectedMake2.make_id).then((models) => setModels2(models));
  }
}, [selectedMake1, selectedMake2]);


  useEffect(() => {
async function fetchYears(make, modelName) {
  if (!make || !modelName) return;

  try {
    const response = await axios.get(
      `http://localhost:5000/api/getYears?make_id=${make}&model_name=${encodeURIComponent(modelName)}`
    );
    const years = response.data.years;
    console.log(`Fetched years for make ${make} and model ${modelName}:`, years);
    if (make === selectedMake1?.make_id && modelName === selectedModel1?.model_name) {
      setYears1(years);
    } else if (make === selectedMake2?.make_id && modelName === selectedModel2?.model_name) {
      setYears2(years);
    }
  } catch (error) {
    console.error("Error fetching years data:", error);
  }
}


    if (selectedMake1 && selectedModel1) {
      fetchYears(selectedMake1.make_id, selectedModel1.model_name).then((years) => setYears1(years));
    }

    if (selectedMake2 && selectedModel2) {
            fetchYears(selectedMake2.make_id, selectedModel2.model_name).then((years) => setYears2(years));
    }
  }, [selectedMake1, selectedModel1, selectedMake2, selectedModel2]);

  const handleCompareClick = async () => {
  if (!selectedMake1 || !selectedModel1 || !selectedYear1 || !selectedMake2 || !selectedModel2 || !selectedYear2) {
    alert("Please select both vehicles to compare.");
    return;
  }

  // Fetch vehicle data for both vehicles
  try {
    const response1 = await axios.get(
      `http://localhost:5000/api/getVehicleData?make=${selectedMake1?.make_id}&model=${selectedModel1?.model_name}&year=${selectedYear1?.year}`
    );
    setVehicleData1(response1.data);

    const response2 = await axios.get(
      `http://localhost:5000/api/getVehicleData?make=${selectedMake2?.make_id}&model=${selectedModel2?.model_name}&year=${selectedYear2?.year}`
    );
    setVehicleData2(response2.data);
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
  }
};


function renderVehicleData(vehicleData) {
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
          {/* You can add more rows based on the data you want to display */}
          <TableRow>
            <TableCell>Make</TableCell>
            <TableCell>{vehicleData.make_display}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Model</TableCell>
            <TableCell>{vehicleData.model_name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Year</TableCell>
            <TableCell>{vehicleData.year}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Price</TableCell>
            <TableCell>{formatNumber(vehicleData.price)}</TableCell>
          </TableRow>
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
            getOptionLabel={(option) => (option.year ? option.year.toString() : "")}
            value={selectedYear1}
            onChange={(event, newValue) => setSelectedYear1(newValue)}
            renderInput={(params) => <TextField {...params} label="Year 1" />}
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
            getOptionLabel={(option) => (option.year ? option.year.toString() : "")}
            value={selectedYear2}
            onChange={(event, newValue) => setSelectedYear2(newValue)}
            renderInput={(params) => <TextField {...params} label="Year 2" />}
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleCompareClick}>
          Compare
        </Button>
      </Box>
      {vehicleData1 && vehicleData2 && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">Vehicle 1</Typography>
            {/* Render vehicleData1 content here */}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Vehicle 2</Typography>
            {/* Render vehicleData2 content here */}
          </Grid>
        </Grid>
      )}
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

