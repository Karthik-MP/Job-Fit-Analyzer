chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "analyze") {
        // Get job description text from the page
        const jobDescription = document.body.innerText;
        sendResponse({text: jobDescription});
      }
      return true;
    }
  );