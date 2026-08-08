function rendercharts() {
    if (typeof Chart === 'undefined') {
        const container = document.querySelector('.chart-grid');
        if (container) {
            container.innerHTML = '<p>Chart library could not be loaded.</p>';
        }
        return;
    }

    const ctx = document.getElementById('bar-chart');

    new Chart(ctx, {
        type: 'bar',
        data: {
        labels: ['Academic', 'Social', 'Sports', 'Cultural', 'Career', 'Workshops' , 'Club Activities' , 'Volunteering' , 'Networking'],
        datasets: [{
            label: '# of Registrations', //number of registrations per category
            data: [12, 19, 3, 5, 2, 3, 8, 12, 6],
            borderWidth: 1,
            backgroundColor: 'rgba(54, 162, 235, 0.4)',
        },
        {
            label: '# of vacancies', //number of vacancies per category
            data: [5, 10, 15, 20, 25, 30, 7, 18, 5],
            borderWidth: 1,
            backgroundColor: 'rgba(137, 211, 19, 0.4)',
        }]
        },
        options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
            beginAtZero: true
            }
        }
        }
    });

    const ctx2 = document.getElementById('doughnut-chart');

    const dataValues = [30, 25, 20, 25, 15, 10, 12, 30, 2]; //number of events per category
    const total = dataValues.reduce((sum, value) => sum + value, 0);
    
    new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Academic', 'Social', 'Sports', 'Cultural', 'Career', 'Workshops' , 'Club Activities' , 'Volunteering' , 'Networking'],
            datasets: [{
                data: dataValues,
                backgroundColor: [
                    '#ff6384',
                    '#36a2eb',
                    '#ffce56',
                    '#4bc0c0',
                    '#9966ff',
                    '#ff40d6',
                    '#ff3848',
                    '#6e25ff',
                    '#ffca39'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}
/**************Navigation Scripts**************/
function toggleDropdown() {
    const button = document.getElementById("menuButton");
    const menu = document.getElementById("dropdown") || document.getElementById("studentDropdown");

    if (!button || !menu) return;

    button.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
        menu.classList.add("hidden");
    });
}

function rotateMenuArrow(){
    const arrow = document.querySelector(".arrow");

    arrow.addEventListener("click", () => {
        arrow.classList.toggle("open");
    });
}
/**********************************************/

