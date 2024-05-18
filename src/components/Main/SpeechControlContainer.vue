<template>
  <div
    class="speech-control-container"
    :class="{ 'full-screen': isFullScreen || isRecording }"
  >
    <p v-if="isFullScreen" class="response ai-response">
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

      <button
        id="closeMic"
        class="close-btn"
        @click="stopAndMinimize"
        v-if="isRecording"
      >
        <CloseIcon fillColor="red" />
      </button>
    </div>

    <!-- <textarea
      v-if="isFullScreen"
      class="response-area"
      name=""
      id=""
      cols="30"
      rows="10"
      v-html="testResponse"
    ></textarea> -->
  </div>
</template>

<script>
import MicIcon from "@/components/Icons/MicIcon";
import StopIcon from "@/components/Icons/StopIcon";
import CloseIcon from "@/components/Icons/CloseIcon";
import { getAudioTranscription } from "@/utils/GoogleAPIClient";

export default {
  props: ["isFullScreen"],
  components: {
    MicIcon,
    StopIcon,
    CloseIcon,
  },

  async mounted() {
    // await this.initRecorder();
  },
  data() {
    return {
      isRecording: false,
      testResponse: "..",
      micFillColor: "#111",
      aiResponse: "Hello! How can I help you?",
      speechResponse: "",
      recognizedText: "",
      mediaRecorder: null,
      audioChunks: [],
      transcriptions: [],
      stream: null,
      // replay: "For Testing Only",
    };
  },

  methods: {
    async initRecorder() {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        console.log("Stopping mediaRecorder");
        this.stream.getTracks().forEach((track) => track.stop());

        // Set media stream to null or undefined
        this.stream = null;

        this.sendDataToSpeechToTextAPI();
      };
    },
    async startRecording() {
      await this.initRecorder();

      await this.mediaRecorder.start();
      this.isRecording = true;
      this.$emit("maximize-mic");
    },
    async stopRecording() {
      if (this.mediaRecorder.state !== "recording") return;

      await this.mediaRecorder.stop();
      this.isRecording = false;
    },

    stopAndMinimize() {
      this.stopRecording();
      this.minimizeMic();
    },

    async sendDataToSpeechToTextAPI() {
      if (this.audioChunks.length === 0) {
        console.error("No audio data to send.");
        return;
      }

      // let base64Data = getAudioBase64(this.audioChunks);
      // Convert audio chunks to a single Blob
      const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" }); // Adjust type based on your audio format
      // Convert audio Blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1]; // Extract base64 data (remove data URI prefix)

        getAudioTranscription(base64Data).then((transcription) => {
          console.log("transcription", transcription);
          if (transcription?.length) {
            this.testResponse = transcription;
            this.transcriptions.push({ text: transcription });
            this.$emit("update-messages", [...this.transcriptions]);
          }
        });
      };

      reader.readAsDataURL(audioBlob); // Read audio Blob as data URL

      // Clear audioChunks for the next recording
      this.audioChunks = [];
    },
    minimizeMic() {
      this.$emit("minimize-mic");
    },
  },

  computed: {
    iconFillColor() {
      return this.isRecording ? "green" : "#222";
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
  transition: all 0.5s ease;
}
.speech-control-container.full-screen {
  height: 100%;
  width: 100%;
  position: absolute;
  bottom: 0;
  top: 0;
  /* background: var(--primary-color); */
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
  width: 50%;
  text-align: center;
  font-size: 30px;
  padding: 10px;
  margin: 0px auto 50px auto;
}
.ai-response {
  min-width: 320px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: rgba(0, 0, 0, 0.5);
}
.speech-response {
  /* margin-bottom: 50px; */
}
.buttons-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin: 10px auto;
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

.close-btn {
  background: #000;
  position: absolute;
  right: -30px;
  bottom: -80px;
  width: 70px;
  height: 70px;
  margin-right: 20px;
  border-radius: 50%;
  border: none;
  padding: 20px;
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
