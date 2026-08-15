/**************Navigation Scripts**************/
function toggleDropdown() {
    const button = document.getElementById("menuButton");
    const menu = document.getElementById("dropdown") || document.getElementById("studentDropdown");

    if (!button || !menu) return;

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


/***dynamically populate the admin navigation menu***/
function getNavDropdown() {
    const adminNavItems = document.getElementById("dropdown");

    if (!adminNavItems) return;

    adminNavItems.innerHTML += `
                        <a href="/admin/admin-dashboard" target="_self">Overview</a>
                        <a href="/admin/manage-events" target="_self">Manage Events</a>
                        <a href="/admin/create-event" target="_self">Create Event</a>
                        <a href="/admin/analytics" target="_self">Analytics</a>
                                `;
    }

function getStudentNavDropdown() {
    const adminNavItems = document.getElementById("studentDropdown");

    if (!adminNavItems) return;

    adminNavItems.innerHTML += `
                        <a href="/student/student-dashboard" target="_self">Overview</a>
                        <a href="/student/events" target="_self">Events</a>
                        <a href="/student/my-registrations" target="_self">My Registrations</a>
                        <a href="/student/profile" target="_self">Profile</a>
                                `;
    }
    


/*Element checking before function calls*/
function initializeAdminPage() {
    if (document.getElementById("menuButton") && document.getElementById("dropdown")) {
        toggleDropdown();
    }
    
    if (document.getElementById("menuButton") && document.getElementById("studentDropdown")) {
        toggleDropdown();
    }
    
    if (document.querySelector(".arrow")) {
        rotateMenuArrow();
    }

    if (document.getElementById("dropdown")) {
        getNavDropdown();
    }

    if (document.getElementById("studentDropdown")) {
        getStudentNavDropdown();
    }

}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAdminPage);
} else {
    initializeAdminPage();
}


