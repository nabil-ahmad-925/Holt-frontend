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


{
    "userId": "622fb41b-3a36-4694-ac33-b364758d3356",
    "video_url": "https://www.youtube.com/watch?v=fTFWvpt1BSY",
    "transcript": "[{\"start\":\"0.03\",\"text\":\"okay you&#39;re never gonna believe this I alluded that I was gonna do this on Instagram take a look at this this is the first time that a company has ever reached out to us and an expressed interest but I created this series for a very specific reason we&#39;re not changing that so we&#39;re still gonna do it okay so welcome back to episode 10 of but better it so for those of you who don&#39;t live in Texas the honey butter chicken biscuit is one of the most coveted sandwiches in Texas fast food history it is something\"},{\"start\":\"43.14\",\"text\":\"that people here would consider unavoidable it&#39;s a um breakfast only item for some reason but water burger Whataburger reached out I will say really quickly that they have been very good sports so regardless of how this goes water burger if you&#39;re watching I appreciate you being so nice I think there&#39;s anything else that we really need to say about this other than let&#39;s make this shall we its water burger yeah it&#39;s actually what a burger everyone calls it water burger but I don&#39;t understand where they&#39;re\"},{\"start\":\"68.7\",\"text\":\"getting the extra are can I get for honey butter chicken biscuits there&#39;s nobody okay I just maybe the honey this is gonna be better one I can&#39;t tell if I genuinely can&#39;t tell if we&#39;re supposed to wait your water burger you&#39;re already losing points right now bro this is supposed to be fast food good hurry up the transaction was faster that&#39;s good it&#39;s time for what a burger this is a coveted comfy Texas thing so I&#39;ll try to be gentle you have to be as unbiased as possible it&#39;s hard for me to\"},{\"start\":\"98.22\",\"text\":\"be I got a lot of sandwiches come on now expecting it to look a little better I mean not saying that it looks it looks kind of it looks kind of sad I&#39;m scared to say this cuz I know the Texans are gonna get mad at me but like okay maybe the taste is better this is still hot okay we&#39;re like two minutes away from it so don&#39;t want to hear anything okay I mean the chickens not bad it&#39;s crispy barely any honey butter on this look at this falling apart the actual taste is good I mean like it&#39;s good but like this\"},{\"start\":\"124.469\",\"text\":\"is overripe I&#39;m sorry I&#39;ve never had this before either let me finish with this four people get to man me it&#39;s it&#39;s not like oh god this is so gross it&#39;s just like no I just maybe it was too hyped up for me maybe I expected more than what I got now it&#39;s our turn okay so before you do anything we need to first marinate our chicken so to make the marinade you&#39;re gonna combine two cups are 475 millilitres of buttermilk half a tablespoon or 12 grams of gochujang optional 2 teaspoons are 6\"},{\"start\":\"150.25\",\"text\":\"grams of white pepper 1 tablespoon or 8 grams of garlic powder 1 tablespoon or 8 grams of onion powder 1 and 1/2 teaspoons or seven grams of kosher salt and 1 tablespoon or 8 grams of smoked paprika give that some whiskey business until thoroughly combined and depending on how many pieces of chicken you want I&#39;d recommend starting with 2 to 4 chicken breasts cutting those in half like so now look the thickness is pretty different between these two pieces so take the thicker end cover it in some plastic wrap and beat it down until it\"},{\"start\":\"175.72\",\"text\":\"is the same thickness as the other piece no thinner though then just dump those bad boys for the nice little buttermilk bath cover them with plastic wrap and let them marinate for 1 hour at room temperature or overnight in the refrigerator now when you&#39;re ready to actually make this sandwich we need to first start with our buttermilk biscuit this is an important piece make no mistake so in a food processor you&#39;re gonna combine 2 and 3/4 of a cup or 375 grams of all-purpose flour two tablespoons are 26 grams of baking powder and 2/3 of a\"},{\"start\":\"201.94\",\"text\":\"teaspoon or three grams of fine sea salt what&#39;s that a few times in your food processor until thoroughly combined a whiskey business today before you add your butter make sure to measure it and get the exact 140 grams without even trying it just flex on that then cube it up into half inch cubes doesn&#39;t have to be perfect now make sure this butter is really cold if it&#39;s not place it in the freezer for about 5 minutes and then add 2/3 of a cup or 140 grams of cubed very cold butter and pulse it on your food\"},{\"start\":\"225.609\",\"text\":\"processor about 12 to 14 times or until you get little pea-sized balls in there pour that into a bowl and then using a fork you&#39;re then going to mix it in 1 cup or 240 milliliters of butter milk slowly streaming in mixing streaming in and mixing till you&#39;ve added all of your buttermilk and you get a solid mass if it feels a bit dry just add an extra tablespoon or so of buttermilk dump it out onto a work surface gently knead it until it comes together roll it out into a rough rectangle fold it like a letter\"},{\"start\":\"249.519\",\"text\":\"roll it out again lengthwise fold it like a letter again and let it rest in the fridge for about 5 minutes now what&#39;s your toast done taking a nap pull it out lightly flour your work surface and roll it out until you get a rectangle that&#39;s about three quarters of an inch thick then using a three to four inch biscuit cutter cut out many biscuits as you can place them on a baking sheet lined with parchment paper now look I know you got a lot of excess dough here no problem just bring it back together hold it roughly into a single\"},{\"start\":\"271.53\",\"text\":\"shape roll it back out into a 3/4 of an inch thick rectangle and punch out as many biscuits as you can brush the tops with some extra buttermilk go light here you don&#39;t need to go crazy then place them in an oven set to 425 degrees Fahrenheit for about 15 to 17 minutes or until the tops are golden beautiful Brown like this I mean look at that that is a perfect buttermilk biscuit slap some butter on there slap some honey on there but more specifically slap something on there to flex or warble good okay so we\"},{\"start\":\"297.66\",\"text\":\"have our elements ready it&#39;s time to fry our chicky first to fill a heavy-bottomed pot with enough fry oil just to go up about two-and-a-half to three inches high make sure you&#39;re not filling it anywhere higher than three-quarters of the way up otherwise you&#39;re risking a fire hazard and I don&#39;t want to get any messages about that sort of thing send it over the stove go ahead and bring that up to about 350 degrees Fahrenheit now while that&#39;s coming up make your dredge by combining two cups\"},{\"start\":\"318.3\",\"text\":\"are 300 grams of all-purpose flour 1 tablespoon or 10 grams of kosher salt 1 teaspoon or 3 grams of smoked paprika 1 tablespoon or 8 grams of garlic powder 1 tablespoon or 8 grams of serrano powder which is optional but if you want to be fancy then you can do that 1 and a half teaspoons or 1 gram of fresh ground black pepper give it some whiskey business until thoroughly combined in will ready to fly some chickie to bread your chicken pull a piece of chicken out of your buttermilk marinade drop it in your flour mixture toss and press\"},{\"start\":\"343.98\",\"text\":\"aggressively to get every single crevice totally hydrated with flour until it&#39;s totally dry shake off the excess and place it to the side now look another thing that you can do is you can drizzle just a little bit of your buttermilk marinade into the flour toss it around so you get little tiny little pieces of clumped up flour in there and then toss your chicken and press in there and you&#39;ll get this little flaky nubs all around the pieces of chicken anyway rinse to repeat with all of your chicken make sure that there&#39;s no wet\"},{\"start\":\"367.11\",\"text\":\"spots on any chicken and once all of your chicken is breaded you&#39;re then going to drop your chicken into your 350 degree Fahrenheit oil in batches I would say like 2 to 3 pieces per batch for 5 to 7 minutes or until beautifully golden brown and quit be like this as each piece finishes make sure to place it on a wire rack set over a baking sheet just to drain that excess oil off repeat with the rest but now we need to talk about the coveted honey button it&#39;s a reference to the song where he says honey butter I don&#39;t know if you in a\"},{\"start\":\"393.45\",\"text\":\"small pot combine 1/2 for 120 milliliters of wildflower honey with an optional 1 tablespoon or 14 mils of avocado honey we sit on your stovetop medium heat and as soon as it becomes nice and hot turn the heat off and in 6 leaves of fresh sage then begin whisking and whisk in 3 and a half tablespoons our 50 grams of a really good salted butter specifically salted and just keep whisking whisking whisking do not stop until it&#39;s beautifully emulsified into a nice smooth and thickie honey butter if it separates then well you did it wrong\"},{\"start\":\"422.87\",\"text\":\"don&#39;t don&#39;t let that happen please open up a nice hot biscuit putting this together is very simple you got your bottom half of your biscuit gently but lovingly place a piece of chicken onto the biscuit drizzle generously with your honey butter goes generous as you want there&#39;s really no such thing as too much of this stuff and well that&#39;s it crown your king and you&#39;ve got a honey butter chicken biscuit now for the moment you&#39;ve been waiting for the taste test first off the flecks on this sandwich is\"},{\"start\":\"452.26\",\"text\":\"his timing is so impeccable okay so my mouth is watering look at this it&#39;s looking mad in a while so first a sound bite I&#39;m at a loss for words this is do I even need to say anything do I really the chicken is perfectly seasoned it&#39;s I&#39;m sweating this is soaking I&#39;m I&#39;m like drenched the honey butter is like you really taste the sage and the honey the components of the butter the biscuit I don&#39;t see nothing fall our part of your bro ain&#39;t doing it definitely help gather broker you right into the corner\"},{\"start\":\"490.31\",\"text\":\"I&#39;m gonna shift them around shifting them around Oh them around it&#39;s just like one of those lipgloss to top it now let me hold that no please nope I&#39;m gonna feed it to you man damn put your hands down hands all the way down at your sides I feel as though I didn&#39;t get enough honey water to cleanse the palate I&#39;m squishing it for you to just take the bite so one or two two one I forgot I didn&#39;t get any honey I don&#39;t know a little flap to is really good and two is better one I feel like I didn&#39;t get\"},{\"start\":\"531.74\",\"text\":\"anything other than just like oh no I just like didn&#39;t have any flavor didn&#39;t really taste like anything we blindfolded this time the winner is me again always that&#39;s how it goes water burgers thank you for being a good sport I appreciate it I know you guys have love for me I have love for you guys too and so I appreciate you guys partaking in this against your will much appreciated and we did it just like you like it but you want to know what else is just like you like it b-roll or isn&#39;t that is it so we made a\"},{\"start\":\"576.709\",\"text\":\"Whataburger honey buttered chicken biscuit this is the in the Texas area this is one of the most requested but better episodes of all time obviously water burger is hugely hugely hugely hugely loved here it&#39;s a Texas favorite obviously water burger thank you for being good sport we appreciate you but we know who the real winner is probably about the time that I&#39;m recording this will have hit 2 million subscribers I&#39;m assuming because right now we&#39;re recording several days ahead of time and we were sitting at one point\"},{\"start\":\"601.61\",\"text\":\"nine nine million subscribers so first off a pre-emptive thank you but more specifically there is a two million subscribers special coming don&#39;t worry is on its way I appreciate the excitement but until then if you enjoyed this video or you learned something leave a like subscribe and I will see you next time [Music]\"}]",
    "summary": "**Introduction**\n\n* The speaker alludes to reaching out to Whataburger for a collaboration.\n* They acknowledge that the \"honey butter chicken biscuit\" is a coveted sandwich in Texas.\n\n**Whataburger Honey Butter Chicken Biscuit Review**\n\n* The speaker expresses disappointment with the Whataburger honey butter chicken biscuit.\n* They find it underwhelming and not worth the hype.\n\n**Homemade Honey Butter Chicken Biscuit Recipe**\n\n* The speaker begins by instructing viewers on how to make a buttermilk marinade for the chicken.\n* They then provide detailed instructions on how to make buttermilk biscuits.\n* Next, they explain how to bread and fry the chicken.\n* Finally, they teach viewers how to make a honey butter topping.\n\n**Taste Test**\n\n* The speaker conducts a taste test of their homemade honey butter chicken biscuit.\n* They find it far superior to the Whataburger version.\n\n**Conclusion**\n\n* The speaker encourages viewers to try their homemade honey butter chicken biscuit recipe.\n* They thank Whataburger for being a good sport.\n* They announce that they are approaching 2 million subscribers and promise a special video to celebrate the milestone.",
    "videoDetails": {
        "videoId": "fTFWvpt1BSY",
        "title": "Making The Whataburger Honey Butter Chicken Biscuit At Home | But Better",
        "description": "Making the ultimate fried chicken biscuit at home isn't as much of a challenge as we thought. Whataburger Honey Butter Chicken Biscuit, you're in for an overhaul... Welcome back to episode 10 of But Better!\n\nRecipe: https://www.joshuaweissman.com/post/whataburger-honey-butter-chicken-sandwich-but-better\n\nBiscuit Cutters: https://shop-links.co/1731248537918472055\nGochujang: https://shop-links.co/1731248517360380246\nPyrex® Prepware Glass Measuring Cup: https://shop-links.co/1731248517401284785\n64 oz. Wide Mouth Half Gallon Jars (Pack of 6): https://shop-links.co/1731248518767831455\nStaub Cast Iron 5.5-Qt. Round Cocotte: https://shop-links.co/1731248520031181453\n\nFOLLOW ME:\nInstagram: https://www.instagram.com/joshuaweissman\nTik Tok: https://www.tiktok.com/@flakeysalt\nTwitter: https://twitter.com/therealweissman\nFacebook: https://www.facebook.com/thejoshuaweissman\nSubreddit: https://www.reddit.com/r/JoshuaWeissman/\n---------------------------------------------------------------",
        "channelId": "UChBEbMKI1eCcejTtmI32UEw",
        "channelName": "Joshua Weissman",
        "videoLengthSeconds": "PT10M34S",
        "viewCount": "3378339",
        "publishedTime": "2020-05-24T14:00:30Z"
    },
    "captions": [
        {
            "language": "en"
        }
    ]
}