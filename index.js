window.onload = function () {
    const registrationForm = document.getElementById('registrationForm');
    const userTable = document.getElementById('userTable').querySelector('tbody');  // Use tbody for new rows
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const dobInput = document.getElementById('dob');
    const dobError = document.getElementById('dobError');
    const resetButton = document.getElementById('resetButton');
    const today = new Date();

    // Set minimum and maximum DOB for age 18 to 55
    const minDate = new Date(today.getFullYear() - 55, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    // Format date to YYYY-MM-DD for the date input
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Format date to dd/mm/yyyy for display
    const formatDisplayDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    dobInput.setAttribute('min', formatDate(minDate));
    dobInput.setAttribute('max', formatDate(maxDate));

    // Email validation regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Retrieve stored data from localStorage
    let storedData = JSON.parse(localStorage.getItem('userData')) || [];

    // Populate the table with stored data
    const populateTable = () => {
        userTable.innerHTML = '';  // Clear table
        storedData.forEach((user) => {
            const newRow = `
                <tr class="hover:bg-gray-100">
                    <td class="px-4 py-2 border">${user.name}</td>
                    <td class="px-4 py-2 border">${user.email}</td>
                    <td class="px-4 py-2 border">${user.password}</td>
                    <td class="px-4 py-2 border">${user.dob}</td>
                    <td class="px-4 py-2 border">${user.termsAccepted ? 'Yes' : 'No'}</td>
                </tr>
            `;
            userTable.innerHTML += newRow;
        });
    };

    populateTable();  // Initial population of table with stored data

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();  // Prevent the default form submission behavior

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const dob = document.getElementById('dob').value;
        const termsAccepted = document.getElementById('terms').checked;

        // Validate email
        if (!emailPattern.test(email)) {
            emailError.classList.remove('hidden');
            return;
        } else {
            emailError.classList.add('hidden');
        }

        // Validate DOB (Age should be between 18 and 55)
        const dobDate = new Date(dob);  // Date from YYYY-MM-DD format
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }

        if (age < 18 || age > 55) {
            dobError.classList.remove('hidden');
            dobError.textContent = 'You must meet the requirement between 18 to 55 years.';
            return;
        } else {
            dobError.classList.add('hidden');
        }

        // Add the submitted data to the table and localStorage
        const newUser = {
            name,
            email,
            password,
            dob: formatDisplayDate(dobDate),  // Store in dd/mm/yyyy format
            termsAccepted
        };
        storedData.push(newUser);
        localStorage.setItem('userData', JSON.stringify(storedData));

        populateTable();  // Update the table with new data

        // Clear the form after submission
        registrationForm.reset();
    });

    // Reset Button Logic
    resetButton.addEventListener('click', function () {
        // Clear localStorage and table entries
        localStorage.removeItem('userData');
        storedData = [];  // Reset stored data array
        userTable.innerHTML = '';  // Clear the table
    });
};
