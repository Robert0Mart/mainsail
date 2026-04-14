<template>
  <panel 
    title="Printing Dashboard" 
    icon="mdi-monitor-dashboard" 
    card-class="blocks-main-panel"
    center-title
  >
    <div class="pa-6"> 
      <v-row align="start">
        
        <v-col cols="12" lg="6" class="pr-lg-6 mb-6 mb-lg-0">
          <div class="media-container w-full">
            <div v-if="isLive && !showThumbnailView" class="webcam-fixed-wrapper shadow-xl">
              <webcam-wrapper 
                :webcam="currentCam" 
                page="dashboard"
                class="inner-rounded h-100"
              />
            </div>

            <v-img
              v-else-if="showThumbnailView"
              :src="thumbnailUrl"
              class="inner-rounded responsive-thumbnail shadow-xl"
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

          <v-row dense class="mt-4">
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
          <v-row dense>
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
            <div v-for="temp in [
              {n:'EXTRUDER', v:extruderTemp, i:'mdi-printer-3d-nozzle', c:'red'},
              {n:'BED', v:bedTemp, i:'mdi-radiator', c:'blue'},
              {n:'CHAMBER', v:'25.0', i:'mdi-thermometer-lines', c:'orange'},
              {n:'MCU', v:'42.1', i:'mdi-chip', c:'green'},
              {n:'HOST', v:'38.5', i:'mdi-raspberry-pi', c:'purple'},
              {n:'EXTRA 1', v:'--', i:'mdi-thermometer-plus', c:'grey'},
              {n:'EXTRA 2', v:'--', i:'mdi-thermometer-plus', c:'grey'}
            ]" :key="temp.n" class="temp-card d-flex align-center px-3"> 
              <v-icon x-small :color="temp.c + ' lighten-1'" class="mr-2">{{ temp.i }}</v-icon>
              <span class="text-caption grey--text font-weight-bold mr-auto">{{ temp.n }}</span>
              <span class="text-body-2 white--text font-weight-bold">{{ temp.v }}°C</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </panel>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import AfcMixin from '@/components/mixins/afc'
import WebcamMixin from '@/components/mixins/webcam'
import MiscellaneousSlider from '@/components/inputs/MiscellaneousSlider.vue'
import MiscellaneousMixin from '@/components/mixins/miscellaneous'
import WebcamWrapper from "@/components/webcams/WebcamWrapper.vue";

@Component({ 
  components: { 
    WebcamWrapper, 
    MiscellaneousSlider
  } 
})
export default class OurDashboardPanel extends Mixins(BaseMixin, AfcMixin, WebcamMixin, MiscellaneousMixin) {
  readonly perimeter = 112 * 4 
  isLive = true
  showThumbnailView = false

  get webcams() { return this.$store.getters['gui/webcams/getWebcams'] }
  get currentCam() {
    const cams = this.webcams;
    return (cams && cams.length > 0) ? cams[0] : { service: 'mjpeg', stream_url: '' };
  }
  get thumbnailUrl() { return this.$store.getters['files/getFileThumbnail'] || '' }
  get printer() { return this.$store.state.printer }
  get isPrinting() { return this.$store.getters['printer/getIsPrinting'] }
  get isPaused() { return this.$store.getters['printer/getIsPaused'] }

  get dynamicStartText() { return this.isPrinting ? 'PAUSE' : (this.isPaused ? 'RESUME' : 'START'); }
  get dynamicStartIcon() { return this.isPrinting ? 'mdi-pause' : (this.isPaused ? 'mdi-play-pause' : 'mdi-play'); }
  get dynamicStartColor() { return this.isPrinting ? 'amber darken-2' : (this.isPaused ? 'success darken-1' : 'success'); }

  dynamicStartAction() {
    if (this.isPrinting) return this.$socket.emit('printer.print.pause')
    if (this.isPaused) return this.$socket.emit('printer.print.resume')
    return this.$socket.emit('printer.print.start')
  }

  toggleInternalView() { this.showThumbnailView = !this.showThumbnailView; }

  get miscellaneous() {
    return (this.$store.getters['printer/getMiscellaneous'] ?? []).filter((f: any) => f && f.name && !f.name.toLowerCase().includes('hotend'))
  }

  get displayProgress() {
    if (!this.klipperReadyForGui) return 0;
    const progress = this.printer.display_status?.progress || this.printer.virtual_sdcard?.progress || 0;
    return Math.floor(progress * 100);
  }

