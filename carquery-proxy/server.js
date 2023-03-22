const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/api/getYears", async (req, res) => {
  const { make, model } = req.query; // Change 'make_id' to 'make'

  if (!make || !model) {
    res.status(400).json({ error: "Missing 'make' or 'model' query parameter" });
    return;
  }

  try {
    const response = await axios.get(
      `https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=${make}&model=${model}`
    );
    // ... the rest of the code remains unchanged
  } catch (error) {
    console.error("Error fetching years:", error);
    res.status(500).json({ error: "Failed to fetch years" });
  }
});





app.get("/api/getMakes", async (req, res) => {
  try {
    const response = await axios.get("https://www.carqueryapi.com/api/0.3/?cmd=getMakes");
    res.json({ makes: response.data.Makes });
  } catch (error) {
    console.error("Error fetching makes:", error);
    res.status(500).json({ error: "Failed to fetch makes" });
  }
});

app.get("/api/getModels", async (req, res) => {
  const { make } = req.query;

  if (!make) {
    res.status(400).json({ error: "Missing 'make' query parameter" });
    return;
  }

  try {
    const response = await axios.get(
      `https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${make}`
    );
    res.json({ models: response.data.Models });
      } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});