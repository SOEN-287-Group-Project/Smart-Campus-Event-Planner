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

function toggleDropdown() {
    const button = document.getElementById("menuButton");
    const menu = document.getElementById("dropdown");

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

/***Rendering events table from database***/ 
function renderEvents(){
    const tbody = document.getElementById("eventTableBody"); //locate the table body
    const modal = document.getElementById("editModal"); //locate edit button

    const editName = document.getElementById("editName");//modal input fields


    const editStartDate = document.getElementById("editStartDate");
    const editStartTime = document.getElementById("editStartTime");
    const editEndTime = document.getElementById("editEndTime");


    const editCategory = document.getElementById("editCategory");
    const editCapacity = document.getElementById("editCapacity");
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    if (!tbody) return; //render only if the table body exists

    let events = []; 
    let currentEvent = null; // r

    function renderTable() {
        tbody.innerHTML = "";

        events.forEach((event) => {
            tbody.innerHTML += `
                <tr>
                    <td>${event.title}</td>
                    <td>${event.start_time ? event.start_time.replace("T", "<br>") : ""}</td>
                    <td>${event.end_time ? event.end_time.replace("T", "<br>") : ""}</td>
                    <td>${event.category_id || ""}</td>
                    <td>${event.capacity || ""}</td>
                    <td>${event.status || ""}</td>
                    <td>
                        <button class="edit-event" data-id="${event.event_id}">
                            Edit
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    fetch("/admin/api/events")
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
            tbody.innerHTML = `<tr><td colspan="6">Unable to load events from the server.</td></tr>`;
        });
    
    /*Modal popup for editing events*/    
    tbody.addEventListener("click", (e) => {
        if (!e.target.classList.contains("edit-event")) return;

        const id = e.target.dataset.id;
        currentEvent = events.find((event) => event.event_id === id);

        if (!currentEvent) return;

        editName.value = currentEvent.title;
        editStartDate.value = currentEvent.event_date;
        editStartTime.value = currentEvent.start_time;
        editEndTime.value = currentEvent.end_time;
        editCategory.value = currentEvent.category_id;
        editCapacity.value = currentEvent.capacity;

        if (modal) {
            modal.style.display = "flex";
        }
    });

    saveBtn?.addEventListener("click", () => {//save changes to the event (push to db?)
        if (!currentEvent) return;

        currentEvent.title = editName.value;
        currentEvent.start_date = editStartDate.value;
        currentEvent.start_time = editStartTime.value;
        currentEvent.end_time = editEndTime.value;
        currentEvent.category_id = editCategory.value;
        currentEvent.capacity = editCapacity.value;

        renderTable();
        modal.style.display = "none";
    });

    cancelBtn?.addEventListener("click", () => {
        if (modal) {
            modal.style.display = "none";
        }
    });

    modal?.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
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

function initializeAdminPage() {
    if (document.getElementById("menuButton") && document.getElementById("dropdown")) {
        toggleDropdown();
    }

    if (document.querySelector(".arrow")) {
        rotateMenuArrow();
    }

    if (document.getElementById("dropdown")) {
        getNavDropdown();
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
