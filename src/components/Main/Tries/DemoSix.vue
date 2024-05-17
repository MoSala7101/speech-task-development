<!-- src/components/AudioRecorder.vue -->
<template>
  <div>
    <button @click="startRecording">Start Recording</button>
    <button @click="stopRecording">Stop Recording</button>
    <br />
    <audio ref="audioPlayer" controls></audio>
    <!-- Audio element for playback -->

    <textarea cols="30" rows="10" v-html="replay"></textarea>
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
    },
    stopRecording() {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = this.handleStop;
    },
    async handleStop() {
      const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
      this.audioChunks = [];

      this.$refs.audioPlayer.src = URL.createObjectURL(audioBlob);

      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.wav");

      // fetch("https://speech.maronx.cloud/upload", {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "multipart/form-data",
      //   },
      //   body: formData,
      // }).then(response => {
      //   console.log(response);
      // })

      try {
        const response = await axios.post(
          "http://localhost:3000/upload",
          formData
        );

        const result = response.data;
        this.replay = result;
        this.transcription = result.transcription;
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
};
</script>
    <style scoped>
button {
  width: 100px;
  height: 50px;
  margin: 5px;
}
textarea {
  width: 100%;
  height: 100%;
}
</style>
  