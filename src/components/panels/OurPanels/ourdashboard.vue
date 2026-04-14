<template>
  <panel 
    title="Printing Dashboard" 
    icon="mdi-monitor-dashboard" 
    card-class="our-dashboard-panel"
    :margin-bottom="true"
    center-title
  >
    <div class="pa-6 fill-height"> 
      <v-row class="fill-height" align="start">
        
        <v-col cols="12" lg="6" class="pr-lg-6 mb-6 mb-lg-0">
          <div class="media-container w-full">
            <div v-if="isLive && !showThumbnailView" class="webcam-fixed-wrapper shadow-xl">
              <webcam-wrapper 
                :webcam="currentCam" 
                page="dashboard"
                class="rounded-lg overflow-hidden h-100"
              />
            </div>

            <v-img
              v-else-if="showThumbnailView"
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

            <div class="internal-toggle-wrapper">
              <v-btn 
                color="amber darken-2" 
                class="internal-orange-btn font-weight-black" 
                depressed 
                @click="toggleInternalView"
              >
                <v-icon small left>{{ showThumbnailView ? 'mdi-camera' : 'mdi-printer-3d' }}</v-icon>
                {{ showThumbnailView ? 'CAM' : '3D' }}
              </v-btn>
            </div>
          </div>

          <v-row dense class="flex-shrink-0 mt-4">
            <v-col cols="6">
              <v-btn block :color="dynamicStartColor" class="buttons big-btn font-weight-black" depressed @click="dynamicStartAction">
                <v-icon left>{{ dynamicStartIcon }}</v-icon> {{ dynamicStartText }}
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn block color="error" class="buttons big-btn font-weight-black" depressed @click="() => {}">
                <v-icon left>mdi-stop</v-icon> STOP
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="6" lg="3" class="px-lg-4 mb-6 mb-md-0 d-flex flex-column">
          <v-row dense class="stats-wrapper">
            <v-col cols="6" v-for="stat in mainStats" :key="stat.label">
              <div class="stat-card">
                <span class="text-caption grey--text text-uppercase font-weight-bold">{{ stat.label }}</span>
                <div class="white--text font-weight-bold text-subtitle-1">
                  {{ stat.value }} 
                  <small class="grey--text font-weight-light">{{ stat.unit }}</small>
                </div>
              </div>
            </v-col>
          </v-row>

          <div v-if="miscellaneous && miscellaneous.length > 0" class="fans-vertical-wrapper mt-4">
            <span class="text-caption grey--text font-weight-bold mb-2 d-block px-2">FANS</span>
            <div class="d-flex flex-column" style="gap: 8px;">
              <div v-for="(object, index) of miscellaneous" :key="index" class="fan-card-compact">
                <miscellaneous-slider
                  :name="object.name"
                  :type="object.type"
                  :target="object.power"
                  :rpm="object.rpm"
                  :controllable="object.controllable"
                  :pwm="object.pwm"
                  :off_below="object.off_below"
                  :max="object.max_power"
                  :multi="parseInt(object.scale)" />
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="3" class="pl-lg-6 d-flex flex-column">
          <div class="d-flex flex-column" style="gap: 30px;"> 
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
::v-deep .our-dashboard-panel { 
  height: 100%; 
  min-height: 60vh;
  background: linear-gradient(145deg, #1c1c22, #141419) !important;
  border: 1px solid rgba(255, 255, 255, 0.04) !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
}

.fill-height { height: 100%; }

.webcam-fixed-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 400px; 
  background: #000;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
}
.h-100 { height: 100% !important; }

.responsive-thumbnail {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 400px;
  border-radius: 10px;
}

