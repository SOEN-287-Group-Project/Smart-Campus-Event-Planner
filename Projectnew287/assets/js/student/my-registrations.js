/*import Event from "../../models/Event.js";*/
// Creates a lookup table with links to an image for each categories
class Event{
    constructor(
        event_id,
        title,
        description,
        category, 
            /*
            Academic workshops
            Career events
            Club activities
            Sports events
            Cultural events
            Volunteering events
            Social events
            Guest lectures
            Networking events
            Other
            */
        event_date,
        start_time,
        end_time,
        location,
        capacity,
        status, // open, full, cancelled, completed, disabled
        organizer_id,
        created_on
    ){
        this.event_id = event_id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.event_date = event_date;
        this.start_time = start_time;
        this.end_time = end_time;
        this.location = location;
        this.capacity = capacity;
        this.status = status;
        this.organizer_id = organizer_id;
        this.created_on = created_on;
    }

}

function get_category_image_url(category){
    const category_images= {
     "Academic workshops" : "../assets/images/image_project/image_project.jpg",
     "Career events" : "assets/images/image_project/image2.jpg",
     "Club activities": "assets/images/image_project/image3.jpg",
     "Sports events": "assets/images/image_project/image4.jpg",
     "Cultural event": "assets/images/image_project/image5.jpg",
     "Volunteering events": "assets/images/image_project/image6.jpg",
     "Social events": "assets/images/image_project/image7.jpg",
     "Guest lectures": "assets/images/image_project/image8.jpg",
     "Networking events": "assets/images/image_project/image9.jpg",
     "Other": "assets/images/image_project/image10.jpg"
    }

    return category_images[category] || category_images["Other"];  // Return the url depending on the category
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
  
                                <!-- 2. Horizontal Line -->
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                </button>
                            </div>
                        </footer>`;

                        return article;

}
// FAKE EVENTS FOR ****  TESTING ****
const fake_events = [
  new Event(
    4,
    "Intramural Basketball Tournament",
    "5v5 tournament for student teams of all skill levels.",
    "Sports events",
    "Nov 15",
    "1:00 PM",
    "6:00 PM",
    "Loyola Gymnasium",
    8,
    "Open",
    104,
    "2026-07-22"
  ),
  new Event(
    2,
    "Fall Career & Co-op Fair",
    "Meet top tech employers, network, and submit your resume.",
    "Career events",
    "Nov 02",
    "10:00 AM",
    "3:00 PM",
    "EV Building Atrium",
    45,
    "Open",
    102,
    "2026-07-21"
  ),
  new Event(
    3,
    "Hackathon Kickoff Night",
    "Form teams, pitch ideas, and start building your weekend projects.",
    "Club activities",
    "Nov 10",
    "5:00 PM",
    "9:00 PM",
    "H-Building 8th Floor",
    0,
    "Full",
    103,
    "2026-07-22"
  ),
  new Event(
    1,
    "Web Development Workshop",
    "Learn HTML & CSS Basics from scratch with hands-on practice.",
    "Academic workshops",
    "Oct 24",
    "6:00 PM",
    "8:00 PM",
    "Downtown Auditorium",
    12,
    "Open",
    101,
    "2026-07-20"
  ),
  new Event(
    5,
    "Annual Holiday Symphony",
    "A night of classical music featuring the university orchestra.",
    "Cultural event",
    "Dec 05",
    "7:30 PM",
    "9:30 PM",
    "Oscar Peterson Concert Hall",
    20,
    "Open",
    105,
    "2026-07-23"
  )
  ];


const container = document.querySelector(".event-card-container");

// Goes through the whole Event fake_events array
const article_elements = fake_events.map(event => create_event(event));
// Appends all of the events one after the other to make it easier then hardcoding
// with append.child()
container.append(...article_elements);