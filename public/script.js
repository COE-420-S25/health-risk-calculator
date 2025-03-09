document
  .getElementById("riskForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get user input values
    const age = parseInt(document.getElementById("age").value);
    const height = parseInt(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const systolic = parseInt(document.getElementById("systolic").value);
    const diastolic = parseInt(document.getElementById("diastolic").value);
    const diseases = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((el) => el.value);

    // Validate input fields
    let errorMessage = "";

    if (isNaN(age) || age < 0 || age > 150) {
      errorMessage += "❌ Age must be between 0 and 150.<br>";
    }
    if (isNaN(height) || height < 60 || height > 350) {
      errorMessage += "❌ Height must be between 60 cm and 350 cm.<br>";
    }
    if (isNaN(weight) || weight < 5 || weight > 300) {
      errorMessage += "❌ Weight must be between 5 kg and 300 kg.<br>";
    }
    if (isNaN(systolic) || systolic < 30 || systolic > 300) {
      errorMessage +=
        "❌ Systolic blood pressure must be between 30 and 300.<br>";
    }
    if (isNaN(diastolic) || diastolic < 20 || diastolic > 200) {
      errorMessage +=
        "❌ Diastolic blood pressure must be between 20 and 200.<br>";
    }

    // Show error messages if validation fails
    const resultDiv = document.getElementById("result");
    if (errorMessage) {
      resultDiv.innerHTML = `<p class="error-message">${errorMessage}</p>`;
      resultDiv.classList.remove("hidden");
      return; // Stop execution if there are errors
    }

    // Proceed with API call if no errors
    const response = await fetch("/calculate-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age,
        height,
        weight,
        systolic,
        diastolic,
        diseases,
      }),
    });

    const data = await response.json();

    // Display results
    resultDiv.innerHTML = `
      <p>BMI: <span class="highlight">${data.bmi}</span></p>
      <p>Risk Score: <span class="highlight">${data.totalRisk}</span></p>
      <p>Risk Category: <strong class="highlight">${data.riskCategory}</strong></p>
  `;
    resultDiv.classList.remove("hidden");
  });
