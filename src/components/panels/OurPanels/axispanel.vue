<template>
  <panel
    title="New Panel"
    icon="mdi-view-dashboard-outline"
    card-class="our-dashboard-panel"
    :margin-bottom="false"
    center-title
  >
    <div class="pa-6 fill-height">
    </div>
  </panel>
</template>

<style scoped>
::v-deep .our-dashboard-panel { 
  height: 100%; 
  min-height: 60vh;
  background: linear-gradient(145deg, #1c1c22, #141419) !important;
  border: 1px solid rgba(255, 255, 255, 0.04) !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
}

.fill-height { height: 100%; }
</style>