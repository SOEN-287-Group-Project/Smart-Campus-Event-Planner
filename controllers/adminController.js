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