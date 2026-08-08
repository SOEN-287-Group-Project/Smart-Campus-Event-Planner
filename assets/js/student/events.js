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
const article_elements = events.map(event => create_event(event));

fetch('/student/api/events')
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load events");
            }
            return response.json();
        })
        .then((data) => {
        events = data;
        console.log(events);
        const article_elements = events.map(rawEvent => {
            const formattedEvent = {
                ...rawEvent,
                // Convert category_id integer into string name (or fallback to 'Other')
                category: CATEGORY_NAMES[rawEvent.category_id] || rawEvent.category || "Other",
                status: rawEvent.status || (rawEvent.capacity > 0 ? "Open" : "Full")
            };

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
    article.id = event.event_id;

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

const container = document.querySelector(".event-card-container");

// Appends all of the events one after the other to make it easier then hardcoding
// with append.child()
container.append(...article_elements);