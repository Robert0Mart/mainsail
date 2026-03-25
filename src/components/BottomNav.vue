<template>
  <nav class="bottom-navbar">
    <ul class="nav-list">
      <li>
        <router-link to="/" class="nav-link" data-tooltip="Dashboard">
          <v-icon>mdi-view-dashboard</v-icon>
          <span class="tooltip-label">Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/console" class="nav-link" data-tooltip="Console">
          <v-icon>mdi-console</v-icon>
          <span class="tooltip-label">Console</span>
        </router-link>
      </li>
      <li>
        <router-link to="/heightmap" class="nav-link" data-tooltip="Heightmap">
          <v-icon>mdi-map</v-icon>
          <span class="tooltip-label">Heightmap</span>
        </router-link>
      </li>
      <li>
        <router-link to="/files" class="nav-link" data-tooltip="Files">
          <v-icon>mdi-file-document</v-icon>
          <span class="tooltip-label">Files</span>
        </router-link>
      </li>
      <li>
        <router-link to="/viewer" class="nav-link" data-tooltip="Viewer">
          <v-icon>mdi-eye</v-icon>
          <span class="tooltip-label">Viewer</span>
        </router-link>
      </li>
      <li>
        <router-link to="/history" class="nav-link" data-tooltip="History">
          <v-icon>mdi-history</v-icon>
          <span class="tooltip-label">History</span>
        </router-link>
      </li>
      <li>
        <router-link to="/config" class="nav-link" data-tooltip="Config">
          <v-icon>mdi-cog</v-icon>
          <span class="tooltip-label">Config</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import '@mdi/font/css/materialdesignicons.css'
export default {
  name: 'BottomNavbar'
}
</script>

<style scoped>
.bottom-navbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(165deg, #667eea -25%, #000000 100%);
  border-radius: 50px;
  padding: 12px 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 12px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.15) translateY(-4px);
  height: 72px;  /* Cresce para mostrar label */
  border-radius: 24px;
}

.v-icon {
  font-size: 24px;
  transition: transform 0.3s ease;
}

.nav-link:hover .v-icon {
  transform: scale(1.2);
}

.tooltip-label {
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
}

.nav-link:hover .tooltip-label {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
  bottom: -28px;
}

/* Seta opcional */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(0, 0, 0, 0.9);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-link:hover::after {
  opacity: 1;
}
</style>
