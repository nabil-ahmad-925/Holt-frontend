 

import 'url';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai'; // For Gemini API

 const api_key = 'AIzaSyALTO8K819PFLSwjttKKqP7yAUCUltJa_0';
 const genAI = new GoogleGenerativeAI(api_key);

 const generationConfig = { temperature: 0.9, topP: 1, topK: 1, maxOutputTokens: 4096 };

// // 2. Initialise Model
const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

// // 3. Generate Content
async function generateContent(transcript) {
  try {
    // const prompt = "Create a Meal plan for today";
    const result = await model.generateContent(transcript);
    const response = await result.response;
    // console.log("Meal==================>>>",response.text());
    return response;
  } catch (error) {
    console.error('Error generating content:', error);
  }
}

// Save data to local storage
function saveData() {
  const key = 'myKey';
const value = { name: 'my value' };

chrome.storage.local.set({key: 'value'}, () => {
  console.log('Stored name: ' + value.name);
});

}

// Retrieve data from local storage
function getData(key, callback) {
  chrome.storage.local.get([key], function(result) {
    if (callback && typeof callback === 'function') {
      callback(result[key]);
    }
  });
}

async function saveSummaryInDB(summaryObject){
  const response = await fetch('http://localhost:3000/save-summary', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // You can add more headers if needed
                        },
                        body: JSON.stringify(summaryObject),

                    });
                
}

// Function to make API requests
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Function to get video details
async function getVideoDetails() {
  const apiKey = 'AIzaSyBBZR5is4JEiF31xAt4zr0oDs70Cbr9MGQ';
  const videoId = 'fTFWvpt1BSY';

  const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
  const videoDetails = await fetchData(videoDetailsUrl);
  return videoDetails.items[0];
}


// Function to get video captions
async function getVideoCaptions() {
  const apiKey = 'AIzaSyBBZR5is4JEiF31xAt4zr0oDs70Cbr9MGQ';
  const videoId = 'fTFWvpt1BSY';

  const captionsUrl = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`;
  const captionsData = await fetchData(captionsUrl);
  
  if (captionsData.items && captionsData.items.length > 0) {
    const captions = captionsData.items;
    console.log("Captions=========>",captions);
    const captionsInfo = [];
    for (const caption of captions) {
      const language = caption.snippet.language;
      const captionText = caption.snippet.text;

      
      // Print or process the caption information
      console.log(`Language: ${language}`);
      console.log(`Caption Text: ${captionText}`);

       // Add the caption information to the captionsInfo array
       captionsInfo.push({ language, captionText });
    }

    return captionsInfo;
  } else {
    console.log("No captions available");
  }
}


export async function   main(transcript)    {
  // 5ro6o3gpyAw
 console.log("Fetching Transcript GITHUB Actuions-------");
//  const transcript =  await YoutubeTranscript.fetchTranscript('5ro6o3gpyAw');
 console.log("Array Data ======>",transcript);
 console.log("Array Data Stringify======>",JSON.stringify(transcript));

const linesOfText = transcript.map(item => item.text);
const joinedText = linesOfText.join(', ');
console.log('Final Text ===== >',joinedText);

console.log("Generating Summary ------->>>>>");
//  // Run the gemini
const finalSummary = await generateContent(joinedText);
console.log("final summary ==================-->>>",finalSummary.text() );



const detail =  await getVideoDetails();
const captionsInfo =await getVideoCaptions();
 
 
let userId ;
getData('User', function(user) {
  userId = user.id
  console.log('Retrieved value =========== > ', user);
});

console.log("Id ==========>",userId)

  // Extracting details from getVideoDetails() response
  const videoDetails = {
    videoId: detail.id,
    title: detail.snippet.title,
    description: detail.snippet.description,
    channelId: detail.snippet.channelId,
    channelName: detail.snippet.channelTitle,
    videoLengthSeconds: detail.contentDetails.duration,
    viewCount: detail.statistics.viewCount,
    publishedTime: detail.snippet.publishedAt,
  };
 
  // Sample data for the request body
  const requestBody = {
    userId: userId, // Replace with the actual user ID
    video_url: `https://www.youtube.com/watch?v=${detail.id}`, // Replace with the actual YouTube video URL
    transcript: JSON.stringify(transcript),
    summary: finalSummary.text(),
    videoDetails: videoDetails,
    captions: captionsInfo,
 
  };

  console.log("Video details Data===================>",requestBody)

// saveSummaryInDB(requestBody);


return finalSummary.text();

}

 
 
 