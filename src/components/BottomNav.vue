<template>
  <nav class="bottom-navbar">
    <ul class="nav-list">
      <a @click.prevent="scrollTo('section-dashboard')" :class="['nav-link', { active: activeSection === 'section-dashboard' }]" title="Dashboard">
        <v-icon>{{ icons.dashboard }}</v-icon>
      </a>
      <a @click.prevent="scrollTo('section-console')" :class="['nav-link', { active: activeSection === 'section-console' }]" title="Console">
        <v-icon>{{ icons.console }}</v-icon>
      </a>
      <a @click.prevent="scrollTo('section-heightmap')" :class="['nav-link', { active: activeSection === 'section-heightmap' }]" title="Heightmap">
        <v-icon>{{ icons.heightmap }}</v-icon>
      </a>
      <a @click.prevent="scrollTo('section-files')" :class="['nav-link', { active: activeSection === 'section-files' }]" title="Files">
        <v-icon>{{ icons.files }}</v-icon>
      </a>
      <a @click.prevent="scrollTo('section-viewer')" :class="['nav-link', { active: activeSection === 'section-viewer' }]" title="Viewer">
        <v-icon>{{ icons.viewer }}</v-icon>
      </a>
      <a @click.prevent="scrollTo('section-history')" :class="['nav-link', { active: activeSection === 'section-history' }]" title="History">
        <v-icon>{{ icons.history }}</v-icon>
      </a>
      <a @click.prevent="scrollTo('section-machine')" :class="['nav-link', { active: activeSection === 'section-machine' }]" title="Machine">
        <v-icon>{{ icons.machine }}</v-icon>
      </a>
    </ul>
  </nav>
</template>

<script>
import {
  mdiViewDashboard, mdiConsoleLine, mdiGrid, 
  mdiFileDocumentOutline, mdiEye, mdiHistory, mdiWrench
} from '@mdi/js'

export default {
  name: 'BottomNavbar',
  data() {
    return {
      activeSection: 'section-dashboard',
      icons: {
        dashboard: mdiViewDashboard,
        console: mdiConsoleLine,
        heightmap: mdiGrid,
        files: mdiFileDocumentOutline,
        viewer: mdiEye,
        history: mdiHistory,
        machine: mdiWrench
      }
    }
  },
  methods: {
    // Scrolls to the target section horizontally
    scrollTo(id) {
      this.activeSection = id;
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  }
}
</script>

<style scoped>
.bottom-navbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  /* Applies the custom purple-to-black gradient */
  background: linear-gradient(165deg, #696969 -25%, #000000 100%);
  border-radius: 50px;
  padding: 12px 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
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
  color: #eeeeff;  /* Cor base mais branca (era #b8b8c8) - ícones herdam isso */
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transform: scale(1.1);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.nav-link .v-icon {
  color: inherit !important;
  font-size: 24px !important;
}
</style>
