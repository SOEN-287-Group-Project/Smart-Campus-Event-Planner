
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

