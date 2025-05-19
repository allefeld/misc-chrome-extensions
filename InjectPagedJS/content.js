// Based on https://gitlab.coko.foundation/pagedjs
// Code created by Perplexity

// Listen for the message from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "activatePagedjs") {
    activatePagedjs();
  }
});

function activatePagedjs() {
  // Check if Paged.js is already loaded
  if (typeof Paged === 'undefined') {
    // If not, load Paged.js
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/pagedjs/dist/paged.polyfill.js';
    script.onload = function() {
      initializePagedjs();
    };
    document.head.appendChild(script);
  } else {
    // If already loaded, just initialize
    initializePagedjs();
  }
}

function initializePagedjs() {
  // Remove existing Paged.js styles and reflow content
  if (document.querySelector('.pagedjs_pages')) {
    document.querySelector('.pagedjs_pages').remove();
  }
  
  // Initialize Paged.js
  const paged = new Paged.Previewer();
  
  paged.preview(document.body.innerHTML, [], document.body).then(() => {
    console.log("Paged.js activated and content reflowed");
  });
}