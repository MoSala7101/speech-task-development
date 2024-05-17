<template>
  <div>
    <button @click="startRecording" :disabled="isRecording">
      Start Recording
    </button>
    <button @click="stopRecording" :disabled="!isRecording">
      Stop Recording
    </button>
    <button @click="sendAudioToServer">Send to Server</button>

    <h1>{{ hint }}</h1>
    <!-- <audio :src="audioBlob" type="audio/webm"></audio> -->
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
      hint: "00",
    };
  },
  methods: {
    startRecording() {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.addEventListener("dataavailable", (event) => {
            this.audioChunks.push(event.data);
          });
          this.mediaRecorder.start();
          this.isRecording = true;

          setTimeout(() => {
            this.stopRecording();
          }, 5000);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
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
            encoding: "LINEAR16",
            // sampleRateHertz: 16000,
            languageCode: "en-US",
          },
          audio: {
            content: base64Data,
          },
        };

        // Make HTTP request to the Google Speech-to-Text API using Axios
        axios
          .post(
            "https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyBRqLY7bt6x2U4ADcZhE-HvNsVEKghbO9U",
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
            if (response?.results?.length) {
              t = response?.results
                ?.map((result) => result.alternatives[0].transcript)
                .join("\n");

              if (t.length) this.hint = t;
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
};
</script>
  