function createEvents(){


    const eventForm = document.getElementById("createEventForm");

    const createEventName = document.getElementById("createEventName");
    const createEventDescription = document.getElementById("createEventDescription");
    const createEventLocation = document.getElementById("createEventLocation");
    const createEventOrganizer = document.getElementById("createEventOrganizer");
    const createEventCapacity = document.getElementById("createEventCapacity");
    const createEventCategory = document.getElementById("createEventCategory");
    const createEventStartDate = document.getElementById("createEventStartDate");
    const createEventStartTime = document.getElementById("createEventStartTime");
    const createEventEndTime = document.getElementById("createEventEndTime");
    const createEventStatus = document.getElementById("createEventStatus");

    const sumbitNewEvent = document.getElementById("createEventSubmit");
    

    eventForm.addEventListener("submit" , async (e) => {
        e.preventDefault();
        
        const newEvent = {
            title: createEventName.value,
            description: createEventDescription.value,
            organizer_id: createEventOrganizer.value,
            capacity: createEventCapacity.value,
            category_id: createEventCategory.value,
            event_date: createEventStartDate.value,
            start_time: createEventStartTime.value,
            end_time: createEventEndTime.value,
            location: createEventLocation.value,
            status: createEventStatus.value

        };

        if (createEventEndTime.value <= createEventStartTime.value) {
            alert("End time must be later than start time.");
            return;
        }

        try {
            console.log("Submitting event...", newEvent);
            const response = await fetch("/admin/new_event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newEvent)
            });

            const result = await response.json();
            console.log("Server response:", result);

            if (!response.ok) {
                throw new Error(result.message);
            }

            alert("Event created successfully!");

            eventForm.reset();

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to create event: " + error.message);
        }
});






}


function initializeCreateEvent(){
    if (document.getElementById("createEventForm")) {
        createEvents();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCreateEvent);
} else {
    initializeCreateEvent();
} 