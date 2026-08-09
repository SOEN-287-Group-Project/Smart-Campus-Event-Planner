/*import Event from "../../models/Event.js"; */
// Fix since DB event gives me category_id and not category_name
const CATEGORY_NAMES = {
    1: "Academic workshops",
    2: "Career events",
    3: "Club activities",
    4: "Sports events",
    5: "Cultural events",
    6: "Volunteering events",
    7: "Social events",
    8: "Guest lectures",
    9: "Networking events",
    10: "Other"
};

let events = [];
const container = document.querySelector(".event-card-container");
const modal = document.getElementById("eventDetailsModal");
const article_elements = events.map(event => create_event(event));
const searchInput = document.getElementById("searchBar");

fetch('/student/api/events')
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to load events");
        }
        return response.json();
    })
    .then((data) => {
        // 1. Format the raw database data FIRST and store it in global `events`
        events = data.map(rawEvent => {
            return {
                ...rawEvent,
                category: CATEGORY_NAMES[rawEvent.category_id] || rawEvent.category || "Other",
                status: rawEvent.status || (rawEvent.capacity > 0 ? "Open" : "Full")
            };
        });

        const article_elements = events.map(formattedEvent => {
            return create_event(formattedEvent);
        });

        if (container) {
            container.replaceChildren(...article_elements);
        }
    })
    .catch((error) => {
        console.error("Error fetching events:", error);
        if (container) {
            container.innerHTML = `<p class="error">Unable to load events.</p>`;
        }
    });

   function openEventModal(event) {
    const modalElement = document.getElementById("eventDetailsModal");

    // Format start and end times into a single string
    const formattedTime = `${event.start_time} - ${event.end_time}`;

    // Populate my event details with the selected event's data
    document.getElementById("modalTitle").textContent = event.title;
    document.getElementById("modalCategory").textContent = event.category;
    document.getElementById("modalDescription").textContent = event.description;
    document.getElementById("modalDate").textContent = event.event_date;
    document.getElementById("modalTime").textContent = formattedTime;
    document.getElementById("modalLocation").textContent = event.location;
    document.getElementById("modalCapacity").textContent = event.capacity;

    // Makes the popup visible
    modalElement.classList.remove("hidden");
}

function get_category_image_url(category){
    const category_images= {
     "Academic workshops" : "/images/image_project/image_project.jpg",
     "Career events" : "/images/image_project/image2.jpg",
     "Club activities": "/images/image_project/image3.jpg",
     "Sports events": "/images/image_project/image4.jpg",
     "Cultural event": "/images/image_project/image5.jpg",
     "Volunteering events": "/images/image_project/image6.jpg",
     "Social events": "/images/image_project/image7.jpg",
     "Guest lectures": "/images/image_project/image8.jpg",
     "Networking events": "/images/image_project/image9.jpg",
     "Other": "/images/image_project/image10.jpg"
    }

    return category_images[category] || category_images["Other"];  // Return the url depending on the category
}

function fix_event(event){
  event
}
function create_event(event){
    // Creates an article element in HTML and assigns it a class and ID
    const article = document.createElement("article");
    article.className = "event-card";
    article.id = event.event_id; // Create a unique ID for each event to make it easier to find them later

    // Assigns the right image depending on the event_category
    const background_url = get_category_image_url(event.category);

    // Creates dynamic HTML Events container in Events page that change depending on each Attributes of the Event class for that specific event.
    article.innerHTML =  `  <header class="event-card-header" style="background-image: url('${background_url}')">
                        
                                <span class="event-card-category">${event.category}</span>
                                <span class="event-card-status status-${event.status}">
                                <span class="status-dot status-dot-status-${event.status}"></span>
                                ${event.status}
                                </span>
                            </header>
                            <footer class="event-card-footer">
                             <div class="footer-details">
                                <span class="date-time">${event.start_time} ${event.event_date}</span>
                                <span class="location">${event.location}</span>
                                <span class="spots">Spots left: ${event.capacity}</span>
                            </div>
                            <div class="register-container">

                                <!-- Allows to modify button depending on class_status -->

                                <button type="button" class="register-button btn-${event.status}">
                                 <!-- Creates an SVG that looks like a "+" for the button-->

                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">

                                 <!-- 1. Vertical Line -->
                                 <line x1="12" y1="4" x2="12" y2="20"></line>
  
                                <!-- 2. Horizontal Line -->
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                </button>
                            </div>
                        </footer>`;

                        return article;

}


    container.addEventListener("click", (e) => {
    // Fixed a bug where sometimes the click would be detected on the SVG and not the button itself
    const registerBtn = e.target.closest(".register-button");
    if (!registerBtn || registerBtn.classList.contains("btn-full")) return; // Exit if the user clicked somewhere else on the card

    //  Goes up to the parent all the way to the root and stops when it finds <article class="event-card">
    // Used to make sure you are clicking on an event card
    const card = registerBtn.closest(".event-card");
    if (!card) return;

    // Gets the event_ID
    const clickedEventId = card.id;

    //  Search the events array for the event that matches the card.id 
    // String conversion fixed an issue where the event_id was an int in the Database 
    const matchedEvent = events.find(event => String(event.event_id) === String(clickedEventId));

    // If it finds a match in the events array it opens the event details.
    if (matchedEvent) {
        openEventModal(matchedEvent);
        // Log the matched event, helpful for debugging to make sure I was getting the right event from the events array
        console.log("Matched Event:", matchedEvent);
    }
});

// Lets you close the event details popup

if (modal) {
   
    modal.addEventListener("click", (e) => { // Listen for clicks on the event details modal itself
        // Close if the user clicks the Close button OR clicks outside the event details window
        const isCloseBtn = e.target.classList.contains("btn-close"); // Check if the clicked element has the "btn-close" class
        const isBackdropClick = e.target === modal; // Modal is the backdrop so it checks if the target was the background since the whole background is part of modal

        if (isCloseBtn || isBackdropClick) {
            modal.classList.add("hidden");
        }
      
    });
}
// Search bar functionality
if (searchInput) {
    searchInput.addEventListener("input", (e) => {  // Using inputs event so it checks after every keystroke
        const query = e.target.value.toLowerCase().trim(); // Makes every search lowercase and trim removes whitespaces

        events.forEach((event) => { 
            const cardElement = document.getElementById(String(event.event_id));

            // Search across title, description, location, category, and organizer
            const searchableText = `${event.title} ${event.description} ${event.location} ${event.category} ${event.organizer}`.toLowerCase();

            // Toggle .hidden: adds 'hidden' if false, removes 'hidden' if true
            const isMatch = searchableText.includes(query);
            cardElement.classList.toggle("hidden", !isMatch);
        });
    });
}


// Appends all of the events one after the other to make it easier then hardcoding
// with append.child()  
container.append(...article_elements);