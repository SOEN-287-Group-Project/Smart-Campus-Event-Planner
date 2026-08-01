const detailsButtons = document.querySelectorAll(".details-button");

detailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const memberCard = button.closest(".member");
        const memberDetails = memberCard.querySelector(".member-details");

        const isHidden = memberDetails.style.display === "none" ||
                         memberDetails.style.display === "";

        if (isHidden) {
            memberDetails.style.display = "block";
            button.textContent = "−";
        } else {
            memberDetails.style.display = "none";
            button.textContent = "+";
        }
    });
});