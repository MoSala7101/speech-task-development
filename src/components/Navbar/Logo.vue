<template>
  <div class="navbar-logo">
    <div class="logo-container">
      <img class="logo-image" src="@/assets/logo.png" alt="Mohamed Task Logo" />
      <h2 class="logo-title">Speech Task</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppLogo",
};
</script>

<style>
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo-image {
  width: 30px;
  height: 30px;
}
img {
  width: 100%;
  height: 100%;
}
.logo-title {
  margin-left: 10px;
}
</style>

