const form = document.querySelector('#registrationForm');
const table = document.querySelector('#userTable');
const tbody = table.querySelector('tbody');
const resetButton = document.querySelector('#resetButton');
let storedData = JSON.parse(localStorage.getItem('userData')) || [];
const emailValidate = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
};
const saveFormData = (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const dob = document.querySelector('#dob').value;
    const terms = document.querySelector('#terms').checked;
    if (name.trim() === '' || email.trim() === '' || password.trim() === '' || dob.trim() === '') {
        alert('Please fill all fields');
        return;
    }

    if (!emailValidate(email)) {
        document.getElementById('emailError').classList.remove('hidden');
        return;
    } else {
        document.getElementById('emailError').classList.add('hidden');
    }

    if (password.length < 8) {
        alert('Password should be at least 8 characters long');
        return;
    }
    const dobDate = new Date(dob);  
    const today = new Date();      
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    if (age < 18 || age > 55) {
        document.getElementById('dobError').classList.remove('hidden');
        return;
    } else {
        document.getElementById('dobError').classList.add('hidden');
    }

    // Create the entry object
    const entry = {
        name,
        email,
        password,
        dob,
        terms,
    };

    // Store data in localStorage and update UI
    storedData.push(entry);
    localStorage.setItem('userData', JSON.stringify(storedData));
    displayFormData();
    form.reset();
};

// Display the form data in the table
const displayFormData = () => {
    tbody.innerHTML = '';  // Clear the existing rows
    storedData.forEach((entry) => {
        const row = `
            <tr>
                <td>${entry.name}</td>
                <td>${entry.email}</td>
                <td>${entry.password}</td>
                <td>${entry.dob}</td>
                <td>${entry.terms ? 'true' : 'false'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
};
const setDOBMinMax = () => {
    const today = new Date();
    const maxYear = today.getFullYear() - 18;
    const minYear = today.getFullYear() - 55;
    const maxDate = new Date(maxYear, today.getMonth(), today.getDate()).toISOString().split("T")[0];
    const minDate = new Date(minYear, today.getMonth(), today.getDate()).toISOString().split("T")[0];
    document.querySelector("#dob").setAttribute("max", maxDate);
    document.querySelector("#dob").setAttribute("min", minDate);
};
setDOBMinMax();
form.addEventListener('submit', saveFormData);
displayFormData();


resetButton.addEventListener('click', () => {
    localStorage.removeItem('userData');
    storedData = [];
    displayFormData();
});
