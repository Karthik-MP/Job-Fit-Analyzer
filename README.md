🧠 AI-Powered Job Application Assistant (Chrome Extension)

A Chrome extension that leverages Generative AI to streamline the job application process by analyzing job descriptions, extracting key skills, and automatically customizing resumes and cover letters — reducing application time and improving user satisfaction.

🚀 Features
- Job Description Analysis – Uses AI to extract required skills and keywords.
- Resume Customization – Automatically tailors resumes to match job postings.
- Cover Letter Generator – Offers customizable templates, tone options, and real-time suggestions.
- Time Efficiency – Reduces application time by 5–10 minutes per submission.
- Increased Engagement – Cover letter feature boosted user engagement by 30%

🧩 Tech Stack
- Frontend / Extension
    - HTML, CSS (Bootstrap)
    - JavaScript
    - React.js (for cover letter customization)
    - Chrome Extension APIs
- Backend
    - Node.js
    - Express.js
    - RESTful APIs
    - dotenv configuration (.env)
- AI & Automation
    - Generative AI models for job analysis and resume customization

📁 Folder Structure

    Backend/
    │── bootstrap/
    │── authentication.html
    │── authentication.js
    │── content.js
    │── jobAnalysis.html
    │── JobAnalysis.js
    │── popup.html
    │── popup.js
    │── manifest.json
    │── package.json
    │── package-lock.json

    server/
    │── Config/
    │── controllers/
    │── middlewares/
    │── models/
    │── routes/
    │── services/
    │── .env
    │── server.js

⚙️ Setup Instructions

1. Clone the repository
    git clone https://github.com/Karthik-MP/Job-Fit-Analyzer/
    cd job-ai-extension
2. Install dependencies
    npm install
3. Configure environment variables
    Create a .env file in the backend directory.
    Add your API keys and configuration settings.
4. Run the backend
    node server.js
5. Load the extension
    Open Chrome → Extensions → Manage Extensions → Load Unpacked
    Select the project folder to load the extension.

📈 Results

- ⏱ Reduced application time by 5–10 minutes per job.
- 📬 Increased submission volume and user satisfaction.
- 💬 30% boost in engagement via the cover letter generator.
