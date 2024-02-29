 
 //<--------------------------------------------------88888888888888----------------------------------------->
 
 
//  const { YoutubeTranscript } =  require( 'youtube-transcript');
//  const {GoogleGenerativeAI} = require('@google/generative-ai'); // For Gemini API
 
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

let userId ;
getData('User', function(user) {
  userId = user.id
  console.log('Retrieved value =========== > ', user);
});

console.log("Id ==========>",userId)

// Sample data for the request body
const requestBody = {
  userId: userId,  // Replace with the actual user ID
  video_url: 'https://www.youtube.com/watch?v=yourvideoid',  // Replace with the actual YouTube video URL
  transcript: JSON.stringify(transcript),
  summary: finalSummary.text()
};



saveSummaryInDB(requestBody);



return finalSummary.text();

}

 
 
 