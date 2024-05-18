<template>
  <div class="messages-list" v-if="messages.length">
    <MessageItem
      v-for="message in messages"
      :key="message.timestamp"
      :message="message"
    />
  </div>
  <div class="messages-list hint-container" v-else>
    <p v-show="showHint" class="hint">Hello! How can I help you ?</p>
  </div>
</template>
  
<script>
import MessageItem from "./MessageItem";
export default {
  name: "NavbarContainer",
  components: {
    MessageItem,
  },
  props: ["messages","showHint"],
};
</script>

<style>
.messages-list {
  width: 100%;
  height: calc(100% - var(--chat-input-height));
  overflow-y: auto;
  position: relative;
  padding: 0 10px;
  border-bottom: 1px solid var(--border-color);
}

.hint-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: red; */
}

.hint {
  font-size: 50px;
  color: #444;
  text-align: center;
}
</style>
