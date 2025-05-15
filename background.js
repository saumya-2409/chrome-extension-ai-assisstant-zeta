let latestSelection = "";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToAI",
    title: "Security Assurance Bot",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendToAI") {
    latestSelection = info.selectionText;

    chrome.storage.local.get(["selectedText"], (stored) => {
      if (stored.selectedText !== latestSelection) {
        chrome.storage.local.set({ selectedText: latestSelection, cachedAnswer: "" }, () => {
          chrome.action.openPopup();
        });
      } else {
        chrome.action.openPopup();
      }
    });
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "send-selected-text-to-ai") {
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
            chrome.storage.local.set({ selectedText, cachedAnswer: "" });
          }
          chrome.action.openPopup();
        });
      }
    );
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "fetchResponse") {
    fetch(
      "https://your-backend-endpoint.com/api/query",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer YOUR_API_KEY_HERE",
        },
        body: JSON.stringify({ query: message.text }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        sendResponse({ answer: data.output?.result || "No result found." });
      })
      .catch((err) => {
        console.error("Error:", err);
        sendResponse({ answer: "Failed to get response." });
      });

    return true;
  }
});
