// jobAnalysis.js
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('analyze').addEventListener('click', async function () {
      try {
        showLoadingState();
  
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
        // Inject content script to extract job details
        const jobData = await chrome.tabs.sendMessage(tab.id, { action: "extractJobDetails" });
  
        // Get user token
        const { token, userProfile } = await new Promise((resolve) => {
          chrome.storage.local.get(['token', 'userProfile'], resolve);
        });
  
        if (!token) {
          showMessage('Please login first', 'error');
          return;
        }
  
        // Send to backend for analysis
        const response = await fetch(`${API_URL}/analysis/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(jobData)
        });
  
        const analysisResult = await response.json();
  
        if (analysisResult.success) {
          displayAnalysisResults(analysisResult.data);
          saveToHistory(analysisResult.data);
        } else {
          throw new Error(analysisResult.message);
        }
      } catch (error) {
        showMessage(`Analysis failed: ${error.message}`, 'error');
      } finally {
        hideLoadingState();
      }
    });
  
    // Helper function to display analysis results
    function displayAnalysisResults(data) {
      const resultDiv = document.getElementById('result');
      const { matchScore, extractedDetails, recommendations } = data;
  
      resultDiv.innerHTML = `
        <div class="analysis-container">
          <div class="score-section">
            <h4 class="text-lg font-semibold mb-2">Match Scores</h4>
            <div class="score-grid">
              ${createScoreBar('Overall', matchScore.overall)}
              ${createScoreBar('Education', matchScore.education)}
              ${createScoreBar('Visa Status', matchScore.visa)}
              ${createScoreBar('Skills', matchScore.skills)}
              ${createScoreBar('Timing', matchScore.timing)}
            </div>
          </div>
  
          <div class="details-section mt-4">
            <h4 class="text-lg font-semibold mb-2">Job Details</h4>
            <div class="details-grid">
              <div class="detail-item">
                <span class="font-medium">Salary Range:</span> 
                ${formatSalary(extractedDetails.salaryRange)}
              </div>
              <div class="detail-item">
                <span class="font-medium">Education Required:</span>
                ${extractedDetails.educationRequirements}
              </div>
              <div class="detail-item">
                <span class="font-medium">Visa/Citizenship:</span>
                ${extractedDetails.citizenshipRequirements || extractedDetails.visaRequirements || 'Not specified'}
              </div>
              <div class="detail-item">
                <span class="font-medium">Start Date:</span>
                ${formatDate(extractedDetails.startDate)}
              </div>
              <div class="detail-item">
                <span class="font-medium">Duration:</span>
                ${extractedDetails.duration || 'Not specified'}
              </div>
              <div class="detail-item">
                <span class="font-medium">Location:</span>
                ${extractedDetails.location}
              </div>
            </div>
          </div>
  
          <div class="skills-section mt-4">
            <h4 class="text-lg font-semibold mb-2">Required Skills</h4>
            <div class="skills-grid">
              ${extractedDetails.skills.map(skill => `
                <span class="skill-tag">${skill}</span>
              `).join('')}
            </div>
          </div>
  
          <div class="recommendations-section mt-4">
            <h4 class="text-lg font-semibold mb-2">Recommendations</h4>
            <ul class="recommendations-list">
              ${recommendations.map(rec => `
                <li class="recommendation-item">${rec}</li>
              `).join('')}
            </ul>
          </div>
  
          <div class="actions-section mt-4">
            <button id="saveJob" class="save-button">
              Save Job
            </button>
            <button id="shareAnalysis" class="share-button">
              Share Analysis
            </button>
          </div>
        </div>
      `;
  
      // Add event listeners for action buttons
      setupActionButtons(data);
    }
  
    // Helper function to create score bars
    function createScoreBar(label, score) {
      const colorClass = score >= 80 ? 'bg-green-500' : 
                        score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
      return `
        <div class="score-item">
          <div class="score-label">${label}</div>
          <div class="score-bar-container">
            <div class="score-bar ${colorClass}" style="width: ${score}%"></div>
            <span class="score-value">${score}%</span>
          </div>
        </div>
      `;
    }
  
    // Helper function to format salary
    function formatSalary(salaryRange) {
      if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
        return 'Not specified';
      }
      return `${formatCurrency(salaryRange.min)} - ${formatCurrency(salaryRange.max)} ${salaryRange.currency || 'USD'}`;
    }
  
    // Helper function to format currency
    function formatCurrency(amount) {
      if (!amount) return '';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(amount);
    }
  
    // Helper function to format date
    function formatDate(date) {
      if (!date) return 'Not specified';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  
    // Setup action buttons
    function setupActionButtons(data) {
      document.getElementById('saveJob')?.addEventListener('click', () => {
        saveJobToProfile(data);
      });
  
      document.getElementById('shareAnalysis')?.addEventListener('click', () => {
        shareAnalysis(data);
      });
    }
  
    // Save job to user profile
    async function saveJobToProfile(data) {
      try {
        const { token } = await new Promise((resolve) => chrome.storage.local.get(['token'], resolve));
        
        const response = await fetch(`${API_URL}/users/save-job`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            jobData: data
          })
        });
  
        const result = await response.json();
        if (result.success) {
          showMessage('Job saved successfully!', 'success');
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        showMessage(`Failed to save job: ${error.message}`, 'error');
      }
    }
  
    // Share analysis
    function shareAnalysis(data) {
      const shareText = `Job Match Analysis:\n` +
        `Overall Match: ${data.matchScore.overall}%\n` +
        `Position: ${data.extractedDetails.jobTitle}\n` +
        `Company: ${data.extractedDetails.company}\n` +
        `Location: ${data.extractedDetails.location}`;
  
      navigator.clipboard.writeText(shareText)
        .then(() => showMessage('Analysis copied to clipboard!', 'success'))
        .catch(() => showMessage('Failed to copy analysis', 'error'));
    }
  
    // Loading state handlers
    function showLoadingState() {
      const button = document.getElementById('analyze');
      button.disabled = true;
      button.innerHTML = '<span class="spinner"></span> Analyzing...';
    }
  
    function hideLoadingState() {
      const button = document.getElementById('analyze');
      button.disabled = false;
      button.innerHTML = 'Analyze Job';
    }
  
    // Message display handler
    function showMessage(message, type) {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = message;
      messageDiv.className = `message ${type}`;
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
      }, 3000);
    }
  });
  