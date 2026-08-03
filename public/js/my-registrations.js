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
     "Academic workshops" : "https://library.concordia.ca/images/workshop-teaching-classroom730x600.jpg",
     "Career events" : "https://www.concordia.ca/content/concordia/en/students/success/career-planning/events.social.png/1752846174947.jpg",
     "Club activities": "https://www.concordia.ca/cunews/main/stories/2021/09/17/7-clubs-at-Concordia-that-empower-BIPOC-students/_jcr_content/parsys/image.img.jpg/1631217629935.jpg",
     "Sports events": "https://www.concordia.ca/content/concordia/en/students/life/sports-recreation-athletics/_jcr_content/content-main/grid_container_340858671/grid-container-parsys/card_deck/card-deck-parsys/card_1809173446/adaptiveimage.img.620.medium.jpg/1618322972190.jpg",
     "Cultural event": "https://concordia-www.s3.amazonaws.com/files/pages/full_xsml_christmas-concert-202412582109.jpg",
     "Volunteering events": "https://www.concordia.ca/content/concordia/en/students/volunteering/_jcr_content/content-main/grid_container_397463943/grid-container-parsys/card_deck/card-deck-parsys/card/adaptiveimage.img.620.medium.jpg/1761252176660.jpg",
     "Social events": "https://www.concordia.ca/cunews/main/stories/2024/06/26/concordia-s-shift-centre-for-social-transformation-celebrates-its-impact-through-relationship-building/_jcr_content/parsys/image.img.jpg/1719418837870.jpg",
     "Guest lectures": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmUyMSKg6C1QlaNJim6_XMRVeKWOGzyAhH4gjAZ2zbig&s",
     "Networking events": "https://www.concordia.ca/content/shared/en/events/offices/provost/ssc/2024/11/27/networking-101.social.png/1724787203464.jpg",
     "Other": "https://www.concordia.ca/news/stories/2019/08/08/concordia-improves-its-international-standing-in-2-world-rankings/_jcr_content/top-image.img.768.medium.jpg/1565272551020.jpg"
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