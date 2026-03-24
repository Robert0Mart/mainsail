<template>
  <div class="dragon-bg-wrapper">
    <img :src="imagePath" class="dragon-img" alt="Background Dragon" />
    <div class="dark-overlay"></div>
  </div>
</template>

<script>

import dragonBg from '../assets/styles/dragon.png'

export default {
  name: "CyberDragon",
  data() {
    return {
      imagePath: dragonBg
    }
  }
}
</script>

<style scoped>
.dragon-bg-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; 
  pointer-events: none; 
  overflow: hidden;
}

.dragon-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; 
}

.dark-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(5, 5, 7, 0.65); 
  z-index: 1; 
}
</style>