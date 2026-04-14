<template>
  <panel 
    title="Printing Dashboard" 
    icon="mdi-monitor-dashboard" 
    card-class="our-dashboard-panel"
    :margin-bottom="true"
    center-title
  >
    <div class="pa-4 pa-md-8 pt-md-16 fill-height"> 
      <v-row no-gutters class="fill-height">
        
        <v-col cols="12" md="6" class="pr-md-6 d-flex flex-column justify-center mb-6 mb-md-0">
          <div class="media-container w-full">
            <div v-if="isLive" class="webcam-fixed-wrapper shadow-xl">
              <webcam-wrapper 
                :webcam="currentCam" 
                page="dashboard"
                class="rounded-lg overflow-hidden h-100"
              />
            </div>

            <v-img
              v-else
              :src="thumbnailUrl"
              class="rounded-lg border-thumbnail shadow-xl responsive-thumbnail"
              contain
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-icon size="100" color="grey darken-3">mdi-file-image-outline</v-icon>
                </v-row>
              </template>
            </v-img>

            <div class="overlay-progress-wrapper">
              <svg viewBox="0 0 120 120" class="square-svg">
                <rect x="4" y="4" width="112" height="112" rx="10" class="border-ghost" />
                <rect 
                  x="4" y="4" width="112" height="112" rx="10" 
                  class="border-active"
                  :style="edgeStyle"
                />
              </svg>
              <div class="overlay-content">
                <span class="text-h5 font-weight-black white--text">{{ displayProgress }}%</span>
              </div>
            </div>
          </div>

          <v-row dense class="flex-shrink-0 mt-6 px-4 px-md-16">
            <v-col cols="4">
              <v-btn block color="success" class="buttons font-weight-black" depressed @click="() => {}">
                <v-icon small left>mdi-play</v-icon> START
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn block color="error" class="buttons font-weight-black" depressed @click="() => {}">
                <v-icon small left>mdi-stop</v-icon> STOP
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn 
                block 
                :color="isLive ? 'amber darken-2' : 'primary'" 
                class="buttons font-weight-black" 
                depressed 
                @click="isLive = !isLive"
              >
                <v-icon small>{{ isLive ? 'mdi-camera' : 'mdi-camera-switch' }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="3" class="px-md-4 border-sides d-flex flex-column justify-center mb-6 mb-md-0">
          <div class="stats-wrapper px-2 d-flex flex-column" style="gap: 25px;">
            <div v-for="(stat, index) in mainStats" :key="stat.label">
              <div class="d-flex justify-space-between align-center py-2"> 
                <span class="text-caption grey--text text-uppercase font-weight-bold">
                  {{ stat.label }}
                </span>
                <div class="white--text font-weight-bold text-subtitle-1 text-right">
                  {{ stat.value }} 
                  <small class="grey--text font-weight-light ml-1">{{ stat.unit }}</small>
                </div>
              </div>
              <v-divider v-if="index < mainStats.length - 1" class="opacity-10"></v-divider>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="3" class="pl-md-6 d-flex flex-column justify-center">
          <div class="d-flex flex-column" style="gap: 10px;"> 
            <div class="temp-card nozzle-glow d-flex align-center px-3"> 
              <v-icon x-small color="red lighten-1" class="mr-2">mdi-printer-3d-nozzle</v-icon>
              <span class="text-caption grey--text font-weight-bold mr-auto">EXTRUDER</span>
              <span class="text-body-2 white--text font-weight-bold">{{ extruderTemp }}°C</span>
            </div>
            
            <div class="temp-card bed-glow d-flex align-center px-3"> 
              <v-icon x-small color="blue lighten-1" class="mr-2">mdi-radiator</v-icon>
              <span class="text-caption grey--text font-weight-bold mr-auto">BED</span>
              <span class="text-body-2 white--text font-weight-bold">{{ bedTemp }}°C</span>
            </div>

            <div class="temp-card chamber-glow d-flex align-center px-3"> 
              <v-icon x-small color="orange lighten-1" class="mr-2">mdi-thermometer-lines</v-icon>
              <span class="text-caption grey--text font-weight-bold mr-auto">CHAMBER</span>
              <span class="text-body-2 white--text font-weight-bold">25.0°C</span>
            </div>

            <div class="temp-card mcu-glow d-flex align-center px-3"> 
              <v-icon x-small color="green lighten-1" class="mr-2">mdi-chip</v-icon>
              <span class="text-caption grey--text font-weight-bold mr-auto">MCU</span>
              <span class="text-body-2 white--text font-weight-bold">42.1°C</span>
            </div>

            <div class="temp-card host-glow d-flex align-center px-3"> 
              <v-icon x-small color="purple lighten-1" class="mr-2">mdi-raspberry-pi</v-icon>
              <span class="text-caption grey--text font-weight-bold mr-auto">HOST</span>
              <span class="text-body-2 white--text font-weight-bold">38.5°C</span>
            </div>

            <div class="temp-card extra-glow d-flex align-center px-3"> 
              <v-icon x-small color="grey lighten-1" class="mr-2">mdi-thermometer-plus</v-icon>
              <span class="text-caption grey--text font-weight-bold mr-auto">EXTRA 1</span>
              <span class="text-body-2 white--text font-weight-bold">--°C</span>
            </div>

            <div class="temp-card extra-glow d-flex align-center px-3"> 
              <v-icon x-small color="grey lighten-1" class="mr-2">mdi-thermometer-plus</v-icon>
              <span class="text-caption grey--text font-weight-bold mr-auto">EXTRA 2</span>
              <span class="text-body-2 white--text font-weight-bold">--°C</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </panel>
</template>

<style scoped>
/* Altura responsiva (não fixa) para os botões não sumirem no portátil */
.our-dashboard-panel { height: 100%; min-height: 60vh; }
.fill-height { height: 100%; }

/* Wrapper da câmara agora ajusta-se automaticamente (aspect-ratio) */
.webcam-fixed-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 400px; 
  background: black;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}
