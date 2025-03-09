document
  .getElementById("riskForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const systolic = document.getElementById("systolic").value;
    const diastolic = document.getElementById("diastolic").value;
    const diseases = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((el) => el.value);

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

    // Display results in a structured order
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <p>BMI: <span class="highlight">${data.bmi}</span></p>
        <p>Risk Score: <span class="highlight">${data.totalRisk}</span></p>
        <p>Risk Category: <strong class="highlight">${data.riskCategory}</strong></p>
    `;

    resultDiv.classList.remove("hidden");
  });
