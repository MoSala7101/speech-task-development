<template>
  <div>
    <button @click="startRecording">Start Recording</button>
    <button @click="stopRecording">Stop Recording</button>
    <div v-if="transcription">{{ transcription }}</div>
    <h1 style="color: #fff">{{ recordState }}</h1>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      recognitionActive: false,
      audioChunks: [],
      transcription: "",
      recordState: "0",
      API_KEY: "AIzaSyBRqLY7bt6x2U4ADcZhE-HvNsVEKghbO9U",
    };
  },
  mounted() {
    setTimeout(() => {
        this.startRecording()
    }, 1000)
  },
  methods: {
    async startRecording() {
      this.recognitionActive = true;
      this.audioChunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        console.log(event);
        this.recordState = "Data Available";
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      });

      mediaRecorder.addEventListener("stop", async () => {
        this.recordState = "Recording Stop";
        const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
          const response = await fetch(
            `https://speech.googleapis.com/v1/speech:recognize?key=${this.API_KEY}`,
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await response.json();
          this.transcription = data.results[0].alternatives[0].transcript;
        } catch (error) {
          console.error("Error transcribing speech:", error);
        }
      });

      mediaRecorder.start();
    },
    stopRecording() {
      this.recognitionActive = false;
      this.audioChunks = [];
      this.transcription = "";
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => stream.getTracks().forEach((track) => track.stop()));
    },
  },
};
</script>
  
  <style scoped>
/* Add your CSS styles here */
</style>
  