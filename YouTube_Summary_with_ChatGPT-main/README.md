# YouTube Summary with ChatGPT

YouTube Summary with ChatGPT is a simple Chrome Extension (manifest v3) that allows you to get both YouTube video transcripts and summary of the video with OpenAI's ChatGPT AI technology. Chrome Extension is available on [Chrome Web Store](https://chrome.google.com/webstore/detail/chatgpt-youtube-summary/nmmicjeknamkfloonkhhcjmomieiodli).

## How to Install

To install this extension, follow these steps:

1. Download the code on GitHub.
2. Unzip the downloaded file.
3. Open the code in your favorite IDE like VS Code.
4. Run `npm install` in terminal
```
npm install
```
5. Run `npm run build` or `npm run build-release` to run webpack to generate **dist** folder.
```
npm run build
# or
npm run build-release
```
6. In case of Google Chrome, open the Extensions page (chrome://extensions/).
7. Turn on Developer mode by clicking the toggle switch in the top right corner of the page.
8. Click the `Load unpacked` button and select the **dist** directory.
9. YouTube Summary with ChatGPT extension should be installed and active!

## How to Use

To use YouTube Summary with ChatGPT extension, follow these steps (or [watch this video](https://www.youtube.com/watch?v=pNxsdLif2cs)):

1. Go to any YouTube videos.
2. Click the small box on the right top that says `Transcript & Summary`.
3. Click `View AI Summary` button (It automatically copies the prompt for you and opens the ChatGPT page!)
4. Hit `Cmd + V` if you use Mac
5. You'll see a magic!

## Notes

- According to OpenAI, ChatGPT is experiencing exceptionally high demand. They work on scaling their systems but I can't guarantee that ChatGPT keeps free and is open forever.
- This code manually fetches the YouTube video transcripts, and the platform might change the system so I also cannot guarantee that the YouTube video transcript code works forever. I'll try my best to keep updated!

## Feedback & Support

If you have any questions or feedback about YouTube Summary with ChatGPT Extension, please reach out to me on [Twitter](https://twitter.com/kazuki_sf_). Also, I'm building Glasp, a social web annotation tool to build your own AI models to write, search, and summarize better. If you're interested, please check out [Glasp](https://glasp.co/ai-summary).




----------------------------------------------------------------------------------------------------------------

This is a JavaScript code for a browser extension that adds a "Transcript & Summary" feature to YouTube videos. It consists of two main files: index.js and youtube.js. Let's break down the code in detail:

index.js:
Use Strict Mode:

javascript
Copy code
"use strict";
This enforces a stricter set of rules and best practices in JavaScript, helping to catch common coding mistakes.

Import Statement:

javascript
Copy code
import { insertSummaryBtn } from "./youtube";
This imports the insertSummaryBtn function from the youtube.js file.

Initialization and Event Listeners:

javascript
Copy code
window.onload = async () => {
    // Code for YouTube functionality
    // ...

    // Code for chat.openai.com functionality
    // ...
}

The window.onload event is used to execute code after the entire page has loaded. The code checks if the current page is on YouTube (www.youtube.com) and inserts the summary button. It also observes mutations in the DOM to dynamically insert the summary button if the page changes.

YouTube Check and Summary Button Insertion:

javascript
Copy code
if (window.location.hostname === "www.youtube.com") {
    // Check if the URL contains a video ID, then insert the summary button
    // ...

    // Use MutationObserver to dynamically insert the summary button on URL changes
    // ...
}
The code checks if the current page is on YouTube and inserts the summary button if the URL contains a video ID. It uses a MutationObserver to detect changes in the DOM and insert the button accordingly.

Chat OpenAI Check and Textarea Interaction:

javascript
Copy code
if (window.location.hostname === "chat.openai.com") {
    // Focus on the textarea and handle a specific search query (?ref=glasp)
    // ...
}
For the Chat OpenAI website, it focuses on the textarea and, if the URL contains ?ref=glasp, it retrieves a prompt from background.js and sets it in the textarea.

youtube.js:
Strict Mode and Imports:

javascript
Copy code
"use strict";
import { getLangOptionsWithLink, getTranscriptHTML } from "./transcript";
import { getSearchParam } from "./searchParam";
import { getChunckedTranscripts, getSummaryPrompt } from "./prompt";
import { copyTextToClipboard } from "./copy";
Exported Function insertSummaryBtn:

javascript
Copy code
export function insertSummaryBtn() {
    // Functionality for inserting the summary button and handling events
    // ...
}
This function inserts a summary button on YouTube videos, provides functionality for handling events like copying transcripts, jumping to timestamps, and toggling the visibility of the transcript body.

Helper Functions:

sanitizeWidget: Clears the transcript div and adjusts its height.
isWidgetOpen: Checks if the transcript widget is open.
noTranscriptionAlert: Displays a message when no transcription is available.
createLangSelectBtns: Creates language selection buttons.
evtListenerOnLangBtns: Adds event listeners to language selection buttons.
getTYCurrentTime and getTYEndTime: Retrieve current and total video time on YouTube.
scrollIntoCurrTimeDiv: Scrolls to the current timestamp in the transcript.
evtListenerOnTimestamp: Adds event listeners to transcript timestamps for jumping to video timestamps.
copyTranscript: Copies the transcript and video information to the clipboard.
copyTranscriptAndPrompt: Copies the transcript and generates a summary prompt.
Helper Function waitForElm:

javascript
Copy code
function waitForElm(selector) {
    // Waits for an element to appear in the DOM
    // ...
}
This function returns a promise that resolves when a specified element is found in the DOM.

Overall, these scripts work together to enhance the YouTube experience by adding a transcript and summary feature. The code structure follows modern JavaScript practices, utilizing asynchronous functions and modularization.


-------------

The background.js file in a Chrome extension typically runs in the background and handles events, messages, and other functionalities that need to persist across different parts of the extension. Let's break down the code:

```javascript
"use strict";

console.log("connected...");
const onInstallURL = "https://glasp.co/youtube-summary";

// On Chrome Install
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        chrome.tabs.create({ url: onInstallURL });
    }
});

let prompt = "";

// On Message
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "setPrompt") {
        prompt = request.prompt;
    } else if (request.message === "getPrompt") {
        sendResponse({ prompt: prompt });
        prompt = ""; // Reset prompt
    }
});
```

Explanation:

1. **"use strict";**: Enforces a stricter set of rules in JavaScript, catching common coding errors and preventing the use of certain features.

2. **`console.log("connected...");`**: Outputs a log message to the background page's console when the extension is loaded.

3. **`const onInstallURL = "https://glasp.co/youtube-summary";`**: Defines a constant variable for the URL that should be opened when the extension is installed.

4. **`chrome.runtime.onInstalled.addListener(function (details) { ... });`**: Adds an event listener for the runtime.onInstalled event, which is triggered when the extension is installed, updated, or reloaded. In this case, it opens a new tab with the specified URL on the first installation.

5. **`let prompt = "";`**: Initializes a variable `prompt` to an empty string. This variable will be used to store a prompt value received from the content script.

6. **`chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) { ... });`**: Adds an event listener for the runtime.onMessage event, which is triggered when a message is sent from another part of the extension (e.g., content script or popup).

   - If the message is "setPrompt," it updates the `prompt` variable with the value from the message.
   - If the message is "getPrompt," it sends a response containing the current value of the `prompt` variable and then resets the `prompt` to an empty string.

This background script serves as a communication hub between different components of the extension, handling events related to installation and managing the prompt value received from the content script.








---------------------------------------------------------Flow-----------------------------------------------------------

login  -> show portal  -> copy token
enter token in extension -> print summary 

createdAt
updatedAt
videoid
title
description
channelid
channelname
captions
captionslanguage
relatedvideos
videolengthseconds
viewcount
publishedtime
transcript
summary

----------------------------------------------------------------