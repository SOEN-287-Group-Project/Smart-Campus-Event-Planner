function rendercharts() {
    // ******************************************
    // Elements
    // ******************************************
    const totalEventsCount = document.getElementById("totalEventsCount");
    const upcomingEventsCount = document.getElementById("upcomingEventsCount");
    const fullEventsCount = document.getElementById("fullEventsCount");
    const cancelledEventsCount = document.getElementById("cancelledEventsCount");
    const completedEventsCount = document.getElementById("completedEventsCount");
    const tableBody = document.getElementById("registrations/capacityPerEvent");



    
    // Fetch events + attendance
    // ******************************************
    Promise.all([
        fetch("/admin/api/events").then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load events");
            }

            return response.json();
        }),

        fetch("/admin/api/attendance").then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load attendance");
            }

            return response.json();
        })
    ])
    .then(([events, attendance]) => {

        
        // EVENT COUNTERS
        // ******************************************

        // Total Events
        totalEventsCount.innerHTML = events.length;

        // Upcoming Events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingEvents = events.filter((event) => {
            const eventDate = new Date(event.event_date + "T00:00:00");

            return eventDate > today && event.status !== "cancelled";
        });

        upcomingEventsCount.innerHTML = upcomingEvents.length;

        // Full Events
        const fullEvents = events.filter((event) => {
            return event.status === "full";
        });

        fullEventsCount.innerHTML = fullEvents.length;

        // Cancelled Events
        const cancelledEvents = events.filter((event) => {
            return event.status === "cancelled";
        });

        cancelledEventsCount.innerHTML = cancelledEvents.length;

        // Completed Events
        const completedEvents = events.filter((event) => {
            return event.status === "completed";
        });

        completedEventsCount.innerHTML = completedEvents.length;


        
        // REGISTRATIONS / CAPACITY TABLE
        // ******************************************

        tableBody.innerHTML = "";

        events.forEach((event) => {

            const registrationCount = attendance.filter((registration) => {
                return Number(registration.event_id) === Number(event.event_id);
            }).length;

            tableBody.innerHTML += `
                <tr>
                    <td>${event.title}</td>
                    <td>${event.capacity}</td>
                    <td>${registrationCount}</td>
                </tr>
            `;
        });


        // CHART.JS

        if (typeof Chart === "undefined") {
            console.error("Chart.js could not be loaded.");
            return;
        }


        // CATEGORY DATA
        // ******************************************


        const categoryData = {};

        events.forEach((event) => {

            const category = event.category_name;

            if (!categoryData[category]) {
                categoryData[category] = {
                    events: 0,
                    registrations: 0,
                    capacity: 0
                };
            }

            // Number of events in category
            categoryData[category].events++;

            // Total capacity for category
            categoryData[category].capacity += Number(event.capacity) || 0;

            // Registrations belonging to this event
            const registrationCount = attendance.filter((registration) => {
                return Number(registration.event_id) === Number(event.event_id);
            }).length;

            categoryData[category].registrations += registrationCount;
        });


        // BAR CHART DATA
        // Registrations vs Vacancies per category
        // ******************************************

        // Category array for chart
        const categories = Object.keys(categoryData);

        // Data for chart
        const registrationsPerCategory = categories.map((category) => {
            return categoryData[category].registrations;
        });

        const vacanciesPerCategory = categories.map((category) => {

            const capacity = categoryData[category].capacity;
            const registrations = categoryData[category].registrations;

            return Math.max(0, capacity - registrations);
        });


        // BAR CHART
        // ******************************************

        const barCanvas = document.getElementById("bar-chart");

        if (barCanvas) {

            window.registrationCategoryChart = new Chart(barCanvas, {
                type: "bar",

                data: {
                    labels: categories,

                    datasets: [
                        {
                            label: "# of Registrations",

                            data: registrationsPerCategory,

                            borderWidth: 1,

                            backgroundColor: "rgba(54, 162, 235, 0.4)",

                            borderColor: "rgba(54, 162, 235, 1)"
                        },

                        {
                            label: "# of Vacancies",

                            data: vacanciesPerCategory,

                            borderWidth: 1,

                            backgroundColor: "rgba(137, 211, 19, 0.4)",

                            borderColor: "rgba(137, 211, 19, 1)"
                        }
                    ]
                },

                options: {
                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {
                        y: {
                            beginAtZero: true,

                            ticks: {
                                precision: 0
                            }
                        }
                    },

                    plugins: {
                        legend: {
                            position: "top"
                        }
                    }
                }
            });
        }


        // DOUGHNUT CHART DATA
        // Number of events per category
        // ******************************************

        const eventsPerCategory = categories.map((category) => {
            return categoryData[category].events;
        });


        // DOUGHNUT CHART
        // ******************************************

        const doughnutCanvas = document.getElementById("doughnut-chart");

        if (doughnutCanvas) {

            const backgroundColors = [
                "#ff6384",
                "#36a2eb",
                "#ffce56",
                "#4bc0c0",
                "#9966ff",
                "#ff40d6",
                "#ff3848",
                "#6e25ff",
                "#ffca39"
            ];

            window.eventsCategoryChart = new Chart(doughnutCanvas, {
                type: "doughnut",

                data: {
                    labels: categories,

                    datasets: [
                        {
                            data: eventsPerCategory,

                            backgroundColor: categories.map((category, index) => {
                                return backgroundColors[index % backgroundColors.length];
                            }),

                            borderColor: "#fff",

                            borderWidth: 2
                        }
                    ]
                },

                options: {
                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            position: "bottom"
                        },

                        tooltip: {
                            callbacks: {
                                label: function(context) {

                                    const value = context.raw;

                                    const total = eventsPerCategory.reduce(
                                        (sum, value) => sum + value,
                                        0
                                    );

                                    const percentage = total > 0
                                        ? ((value / total) * 100).toFixed(1)
                                        : 0;

                                    return `${context.label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

    })
    .catch((error) => {

        console.error(error);

        // Counters
        if (totalEventsCount) {
            totalEventsCount.innerHTML = "-";
        }

        if (upcomingEventsCount) {
            upcomingEventsCount.innerHTML = "-";
        }

        if (fullEventsCount) {
            fullEventsCount.innerHTML = "-";
        }

        if (cancelledEventsCount) {
            cancelledEventsCount.innerHTML = "-";
        }

        if (completedEventsCount) {
            completedEventsCount.innerHTML = "-";
        }

        // Table
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3">
                        Unable to load event or registration data.
                    </td>
                </tr>
            `;
        }
    });
}


function initializeAnalyticsPage(){
    if (document.getElementById("bar-chart") || document.getElementById("doughnut-chart")) {
            rendercharts();
        }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAnalyticsPage);
} else {
    initializeAnalyticsPage();
}    