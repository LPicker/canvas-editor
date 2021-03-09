<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <SiderBar />
  <MainCanvas />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SiderBar from "./components/SiderBar.vue";
import MainCanvas from "./components/MainCanvas.vue";

export default defineComponent({
  name: "App",
  components: {
    SiderBar,
    MainCanvas,
  },
});
</script>

<style>
body {
  margin: 0;
}
#app {
  display: flex;
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>