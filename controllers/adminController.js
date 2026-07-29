function rendercharts() {
    const ctx = document.getElementById('bar-chart');

    new Chart(ctx, {
        type: 'bar',
        data: {
        labels: ['Academic', 'Social', 'Sports', 'Cultural', 'Career', 'Workshops'],
        datasets: [{
            label: '# of Registrations',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
            backgroundColor: 'rgba(54, 162, 235, 0.4)',
        },
        {
            label: '# of vacancies',
            data: [5, 10, 15, 20, 25, 30],
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

    const dataValues = [30, 25, 20, 25, 15, 10];
    const total = dataValues.reduce((sum, value) => sum + value, 0);

    new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Academic', 'Social', 'Sports', 'Cultural', 'Career', 'Workshops'],
            datasets: [{
                data: dataValues,
                backgroundColor: [
                    '#ff6384',
                    '#36a2eb',
                    '#ffce56',
                    '#4bc0c0',
                    '#9966ff',
                    '#ff40d6'
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

/************************MODAL popup********************************* */ 
function renderEvents(){
    const events = [
    {
        id: 1,
        name: "Spring Tech Summit",
        start: "2026-03-15T10:00",
        end: "2026-03-15T12:00",
        category: "Workshop",
        capacity: 185
    },
    {
        id: 2,
        name: "Campus Networking Night",
        start: "2026-04-02T18:00",
        end: "2026-04-02T20:00",
        category: "Career",
        capacity: 92
    },
    {
        id: 3,
        name: "Volunteer Fair",
        start: "2026-04-10T21:00",
        end: "2026-04-10T23:00",
        category: "Social",
        capacity: 143
    }
    ];

    const tbody = document.getElementById("eventTableBody");
    const modal = document.getElementById("editModal");

    const editName = document.getElementById("editName");
    const editStart = document.getElementById("editStart");
    const editEnd = document.getElementById("editEnd");
    const editCategory = document.getElementById("editCategory");
    const editCapacity = document.getElementById("editCapacity")

    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    let currentEvent = null;

    function renderTable() {
        tbody.innerHTML = "";

        events.forEach((event) => {
            tbody.innerHTML += `
                <tr>
                    <td>${event.name}</td>
                    <td>${event.start.replace("T", "<br>")}</td>
                    <td>${event.end.replace("T", "<br>")}</td>
                    <td>${event.category}</td>
                    <td>${event.capacity}</td>
                    <td>
                        <button class="edit-event" data-id="${event.id}">
                            Edit
                        </button>

                    </td>
                </tr>
            `;
        });
    }

    renderTable();

    tbody.addEventListener("click", (e) => {
        if (!e.target.classList.contains("edit-event")) return;

        const id = Number(e.target.dataset.id);
        currentEvent = events.find((event) => event.id === id);

        editName.value = currentEvent.name;
        editStart.value = currentEvent.start;
        editEnd.value = currentEvent.end;
        editCategory.value = currentEvent.category;
        editCapacity.value = currentEvent.capacity;

        modal.style.display = "flex";
    });

    saveBtn.addEventListener("click", () => {
        currentEvent.name = editName.value;
        currentEvent.start = editStart.value;
        currentEvent.end = editEnd.value;
        currentEvent.category = editCategory.value;
        currentEvent.capacity = editCapacity.value;

        renderTable();
        modal.style.display = "none";
    });

    cancelBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

}











