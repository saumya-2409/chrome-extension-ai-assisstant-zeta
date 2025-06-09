document.addEventListener('mouseup', function () {  
    const selectedText = window.getSelection().toString().trim();  
    if (selectedText.length > 0) {  
        chrome.runtime.sendMessage({ action: 'highlightedText', text: selectedText });  
    }  
});  