.square-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.border-ghost {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 6;
}
.border-active {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.overlay-progress-wrapper {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 90px; 
  height: 90px;
  background: rgba(15, 15, 20, 0.6);
  backdrop-filter: blur(10px); 
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 10;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.overlay-content {
  position: relative;
  z-index: 11;
  text-align: center;
}

.internal-toggle-wrapper {
  position: absolute;
  bottom: 12px;
  left: 12px;
  z-index: 11;
}

.internal-orange-btn {
  height: 38px !important;
  border-radius: 8px !important;
  letter-spacing: 1px;
  font-size: 0.80rem !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stats-wrapper {
  margin-bottom: 0px !important;
}

.stat-card {
  background: rgba(255, 255, 255, 0.025);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 10px 6px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.04);
}

.temp-card {
  width: 100%;
  padding: 8px 14px; 
  min-height: 44px; 
  background: rgba(255, 255, 255, 0.025);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.3s ease;
  display: flex;
}

.fans-vertical-wrapper {
  background: rgba(255, 255, 255, 0.015);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  padding: 12px 14px;
}

.fan-card-compact {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  padding: 0px 8px;
}

.nozzle-glow:hover { border-color: rgba(244, 67, 54, 0.3); background: rgba(244, 67, 54, 0.05); }
.bed-glow:hover { border-color: rgba(33, 150, 243, 0.3); background: rgba(33, 150, 243, 0.05); }
.chamber-glow:hover { border-color: rgba(255, 152, 0, 0.3); background: rgba(255, 152, 0, 0.05); }
.mcu-glow:hover { border-color: rgba(76, 175, 80, 0.3); background: rgba(76, 175, 80, 0.05); }
.host-glow:hover { border-color: rgba(156, 39, 176, 0.3); background: rgba(156, 39, 176, 0.05); }
.extra-glow:hover { border-color: rgba(255, 255, 255, 0.15); background: rgba(255, 255, 255, 0.03); }

.mr-auto { margin-right: auto !important; }
.white--text { color: #f0f0f5 !important; }
.opacity-10 { opacity: 0.05; }
.text-right { text-align: right; }
.w-full { width: 100%; }

.media-container {
  position: relative;
  width: 100%;
  display: block; 
}

.buttons {
  border-radius: 10px !important;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: none !important; 
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.big-btn {
  height: 54px !important;
  font-size: 1rem !important;
}
</style>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Panel from '@/components/ui/Panel.vue'
import BaseMixin from '@/components/mixins/base'
import AfcMixin from '@/components/mixins/afc'
import WebcamMixin from '@/components/mixins/webcam'
import MiscellaneousSlider from '@/components/inputs/MiscellaneousSlider.vue'
import MiscellaneousMixin from '@/components/mixins/miscellaneous'
import WebcamWrapper from "@/components/webcams/WebcamWrapper.vue";

@Component({ 
  components: { 
    Panel,
    WebcamWrapper,
    MiscellaneousSlider
  } 
})
export default class OurDashboardPanel extends Mixins(BaseMixin, AfcMixin, WebcamMixin, MiscellaneousMixin) {
  readonly perimeter = 112 * 4 
  isLive = true
  showThumbnailView = false

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

  get isPrinting() { return this.$store.getters['printer/getIsPrinting'] }
  get isPaused() { return this.$store.getters['printer/getIsPaused'] }

  get dynamicStartText() {
    if (this.isPrinting) return 'PAUSE'
    if (this.isPaused) return 'RESUME'
    return 'START'
  }

  get dynamicStartIcon() {
    if (this.isPrinting) return 'mdi-pause'
    if (this.isPaused) return 'mdi-play-pause'
    return 'mdi-play'
  }

  get dynamicStartColor() {
    if (this.isPrinting) return 'amber darken-2'
    if (this.isPaused) return 'success darken-1'
    return 'success'
  }

  dynamicStartAction() {
    if (this.isPrinting) return this.$socket.emit('printer.print.pause')
    if (this.isPaused) return this.$socket.emit('printer.print.resume')
    return this.$socket.emit('printer.print.start')
  }

  toggleInternalView() {
    this.showThumbnailView = !this.showThumbnailView;
  }

  get miscellaneous() {
    const allFans = this.$store.getters['printer/getMiscellaneous'] ?? []
    return allFans.filter((fan: any) => {
      if (!fan || !fan.name) return true
      return !fan.name.toLowerCase().includes('hotend')
    })
  }

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

  get current_layer() { 
    const storeLayer = this.$store.getters['printer/getPrintCurrentLayer'] || this.$store.getters['printer/getCurrentLayer'];
    const objectLayer = this.printer.print_stats?.info?.current_layer;
    return storeLayer || objectLayer || 0;
  }
  
  get max_layers() { 
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