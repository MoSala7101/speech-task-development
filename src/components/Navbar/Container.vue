<template>
  <div class="navbar-container">
    <NavbarLogo />
    <button class="json-btn" 
    :disabled="!isCanExportSpeech"
    @click="JSONClicked">Export JSON</button>
  </div>
</template>

<script>
import NavbarLogo from "./Logo";
export default {
  name: "NavbarContainer",
  components: {
    NavbarLogo,
  },
  props: ['isCanExportSpeech'],
  methods: {
    JSONClicked() {
      this.$emit("json-clicked");
    },
  },
};
</script>

<style>
.navbar-container {
  background: var(--primary-color);
  width: 100%;
  display: flex;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.json-btn{
  padding: 10px 20px;
  background: green;
  border: none;
  border-radius: 5px;
  color: #f0f0f0;
  cursor: pointer;
}

.json-btn:disabled,
.json-btn[disabled]{
  border: 1px solid #888;
  background-color: #444;
  color: #ccc;
  cursor: default;
}
</style>