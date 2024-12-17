//Function to hide the page when pressing F10 and show the login page
document.addEventListener('DOMContentLoaded', function () {
    if(window.location.pathname === '/index.html'){
        const pageElement = document.querySelector('h1');
        const loginElement = document.querySelector('#login')
        if(pageElement) {
            document.addEventListener('keydown', function (event) {
                if(event.ctrlKey && event.key === 'F10'){
                    pageElement.style.display = 'none';
                    if(loginElement) loginElement.style.display = 'block';
                }
            });
            setTimeout(() => {
                pageElement.style.display = 'none';
                if(loginElement) loginElement.style.display = 'block';
            }, 5000);
        }
    }
    
})

//Function to show the last login time
document.addEventListener('DOMContentLoaded', function () {
    if(window.location.pathname === '/main.html'){
        const lastLoginElement = document.querySelector('#lastLogin');
        const lastLogin = getCookie('lastLogin');
        lastLoginElement.textContent = lastLogin ? lastLogin : 'Never logged in';
    }
})

//Function to validate the email, our page will validate the email on the input, when it loses focus. Submit button will be only enabled when the email is valid
function validateEmail() {
    const emailInput = document.querySelector('#email');
    const errorMessage = document.querySelector('#errorMessage');
    const submitEmail = document.querySelector('#submitEmail');
    const email = emailInput.value.trim();
    //First we check if the email is valid with a regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)) {
        errorMessage.style.display = 'block';
        emailInput.style.border = '1px solid red';
        submitEmail.disabled = true;
        emailInput.focus();
        emailInput.select();
    } else {
        errorMessage.style.display = 'none';
        emailInput.style.border = '1px solid black';
        submitEmail.disabled = false;
    }
}

function submitEmail() {
    //First we get the email from the html
    const emailInput = document.querySelector('#email');
    const email = emailInput.value.trim();
    //Then we get the current date and time
    const now = new Date();
    const currentDateTime = now.toLocaleString();
    //We set the cookie with the login
    setCookie('lastLogin', currentDateTime, 30);
    //We redirect to the main page with the email
    window.location.href = `main.html?email=${encodeURIComponent(email)}`;
}

//Function to show the welcome message, we get the email from the url params
function showWelcomeMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const welcomeMessage = document.querySelector('#welcome');
    if(email) {
        welcomeMessage.textContent = `Welcome ${email}!`;
    }
}

// Function to set the cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 *60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + value + expires + "; path=/";
}

// Function to get the cookies
function getCookie(name){
    const nameToSearch = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieValor = decodedCookie.split(';').find(cookie => cookie.trim().startsWith(nameToSearch));
    return cookieValor ? cookieValor.split("=")[1] : null;
}

// Function to delete the cookies
function deleteCookie(name){
    document.cookie = name + "=; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

//Questions functions
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/questions.html') {
        loadQuestions(true);
    }
});

//Function to enable the button to save the question, it will check if all fields are filled and if the score is a number
function enableButtonToSaveQuestion() {
    const question = document.getElementById('question').value.trim();
    const answer = document.querySelector('input[name="answer"]:checked');
    const score = document.getElementById('score').value;

    const saveButton = document.getElementById('save');
    if (question && answer && score.match(/^[0-9]$/)) {
        saveButton.disabled = false;
    } else {
        saveButton.disabled = true;
    }
}

//Function to save the question, it will reset the form and save the question in the cookie
function saveQuestion() {
    const question = document.getElementById('question').value.trim();
    const answer = document.querySelector('input[name="answer"]:checked').value;
    const score = document.getElementById('score').value;

    //We reset the form after saving the question
    resetForm();
    const questions = getQuestions();
    const newQuestion = {
        question,
        answer,
        score,
        status: 'Saving...'
    };

    //We add the new question to the array and save the questions
    questions.push(newQuestion);
    saveQuestions(questions);

    //To work with different questions at the same time, we save the index of the new question
    const questionIndex = questions.length - 1;

    setTimeout(() => {
        //Due to this index and timeout, we only modify one object in the array
        const updatedQuestions = getQuestions();
        //We check if the object exists in the array and if it does, we change its status to OK
        if (updatedQuestions[questionIndex]) {
            updatedQuestions[questionIndex].status = 'OK';
            saveQuestions(updatedQuestions);
            loadQuestions(false);
        }
    }, 5000);

    loadQuestions(false);
}

//Function to reset the form
function resetForm() {
    document.getElementById('question').value = '';
    document.querySelectorAll('input[name="answer"]').forEach(el => el.checked = false);
    document.getElementById('score').value = '';
    document.getElementById('save').disabled = true;
}

//Function to get the questions from the cookie
function getQuestions() {
    const questionary = document.getElementById('questionary');
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('questions='));
    const questions = cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : [];

    return questions; 
}

//Function to save the questions in the cookie
function saveQuestions(questions) {
    const questionsString = JSON.stringify(questions);
    const encodedQuestions = encodeURIComponent(questionsString);
    document.cookie = `questions=${encodedQuestions}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

//Function to load the questions from the cookie
function loadQuestions(delay) {
    const table = document.getElementById('questionsTable');
    const questionsList = document.getElementById('questionsList');
    const loading = document.getElementById('loading');
    
    table.style.display = 'none';
    loading.style.display = 'block';

    const loadData = () => {
        const questions = getQuestions();
        questionsList.innerHTML = '';
        questions.forEach((p, index) => {
            const row = `<tr>
                <td>${p.question}</td>
                <td>${p.answer}</td>
                <td>${p.score}</td>
                <td>${p.status}</td>
            </tr>`;
            questionsList.insertAdjacentHTML('beforeend', row);
        });
        table.style.display = 'table';
        loading.style.display = 'none';
    };

    if (delay) {
        setTimeout(loadData, 5000);
    } else {
        loadData();
    }
}