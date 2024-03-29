"use strict";

import { insertSummaryBtn } from "./youtube";

let oldHref = "";

window.onload = async () => {
        
    if (window.location.hostname === "www.youtube.com") {
        
        if (window.location.search !== "" && window.location.search.includes("v=")) {

             // Storing data in local storage
             chrome.storage.local.set({
                myDataKey: "Some data to store"
            }, (result) => {
                if (chrome.runtime.lastError) {
                    console.error("Error storing data:", chrome.runtime.lastError);
                } else {
                    console.log("Data stored successfully:", result);
                }
            });



            insertSummaryBtn();

          
            
        }

        const bodyList = document.querySelector("body");
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (oldHref !== document.location.href) {
                    
                    oldHref = document.location.href;

 // Storing data in local storage
 chrome.storage.local.set({
    myDataKey: "Some data to store"
}, (result) => {
    if (chrome.runtime.lastError) {
        console.error("Error storing data:", chrome.runtime.lastError);
    } else {
        console.log("Data stored successfully:", result);
    }
});



                    insertSummaryBtn();
                }
            });
        });
        observer.observe(bodyList, { childList: true, subtree: true });

    }

    if (window.location.hostname === "chat.openai.com") {
        if (document.getElementsByTagName("textarea")[0]) {
            document.getElementsByTagName("textarea")[0].focus();
            // If search query is "?ref=glasp"
            if (window.location.search === "?ref=glasp") {
                // get prompt from background.js
                chrome.runtime.sendMessage({ message: "getPrompt" }, (response) => {
                    document.getElementsByTagName("textarea")[0].value = response.prompt;
                    if (response.prompt !== "") {
                        document.getElementsByTagName("textarea")[0].focus();
                        document.getElementsByTagName("button")[document.getElementsByTagName("button").length-1].click();
                    }
                });
            }
        }
    }
    
}