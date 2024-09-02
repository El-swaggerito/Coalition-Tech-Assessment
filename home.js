async function fetchData() {
    const url = 'https://fedskillstest.coalitiontechnologies.workers.dev';
    const username = 'coalition';
    const password = 'skills-test';

    const credentials = btoa(`${username}:${password}`);
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + credentials);

    const options = {
        method: 'GET',
        headers: headers
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Data fetched successfully:', data);

        const patientData = data[3];
        const formattedDates = formatDate(patientData.date_of_birth)
        const age = calculateAge(patientData.date_of_birth)
        const diagnosisData = patientData.diagnosis_history
        const diastolicData = diagnosisData.slice(0, 6).map(item => item.blood_pressure.diastolic.value).reverse();
        const systolicData = diagnosisData.slice(0, 6).map(item => item.blood_pressure.systolic.value).reverse();


        const xValues = ["Oct, 2023", "Nov, 2023", "Dec, 2023", "Jan, 2024", "Feb, 2024", "Mar, 2024"];
new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
      datasets: [{
      label: 'Diastolic',
      data: diastolicData,
      borderColor: "red",
      fill: false
      }, {
      label: 'Systolic',
      data: systolicData,
      borderColor: "green",
      fill: false
    }]
  },
  options: {
      legend: {
          display: true,
          position: 'right'
      },
       scales: {
      x: {
        title: {
          display: true,
          text: 'Months'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Blood Pressure (mm Hg)'
        }
      }
    }
  }
});
        
        if (patientData) {
            updateContent(".name", patientData.name);
            updateContent(".center", patientData.profile_picture, "src");
            updateContent(".dob", formattedDates);
            updateContent(".gender", `${patientData.gender}, ${age}`);
            updateContent(".contact", patientData.phone_number);
            updateContent(".e-contact", patientData.emergency_contact);
            updateContent(".insurance", patientData.insurance_type);

            if (patientData.diagnostic_list.length >= 4) {
                updateContent(".p1", patientData.diagnostic_list[0].name);
                updateContent(".p2", patientData.diagnostic_list[1].name);
                updateContent(".p3", patientData.diagnostic_list[2].name);
                updateContent(".p4", patientData.diagnostic_list[3].name);

                updateContent(".d1", patientData.diagnostic_list[0].description);
                updateContent(".d2", patientData.diagnostic_list[1].description);
                updateContent(".d3", patientData.diagnostic_list[2].description);
                updateContent(".d4", patientData.diagnostic_list[3].description);

                updateContent(".s1", patientData.diagnostic_list[0].status);
                updateContent(".s2", patientData.diagnostic_list[1].status);
                updateContent(".s3", patientData.diagnostic_list[2].status);
                updateContent(".s4", patientData.diagnostic_list[3].status);
            }
        } else {
            console.error('Patient data is not available');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function updateContent(selector, content, attribute) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        if (attribute) {
            element[attribute] = content;
        } else {
            element.innerHTML = content;
        }
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function calculateAge(birthDateString) {
    const birthDate = new Date(birthDateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

fetchData();


