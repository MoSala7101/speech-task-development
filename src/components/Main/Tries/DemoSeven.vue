<template>
  <div>
    <button @click="startRecording">Start Recording</button>
    <button @click="stopRecording">Stop Recording</button>
    <audio ref="audioPlayer" controls></audio>
    <div v-if="transcription">Transcription: {{ transcription }}</div>
  </div>
</template>
  
  <script>
import axios from "axios";

export default {
  data() {
    return {
      mediaRecorder: null,
      audioChunks: [],
      transcription: "",
      replay: "",
    };
  },
  methods: {
    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.start();
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    },
    stopRecording() {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = this.handleStop;
    },

    async handleStop() {
      const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });

      const formData = new FormData(); // Not needed with Axios
      formData.append("audio", audioBlob); // Not needed with Axios

      try {
        const response = await axios.post(
          "http://localhost:3000/upload",
          
          audioBlob,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const result = await response.data;
        this.transcription = result.transcription;
      } catch (error) {
        console.error(error);
      }
    },

    // async handleStop() {
    //   const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
    //   this.audioChunks = [];

    //   this.$refs.audioPlayer.src = URL.createObjectURL(audioBlob);

    //   // Convert Blob to ArrayBuffer
    //   const arrayBuffer = await audioBlob.arrayBuffer();

    //   // Send the raw audio data as ArrayBuffer
    //   try {
    //     const response = await axios.post(
    //     //   "https://speech.maronx.cloud/upload",
    //       "http://localhost:3000/upload",
    //       arrayBuffer,
    //       {
    //         headers: {
    //           "Content-Type": "application/octet-stream",
    //         },
    //       }
    //     );

    //     const result = response.data;
    //     this.replay = result;
    //     this.transcription = result.transcription;
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // },
  },
};
</script>
  