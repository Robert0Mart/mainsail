<template>
  <panel 
    title="Printing Dashboard" 
    icon="mdi-monitor-dashboard" 
    card-class="blocks-main-panel"
    center-title
  >
    <div class="pa-6"> 
      <v-row align="start">
        
        <v-col cols="12" lg="6" xl="5" class="pr-lg-6 mb-6 mb-lg-0 d-flex flex-column">
          
          <div class="clean-tabs-wrapper d-flex mb-4">
            <v-btn 
              class="tab-btn flex-grow-1" 
              :class="!showThumbnailView ? 'active-tab' : 'inactive-tab'" 
              depressed 
              @click="showThumbnailView = false"
            >
              <v-icon small left>mdi-camera</v-icon> CAM
            </v-btn>
            <v-btn 
              class="tab-btn flex-grow-1" 
              :class="showThumbnailView ? 'active-tab' : 'inactive-tab'" 
              depressed 
              @click="showThumbnailView = true"
            >
              <v-icon small left>mdi-printer-3d</v-icon> 3D
            </v-btn>
          </div>

          <div class="media-container shadow-xl mb-4">
            
            <div v-if="!showThumbnailView" class="h-100 w-100">
              <webcam-wrapper v-if="isLive" :webcam="currentCam" page="dashboard" class="h-100 w-100" />
            </div>

            <div v-else class="h-100 w-100">
              
              <div v-if="isStandby" class="standby-wrapper d-flex flex-column h-100 w-100">
                <div class="standby-header d-flex align-center pa-3">
                  <v-icon small color="white" class="mr-2">mdi-information-outline</v-icon>
                  <span class="white--text font-weight-bold text-caption letter-space">STANDBY</span>
                </div>

                <div class="file-list-container px-2 pb-2 flex-grow-1">
                  <div v-for="(file, index) in recentFiles" :key="index" class="file-list-item d-flex align-center pa-3 mb-2">
                    <v-icon large color="primary darken-1" class="mr-4">mdi-cube-scan</v-icon>
                    <div class="flex-grow-1 overflow-hidden">
                      <div class="white--text font-weight-bold text-body-2 text-truncate">{{ file.filename }}</div>
                      <div class="grey--text text-caption text-truncate">
                        Filament: {{ file.filament }} | Print Time: {{ file.time }}
                      </div>
                    </div>
                    <v-icon small color="warning" class="ml-2">mdi-alert-outline</v-icon>
                  </div>
                </div>
              </div>

              <div v-else class="thumbnail-wrapper h-100 w-100 relative">
                <v-img
                  v-if="thumbnailUrl"
                  :src="thumbnailUrl"
                  class="h-100 w-100"
                  contain
                />
                <div v-else class="no-thumb-bg d-flex flex-column align-center justify-center h-100 w-100">
                  <v-icon size="64" color="rgba(255,255,255,0.1)">mdi-cube-scan</v-icon>
                  <span class="mt-3 grey--text font-weight-bold text-caption">NO THUMBNAIL</span>
                </div>

                <div class="overlay-progress-wrapper">
                  <svg viewBox="0 0 120 120" class="square-svg">
                    <rect x="4" y="4" width="112" height="112" rx="10" class="border-ghost" />
                    <rect x="4" y="4" width="112" height="112" rx="10" class="border-active" :style="edgeStyle" />
                  </svg>
                  <div class="overlay-content">
                    <span class="text-h5 font-weight-black white--text">{{ displayProgress }}%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="file-info-panel pa-4 mb-4">
            <v-row dense>
              <v-col cols="6" class="mb-2">
                <span class="info-label">ESTIMATE</span>
                <div class="info-value white--text font-weight-bold">{{ printEstimate }}</div>
              </v-col>
              <v-col cols="6" class="mb-2">
                <span class="info-label">SLICER</span>
                <div class="info-value white--text font-weight-bold">{{ slicerName }}</div>
              </v-col>
              <v-col cols="6">
                <span class="info-label">TOTAL</span>
                <div class="info-value white--text font-weight-bold">{{ totalTime }}</div>
              </v-col>
              <v-col cols="6">
                <span class="info-label">ETA</span>
                <div class="info-value white--text font-weight-bold">{{ etaTime }}</div>
              </v-col>
            </v-row>
          </div>

          <v-row dense>
            <v-col cols="6">
              <v-btn block :color="dynamicStartColor" class="buttons big-btn font-weight-black" depressed @click="dynamicStartAction">
                <v-icon left>{{ dynamicStartIcon }}</v-icon> {{ dynamicStartText }}
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn block color="error" class="buttons big-btn font-weight-black" depressed @click="() => {}">
                <v-icon left>mdi-stop</v-icon> STOP PRINT
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="6" lg="3" xl="4" class="px-lg-4 mb-6 mb-md-0 d-flex flex-column">
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

        <v-col cols="12" md="6" lg="3" xl="3" class="pl-lg-6 d-flex flex-column">
          <div class="d-flex flex-column" style="gap: 12px;"> 
            <div v-for="temp in [
              {n:'EXTRUDER', v:extruderTemp, i:'mdi-printer-3d-nozzle', c:'red'},
              {n:'BED', v:bedTemp, i:'mdi-radiator', c:'blue'},
              {n:'CHAMBER', v:'25.0', i:'mdi-thermometer-lines', c:'orange'},
              {n:'MCU', v:'42.1', i:'mdi-chip', c:'green'},
              {n:'HOST', v:'38.5', i:'mdi-raspberry-pi', c:'purple'},
              {n:'EXTRA 1', v:'--', i:'mdi-thermometer-plus', c:'grey'},
              {n:'EXTRA 2', v:'--', i:'mdi-thermometer-plus', c:'grey'}
            ]" :key="temp.n" class="temp-card d-flex align-center px-4"> 
              <v-icon x-small :color="temp.c + ' lighten-1'" class="mr-3">{{ temp.i }}</v-icon>
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
  get printer() { return this.$store.state.printer || {} }
  get isPrinting() { return this.$store.getters['printer/getIsPrinting'] || false }
  get isPaused() { return this.$store.getters['printer/getIsPaused'] || false }
  
  get isStandby() { return !this.isPrinting && !this.isPaused; }

  get dynamicStartText() { return this.isPrinting ? 'PAUSE' : (this.isPaused ? 'RESUME' : 'START PRINT'); }
  get dynamicStartIcon() { return this.isPrinting ? 'mdi-pause' : (this.isPaused ? 'mdi-play-pause' : 'mdi-play'); }
  get dynamicStartColor() { return this.isPrinting ? 'amber darken-2' : (this.isPaused ? 'success darken-1' : 'success'); }

  dynamicStartAction() {
    if (this.isPrinting) return this.$socket.emit('printer.print.pause')
    if (this.isPaused) return this.$socket.emit('printer.print.resume')
    return this.$socket.emit('printer.print.start')
  }

  get printEstimate() {
    if(this.isStandby) return '--:--';
    return this.$store.getters['printer/getEstimatedTimeFormat'] || '--:--';
  }

  get slicerName() {
    if(this.isStandby) return '--';
    if (this.printer && this.printer.print_stats && this.printer.print_stats.info && this.printer.print_stats.info.slicer) {
      return this.printer.print_stats.info.slicer;
    }
    return 'PrusaSlicer';
  }

  get totalTime() {
    if(this.isStandby) return '--h --m';
    return this.$store.getters['printer/getTotalTimeFormat'] || '--h --m';
  }

  get etaTime() {
    if(this.isStandby) return '--:--';
    return this.$store.getters['printer/getEstimatedTimeETAFormat'] || '--:--';
  }

  get miscellaneous() {
    return (this.$store.getters['printer/getMiscellaneous'] ?? []).filter((f: any) => f && f.name && !f.name.toLowerCase().includes('hotend'))
  }

  get displayProgress() {
    if (!this.klipperReadyForGui || this.isStandby) return 0;
    let progress = 0;
    if (this.printer && this.printer.display_status && this.printer.display_status.progress) {
      progress = this.printer.display_status.progress;
    } else if (this.printer && this.printer.virtual_sdcard && this.printer.virtual_sdcard.progress) {
      progress = this.printer.virtual_sdcard.progress;
    }
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
      { label: 'Layer', value: `${this.current_layer} / ${this.max_layers}`, unit: '' }
    ]
  }

  get current_layer() { 
    if(this.isStandby) return 0;
    return this.$store.getters['printer/getPrintCurrentLayer'] || 0; 
  }
  get max_layers() { 
    if(this.isStandby) return 0;
    return this.$store.getters['printer/getPrintMaxLayers'] || 0; 
  }
  
  get realSpeed() {
    if (this.printer && this.printer.motion_report && this.printer.motion_report.live_velocity != null) {
      return this.printer.motion_report.live_velocity.toFixed(0);
    }
    return '0';
  }

  get realFlow() {
    const section = Math.pow(1.75 / 2, 2) * Math.PI;
    let vel = 0;
    if (this.printer && this.printer.motion_report && this.printer.motion_report.live_extruder_velocity) {
      vel = this.printer.motion_report.live_extruder_velocity;
    }
    return (section * vel).toFixed(1);
  }

  get extruderTemp() {
    if (this.printer && this.printer.extruder && this.printer.extruder.temperature) {
      return this.printer.extruder.temperature.toFixed(1);
    }
    return '0.0';
  }

  get bedTemp() {
    if (this.printer && this.printer.heater_bed && this.printer.heater_bed.temperature) {
      return this.printer.heater_bed.temperature.toFixed(1);
    }
    if (this.printer && this.printer.heaters && this.printer.heaters.bed && this.printer.heaters.bed.temperature) {
      return this.printer.heaters.bed.temperature.toFixed(1);
    }
    return '0.0';
  }

  get recentFiles() {
    try {
      if (this.$store.state.history && this.$store.state.history.jobs && this.$store.state.history.jobs.length > 0) {
        return this.$store.state.history.jobs.slice(0, 4).map((j: any) => ({
          filename: j.filename || 'Unknown File',
          filament: j.filament_used ? (j.filament_used / 1000).toFixed(2) + ' m' : '-- m',
          time: j.print_duration ? (j.print_duration / 60).toFixed(0) + ' m' : '-- m'
        }));
      }
    } catch (e) {}

    return [
      { filename: "3dbenchy_PLA_8h21m.gcode", filament: "17.95 m / 54 g", time: "8h 20m 48s" },
      { filename: "3dbenchy_PLA_8h46m.gcode", filament: "21.25 m / 63 g", time: "8h 46m 28s" },
      { filename: "2M1_PLA_1d11h23m.gcode", filament: "191.16 m / 572 g", time: "1d 11h 22m 39s" },
      { filename: "2M1_PLA_1d6h37m.gcode", filament: "128.68 m / 386 g", time: "1d 6h 36m 30s" }
    ];
  }
}
</script>

