document.addEventListener("DOMContentLoaded", () => {
  const questionEl = document.getElementById("question");
  const answerEl = document.getElementById("answer");
  const copyBtn = document.getElementById("copyBtn");
  const copyIcon = copyBtn.querySelector("i");
  const tooltip = document.getElementById("copyTooltip");

  const showTooltip = () => {
    tooltip.classList.add("show");
    tooltip.classList.remove("hidden");
    setTimeout(() => {
      tooltip.classList.remove("show");
      tooltip.classList.add("hidden");
    }, 2000);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      copyIcon.classList.remove("fa-clone");
      copyIcon.classList.add("fa-check");
      showTooltip();
      setTimeout(() => {
        copyIcon.classList.remove("fa-check");
        copyIcon.classList.add("fa-clone");
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  chrome.storage.local.get(["selectedText", "cachedAnswer"], (result) => {
    const text = result.selectedText;
    const cached = result.cachedAnswer;

    if (text) {
      questionEl.textContent = text;
      copyIcon.classList.remove("fa-check");
      copyIcon.classList.add("fa-clone");

      if (cached && cached.trim()) {
        // ✅ Use cached answer
        answerEl.innerHTML = cached;
        answerEl.classList.remove("hidden");
        copyToClipboard(cached);
      } else {
        // Show loader
        console.log("2");
        answerEl.innerHTML = `
          <div class="loader">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        `;
        answerEl.classList.remove("hidden");
      
        // ❌ No cached answer, fetch it
        chrome.runtime.sendMessage({ type: "fetchResponse", text }, (response) => {
          answerEl.innerHTML = response.answer || "No response received.";
          answerEl.scrollTop = 0;
          chrome.storage.local.set({ cachedAnswer: response.answer });
      
          copyToClipboard(response.answer);
        });
      }
      
    } else {
      questionEl.textContent = "No text selected.";
    }
  });

  copyBtn.addEventListener("click", () => {
    const answerText = document.getElementById("answer").textContent.trim();
    if (answerText) {
      copyToClipboard(answerText);
    }
  });

  document.getElementById("closeBtn").addEventListener("click", () => {
    window.close();
  });
});

