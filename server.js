const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // Use Azure's assigned port

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html when accessing root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Risk Calculation API
app.post("/calculate-risk", (req, res) => {
  const { age, height, weight, systolic, diastolic, diseases = [] } = req.body; // Ensure `diseases` is an array

  // Validate inputs
  if (!age || !height || !weight || !systolic || !diastolic) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (height < 60) {
    return res.status(400).json({ error: "Height must be at least 60 cm." });
  }

  // Calculate BMI
  const heightMeters = height / 100;
  const bmi = weight / (heightMeters * heightMeters);

  // Determine BMI Category
  let bmiPoints = 0;
  if (bmi >= 25 && bmi < 30) {
    bmiPoints = 30; // Overweight
  } else if (bmi >= 30) {
    bmiPoints = 75; // Obese
  }

  // Age Points
  let agePoints = age < 30 ? 0 : age < 45 ? 10 : age < 60 ? 20 : 30;

  // Blood Pressure Points
  let bpPoints = 0;
  if (systolic < 120 && diastolic < 80) {
    bpPoints = 0; // Normal
  } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    bpPoints = 15; // Elevated
  } else if (
    (systolic >= 130 && systolic <= 139) ||
    (diastolic >= 80 && diastolic <= 89)
  ) {
    bpPoints = 30; // Stage 1 Hypertension
  } else if (systolic >= 140 || diastolic >= 90) {
    bpPoints = 75; // Stage 2 Hypertension
  } else if (systolic > 180 || diastolic > 120) {
    bpPoints = 100; // Hypertensive Crisis
  }

  // Family Disease Points
  let diseasePoints = 0;
  if (diseases.includes("diabetes")) diseasePoints += 10;
  if (diseases.includes("cancer")) diseasePoints += 10;
  if (diseases.includes("alzheimers")) diseasePoints += 10;

  // Total Risk Score
  const totalRisk = agePoints + bmiPoints + bpPoints + diseasePoints;

  // Determine Risk Category
  let riskCategory = "Uninsurable";
  if (totalRisk <= 20) riskCategory = "Low Risk";
  else if (totalRisk <= 50) riskCategory = "Moderate Risk";
  else if (totalRisk <= 75) riskCategory = "High Risk";

  res.json({
    age,
    bmi: bmi.toFixed(2),
    bpPoints,
    diseasePoints,
    totalRisk,
    riskCategory,
  });
});

// Handle 404 errors (optional)
app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
