    // Creates a lookup table with links to an image for each categories
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

    let myRegistrations = [];
    const container = document.getElementById("myRegistrationsContainer");
    const searchInput = document.getElementById("searchBar");


    // Runs directly on page load just like fetch('/student/api/events')
    fetch('/student/api/my-registrations')
        .then((response) => {
            if (response.status === 401) {
                window.location.href = '/auth/login'; // Sends them back to login page
                return;
            }
            if (!response.ok) {
                throw new Error("Failed to load my registrations");
            }
            return response.json();
        })
        .then((data) => {
        // Creates an array myRegistrations to access everywhere 
        // Since im sending username also I need to use data.registrations to access the events attributes
            myRegistrations = data.registrations.map(rawEvent => {
                const categoryName = CATEGORY_NAMES[rawEvent.category_id] || rawEvent.category || "Other"; 
                return {
                    ...rawEvent,
                    category: categoryName,
                    status: rawEvent.status || (rawEvent.capacity > 0 ? "Open" : "Full")
                };
            });

            
            const article_elements = myRegistrations.map(formattedEvent => {
                return create_event(formattedEvent);
            });

            // Populate the page with event cards from Student
            if (container) {
                if (myRegistrations.length === 0) {
                    container.innerHTML = `<p class="no-events">You are not registered for any events yet.</p>`;
                    return;
                }
                container.replaceChildren(...article_elements);
            }
        })
        .catch((error) => {
            console.error("Error fetching my registrations:", error);
            if (container) {
                container.innerHTML = `<p class="error">Unable to load registrations.</p>`;
            }
        });

        function deleteRegistration(registrationId, cardElement) {
        // 1. Send the DELETE request using the URL parameter
        fetch(`/student/api/my-registrations/${registrationId}`, {
            method: 'DELETE'
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to delete registration");
            }
            return res.json();
        })
        .then((data) => {
            console.log("Server response:", data);
            alert(data.message);

            // 2. Remove the event from the user interface
            cardElement.remove();

            // 3. Update global array
            myRegistrations = myRegistrations.filter(
                (event) => String(event.registration_id) !== String(registrationId)
            );

            // 4. Show empty state message if no cards remain
            if (myRegistrations.length === 0 && container) {
                container.innerHTML = `<p class="no-events">You are not registered for any events yet.</p>`;
            }
        })
        .catch((err) => {
            console.error("Error cancelling registration:", err);
            alert("Could not cancel registration. Please try again.");
        });
    }

    function get_category_image_url(category){
        const category_images= {
        "Academic workshops" : "/images/image_project/image_project.jpg",
        "Career events" : "/images/image_project/image2.jpg",
        "Club activities": "/images/image_project/image3.jpg",
        "Sports events": "/images/image_project/image4.jpg",
        "Cultural events": "/images/image_project/image5.jpg",
        "Volunteering events": "/images/image_project/image6.jpg",
        "Social events": "/images/image_project/image7.jpg",
        "Guest lectures": "/images/image_project/image8.jpg",
        "Networking events": "/images/image_project/image9.jpg",
        "Other": "/images/image_project/image10.jpg"
        }

        return category_images[category] || category_images["Other"];  // Return the url depending on the category
    }

    function create_event(event){
        // Creates an article element in HTML and assigns it a class and ID
        const article = document.createElement("article");
        article.className = "event-card";
        article.id = event.event_id;
        article.dataset.registrationId = event.registration_id;
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

    container.addEventListener("click", (e) => {
        // Fixed a bug where sometimes the click would be detected on the SVG and not the button itself
        const registerBtn = e.target.closest(".register-button");
        if (!registerBtn) return;

        //  Goes up to the parent all the way to the root and stops when it finds <article class="event-card">
        // Used to make sure you are clicking on an event card
        const card = registerBtn.closest(".event-card");

        // Gets the regisration ID
        const clickedRegistrationId = card.dataset.registrationId;

        //  Search the events array for the event that matches the card.id 
        // String conversion fixed an issue where the event_id was an int in the Database 
        const matchedEvent = myRegistrations.find(registration => String(registration.registration_id) === String(clickedRegistrationId));

        // If it finds a match in the events array it opens the event details.
        if (matchedEvent) {
            const confirmed = confirm(`Cancel registration for ${matchedEvent.title}?`);
            if (!confirmed) return;

            deleteRegistration(matchedEvent.registration_id, card);
        }
        });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {  // Using inputs event so it checks after every keystroke
        const query = e.target.value.toLowerCase().trim(); // Makes every search lowercase and trim removes whitespaces
        // loops on all events
        myRegistrations.forEach((event) => { 
            const cardElement = document.getElementById(String(event.event_id));

            // Search across title, description, location, category, and organizer
            // Creates a single string with each Event attributes
            const searchableText = `${event.title} ${event.description} ${event.location} ${event.category} ${event.organizer}`.toLowerCase();


            const isMatch = searchableText.includes(query);
            if (isMatch) {
              cardElement.classList.remove("hidden"); // Show card
             } 
             else {
              cardElement.classList.add("hidden");// Hide card
            }
        });
    });
}
