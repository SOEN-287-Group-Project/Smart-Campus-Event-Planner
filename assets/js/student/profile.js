 
document.addEventListener("DOMContentLoaded", () => {
    const profileForm =
        document.getElementById("profile-form");

    const passwordForm =
        document.getElementById("password-form");

    const firstNameInput =
        document.getElementById("first-name");

    const lastNameInput =
        document.getElementById("last-name");

    const emailInput =
        document.getElementById("email");
    
    const roleInput =
    document.getElementById("role");

    async function loadProfile() {
        try {
            const response = await fetch(
                "/student/api/profile"
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            firstNameInput.value = data.firstName;
            lastNameInput.value = data.lastName;
            emailInput.value = data.email;

            roleInput.value =
            data.role.charAt(0).toUpperCase() +
            data.role.slice(1);
        } catch (error) {
            console.error(error);
            alert("Unable to load profile.");
        }
    }

    profileForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            const profileData = {
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                email: emailInput.value
            };

            try {
                const response = await fetch(
                    "/student/api/profile",
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify(profileData)
                    }
                );

                const data = await response.json();

                alert(data.message);
            } catch (error) {
                console.error(error);
                alert("Unable to update profile.");
            }
        }
    );

    passwordForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            const passwordData = {
                currentPassword:
                    document.getElementById(
                        "current-password"
                    ).value,

                newPassword:
                    document.getElementById(
                        "new-password"
                    ).value,

                confirmPassword:
                    document.getElementById(
                        "confirm-password"
                    ).value
            };

            try {
                const response = await fetch(
                    "/student/api/profile/password",
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify(passwordData)
                    }
                );

                const data = await response.json();

                alert(data.message);

                if (response.ok) {
                    passwordForm.reset();
                }
            } catch (error) {
                console.error(error);
                alert("Unable to update password.");
            }
        }
    );

    loadProfile();
});