<style scoped>
.file-list-item,
.stat-card,
.temp-card,
.fans-vertical-wrapper,
.clean-tabs-wrapper,
.file-info-panel,
.buttons,
.media-container,
.standby-wrapper {
  border-radius: calc(var(--master-radius, 15px) - 6px) !important;
}

.stat-card, .temp-card, .fans-vertical-wrapper, .clean-tabs-wrapper, .file-info-panel, .standby-wrapper {
  background: var(--master-inner-bg, rgba(255,255,255,0.05)) !important;
}

.clean-tabs-wrapper { padding: 4px; border: 1px solid var(--master-inner-border, rgba(255, 255, 255, 0.05)); }

.tab-btn {
  border-radius: calc(var(--master-radius, 15px) - 8px) !important;
  font-weight: 800 !important;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  height: 38px !important;
}

.active-tab { background: rgba(255, 255, 255, 0.1) !important; color: #fff !important; box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important; }
.inactive-tab { background: transparent !important; color: #888 !important; }
.inactive-tab:hover { color: #ccc !important; }

.media-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  overflow: hidden;
  position: relative;
  display: flex;
}

.standby-wrapper { border: 1px solid var(--master-inner-border, rgba(255, 255, 255, 0.05)); overflow: hidden; background: transparent !important; }
.standby-header { background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.05); }
.file-list-container { overflow-y: auto; }

.file-list-item {
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.02);
  transition: background 0.2s;
  border-radius: calc(var(--master-radius, 15px) - 8px) !important;
}
.file-list-item:hover { background: rgba(255,255,255,0.05); cursor: pointer; }

