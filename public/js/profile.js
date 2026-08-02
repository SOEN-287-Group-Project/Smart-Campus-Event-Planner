 document.addEventListener("DOMContentLoaded", () => {
    const profileForm = document.getElementById("profile-form");
    const passwordForm = document.getElementById("password-form");

    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email");
    const studentIdInput = document.getElementById("student-id");
    const programInput = document.getElementById("program");

    // Load previously saved profile information
    const savedProfile = JSON.parse(localStorage.getItem("studentProfile"));

    if (savedProfile) {
        firstNameInput.value = savedProfile.firstName;
        lastNameInput.value = savedProfile.lastName;
        emailInput.value = savedProfile.email;
        studentIdInput.value = savedProfile.studentId;
        programInput.value = savedProfile.program;
    }

    // Save profile information
    if (profileForm) {
        profileForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const profileData = {
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                email: emailInput.value,
                studentId: studentIdInput.value,
                program: programInput.value
            };

            localStorage.setItem(
                "studentProfile",
                JSON.stringify(profileData)
            );

            alert("Profile information updated successfully.");
        });
    }

    // Password form
    if (passwordForm) {
        passwordForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const newPassword =
                document.getElementById("new-password").value;

            const confirmPassword =
                document.getElementById("confirm-password").value;

            if (newPassword !== confirmPassword) {
                alert("The new passwords do not match.");
                return;
            }

            alert("Password updated successfully.");

            passwordForm.reset();
        });
    }
});