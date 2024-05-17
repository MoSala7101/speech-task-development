<template>
  <div class="navbar-container">
    <NavbarLogo />
  </div>
</template>

<script>
import NavbarLogo from "./Logo";
export default {
  name: "NavbarContainer",
  components: {
    NavbarLogo,
  },
};
</script>

<style> 
.navbar-container {
  background: var(--primary-color);;
  width: 100%;
  display: flex;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border-color);
}
</style>