  get edgeStyle() {
    return { 
      strokeDasharray: this.perimeter, 
      strokeDashoffset: this.perimeter - (this.perimeter * (this.displayProgress / 100)), 
      stroke: 'var(--v-primary-base)' 
    }
  }

  get mainStats() {
    return [
      { label: 'Speed', value: this.realSpeed, unit: 'mm/s' },
      { label: 'Flow', value: this.realFlow, unit: 'mm³/s' },
      { label: 'Layer', value: `${this.current_layer} / ${this.max_layers}`, unit: '' },
      { label: 'ETA', value: this.etaTime, unit: '' }
    ]
  }

  get current_layer() { return this.$store.getters['printer/getPrintCurrentLayer'] || 0; }
  get max_layers() { return this.$store.getters['printer/getPrintMaxLayers'] || 0; }
  
  get realSpeed() {
    const live = this.printer.motion_report?.live_velocity
    return live != null ? live.toFixed(0) : '0';
  }

  get realFlow() {
    const section = Math.pow(1.75 / 2, 2) * Math.PI
    return (section * (this.printer.motion_report?.live_extruder_velocity || 0)).toFixed(1);
  }

  get etaTime() { return this.$store.getters['printer/getEstimatedTimeETAFormat'] || '--:--' }
  get extruderTemp() { return (this.printer.extruder?.temperature || 0).toFixed(1) }
  get bedTemp() { return (this.printer.heater_bed?.temperature || 0).toFixed(1) }
}
</script>

<style scoped>
/* =========================================================================
   DYNAMIC ROUNDNESS
   Hooks into --panel-radius from Panel.vue and scales down slightly to fit inside!
   ========================================================================= */
.inner-rounded,
.webcam-fixed-wrapper,
.responsive-thumbnail,
.stat-card,
.temp-card,
.fans-vertical-wrapper,
.buttons {
  border-radius: calc(var(--panel-radius) - 4px) !important;
}

/* =========================================================================
   STAT & TEMP CARDS (Hooks into --panel-inner-bg from Panel.vue)
   ========================================================================= */
/* Inside OurDashboardPanel.vue */
.stat-card, .temp-card, .fans-vertical-wrapper {
    background: var(--master-inner-bg, rgba(255,255,255,0.05)) !important;
    border-radius: calc(var(--master-radius, 15px) - 6px) !important;
}

.stat-card { padding: 12px 8px; text-align: center; }
.temp-card { width: 100%; padding: 10px 16px; min-height: 48px; display: flex; }
.fans-vertical-wrapper { padding: 16px; }

/* Fan nested items get slightly darker relative to the inner bg */
.fan-card-compact {
  background: rgba(0, 0, 0, 0.15); 
  border-radius: calc(var(--panel-radius) - 6px);
  padding: 2px 10px;
}

/* =========================================================================
   MEDIA CONTAINERS
   ========================================================================= */
.webcam-fixed-wrapper {
  width: 100%; aspect-ratio: 16 / 9; max-height: 400px; 
  background: #000; overflow: hidden; position: relative;
}
.responsive-thumbnail { width: 100%; aspect-ratio: 16 / 9; max-height: 400px; }
.media-container { position: relative; width: 100%; display: block; }
.h-100 { height: 100% !important; }

/* =========================================================================
   PROGRESS OVERLAY & SVG
   ========================================================================= */
.overlay-progress-wrapper {
  position: absolute; top: 15px; right: 15px; width: 90px; height: 90px;
  background: rgba(15, 15, 20, 0.75); backdrop-filter: blur(12px); 
  border-radius: calc(var(--panel-radius) - 2px);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--panel-inner-border); z-index: 10;
}

.square-svg { position: absolute; width: 100%; height: 100%; transform: rotate(-90deg); }
.border-ghost { fill: none; stroke: var(--panel-svg-track); stroke-width: 6; }
.border-active { fill: none; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 0.8s ease; }

/* =========================================================================
   INTERNAL BUTTONS
   ========================================================================= */
.internal-toggle-wrapper { position: absolute; bottom: 15px; left: 15px; z-index: 11; }

.internal-orange-btn {
  height: 40px !important;
  border-radius: calc(var(--panel-radius) - 6px) !important;
  letter-spacing: 1px; border: 1px solid var(--panel-inner-border);
}

.buttons { 
  letter-spacing: 1px; text-transform: uppercase; 
  border: 1px solid var(--panel-inner-border); 
}
.big-btn { height: 56px !important; font-size: 1.1rem !important; }

/* =========================================================================
   UTILITIES
   ========================================================================= */
.white--text { color: var(--panel-text-main) !important; }
</style>