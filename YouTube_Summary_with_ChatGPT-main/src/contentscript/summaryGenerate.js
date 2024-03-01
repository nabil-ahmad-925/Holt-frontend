 

// import 'url';
// import { GoogleGenerativeAI } from '@google/generative-ai'; // For Gemini API

//  const Youtube_APIKEY = 'AIzaSyBBZR5is4JEiF31xAt4zr0oDs70Cbr9MGQ';
//  const Gemini_APIKEY = 'AIzaSyALTO8K819PFLSwjttKKqP7yAUCUltJa_0';
//  let globalVideoId = '';
//  let userId = ''; 

//  const genAI = new GoogleGenerativeAI(Gemini_APIKEY);

//  const generationConfig = { temperature: 0.9, topP: 1, topK: 1, maxOutputTokens: 4096 };

// // // 2. Initialise Model
// const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

// // // 3. Generate Content
// async function generateContent(transcript) {
//   try {
//     // const prompt = "Create a Meal plan for today";
//     const result = await model.generateContent(transcript);
//     const response = await result.response;

//     return response;
//   } catch (error) {
//     console.error('Error generating content:', error);
//   }
// }

// // Save data to local storage
// function saveData() {
//   const key = 'myKey';
// const value = { name: 'my value' };

// chrome.storage.local.set({key: 'value'}, () => {
//   console.log('Stored name: ' + value.name);
// });

// }

// // Retrieve data from local storage
// function getData(key, callback) {
//   chrome.storage.local.get([key], function(result) {
//     if (callback && typeof callback === 'function') {
//       callback(result[key]);
//     }
//   });
// }

// // Wrap the asynchronous operation in a promise
// const getUserId = () => new Promise(resolve => {
//   getData('User', function(user) {
//     userId = user.id;
//     console.log('Retrieved value =========== > ', user);
//     resolve();
//   });
// });


// async function saveSummaryInDB(summaryObject){
//   const response = await fetch('http://localhost:3000/save-summary', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                             // You can add more headers if needed
//                         },
//                         body: JSON.stringify(summaryObject),

//                     });
                
// }

// // Function to make API requests
// async function fetchData(url) {
//   const response = await fetch(url);
//   const data = await response.json();
//   return data;
// }

// // Function to get video details
// async function getVideoDetails() {
//   const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${globalVideoId}&key=${Youtube_APIKEY}`;
//   const videoDetails = await fetchData(videoDetailsUrl);
//   return videoDetails.items[0];
// }


// // Function to get video captions
// async function getVideoCaptions() {
//   const captionsUrl = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${globalVideoId}&key=${Youtube_APIKEY}`;
//   const captionsData = await fetchData(captionsUrl);
  
//   if (captionsData.items && captionsData.items.length > 0) {
//     const captions = captionsData.items;
//     console.log("Captions=========>",captions);
//     const captionsInfo = [];
//     for (const caption of captions) {
//       const language = caption.snippet.language;
//       const captionText = caption.snippet.text;

      
//       // Print or process the caption information
//       console.log(`Language: ${language}`);
//       console.log(`Caption Text: ${captionText}`);

//        // Add the caption information to the captionsInfo array
//        captionsInfo.push({ language, captionText });
//     }

//     return captionsInfo;
//   } else {
//     console.log("No captions available");
//   }
// }


// export async function   main(transcript, videoId)    {

// // setting current video Id
// globalVideoId = videoId;

// // converted transcript array to the text 
// const linesOfText = transcript.map(item => item.text);
// const joinedText = linesOfText.join(', ');

// console.log('Final Text ============= >',joinedText);


// console.log("Generating Summary  ===== >");
//  // sending call to gemini model 
// const finalSummary = await generateContent(joinedText);

// // getting details of channel and other than summary and transcript
// const detail =  await getVideoDetails();
// const captionsInfo =await getVideoCaptions();
 

// // current logged in user id
// await getUserId();

 
// // final object that is to be saved in supabase
//   const requestBody = {
//     userid: userId, // Replace with the actual user ID
//     video_url: `https://www.youtube.com/watch?v=${detail.id}`, // Replace with the actual YouTube video URL
//     transcript: JSON.stringify(transcript),
//     summary: finalSummary.text(),
//     videoid: detail.id,
//     title: detail.snippet.title,
//     description: detail.snippet.description,
//     channelid: detail.snippet.channelId,
//     channelname: detail.snippet.channelTitle,
//     videolengthseconds: transcript[transcript.length-1].start,
//     viewcount: detail.statistics.viewCount,
//     publishedtime: detail.snippet.publishedAt,
//     captions: captionsInfo,
 
