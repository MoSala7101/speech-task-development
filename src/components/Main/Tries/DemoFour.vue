<template>
  <div>
    <button @click="startRecording" :disabled="isRecording">
      Start Recording
    </button>
    <button @click="stopRecording" :disabled="!isRecording">
      Stop Recording
    </button>
    <!-- apiKey: "AIzaSyBRqLY7bt6x2U4ADcZhE-HvNsVEKghbO9U", // Your API key here -->

    <h1>{{ hint }}</h1>
  </div>
</template>
  
  <script>
import axios from "axios";
export default {
  data() {
    return {
      mediaRecorder: null,
      audioChunks: [],
      isRecording: false,
      chunkSendingTimer: null,
      apiKey: "AIzaSyBRqLY7bt6x2U4ADcZhE-HvNsVEKghbO9U", // Your API key here
      hint: "...", // Hint to display in the DOM
    };
  },
  mounted() {
    // Call startRecording() to begin capturing audio continuously
    this.startRecording();
  },
  methods: {
    startRecording() {
      navigator.mediaDevices
        .getUserMedia({ audio: true }) // Request access to the user's microphone
        .then((stream) => {
          // Initialize the media recorder
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.addEventListener("dataavailable", (event) => {
            // Push audio data to audioChunks array when available
            this.audioChunks.push(event.data);
          });

          // Start recording audio
          this.mediaRecorder.start();
          this.isRecording = true;
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error); // Log error if microphone access is denied
        });
    },
    stopRecording() {
      clearInterval(this.chunkSendingTimer); // Stop the chunk sending timer
      if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
        this.mediaRecorder.stop();
        this.isRecording = false;

        // Send the collected audio chunks after stopping recording
        this.sendDataToSpeechToTextAPI(this.audioChunks);
      }
    },
    sendDataToSpeechToTextAPI(audioChunks) {
      // Check if audioChunks is empty
      if (!audioChunks || audioChunks.length === 0) {
        this.hint = "No audio data to send.";
        console.error("No audio data to send."); // Log error if no audio data to send
        return;
      }

      this.hint = "Sending audioChunks..";

      // Convert audio chunks to base64 data
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1]; // Extract base64 data (remove data URI prefix)

        // Create the request body object
        const requestBody = {
          config: {
            encoding: "LINEAR16",
            sampleRateHertz: 48000, // Match the actual sample rate of the audio data
            languageCode: "en-US",
          },
          audio: {
            content: base64Data,
          },
        };

        // Make HTTP request to the Google Speech-to-Text API using Axios
        axios
          .post(
            `https://speech.googleapis.com/v1/speech:recognize?key=${this.apiKey}`,
            requestBody,
            {
              headers: {
                "Content-Type": "application/json", // Use application/json for JSON request body
              },
            }
          )
          .then((response) => {
            // Handle response from the API
            console.log("Transcription:", response);

            let t = "no transcription yet";
            if (response?.data?.results?.length) {
              t = response.data.results
                .map((result) => result.alternatives[0].transcript)
                .join("\n");
            }

            // Set hint based on transcription
            this.hint = t;
          })
          .catch((error) => {
            // Handle error
            console.error("Error sending audio data:", error);
          });
      };

      // Read audio chunks as data URL
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      reader.readAsDataURL(audioBlob);
    },
  },
};
</script>
  