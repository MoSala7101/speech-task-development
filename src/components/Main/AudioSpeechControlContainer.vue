<template>
  <div>
    <button @click="startRecording">Start Recording</button>
    <button @click="stopRecording">Stop Recording</button>
    <br />
    <span v-if="recordedAudio">Recording: {{ recordedAudio.name }}</span>
  </div>
</template>

<script>
import { getAudioTranscription } from "@/utils/GoogleAPIClient";
import { convertBlobToWav, blobToBase64 } from "@/utils/AudioEnconding";

export default {
  data() {
    return {
      recorder: null,
      recordedAudio: null,
      audioContext: null,
      stream: null,
      source: null,
    };
  },
  methods: {
    async startRecording() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        this.audioContext = new AudioContext();
        this.source = this.audioContext.createMediaStreamSource(this.stream);
        console.log(" this.source : ", this.source);

        this.recorder = new MediaRecorder(this.stream, {
          mimeType: "audio/webm",
        });

        const chunks = [];
        this.recorder.ondataavailable = (e) => chunks.push(e.data);
        this.recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const wavBlob = await convertBlobToWav(this.audioContext, blob);
          await blobToBase64(wavBlob).then((base64Data) => {
            getAudioTranscription(base64Data).then((transcription) => {
              console.log(transcription);
            });
          });
        };

        this.recorder.start();
      } catch (error) {
        console.error("Error capturing audio:", error);
      }
    },

    
    async stopRecording() {
      if (this.recorder) {
        await this.recorder.stop();
      }
    },
  },
};
</script>

<style scoped>
button {
  margin: 10px;
}
</style>
