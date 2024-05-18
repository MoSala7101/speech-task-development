<template>
  <div class="navbar-container">
    <NavbarLogo />
    <button class="json-btn" @click="JSONClicked">Export JSON</button>
  </div>
</template>

<script>
import NavbarLogo from "./Logo";
export default {
  name: "NavbarContainer",
  components: {
    NavbarLogo,
  },
  methods: {
    JSONClicked() {
      console.log("JSON CLICKED");
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
</style>