function overview(){
    const topEventsTable = document.getElementById("topEventsTable");
    const totalEventsCount = document.getElementById("totalEventsCount");
    const upcomingEvent = document.getElementById("upcomingEvent");
    const totalCapacity = document.getElementById("totalCapacity")
    
    fetch("/admin/api/events") //fetch events
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load events");
            }
            return response.json();
        })
        .then((data) => {

            // Count events
            totalEventsCount.innerHTML = data.length;

            // Total registrations;
            let capacityCount = 0;
            data.forEach((event) =>{
                capacityCount += event.capacity;
            });
            totalCapacity.innerHTML = capacityCount;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Count upcoming events
            const upcomingEvents = data.filter((event) => {
                const eventDate = new Date(event.event_date + "T00:00:00");

                return eventDate > today && event.status !== "cancelled";
            });


            upcomingEvent.innerHTML = upcomingEvents.length;
            // Sort events by capacity
            data.sort((a, b) => b.capacity - a.capacity);

            // Top 6    
            const topEvents = data.slice(0, 6);

            topEventsTable.innerHTML = "";

            topEvents.forEach((event) => {
                topEventsTable.innerHTML += `
                    <tr>
                        <td>${event.title}</td>
                        <td><strong>${event.capacity}</strong></td>
                    </tr>
                `;
            });

        })
        .catch((error) => {
            console.error(error);
            topEventsTable.innerHTML = `<tr><td colspan="2">Unable to load events from the server.</td></tr>`;
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

function initializeDashboard(){
    if (document.getElementById("topEventsTable")){
        overview();
    }
    
    if (document.getElementById("monthYear") && document.getElementById("dates")) {
        renderCalendar();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeDashboard);
} else {
    initializeDashboard();
}    