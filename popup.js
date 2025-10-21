// popup.js
document.addEventListener('DOMContentLoaded', function() {
  const API_URL = 'http://localhost:3000/api';
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

  // Handling page navigation (Next / Previous)
  document.getElementById('nextPage1').addEventListener('click', () => {
    document.getElementById('errorMessage').classList.add('hidden')
    // Capture data from page 1
    console.log("askh")
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const country = document.getElementById('country').value;
    if (!email || !password || !phoneNumber || !country) {
      // alert("Please fill out all fields before proceeding.");
      document.getElementById('errorMessage').classList.remove('hidden')
      return;
    }

    // Save to localStorage (or pass to page 2)
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    localStorage.setItem('phoneNumber', phoneNumber);
    localStorage.setItem('country', country);

    // Show page 2
    document.getElementById('signupForm1').classList.add('hidden');
    document.getElementById('signupForm2').classList.remove('hidden');
  });

  document.getElementById('previousPage2').addEventListener('click', () => {
    // Go back to page 1
    document.getElementById('signupForm2').classList.add('hidden');
    document.getElementById('signupForm1').classList.remove('hidden');
  });

  // Signup Handler (on page 2)
  document.getElementById('signupButton').addEventListener('click', async () => {
    // Get data from page 2
    const major = document.getElementById('major').value;
    const degree = document.getElementById('degree').value;
    const university = document.getElementById('university').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const visaStatus = document.getElementById('visaStatus').value;

    // Retrieve data from page 1 (stored in localStorage)
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const country = localStorage.getItem('country');
    
    // Submit to backend
    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, phoneNumber, country, major, degree, university, startDate, endDate, visaStatus })
      });

      const data = await response.json();
      if (response.ok) {
        chrome.storage.local.set({ 
          token: data.token,
          userProfile: data.user
        }, () => {
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
        chrome.storage.local.set({ 
          token: data.token,
          userProfile: data.user
        }, () => {
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

  // Analyze current page
  document.getElementById('analyze').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "analyze"}, function(response) {
        analyzeJobDescription(response.text);
        });
      });
    });

  function showLogin(){
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
