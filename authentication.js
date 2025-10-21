// authentication.js
const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function () {
  checkAuth();

  // Show/Hide Forms
  document.getElementById('showSignup').addEventListener('click', () => {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm1').classList.remove('hidden');
  });

  document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('signupForm1').classList.add('hidden');
    document.getElementById('signupForm2').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
  });

  // Move to second part of signup form (signupForm2)
  document.getElementById('nextSignup').addEventListener('click', () => {
    // Collect data from the first form (signupForm1)
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const country = localStorage.getItem('country');

    // You can validate the inputs before proceeding, e.g., check if they are not empty
    if (email && password && phoneNumber && country) {
      document.getElementById('signupForm1').classList.add('hidden');
      document.getElementById('signupForm2').classList.remove('hidden');
    } else {
      showMessage('Please fill out all fields before proceeding.', 'error');
    }
  });

  // Signup Handler (submit final form)
  document.getElementById('signupButton').addEventListener('click', async () => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const country = localStorage.getItem('country');
    const major = document.getElementById('major').value;
    const degree = document.getElementById('degree').value;
    const university = document.getElementById('university').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const visaStatus = document.getElementById('visaStatus').value;

    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, phoneNumber, country, major, degree, university, startDate, endDate, visaStatus })
      });

      const data = await response.json();
      if (response.ok) {
        chrome.storage.local.set({ token: data.token, userProfile: data.user }, () => {
          showMessage('Signup successful!', 'success');
          showLogin();
        });
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('Error during signup', 'error');
    }
  });

  // Login Handler
  document.getElementById('loginButton').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        chrome.storage.local.set({ token: data.token, userProfile: data.user }, () => {
          showMessage('Login successful!', 'success');
          showMainApp();
        });
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('Error during login', 'error');
    }
  });

  // Logout Handler
  document.getElementById('logout').addEventListener('click', () => {
    chrome.storage.local.remove(['token', 'userProfile'], () => {
      showAuthForms();
    });
  });

  // Helper Functions
  function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type;
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = '';
    }, 3000);
  }

  function checkAuth() {
    chrome.storage.local.get(['token'], (data) => {
      if (data.token) {
        showMainApp();
      } else {
        showAuthForms();
      }
    });
  }

  function showLogin() {
    document.getElementById('signupForm1').classList.add('hidden');
    document.getElementById('signupForm2').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
  }

  function showMainApp() {
    document.getElementById('authForms').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
  }

  function showAuthForms() {
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('authForms').classList.remove('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm1').classList.add('hidden');
    document.getElementById('signupForm2').classList.add('hidden');
  }
});
