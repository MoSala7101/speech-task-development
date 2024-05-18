<template>
  <div id="app">
    <NavbarContainer @json-clicked="exportMessages" />
    <main class="container">
      <MessagesList
        :messages="messages"
        :showHint="!messages.length && !isFullScreen"
      />
      <SpeechControlContainer
        :showInitialMessageOnFullScreen="!messages.length"
        :isFullScreen="isFullScreen"
        @update-messages="updateMessages"
        @minimize-mic="minimizeMic"
        @maximize-mic="maximizeMic"
      />
    </main>
  </div>
</template>

<script>
import NavbarContainer from "@/components/Navbar/Container";
import MessagesList from "@/components/Main/MessagesList";
import SpeechControlContainer from "@/components/Main/SpeechControlContainer";

export default {
  name: "App",
  components: {
    NavbarContainer,
    MessagesList,
    SpeechControlContainer,
  },
  data() {
    return {
      messages: [],
      isFullScreen: true,
    };
  },
  methods: {
    updateMessages(messages) {
      this.messages = [...messages];
    },
    minimizeMic() {
      this.isFullScreen = false;
    },
    maximizeMic() {
      this.isFullScreen = true;
    },
    exportMessages() {
      try {
        if (!this.messages.length) return;

        let messagesObject = Object.assign(
          {},
          [...this.messages].map((m) => m.text)
        );

        const filename = "speech_messages.json";
        const content = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(messagesObject)
        )}`;
        const link = document.createElement("a");

        link.style.display = "none";
        link.setAttribute("target", "_blank");
        link.setAttribute("href", content);
        link.setAttribute("download", filename);

        document.body.appendChild(link);
        link.click(); // Programmatically click the link to trigger the download
        document.body.removeChild(link); // Remove the link from the document
      } catch (error) {
        console.log("exportMessages: ", this.messages);
      }
    },
  },
};
</script>

<style>
:root {
  --chat-input-height: 100px;
  --border-color: #333;
  --primary-color: #222;
}

/* resetting */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  overflow-x: hidden;
  font-family: Verdana, sans-serif;
}
/* Change scrollbar apperance */
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  background-color: #444;
  outline: 1px solid #555;
  border-radius: 10px;
}

#app {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--primary-color);
  color: #f9f9f9;
  height: 100dvh;
  overflow: hidden;
}

.container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