.h-100 { height: 100% !important; }

.responsive-thumbnail {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 400px;
}

.square-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.border-ghost {
  fill: none;
  stroke: rgba(255, 255, 255, 0.05);
  stroke-width: 6;
}
.border-active {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.temp-card {
  width: 100%;
  padding: 6px 12px; 
  min-height: 42px; 
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  display: flex;
}

.nozzle-glow:hover { border-color: rgba(244, 67, 54, 0.5); background: rgba(244, 67, 54, 0.1); }
.bed-glow:hover { border-color: rgba(33, 150, 243, 0.5); background: rgba(33, 150, 243, 0.1); }
.chamber-glow:hover { border-color: rgba(255, 152, 0, 0.5); background: rgba(255, 152, 0, 0.1); }
.mcu-glow:hover { border-color: rgba(76, 175, 80, 0.5); background: rgba(76, 175, 80, 0.1); }
.host-glow:hover { border-color: rgba(156, 39, 176, 0.5); background: rgba(156, 39, 176, 0.1); }
.extra-glow:hover { border-color: rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.05); }

.mr-auto { margin-right: auto !important; }
.border-thumbnail {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0,0,0,0.2);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.media-container {
  position: relative;
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  display: block; 
}

.overlay-progress-wrapper {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 100px; 
  height: 100px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.overlay-content {
  position: relative;
  z-index: 11;
  text-align: center;
}

.white--text { color: #ffffff !important; }
.opacity-10 { opacity: 0.1; }
.text-right { text-align: right; }
.w-full { width: 100%; }

.buttons {
  height: 48px !important;
  border-radius: 10px !important;
  letter-spacing: 1px;
  font-size: 0.85rem !important;
  text-transform: uppercase;
}
</style>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Panel from '@/components/ui/Panel.vue'
import BaseMixin from '@/components/mixins/base'
import AfcMixin from '@/components/mixins/afc'
import WebcamMixin from '@/components/mixins/webcam'

import WebcamWrapper from "@/components/webcams/WebcamWrapper.vue";
@Component({ 
  components: { 
    Panel,
    WebcamWrapper 
  } 
})
export default class OurDashboardPanel extends Mixins(BaseMixin, AfcMixin, WebcamMixin) {
  readonly perimeter = 112 * 4 
  isLive = true

  get webcams() {
    return this.$store.getters['gui/webcams/getWebcams']
  }

  get currentCam() {
    const cams = this.webcams;
    if (cams && cams.length > 0) return cams[0];
    return { service: 'mjpeg', stream_url: '' };
  }

  get thumbnailUrl() {
    return this.$store.getters['files/getFileThumbnail'] || ''
  }

  get printer() { return this.$store.state.printer }

  get displayProgress() {
    if (!this.klipperReadyForGui) return 0;
    const realPhysicalProgress = this.printer.display_status?.progress || 0;
    const fileReadProgress = this.printer.virtual_sdcard?.progress || 0;
    const actualProgress = realPhysicalProgress > 0 ? realPhysicalProgress : fileReadProgress;
    return Math.floor(actualProgress * 100);
  }

  get edgeStyle() {
    const offset = this.perimeter - (this.perimeter * (this.displayProgress / 100))
    return {
      strokeDasharray: this.perimeter,
      strokeDashoffset: offset,
      stroke: 'var(--v-primary-base)'
    }
  }

  get mainStats() {
    return [
      { label: this.$t('Panels.StatusPanel.Speed'), value: this.realSpeed, unit: 'mm/s' },
      { label: this.$t('Panels.StatusPanel.Flow'), value: this.realFlow, unit: 'mm³/s' },
      { label: this.$t('Panels.StatusPanel.Layer'), value: `${this.current_layer} / ${this.max_layers}`, unit: '' },
      { label: this.$t('Panels.StatusPanel.ETA'), value: this.etaTime, unit: '' }
    ]
  }

  // --- ARRANJO DAS LAYERS --- //
  get current_layer() { 
    // Procura em todos os cantos possíveis da base de dados
    const storeLayer = this.$store.getters['printer/getPrintCurrentLayer'] || this.$store.getters['printer/getCurrentLayer'];
    const objectLayer = this.printer.print_stats?.info?.current_layer;
    return storeLayer || objectLayer || 0;
  }
  
  get max_layers() { 
    // Procura em todos os cantos possíveis da base de dados
    const storeTotal = this.$store.getters['printer/getPrintMaxLayers'] || this.$store.getters['printer/getTotalLayers'];
    const objectTotal = this.printer.print_stats?.info?.total_layer;
    return storeTotal || objectTotal || 0;
  }

  get realSpeed() {
    const live = this.printer.motion_report?.live_velocity
    if (live != null) return live.toFixed(0)
    const req = this.printer.gcode_move?.speed || 0
    const fac = this.printer.gcode_move?.speed_factor || 1
    return ((req / 60) * fac).toFixed(0)
  }

  get realFlow() {
    const live_ev = this.printer.motion_report?.live_extruder_velocity || 0
    const diameter = this.printer.configfile?.settings?.extruder?.filament_diameter || 1.75
    const section = Math.pow(diameter / 2, 2) * Math.PI
    return (section * live_ev).toFixed(1)
  }

  get etaTime() { return this.$store.getters['printer/getEstimatedTimeETAFormat'] || '--:--' }
  get extruderTemp() { return (this.printer.extruder?.temperature || 0).toFixed(1) }
  get bedTemp() {
    const bed = this.printer.heater_bed || this.printer.heaters?.bed
    return (bed?.temperature || 0).toFixed(1)
  }
}
</script>