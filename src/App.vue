<template>
  <div id="app">
    <NavbarContainer />
    <main class="container">
      <!-- <DemoOne /> -->
      <!-- <DemoTwo /> -->
      <!-- <DemoThree /> -->
      <!-- <DemoFour /> -->
      <!-- <DemoFive /> -->
      <!-- <DemoSix /> -->
      <!-- <DemoSeven /> -->
      <MessagesList :messages="messages" />
      <SpeechControlContainer :isFullScreen="!messages.length" />
    </main>
  </div>
</template>

<script>
import NavbarContainer from "@/components/Navbar/Container";
import MessagesList from "@/components/Main/MessagesList";
// import DemoOne from "@/components/Main/Tries/DemoOne";
// import DemoTwo from "@/components/Main/Tries/DemoTwo";
// import DemoThree from "@/components/Main/Tries/DemoThree";
// import DemoFour from "@/components/Main/Tries/DemoFour";
// import DemoFive from "@/components/Main/Tries/DemoFive";
// import DemoSix from "@/components/Main/Tries/DemoSix";
// import DemoSeven from "@/components/Main/Tries/DemoSeven";
import SpeechControlContainer from "@/components/Main/SpeechControlContainer";

export default {
  name: "App",
  components: {
    NavbarContainer,
    MessagesList,
    // DemoOne,
    // DemoTwo,
    // DemoThree,
    // DemoFour,
    // DemoFive,
    // DemoSix,
    // DemoSeven,
    SpeechControlContainer,
  },
  data() {
    return {
      messages: [],
    };
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
  height: 100vh;
  overflow: hidden;
}

.container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
