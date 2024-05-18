<template>
  <div class="message-item" :class="{ 'ai-message': message.sender == 'ai' }">
    <!-- <span class="message-time">{{ message.timestamp }}</span> -->
    <div class="message-text">{{ message.text }}</div>
  </div>
</template>

<script>
export default {
  props: ["message"],
};
</script>

<style>
.message-item {
  width: 100%;
  margin: 5px 0;
  border-radius: 25px;
  padding: 15px 30px 15px 30px;
  background-color: #111;
  color: #f0f0f0;
  width: fit-content;
  margin-left: auto;
  position: relative;
}

.message-item.ai-message {
  margin-left: unset;
  margin-right: auto;
  color: #111;
  background-color: #f0f0f0;
}

.message-time {
  font-size: 10px;
  font-weight: bolder;
  position: absolute;
  top: 5px;
  right: 10px;
}
.message-item.ai-message .message-time {
  right: unset;
  left: 10px;
}
</style>