/*Calendar rendering*/
function renderCalendar(){
    const monthYearElement = document.getElementById('monthYear');
    const datesElement = document.getElementById('dates');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentDate = new Date();

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
            datesHTML += `<div class = "date ${activeClass}">${i}</div>`;
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

/***dynamically populate the admin navigation menu***/
function getNavDropdown() {
    const adminNavItems = document.getElementById("dropdown");

    if (!adminNavItems) return;

    adminNavItems.innerHTML += `
                        <a href="/admin/admin-dashboard" target="_self">Overview</a>
                        <a href="/admin/manage-events" target="_self">Manage Events</a>
                        <a href="/admin/create-event" target="_self">Create Event</a>
                        <a href="/admin/analytics" target="_self">Analytics</a>
                                `;
    }

function getStudentNavDropdown() {
    const adminNavItems = document.getElementById("studentDropdown");

    if (!adminNavItems) return;

    adminNavItems.innerHTML += `
                        <a href="/student/student-dashboard" target="_self">Overview</a>
                        <a href="/student/events" target="_self">Events</a>
                        <a href="/student/my-registrations" target="_self">My Registrations</a>
                        <a href="/student/profile" target="_self">Profile</a>
                                `;
    }

/*****Rendering events table from database*****/ 

//Attendace modal()

//Edit event modal()

//Table rendering()

//fetch APIs

function renderEvents(){
    const tbody = document.getElementById("eventTableBody"); //locate the table body

    if (!tbody) return;
    
    let events = []; 
    let currentEvent = null;
    let attendanceData = {};


    function attendanceModal() {

        const modal = document.getElementById("attendanceModal");
        const attendanceTableBody =
            document.getElementById("attendanceTableBody");
        const eventTitle =
            document.getElementById("currentEventTitle");

        tbody.addEventListener("click", (e) => {

            if (!e.target.classList.contains("Manage-Attendance")) return;

            const id = e.target.dataset.id;

            currentEvent = events.find(
                (event) => event.event_id == id
            );

            if (!currentEvent) return;

            eventTitle.textContent = currentEvent.title;

            // Remove attendees from previous event
            attendanceTableBody.innerHTML = "";

            // Get attendees belonging to this event
            const attendees = attendanceData[id] || [];

            
            attendees.forEach((attendee) => {

                attendanceTableBody.innerHTML += `
                    <tr>
                        <td>${attendee.user_id}</td>
                        <td>${attendee.attended}</td>
                        <td>
                            <button
                                class="delete-attendee"
                                data-id="${attendee.user_id}">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;

            });

            modal.style.display = 'flex';
        });


    // Close modal
    AttendanceCancelBtn?.addEventListener("click", () => {
            modal.style.display = "none";
        });

    modal.addEventListener("click", (e) => {

        if (e.target === modal) {
            modal.style.display = "none";
        }

    });
}

    function editEventModal() {
        //locate edit button
        const modal = document.getElementById("editStudentModal"); 
        //modal input fields
        const editName = document.getElementById("editName"); 
        const editStartDate = document.getElementById("editStartDate");
        const editStartTime = document.getElementById("editStartTime");
        const editEndTime = document.getElementById("editEndTime");
        const editCategory = document.getElementById("editCategory");
        const editCapacity = document.getElementById("editCapacity");
        const editDescription = document.getElementById("editDescription");
        const editEventLocation = document.getElementById("editEventLocation");

        const saveBtn = document.getElementById("saveBtn");
        const cancelBtn = document.getElementById("cancelBtn");

        if (!modal) return;

        tbody.addEventListener("click", (e) => {
            if (!e.target.classList.contains("edit-event")) return;

            const id = e.target.dataset.id;
            currentEvent = events.find((event) => event.event_id == id);

            if (!currentEvent) return;

            editName.value = currentEvent.title;
            editStartDate.value = currentEvent.event_date;
            editStartTime.value = currentEvent.start_time;
            editEndTime.value = currentEvent.end_time;
            editCategory.value = currentEvent.category_id;
            editCapacity.value = currentEvent.capacity;
            editDescription.value = currentEvent.description;
            editEventLocation.value = currentEvent.location;
            modal.style.display = "flex";
        });

        saveBtn?.addEventListener("click", async () => {
            if (!currentEvent) return;

            const updatedEvent = {
                title: editName.value,
                event_date: editStartDate.value,
                start_time: editStartTime.value,
                end_time: editEndTime.value,
                category_id: editCategory.value,
                capacity: Number(editCapacity.value),
                description: editDescription.value,
                location: editEventLocation.value
            };

            try {
                const response = await fetch( // send the updated event data to Express with the event ID is included in the URL
                    `/admin/api/events/${currentEvent.event_id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updatedEvent) //convert the updated event object to a JSON string
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to update event");
                }

                const savedEvent = await response.json();

                // replace the local event with what the server saved
                Object.assign(currentEvent, savedEvent);

                renderTable();
                modal.style.display = "none";

            } catch (error) {
                console.error(error);
                alert("Failed to save event.");
            }
        });

        //close modal
        cancelBtn?.addEventListener("click", () => {
            modal.style.display = "none";
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    function renderTable() {
        tbody.innerHTML = "";

        events.forEach((event) => {
            tbody.innerHTML += `
                <tr>
                    <td>${event.title}</td>
                    <td>${(event.event_date && event.start_time) ? `${event.event_date}<br>${event.start_time}` : ""}</td>
                    <td>${event.end_time || ""}</td>
                    <td>${event.category_id || ""}</td>
                    <td>${event.capacity || ""}</td>
                    <td>${event.location || ""}</td>
                    <td>${event.status || ""}</td>
                    <td>

                        <button type="button" class="edit-event" data-id="${event.event_id}">
                            Edit
                        </button>

                        <button type="button" class="Manage-Attendance" data-id="${event.event_id}">
                            Attendance
                        </button>

                    </td>
                </tr>
            `;
        });
    }

    fetch("/admin/api/events") //fetch events
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load events");
            }
            return response.json();
        })
        .then((data) => {
            events = data;
            renderTable();
        })
        .catch((error) => {
            console.error(error);
            tbody.innerHTML = `<tr><td colspan="7">Unable to load events from the server.</td></tr>`;
        });


    

    fetch('/admin/api/attendance') //fetch attendance
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to load attendance data');
            }

            return res.json();
        })
        .then((data) => {

            attendanceData = data.reduce((result, registration) => {

                const eventId = registration.event_id;

                // Create array for this event if it doesn't exist
                if (!result[eventId]) {
                    result[eventId] = [];
                }

                // Store the entire registration
                result[eventId].push(registration);

                return result;

            }, {});


        })
        .catch((err) => {
            console.warn('Could not prefetch attendance data:', err);
        });

    editEventModal();
    attendanceModal();


}
/**********************************************/

/*Element checking before function calls*/
function initializeAdminPage() {
    if (document.getElementById("menuButton") && document.getElementById("dropdown")) {
        toggleDropdown();
    }

    if (document.getElementById("menuButton") && document.getElementById("studentDropdown")) {
        toggleDropdown();
    }
    

    if (document.querySelector(".arrow")) {
        rotateMenuArrow();
    }

    if (document.getElementById("dropdown")) {
        getNavDropdown();
    }

    if (document.getElementById("studentDropdown")) {
        getStudentNavDropdown();
    }

    if (document.getElementById("monthYear") && document.getElementById("dates")) {
        renderCalendar();
    }

    if (document.getElementById("bar-chart") || document.getElementById("doughnut-chart")) {
        rendercharts();
    }

    if (document.getElementById("eventTableBody")) {
        renderEvents();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAdminPage);
} else {
    initializeAdminPage();
}
