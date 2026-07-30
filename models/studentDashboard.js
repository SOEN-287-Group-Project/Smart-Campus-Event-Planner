function renderStudentAttendanceChart() {
    const ctx = document.getElementById("student-attendance-chart");
  
    new Chart(ctx, {
      type: "bar", 
      data: {
        labels: [
          "Academic",
          "Career",
          "Club",
          "Sports",
          "Cultural",
          "Social",
        ],
        datasets: [{
          label: "Events attended",
          data: [5, 4, 3, 2, 4, 3], 
          backgroundColor: "rgba(37, 99, 235, 0.5)",
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
      },
    });
  }

  
  function handleLogin() {
    const email = document.getElementById("email").value.trim().toLowerCase();
    if (email === "admin" || email === "admin@concordia.ca") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "student-dashboard.html";
    }
  }