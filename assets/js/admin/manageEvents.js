/******Search******/
function searchEvents(){

    let event = []; //search array
    const searchInput = document.getElementById("event-search-function");

    
    fetch("/admin/api/events") //fetch events
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load events");
            }
            return response.json();
        })
        .then((data) => {
            event = data.map(rawEvent => {
            return {
                    ...rawEvent,
                    status: rawEvent.status || (rawEvent.capacity > 0 ? "Open" : "Full")
                };
            });
            console.log(event);
        })
        .catch((error) => {
            console.error(error);
            tbody.innerHTML = `<tr><td colspan="7">Unable to load events from the server.</td></tr>`;
        });

    // Search bar functionality
    if (searchInput) {

        searchInput.addEventListener("input", (e) => {  // Using inputs event so it checks after every keystroke
            const query = e.target.value.toLowerCase().trim(); // Makes every search lowercase and trim removes whitespaces
        
            // loops on all events
            event.forEach((event) => { 
                const tableRow = document.getElementById(String(event.event_id));

                // Search across title, description, location, category, and organizer
                // Creates a single string with each Event attributes
                const searchableText = `${event.title} ${event.description} ${event.location} ${event.category_name} ${event.organizer_id}`.toLowerCase();


                const isMatch = searchableText.includes(query);
                if (isMatch) {
                tableRow.classList.remove("hidden"); // Show card
                } 
                else {
                tableRow.classList.add("hidden");    // Hide card
                }
            });
        });
    }



    
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
        const attendanceTableBody = document.getElementById("attendanceTableBody");
        const eventTitle = document.getElementById("currentEventTitle");
        const saveBtn = document.getElementById("AttendanceSaveBtn");
        const cancelBtn = document.getElementById("AttendanceCancelBtn");

        if (!modal || !attendanceTableBody) return;

        // Open modal when clicking the Attendance button in the events table
        tbody.addEventListener("click", (e) => {
            const target = e.target;
            if (!target.classList.contains("Manage-Attendance")) return;

            const id = target.dataset.id;
            currentEvent = events.find((event) => event.event_id == id);
            if (!currentEvent) return;

            if (eventTitle) eventTitle.textContent = currentEvent.title || "";

            // Render attendees for the selected event
            const attendees = attendanceData[id] || [];
            attendanceTableBody.innerHTML = attendees
                .map((attendee) => `
                    <tr data-user-id="${attendee.user_id}">
                        <td>${attendee.full_name}</td>
                        <td class="attendance-status">${attendee.attended}</td>
                        <td>
                            <button type="button" class="manage-student-attendance" data-id="${attendee.user_id}">Manage</button>
                        </td>
                    </tr>
                `)
                .join("");

            modal.style.display = "flex";
        });

        
        attendanceTableBody.addEventListener("click", (e) => {
            const button = e.target.closest(".manage-student-attendance");
            if (!button) return;
            if (!currentEvent) return;

            const userId = button.dataset.id;
            const row = button.closest("tr");
            const statusCell = row && row.querySelector(".attendance-status");
            if (!statusCell) return;

            const attendees = attendanceData[currentEvent.event_id] || [];
            const attendee = attendees.find((a) => String(a.user_id) === String(userId));
            if (!attendee) return;

            if (statusCell.querySelector("select")) return; // already editing

            statusCell.innerHTML = `
                <select class="attendance-status-select">
                    <option value="yes" ${attendee.attended === "yes" ? "selected" : ""}>Yes</option>
                    <option value="no" ${attendee.attended === "no" ? "selected" : ""}>No</option>
                </select>
            `;

            const select = statusCell.querySelector(".attendance-status-select");
            select.addEventListener(
                "change",
                () => {
                    attendee.attended = select.value;
                    statusCell.textContent = select.value;
                },
                { once: true }
            );
        });

        // Save attendance for the current event
        saveBtn?.addEventListener("click", async () => {
            if (!currentEvent) return;

            const attendees = attendanceData[currentEvent.event_id] || [];

            try {
                for (const attendee of attendees) {
                    const response = await fetch(
                        `/admin/api/attendance/${currentEvent.event_id}/${attendee.user_id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                attended: attendee.attended
                            })
                        }
                    );

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(
                            `Failed to update ${currentEvent.event_id}/${attendee.user_id}:`,
                            errorText
                        );

                        throw new Error(
                            `Failed to update attendance for user ${attendee.user_id}`
                        );
                    }
                }

                modal.style.display = "none";

            } catch (error) {
                console.error("Failed to save attendance:", error);
                alert("Could not save attendance.");
            }
        });

        // Close modal handlers
        cancelBtn?.addEventListener("click", () => (modal.style.display = "none"));
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
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
        const editStatus = document.getElementById("editStatus");
        const deleteBtn = document.getElementById("deleteBtn");

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
            editStatus.value = currentEvent.status;
            modal.style.display = "flex";
        });

        //Save
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
                location: editEventLocation.value,
                status: editStatus.value
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

        //Delete
        deleteBtn?.addEventListener("click", async () => {
            if (!currentEvent) return;

            const confirmed = confirm(
                `Are you sure you want to delete "${currentEvent.title}"?`
            );

            if (!confirmed) return;

            try {
                const response = await fetch(
                    `/admin/api/events/${currentEvent.event_id}`,
                    {
                        method: "DELETE"
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to delete event");
                }

                // Remove the event from the local events array
                const index = events.findIndex(
                    (event) => event.event_id == currentEvent.event_id
                );

                if (index !== -1) {
                    events.splice(index, 1);
                }

                // Clear the current event
                currentEvent = null;

                // Refresh the table
                renderTable();

                // Close the modal
                modal.style.display = "none";

            } catch (error) {
                console.error(error);
                alert("Failed to delete event.");
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
                <tr id = "${event.event_id}">
                    <td>${event.title}</td>
                    <td>${event.full_name || ""}</td>
                    <td>${(event.event_date && event.start_time) ? `${event.event_date}<br>${event.start_time}` : ""}</td>
                    <td>${event.end_time || ""}</td>
                    <td>${event.category_name || ""}</td>
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


function initializeManageEvents(){
    if (document.getElementById("event-search-function")){
        searchEvents();
    }

    if (document.getElementById("eventTableBody")) {
        renderEvents();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeManageEvents);
} else {
    initializeManageEvents();
} 