.thumbnail-wrapper { background: #000; }
.no-thumb-bg { background: rgba(0,0,0,0.5); border: 1px dashed rgba(255,255,255,0.1); }

.overlay-progress-wrapper {
  position: absolute; top: 15px; right: 15px; width: 80px; height: 80px;
  background: rgba(15, 15, 20, 0.75); backdrop-filter: blur(12px); 
  border-radius: calc(var(--master-radius, 15px) - 6px);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--panel-inner-border); z-index: 10;
}

.square-svg { position: absolute; width: 100%; height: 100%; transform: rotate(-90deg); }
.border-ghost { fill: none; stroke: var(--panel-svg-track, rgba(255,255,255,0.1)); stroke-width: 6; }
.border-active { fill: none; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 0.8s ease; }

.file-info-panel { border: 1px solid var(--master-inner-border, rgba(255, 255, 255, 0.05)); }
.info-label { font-size: 0.65rem; color: #888; text-transform: uppercase; display: block; font-weight: bold; letter-spacing: 0.5px; }
.info-value { font-size: 1rem; }

.stat-card { padding: 12px 8px; text-align: center; }
.temp-card { width: 100%; padding: 12px 16px; min-height: 52px; display: flex; }
.fans-vertical-wrapper { padding: 16px; }

.fan-card-compact { background: rgba(0, 0, 0, 0.15); border-radius: calc(var(--master-radius, 15px) - 8px); padding: 2px 10px; }

.buttons { letter-spacing: 1px; text-transform: uppercase; border: 1px solid var(--master-inner-border, rgba(255,255,255,0.1)); }
.big-btn { height: 56px !important; font-size: 1.1rem !important; }
.white--text { color: var(--panel-text-main, #fff) !important; }
.letter-space { letter-spacing: 2px; }
.w-100 { width: 100% !important; }
.h-100 { height: 100% !important; }
.relative { position: relative; }
</style>