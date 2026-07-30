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

  function renderStudentCalendar(){
    const monthYearElement = document.getElementById('monthYear');
    const datesElement = document.getElementById('dates');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentDate = new Date();

    
    const upcomingEvents = [
        { title: "Career Fair", date: "2026-08-10" },
        { title: "AI and Machine Learning Workshop", date: "2026-08-23" },
        { title: "Campus Networking Night", date: "2026-09-05" },
        { title: "Aerospace Engineering Conference", date: "2026-09-10" },
        { title: "Starry Night Dinner", date: "2026-09-10" }
      ];




    const updateCalendar = () => {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const firstDay = new Date(currentYear, currentMonth, 0);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const totalDays = lastDay.getDate();
        const firstDayIndex = firstDay.getDay();
        const lastDayIndex = lastDay.getDay();

        const monthYearString = currentDate.toLocaleDateString('default' , {month: 'long' , year: 'numeric'});
        monthYearElement.textContent = monthYearString;

        let datesHTML = '';

        for(let i = firstDayIndex; i > 0; i--){
            const prevDate = new Date(currentYear, currentMonth , 0 - i + 1);
            datesHTML += `<div class = "date inactive">${prevDate.getDate()}</div>`;
        }
    

        for(let i = 1; i<=totalDays; i++){
            const date = new Date(currentYear, currentMonth, i);
            const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
            // Check if the date is in the upcoming events array
            const iso = `${currentYear}-${String(currentMonth + 1 /* + 1 because months are 0-indexed */).padStart(2/* if the string is less than 2 characters pad it with ->*/, "0"/* So that the dates are formatted like 01, 02, etc. */ )}-${String(i).padStart(2, "0")}`;
            const dayEvents = upcomingEvents.filter((e) => e.date === iso); // Filter the upcoming events array to get the events for the current date
            const eventClass = dayEvents.length ? "has-event" : ""; // If there are events for the current date, add the has-event class
            const title = dayEvents.map((e) => e.title).join(", "); // Join the event titles with a comma in case there are multiple events for the current date

            datesHTML += `<div class="date ${activeClass} ${eventClass}" title="${title}">${i}</div>`;
        }

        for(let i = 1; i <= 7 - lastDayIndex; i++){
            const nextDate = new Date(currentYear, currentMonth + 1, i);
            datesHTML += `<div class = "date inactive">${nextDate.getDate()}</div>`;

        }

        datesElement.innerHTML = datesHTML;
    } 
    
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    })

    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    })

    updateCalendar();
}