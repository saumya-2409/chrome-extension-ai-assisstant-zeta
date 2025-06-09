const API_KEY = "YOUR_API_KEY";

let latestSelection = "";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendTozeta",
    title: "Security Assurance Bot",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendTozeta") {
    latestSelection = info.selectionText;

    chrome.storage.local.get(["selectedText"], (stored) => {
      if (stored.selectedText !== latestSelection) {
        // New text — reset cachedAnswer
        chrome.storage.local.set({ selectedText: latestSelection, cachedAnswer: "" }, () => {
          chrome.action.openPopup();
        });
      } else {
        // Same text — reuse cache
        chrome.action.openPopup();
      }
    });
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "send-selected-text-to-zeta") {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => window.getSelection().toString().trim(),
      },
      async (results) => {
        const selectedText = results?.[0]?.result;
        if (!selectedText) return;

        chrome.storage.local.get(["selectedText", "cachedAnswer"], (stored) => {
          if (stored.selectedText !== selectedText) {
            // New text — update and allow popup to fetch a new answer
            chrome.storage.local.set({ selectedText, cachedAnswer: "" });
          }
          // Open popup regardless (it handles logic inside)
          chrome.action.openPopup();
        });
      }
    );
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "fetchResponse") {
    fetch(
      "https://superblocks-dv60.cvent-internaltools-dev.cvent.cloud/v2/execute/445dcad8-b5db-40fc-867e-11245eecc5d2?profile=production&test=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ query: message.text }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // Adapt this based on your API's response format
        sendResponse({ answer: data.output?.result || "No result found." });
      })
      .catch((err) => {
        console.error("Error:", err);
        sendResponse({ answer: "Failed to get response." });
      });

    return true; // Needed for async sendResponse
  }
});
