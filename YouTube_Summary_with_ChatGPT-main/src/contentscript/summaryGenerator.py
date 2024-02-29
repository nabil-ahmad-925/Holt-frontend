import pathlib
import textwrap

import google.generativeai as genai

# from IPython.display import display
# from IPython.display import Markdown

# YouTube Data API
import googleapiclient.discovery

# For displaying videos in Colab
# from IPython.display import YouTubeVideo

# YT Transcripts
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

# Gemini API
import google.generativeai as genai


# Or use `os.getenv('GOOGLE_API_KEY')` to fetch an environment variable.
GOOGLE_API_KEY='AIzaSyALTO8K819PFLSwjttKKqP7yAUCUltJa_0'
YOUTUBE_DATA_API_KEY ='AIzaSyBBZR5is4JEiF31xAt4zr0oDs70Cbr9MGQ'

genai.configure(api_key=GOOGLE_API_KEY)




youtube = googleapiclient.discovery.build(serviceName='youtube', version='v3', developerKey=YOUTUBE_DATA_API_KEY)

genai.configure(api_key=GOOGLE_API_KEY)
genai_model = genai.GenerativeModel('gemini-pro')

def search_yt(query, max_results=5, page_token=None):

    # Reference: https://developers.google.com/youtube/v3/docs/search/list
    # Reference: https://developers.google.com/youtube/v3/guides/implementation/pagination
    request = youtube.search().list(
        part="snippet", # search by keyword
        maxResults=max_results,
        pageToken=page_token, # optional, for going to next/prev result page
        q=query,
        videoCaption='closedCaption', # only include videos with captions
        type='video',   # only include videos, not playlists/channels
    )
    response = request.execute()
    search_response = Search_Response(response)
    return search_response

# Display YouTube search results
def display_yt_results(search_response, extract_prompt=None):
  for search_result in search_response.search_results:
      print(f'Video ID: {search_result.video_id}')
      print(f'Title: {search_result.title}')
      youtube_video = YouTubeVideo(search_result.video_id)
      display(youtube_video)

      if(extract_prompt is not None):
        transcript = get_transcript(search_result.video_id)
        extracted_text, _, _ = get_ai_extract(extract_prompt, transcript)
        print(extracted_text)

      print()

# Get transcript from YouTube video
# Reference: https://github.com/jdepoix/youtube-transcript-api
def get_transcript(video_id, languages=['en','en-US','en-GB']):
    transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=languages)
    transcript = TextFormatter().format_transcript(transcript)

    # print(transcript)
    return transcript

# Extract information from text based on prompt instructions
def get_ai_extract(prompt, text):
    response = genai_model.generate_content(prompt + text, stream=False)
    return response.text, response.prompt_feedback, response.candidates



transcript = get_transcript("5ro6o3gpyAw") 
# print("THis is my first python extension app test ",transcript)

recipe, _, _ = get_ai_extract("Extract Summary from video transcript: ", transcript)
# Save the recipe data to a file named data.txt
with open("data.txt", "w") as file:
    file.write(recipe)

print("Saved to file",recipe)