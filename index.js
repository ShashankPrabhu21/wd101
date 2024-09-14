
document.addEventListener("DOMContentLoaded", () => {
    let userForm = document.querySelector("#registrationForm");
    let userEntries = JSON.parse(localStorage.getItem("userFormEntries")) || [];

    const setDOBMinMax = () => {
        const today = new Date();
        const maxYear = today.getFullYear() - 18;
        const minYear = today.getFullYear() - 55;

        const maxDate = new Date(maxYear, today.getMonth(), today.getDate())
            .toISOString()
            .split("T")[0];
        const minDate = new Date(minYear, today.getMonth(), today.getDate())
            .toISOString()
            .split("T")[0];

        document.querySelector("#dob").setAttribute("max", maxDate);
        document.querySelector("#dob").setAttribute("min", minDate);
    };

    setDOBMinMax();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const saveUserForm = (e) => {
        e.preventDefault();
        const name = document.querySelector("#name").value;
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        const dob = document.querySelector("#dob").value;
        const acceptTerms = document.querySelector("#acceptTerms").checked;

        const calculateAge = (dob) => {
            const dobDate = new Date(dob);
            const diffMs = Date.now() - dobDate.getTime();
            const ageDate = new Date(diffMs);
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };

        const age = calculateAge(dob);

        if (age < 18 || age > 55) {
            alert("Age must be between 18 and 55 years.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const entries = {
            name,
            email,
            password,
            dob,
            acceptTerms,
        };

        userEntries.push(entries);
        localStorage.setItem("userFormEntries", JSON.stringify(userEntries));
        displayData();
        window.location.reload()
        userForm.reset(); 
    };

    const displayData = () => {
        let showData = document.querySelector(".showData");
        let formData = JSON.parse(localStorage.getItem("userFormEntries"));

        if (formData && formData.length > 0) {
            let htmlContent = `
            ${formData
                    .map(
                        (entry) => `
                <tr>
                    <td>${entry.name}</td>
                    <td>${entry.email}</td>
                    <td>${entry.password}</td>
                    <td>${entry.dob}</td>
                    <td>${entry.acceptTerms ? "true" : "false"}</td>
                </tr>
            `
                    )
                    .join("\n")}
            `;
            showData.innerHTML = htmlContent;
        } else {
            showData.innerHTML = "<p>No Data Available.</p>";
        }
    };

    userForm.addEventListener("submit", saveUserForm);
    displayData();
});
