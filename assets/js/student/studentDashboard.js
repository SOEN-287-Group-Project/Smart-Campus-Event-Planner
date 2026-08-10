const studentDashboardData = {
  // hardcoded data for the dashboard
  name: "Caroline",
  stats: {
    totalRegistrations: 24,
    upcoming: 3,
    attended: 21,
    cancelled: 1,
  },
  upcomingEvents: [
    { title: "Career Fair", date: "2026-08-10" },
    { title: "AI and Machine Learning Workshop", date: "2026-08-23" },
    { title: "Campus Networking Night", date: "2026-09-05" },
    { title: "Aerospace Engineering Conference", date: "2026-09-10" },
    { title: "Starry Night Dinner", date: "2026-09-10" },
  ],
  attendanceByCategory: {
    labels: ["Academic", "Career", "Club", "Sports", "Cultural", "Social"],
    data: [5, 4, 3, 2, 4, 3],
  },
};

function handleLogin() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  if (email === "admin" || email === "admin@concordia.ca") {
    window.location.href = "admin-dashboard.html";
  } else {
    window.location.href = "student-dashboard.html";
  }
}

function renderStudentHeader(data) {
  // render the student's name in the header
  const nameFromData = document.getElementById("student-name");
  if (nameFromData) {
    nameFromData.textContent = `${data.name}'s Dashboard`;
  }
}

function renderStats(data) {
  // This is for the quick stats at the top of the dashboard
  document.getElementById("stat-total").textContent = data.stats.totalRegistrations;
  document.getElementById("stat-upcoming").textContent = data.stats.upcoming;
  document.getElementById("stat-attended").textContent = data.stats.attended;
  document.getElementById("stat-cancelled").textContent = data.stats.cancelled;
}

function renderUpcomingTable(data) {
  const tbody = document.getElementById("upcoming-events-body");
  tbody.innerHTML = data.upcomingEvents
    .map(
      (event) => `
      <tr>
        <td>${event.title}</td>
        <td><strong>${event.date}</strong></td>
      </tr>`
    )
    .join("");
}

function renderStudentAttendanceChart(data) {
  const ctx = document.getElementById("student-attendance-chart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.attendanceByCategory.labels,
      datasets: [
        {
          label: "Events attended",
          data: data.attendanceByCategory.data,
          backgroundColor: "rgba(37, 99, 235, 0.5)",
          borderWidth: 1,
        },
      ],
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

function renderStudentCalendar(upcomingEvents) {
  const monthYearElement = document.getElementById("monthYear");
  const datesElement = document.getElementById("dates");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (!monthYearElement || !datesElement || !prevBtn || !nextBtn) return;

  let currentDate = new Date();

  const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 0);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    monthYearElement.textContent = currentDate.toLocaleDateString("default", {
      month: "long",
      year: "numeric",
    });

    let datesHTML = "";

    for (let i = firstDayIndex; i > 0; i--) {
      const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
      datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const activeClass =
        date.toDateString() === new Date().toDateString() ? "active" : "";

      const iso = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const dayEvents = upcomingEvents.filter((e) => e.date === iso);
      const eventClass = dayEvents.length ? "has-event" : "";
      const title = dayEvents.map((e) => e.title).join(", ");

      datesHTML += `<div class="date ${activeClass} ${eventClass}" title="${title}">${i}</div>`;
    }

    for (let i = 1; i <= 7 - lastDayIndex; i++) {
      const nextDate = new Date(currentYear, currentMonth + 1, i);
      datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
    }

    datesElement.innerHTML = datesHTML;
  };

  prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
  });

  nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
  });

  updateCalendar();
}

// ----------------Preparing data for the dashboard--------------

//this is a helper function to filter out registrations that are not upcoming
function isUpcomingRegistration(registration) { // we pass in the registration objects from the getRegistrationsForUser function from the DB
  const today = new Date().toISOString().slice(0, 10);

  if (!registration.event_date || registration.event_date < today) { // if the event date is not set or is in the past, return false
    return false;
  }

  if (
    registration.status === "cancelled" || // if the registration status is cancelled, completed, or disabled, return false
    registration.status === "completed" ||
    registration.status === "disabled"
  ) {
    return false;
  }

  return true;
}

function getUpcomingEvents(registrations) {
  return registrations.filter(isUpcomingRegistration).map((registration) => ({
      title: registration.title,
      date: registration.event_date,
    })).sort((a, b) => a.date.localeCompare(b.date)); // sort the registrations by date, can do so with string comparison since dates are in ISO format
}

function getAttendanceByCategory(registrations) {
  const attended = registrations.filter(
    (registration) => registration.attended === "yes" // filter out registrations that are not attended
  );

  const counts = {};
  for (const registration of attended) {
    const label = registration.category_name || "Other"; // if the registration category is not set, set it to "Other"
    counts[label] = (counts[label] || 0) + 1; // count the number of registrations for each category
  }

  const labels = Object.keys(counts).sort(); // sort the categories alphabetically
  const data = labels.map((label) => counts[label]); // map the categories to the number of registrations for each category

  return { labels, data }; // return the categories and the number of registrations for each category
}

function buildStudentDashboardData(name, registrations) {
  const upcomingEvents = getUpcomingEvents(registrations);

  return {
    name: name.trim().split(" ")[0], // get the first name of the student
    stats: {
      totalRegistrations: registrations.length,
      upcoming: upcomingEvents.length,
      attended: registrations.filter((r) => r.attended === "yes").length,
      cancelled: registrations.filter((r) => r.status === "cancelled").length,
    },
    upcomingEvents: upcomingEvents,
    attendanceByCategory: getAttendanceByCategory(registrations),
  };
}

async function initStudentDashboard() {
  try {
    const response = await fetch("/student/api/dashboard");
    const payload = await response.json();

    if (!response.ok) {
      alert(payload.message || "Unable to load dashboard.");
      return;
    }

    const data = buildStudentDashboardData(
      payload.name,
      payload.registrations
    );

    renderStudentHeader(data);
    renderStats(data);
    renderUpcomingTable(data);
    renderStudentAttendanceChart(data);
    renderStudentCalendar(data.upcomingEvents);
  } catch (error) {
    console.error(error);
    alert("Unable to load dashboard.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("stat-total")) { //simple check to ensure the DOM is loaded before initializing the dashboard
    initStudentDashboard();
  }
});