//   };

//   console.log("Video details Data===================>",requestBody)

// // storing all the data of video in supabase
//  const dataRes = await saveSummaryInDB(requestBody);

// // sending summary to the extension UI 
// return finalSummary.text();

// }

 
 // Importing necessary modules
import 'url';
import { GoogleGenerativeAI } from '@google/generative-ai'; // For Gemini API

// API keys for YouTube and Gemini
const Youtube_APIKEY = 'AIzaSyBBZR5is4JEiF31xAt4zr0oDs70Cbr9MGQ';
const Gemini_APIKEY = 'AIzaSyALTO8K819PFLSwjttKKqP7yAUCUltJa_0';

// Global variables for video and user information
let globalVideoId = '';
let userId = '';

// Initializing GoogleGenerativeAI with Gemini API key
const genAI = new GoogleGenerativeAI(Gemini_APIKEY);

// Configuration for content generation
const generationConfig = { temperature: 0.9, topP: 1, topK: 1, maxOutputTokens: 4096 };

// Initializing the generative model
const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

// Asynchronous function to generate content using the model
async function generateContent(transcript) {
  try {
    const result = await model.generateContent(transcript);
    const response = await result.response;

    return response;
  } catch (error) {
    console.error('Error generating content:', error);
  }
}

// Function to save data to local storage
function saveData() {
  const key = 'myKey';
  const value = { name: 'my value' };

  // Using Chrome extension storage API to save data
  chrome.storage.local.set({ key: 'value' }, () => {
    console.log('Stored name: ' + value.name);
  });
}

// Function to retrieve data from local storage
function getData(key, callback) {
  chrome.storage.local.get([key], function (result) {
    if (callback && typeof callback === 'function') {
      callback(result[key]);
    }
  });
}

// Wrapping asynchronous operation in a promise to get user ID
const getUserId = () => new Promise(resolve => {
  getData('User', function (user) {
    userId = user.id;
    console.log('Retrieved value =========== > ', user);
    resolve();
  });
});

// Asynchronous function to save summary in the database
async function saveSummaryInDB(summaryObject) {
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

// Function to get video details from YouTube API
async function getVideoDetails() {
  const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${globalVideoId}&key=${Youtube_APIKEY}`;
  const videoDetails = await fetchData(videoDetailsUrl);
  return videoDetails.items[0];
}

// Function to get video captions from YouTube API
async function getVideoCaptions() {
  const captionsUrl = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${globalVideoId}&key=${Youtube_APIKEY}`;
  const captionsData = await fetchData(captionsUrl);

  if (captionsData.items && captionsData.items.length > 0) {
    const captions = captionsData.items;
    console.log("Captions=========>", captions);
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

// Main function to coordinate the entire process
export async function main(transcript, videoId) {

  // Setting current video Id
  globalVideoId = videoId;

  // Converting transcript array to text
  const linesOfText = transcript.map(item => item.text);
  const joinedText = linesOfText.join(', ');

  console.log('Final Text ============= >', joinedText);

  console.log("Generating Summary  ===== >");
  // Sending call to the Gemini model
  const finalSummary = await generateContent(joinedText);

  // Getting details of the channel and other than summary and transcript
  const detail = await getVideoDetails();
  const captionsInfo = await getVideoCaptions();

  // Getting the current logged-in user id
  await getUserId();

  // Final object to be saved in Supabase
  const requestBody = {
    userid: userId, // Replace with the actual user ID
    video_url: `https://www.youtube.com/watch?v=${detail.id}`, // Replace with the actual YouTube video URL
    transcript: JSON.stringify(transcript),
    summary: finalSummary.text(),
    videoid: detail.id,
    title: detail.snippet.title,
    description: detail.snippet.description,
    channelid: detail.snippet.channelId,
    channelname: detail.snippet.channelTitle,
    videolengthseconds: transcript[transcript.length - 1].start,
    viewcount: detail.statistics.viewCount,
    publishedtime: detail.snippet.publishedAt,
    captions: captionsInfo,
  };

  console.log("Video details Data===================>", requestBody);

  // Storing all the data of the video in Supabase
  const dataRes = await saveSummaryInDB(requestBody);

  // Sending the summary to the extension UI
  return finalSummary.text();
}

 