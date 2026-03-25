<template>
  <nav class="bottom-navbar">
    <ul class="nav-list">
      <router-link to="/" class="nav-link"><v-icon>mdi-view-dashboard</v-icon></router-link></li>
      <router-link to="/console" class="nav-link"><v-icon>mdi-console</v-icon></router-link></li>
      <router-link to="/heightmap" class="nav-link"><v-icon>mdi-map</v-icon></router-link></li>
      <router-link to="/files" class="nav-link"><v-icon>mdi-file-document</v-icon></router-link></li>
      <router-link to="/viewer" class="nav-link"><v-icon>mdi-eye</v-icon></router-link></li>
      <router-link to="/history" class="nav-link"><v-icon>mdi-history</v-icon></router-link></li>
      <router-link to="/config" class="nav-link"><v-icon>mdi-cog</v-icon></router-link></li>
    </ul>
  </nav>
</template>

<script>
import '@mdi/font/css/materialdesignicons.css'

export default {
  name: 'BottomNavbar'
}
import '@mdi/font/css/materialdesignicons.css'
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
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.v-icon {
  font-size: 24px !important;
}
</style>
