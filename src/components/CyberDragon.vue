<template>
  <div class="custom-theme-container">
    
    <div class="dragon-bg-wrapper">
      <img :src="imagePath" class="dragon-img" alt="Background Dragon" />
      <div class="dark-overlay"></div>
    </div>

    <div class="pro-dock">
      <router-link to="/" class="dock-item">
        <v-icon>mdi-view-dashboard</v-icon>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/console" class="dock-item">
        <v-icon>mdi-console-line</v-icon>
        <span>Console</span>
      </router-link>
      <router-link to="/heightmap" class="dock-item">
        <v-icon>mdi-grid</v-icon>
        <span>Heightmap</span>
      </router-link>
      <router-link to="/gcodefiles" class="dock-item">
        <v-icon>mdi-file-document-outline</v-icon>
        <span>Files</span>
      </router-link>
      <router-link to="/history" class="dock-item">
        <v-icon>mdi-history</v-icon>
        <span>History</span>
      </router-link>
      <router-link to="/machine" class="dock-item">
        <v-icon>mdi-wrench</v-icon>
        <span>Machine</span>
      </router-link>
    </div>

  </div>
</template>

<script>
// Import the background image from the assets folder
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
/* Invisible wrapper to avoid Vue template errors */
.custom-theme-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* --- BACKGROUND IMAGE --- */
/* z-index: -1 pushes the dragon image behind everything */
.dragon-bg-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; 
  pointer-events: none;
}

.dragon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Dark overlay to make the text readable */
.dark-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}

/* --- FLOATING DOCK --- */
/* z-index: 9999 brings the dock to the very front */
.pro-dock {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(20, 20, 25, 0.65);
  backdrop-filter: blur(15px); /* Frosted glass effect */
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  display: flex;
  gap: 12px;
  padding: 10px 20px;
  z-index: 9999; 
  pointer-events: auto; /* Enable clicks on the dock buttons */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
}

/* Default button style (gray) */
.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8a8a9e !important;
  text-decoration: none;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 8px 14px;
  border-radius: 14px;
  transition: all 0.3s ease;
  min-width: 68px;
}

.dock-item .v-icon {
  color: #8a8a9e !important;
  font-size: 24px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

/* Hover effect (turns white) */
.dock-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff !important;
}

.dock-item:hover .v-icon {
  color: #ffffff !important;
}

/* Active page effect (turns white and moves up slightly) */
.dock-item.router-link-exact-active {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff !important;
}

.dock-item.router-link-exact-active .v-icon {
  color: #ffffff !important;
  transform: translateY(-2px);
}
</style>

<style>
/* --- GLOBAL CSS --- */

/* 1. Ataca APENAS a barra principal que tem o nosso alvo, ignorando todas as outras! */
.kill-main-sidebar {
  display: none !important;
}

/* 2. Força o conteúdo principal a ignorar a margem do Vuetify e encostar à esquerda */
#content {
  padding-left: 0 !important;
  padding-bottom: 120px !important; /* Espaço para a doca flutuante */
}

/* 3. Esconde o menu das 3 riscas no topo esquerdo */
.v-app-bar__nav-icon {
  display: none !important;
}
</style>