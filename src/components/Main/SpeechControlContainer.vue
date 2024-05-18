<template>
  <div
    class="speech-control-container"
    :class="{ 'full-screen': isFullScreen || isRecording }"
  >
    <p v-if="aiResponse" class="response ai-response">
      {{ aiResponse }}
    </p>
    <p v-if="speechResponse" class="response speech-response">
      {{ speechResponse }}
    </p>

    <div class="buttons-container">
      <button id="micBtn" class="mic-btn" @click="startRecording">
        <MicIcon :fillColor="iconFillColor" />
      </button>
      <button
        id="stopBtn"
        class="stop-btn"
        @click="stopRecording"
        v-if="isRecording"
      >
        <StopIcon :fillColor="iconFillColor" />
      </button>
    </div>
    <div class="test-container" v-show="showResult">
      <div class="audio-container">
        <audio class="audio-player" ref="audioPlayer" controls></audio>
      </div>
      <textarea class="response-area" rows="10" v-html="replay"> </textarea>
    </div>
  </div>
</template>

<script>
/**
Task: 
Implementing Free Google Speech-to-Text API in Vue.js with Plain JavaScript

Description: 
--------------
As a Senior Front-End Developer, your task is to integrate the free tier of 
Google Speech-to-Text API into a Vue.js application using plain JavaScript.
The objective is to create a feature that allows users to speak into their browser's
microphone, transcribe the speech into text using the Google API,
display the transcribed text on the screen, and export the text into a JSON file.

Deliverables:
----------------
	A fully functional Vue.js application with the integrated 
Google Speech-to-Text API feature using plain JavaScript of at least 10 spoken sentences.

	Documentation:
----------------------
1) How did you develop the solution.
2) The searches you made and any other relevant information 
e.g. setup instructions, usage guidelines, etc.

	The exported JSON file containing the transcribed text.

Resources: 
-----------------------
	Google Cloud Speech-to-Text API Documentation: [Google Cloud Speech-to-Text Documentation]
(https://cloud.google.com/speech-to-text/docs)

	Vue.js Documentation: [Vue.js Documentation] (https://vuejs.org/v2/guide/)

Deadline: 
2 days from receiving the task.
*/

import MicIcon from "@/components/Icons/MicIcon";
import StopIcon from "@/components/Icons/StopIcon";

// import axios from "axios";
export default {
  props: ["isFullScreen"],
  components: {
    MicIcon,
    StopIcon,
  },

  async mounted() {
    await this.initRecorder();
  },
  data() {
    return {
      isRecording: false,
      showResult: false,
      micFillColor: null,
      aiResponse: "Hello! How can I help you?",
      speechResponse: "",
      recognizedText: "",
      mediaRecorder: null,
      audioChunks: [],
      transcription: "",
      replay: "For Testing Only",
      API_KEY: "AIzaSyBRqLY7bt6x2U4ADcZhE-HvNsVEKghbO9U",
    };
  },

  methods: {
    async initRecorder() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
    },
    async startRecording() {
     await this.mediaRecorder.start();
      this.isRecording = true;
      this.showResult = false;
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.isRecording = false;
        this.sendDataToSpeechToTextAPI();
      }
    },

    sendDataToSpeechToTextAPI() {
      if (this.audioChunks.length === 0) {
        console.error("No audio data to send.");
        return;
      }

      // Convert audio chunks to a single Blob
      const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" }); // Adjust type based on your audio format

      // Convert audio Blob to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1]; // Extract base64 data (remove data URI prefix)

        // Create the request body object
        const requestBody = {
          config: {
            encoding: "WEBM_OPUS",
            // encoding: "LINEAR16",
            // sampleRateHertz: 16000,
            languageCode: "en-US",
          },
          audio: {
            content: base64Data,
          },
        };

        // Make HTTP request to the Google Speech-to-Text API using Fetch
        fetch(
          `https://speech.googleapis.com/v1/speech:recognize?key=${this.API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Use application/json for JSON request body
            },
            body: JSON.stringify(requestBody),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            // this.log(JSON.stringify(data));
            // this.log("JSON: ", JSON.parse(JSON.stringify(data)));
            // this.log(data);

            let t = "no transcription yet";
            if (data?.results?.length) {
              t = data?.results
                ?.map((result) => result.alternatives[0].transcript)
                .join("\n");

              if (t.length) this.replay = t;
              this.showResult = t;
            }

            // Clear audioChunks for the next recording
            this.audioChunks = [];
          })
          .catch((error) => {
            // Handle error
            console.error("Error sending audio data:", error);
          });
      };
      reader.readAsDataURL(audioBlob); // Read audio Blob as data URL
    },
  },

  computed: {
    iconFillColor() {
      return this.isRecording ? "red" : "#222";
    },
  },
};
</script>


<style>
.speech-control-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--speech-control-container-height);
  transition: all 0.3s ease;
}
.speech-control-container.full-screen {
  height: 100%;
  width: 100%;
  position: absolute;
  bottom: 0;
  top: 0;
  background: var(--primary-color);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 50px;
}
.speech-control-container.full-screen .mic-btn {
  width: 200px;
  height: 200px;
}

.response {
  width: 80%;
  text-align: center;
  font-size: 30px;
  padding: 10px;
  margin: 0px auto 50px auto;
}
.ai-response {
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: #111;
}
.speech-response {
  /* margin-bottom: 50px; */
}
.buttons-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.mic-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  padding: 15px;
  cursor: pointer;
  transition: all 0.1s ease;
  top: 0;
}
.stop-btn {
  position: absolute;
  right: -90px;
  bottom: 0px;
  width: 60px;
  height: 60px;
  margin-right: 20px;
  border-radius: 50%;
  border: none;
  padding: 15px;
  cursor: pointer;
}

.response-area {
  width: 80%;
  height: 100px;
  text-align: left;
  margin: 20px;
  padding: 10px;
  background: #111;
  color: green;
  border-radius: 10px;
  resize: none;
}

.audio-player {
  margin-top: 20px;
}

.test-container {
  background: #111;
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.audio-container {
  height: 100px;
}
</style>

