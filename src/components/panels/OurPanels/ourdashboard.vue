<template>
  <panel 
    title="Printing Dashboard" 
    icon="mdi-monitor-dashboard" 
    card-class="blocks-main-panel"
    center-title
  >
    <div class="pa-6"> 
      <v-row align="stretch">
        
        <v-col cols="12" lg="6" xl="5" class="pr-lg-6 mb-6 mb-lg-0 d-flex flex-column col-left-wrapper">
          
          <div class="clean-tabs-wrapper d-flex mb-4 flex-shrink-0">
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

          <div class="media-container flex-grow-1 mb-4 shadow-xl relative overflow-hidden" ref="mediaBox">
            
            <div class="top-progress-bar-wrapper" v-if="!isStandby">
              <div class="top-progress-fill" :style="{ width: displayProgress + '%' }"></div>
            </div>

            <div v-if="!showThumbnailView" class="h-100 w-100 relative">
              <webcam-wrapper v-if="isLive" :webcam="currentCam" page="dashboard" class="h-100 w-100 inner-rounded" style="background: #000;" />
              <div class="cam-progress-badge d-flex align-center justify-center">
                <span class="white--text font-weight-black">{{ displayProgress }}%</span>
              </div>
            </div>

            <div v-else class="h-100 w-100">

              <div v-if="!isStandby" class="thumbnail-wrapper h-100 w-100 relative inner-rounded">
                <v-img v-if="thumbnailUrl" :src="thumbnailUrl" class="responsive-thumbnail inner-rounded h-100 w-100" contain />
                <div v-else class="no-thumb-bg d-flex flex-column align-center justify-center inner-rounded h-100 w-100">
                  <v-icon size="64" color="white" style="opacity: 0.1">mdi-cube-scan</v-icon>
                  <span class="grey--text text-caption mt-2">PREVIEWING MODEL...</span>
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

              <div v-else class="standby-wrapper d-flex flex-column h-100 w-100 inner-rounded">
                <div class="standby-header d-flex align-center justify-space-between pa-4 flex-shrink-0">
                  <div class="d-flex align-center">
                    <v-icon color="white" class="mr-3">mdi-information</v-icon>
                    <span class="white--text font-weight-regular text-h6">Standby</span>
                  </div>
                  <v-icon color="white">mdi-chevron-down</v-icon>
                </div>

                <div class="standby-mini-tabs d-flex flex-shrink-0 mx-2" style="height: 30px;">
                  <div class="mini-tab flex-grow-1" :class="standbyTab === 0 ? 'active-mini-tab' : ''" @click="standbyTab = 0">
                    <v-icon small :color="standbyTab === 0 ? '#2196f3' : 'white'">mdi-file-document-outline</v-icon>
                  </div>
                  <div class="mini-tab flex-grow-1" :class="standbyTab === 1 ? 'active-mini-tab' : ''" @click="standbyTab = 1">
                    <v-icon small :color="standbyTab === 1 ? '#2196f3' : 'white'">mdi-history</v-icon>
                  </div>
                  <div class="mini-tab flex-grow-1" :class="standbyTab === 2 ? 'active-mini-tab' : ''" @click="standbyTab = 2">
                    <v-icon small :color="standbyTab === 2 ? '#2196f3' : 'white'">mdi-format-list-bulleted</v-icon>
                    <span class="badge ml-2">0</span>
                  </div>
                </div>

                <div class="standby-content flex-grow-1 overflow-y-auto px-2 py-2" style="max-height: 280px;">
                  <template v-if="standbyTab === 0 || standbyTab === 1">
                    <div v-for="(file, index) in mockHistory" :key="index" class="history-item d-flex align-center pa-3 mx-1">
                      <v-icon color="cyan lighten-2" class="mr-4">mdi-cube-scan</v-icon>
                      <div class="flex-grow-1 overflow-hidden pr-3">
                        <div class="white--text text-body-2 text-truncate">{{ file.name }}</div>
                        <div class="grey--text text-caption text-truncate">Filament: {{ file.filament }} | Time: {{ file.time }}</div>
                      </div>
                      <v-icon :color="file.color">{{ file.icon }}</v-icon>
                    </div>
                  </template>
                  <template v-else-if="standbyTab === 2">
                    <div class="d-flex align-center justify-center h-100 pa-4">
                      <span class="grey--text text-body-2 text-center">There is currently no file in the job queue.</span>
                    </div>
                  </template>
                </div>
              </div>

            </div>

            <div class="media-controls-overlay d-flex justify-start align-end pa-3" v-if="!isStandby || !showThumbnailView">
              <v-btn icon color="white" class="fs-btn-clean" @click="toggleFullscreen">
                <v-icon color="white">mdi-fullscreen</v-icon>
              </v-btn>
            </div>
          </div>

          <div class="file-info-panel px-6 py-4 mb-4 flex-shrink-0">
            <v-row dense no-gutters>
              <v-col cols="3">
                <span class="info-label">ESTIMATE</span>
                <div class="info-value white--text font-weight-bold">{{ printEstimate }}</div>
              </v-col>
              <v-col cols="3">
                <span class="info-label">SLICER</span>
                <div class="info-value white--text font-weight-bold text-truncate">{{ slicerName }}</div>
              </v-col>
              <v-col cols="3">
                <span class="info-label">TOTAL</span>
                <div class="info-value white--text font-weight-bold">{{ totalTime }}</div>
              </v-col>
              <v-col cols="3">
                <span class="info-label">ETA</span>
                <div class="info-value white--text font-weight-bold">{{ etaTime }}</div>
              </v-col>
            </v-row>
          </div>

          <v-row dense class="flex-shrink-0 mt-auto">
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
          <div class="flex-shrink-0">
            <v-row dense>
              <v-col cols="6" v-for="stat in mainStats" :key="stat.label">
                <div class="stat-card mb-3 pa-4">
                  <span class="text-caption grey--text text-uppercase font-weight-bold">{{ stat.label }}</span>
                  <div class="white--text font-weight-bold text-subtitle-1">{{ stat.value }} <small class="grey--text">{{ stat.unit }}</small></div>
                </div>
              </v-col>
            </v-row>
          </div>

          <div class="fans-vertical-wrapper mt-4 pa-4">
            <span class="text-caption grey--text font-weight-bold mb-3 d-block px-1">CONTROLS</span>
            <div class="d-flex flex-column" style="gap: 12px;">
              <div v-for="(object, index) in displayFans" :key="'fan-'+index" class="fan-card-compact px-3 py-1">
                <miscellaneous-slider 
                  :name="object.name" 
                  :type="object.type" 
                  :target="object.power" 
                  :rpm="object.rpm" 
                  :controllable="object.controllable" 
                  :pwm="object.pwm" 
                  :off_below="object.off_below" 
                  :max="object.max_power" 
                  :multi="parseInt(object.scale || '1')" 
                />
              </div>
              
              <v-divider class="my-1" style="border-color: rgba(255,255,255,0.05)"></v-divider>

              <span class="text-caption grey--text font-weight-bold mb-1 d-block px-1">LED LIGHTING</span>

              <div v-for="(led, index) in displayLeds" :key="'led-'+index" class="fan-card-compact px-3 py-3">
                
                <div class="d-flex align-center justify-space-between mb-2 px-1">
                  <span class="white--text text-body-2 font-weight-bold d-flex align-center">
                    <v-icon small class="mr-2" :color="led.enabled ? 'amber lighten-2' : 'grey darken-1'">
                      {{ led.enabled ? 'mdi-lightbulb' : 'mdi-lightbulb-outline' }}
                    </v-icon>
                    {{ led.name }}
                  </span>
                  <v-switch 
                    v-model="led.enabled"
                    dense 
                    hide-details 
                    class="mt-0 pt-0 custom-switch" 
                    color="primary"
                    @change="onLedToggle(led)"
                  />
                </div>

                <transition name="fade-slide">
                  <div v-if="led.enabled" class="d-flex align-center px-1" style="gap: 8px;">
                    <v-icon small color="grey">mdi-brightness-4</v-icon>
                    <v-slider
                      v-model="led.brightness"
                      :min="0"
                      :max="100"
                      :step="1"
                      hide-details
                      dense
                      color="primary"
                      track-color="rgba(255,255,255,0.12)"
                      class="flex-grow-1 my-0"
                      @change="onLedBrightnessChange(led)"
                    />
                    <v-icon small color="amber lighten-2">mdi-brightness-7</v-icon>
                    <span class="white--text text-caption font-weight-bold led-value-badge">
                      {{ led.brightness }}%
                    </span>
                  </div>
                </transition>

                <div v-if="!led.enabled" class="text-center py-1">
                  <span class="grey--text text-caption">LED desligado</span>
                </div>

              </div>

            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="3" xl="3" class="pl-lg-6 d-flex flex-column">
          <div class="d-flex flex-column" style="gap: 16px;"> 
            <div v-for="temp in temperatureCards" :key="temp.n" class="temp-card d-flex align-center px-5"> 
              <v-icon x-small :color="temp.c + ' lighten-1'" class="mr-4">{{ temp.i }}</v-icon>
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

interface LedItem {
  name: string;
  klipperName: string;
  brightness: number;
  enabled: boolean;
}

@Component({ components: { WebcamWrapper, MiscellaneousSlider } })
export default class OurDashboardPanel extends Mixins(BaseMixin, AfcMixin, WebcamMixin, MiscellaneousMixin) {
  readonly perimeter = 112 * 4;
  isLive = true;
  showThumbnailView = false;
  standbyTab = 0;

  ledItems: LedItem[] = [
    { name: 'Led', klipperName: 'case_light', brightness: 80, enabled: true },
  ];

  get currentCam() { 
    const cams = this.$store.getters['gui/webcams/getWebcams'];
    return (cams && cams.length > 0) ? cams[0] : { service: 'mjpeg', stream_url: '' }; 
  }
  
  get thumbnailUrl(): string {
    const activeFile = this.printer?.print_stats?.filename;
    if (!activeFile || activeFile === '') return '';
    
    const getter = this.$store.getters['files/getFileThumbnail'];
    if (typeof getter === 'function') return getter(activeFile) || '';
    
    const byPath = this.$store.getters['files/getFileThumbnailByPath'];
    if (typeof byPath === 'function') return byPath(activeFile) || '';

    return '';
  }
  
  get printer() { return this.$store.state.printer || {} }
  get isPrinting() { return this.$store.getters['printer/getIsPrinting'] || (this.printer?.print_stats?.state === 'printing'); }
  get isPaused() { return this.$store.getters['printer/getIsPaused'] || (this.printer?.print_stats?.state === 'paused'); }
  
  get isStandby() { 
    if (this.isPrinting || this.isPaused) return false;
    const filename = this.printer?.print_stats?.filename;
    if (filename && filename !== '') return false;
    return true;
  }
  
  get dynamicStartText() { return this.isPrinting ? 'PAUSE' : (this.isPaused ? 'RESUME' : 'START PRINT'); }
  get dynamicStartIcon() { return this.isPrinting ? 'mdi-pause' : (this.isPaused ? 'mdi-play-pause' : 'mdi-play'); }
  get dynamicStartColor() { return this.isPrinting ? 'amber darken-2' : (this.isPaused ? 'success darken-1' : 'success'); }
  
  dynamicStartAction() {
    if (this.isPrinting) return this.$socket.emit('printer.print.pause');
    if (this.isPaused)   return this.$socket.emit('printer.print.resume');
    return this.$socket.emit('printer.print.start');
  }
  
  toggleFullscreen() {
    const el = this.$refs.mediaBox as HTMLElement;
    if (!document.fullscreenElement) el.requestFullscreen().catch(err => console.log(err));
    else if (document.exitFullscreen) document.exitFullscreen();
  }

  get printEstimate() { if (this.isStandby) return '--:--'; return this.$store.getters['printer/getEstimatedTimeFormat'] || '--:--'; }
  get slicerName()    { if (this.isStandby) return '--'; return this.printer?.print_stats?.info?.slicer || 'PrusaSlicer'; }
  get totalTime()     { if (this.isStandby) return '--h --m'; return this.$store.getters['printer/getTotalTimeFormat'] || '--h --m'; }
  get etaTime()       { if (this.isStandby) return '--:--'; return this.$store.getters['printer/getEstimatedTimeETAFormat'] || '--:--'; }
  
  get displayFans() {
    const m = this.$store.getters['printer/getMiscellaneous'];
    return m ? m.filter((f: any) => f && f.name && 
      !f.name.toLowerCase().includes('hotend') && 
      !f.name.toLowerCase().includes('light') &&
      !f.name.toLowerCase().includes('led')
    ) : [];
  }

  get displayLeds(): LedItem[] {
    return this.ledItems;
  }

  onLedToggle(led: LedItem) {
    if (led.enabled) {
      this.onLedBrightnessChange(led);
    } else {
      this.$socket.emit('printer.gcode.script', {
        script: `SET_LED LED=${led.klipperName} RED=0 GREEN=0 BLUE=0 SYNC=0`
      });
    }
  }

  onLedBrightnessChange(led: LedItem) {
    if (!led.enabled) return;
    const v = parseFloat((led.brightness / 100).toFixed(2));
    this.$socket.emit('printer.gcode.script', {
      script: `SET_LED LED=${led.klipperName} RED=${v} GREEN=${v} BLUE=${v} SYNC=0`
    });
  }

  get displayProgress() {
    if (this.isStandby) return 0;
    let progress = 0;
    if (this.printer?.display_status?.progress) progress = this.printer.display_status.progress;
    else if (this.printer?.virtual_sdcard?.progress) progress = this.printer.virtual_sdcard.progress;
    return Math.floor(progress * 100);
  }
  
  get edgeStyle() {
    return {
      strokeDasharray: this.perimeter,
      strokeDashoffset: this.perimeter - (this.perimeter * (this.displayProgress / 100)),
      stroke: 'var(--v-primary-base)'
    };
  }

  get mainStats() {
    return [
      { label: 'Speed',    value: this.realSpeed,                              unit: 'mm/s' },
      { label: 'Flow',     value: this.realFlow,                               unit: 'mm³/s' },
      { label: 'Layer',    value: this.current_layer + ' / ' + this.max_layers, unit: '' },
      { label: 'FILAMENT', value: this.zHeight,                                unit: 'mm' }
    ];
  }
  get current_layer() { return this.$store.getters['printer/getPrintCurrentLayer'] || 0; }
  get max_layers()    { return this.$store.getters['printer/getPrintMaxLayers'] || 0; }
  get realSpeed() {
    if (this.printer?.motion_report?.live_velocity != null) return this.printer.motion_report.live_velocity.toFixed(0);
    return '0';
  }
  get realFlow() {
    const section = Math.pow(1.75 / 2, 2) * Math.PI;
    let vel = 0;
    if (this.printer?.motion_report?.live_extruder_velocity) vel = this.printer.motion_report.live_extruder_velocity;
    return (section * vel).toFixed(1);
  }
  get zHeight() {
    if (this.printer?.toolhead?.position?.length >= 3) return this.printer.toolhead.position[2].toFixed(2);
    return '0.00';
  }

  get extruderTemp() { return this.printer?.extruder?.temperature?.toFixed(1) ?? '0.0'; }
  get bedTemp()      { return this.printer?.heater_bed?.temperature?.toFixed(1) ?? '0.0'; }
  get temperatureCards() {
    return [
      { n: 'EXTRUDER', v: this.extruderTemp, i: 'mdi-printer-3d-nozzle',   c: 'red'    },
      { n: 'BED',      v: this.bedTemp,      i: 'mdi-radiator',             c: 'blue'   },
      { n: 'CHAMBER',  v: '25.0',            i: 'mdi-thermometer-lines',    c: 'orange' },
      { n: 'MCU',      v: '42.1',            i: 'mdi-chip',                 c: 'green'  },
      { n: 'HOST',     v: '38.5',            i: 'mdi-raspberry-pi',         c: 'purple' },
      { n: 'EXTRA 1',  v: '--',              i: 'mdi-thermometer-plus',     c: 'grey'   }
    ];
  }

  get mockHistory() {
    return [
      { name: 'winscreen_whiper_cap_peugeot_207_ASA_1h39m.gcode', filament: '6.80 m / 17 g',   time: '1h 38m 45s',  icon: 'mdi-check-circle-outline', color: '#4caf50' },
      { name: 'remake1-Volkswagen_ASA_19h24m.gcode',              filament: '76.75 m / 192 g', time: '19h 23m 55s', icon: 'mdi-alert-outline',         color: '#ff9800' },
      { name: 'ASA_1.gcode',                                       filament: '71.85 m / 180 g', time: '16h 24m 17s', icon: 'mdi-check-circle-outline',  color: '#4caf50' },
      { name: 'ASA_2.gcode',                                       filament: '74.22 m / 186 g', time: '1d 11m 29s',  icon: 'mdi-close-circle-outline',  color: '#f44336' },
      { name: 'remake1-Volkswagen_ASA_1d9h45m.gcode',             filament: '178.58 m / 447 g',time: '1d 9h 44m 42s',icon: 'mdi-alert-outline',        color: '#ff9800' }
    ];
  }
}
</script>

<style scoped>
.inner-rounded, .stat-card, .temp-card, .fans-vertical-wrapper,
.clean-tabs-wrapper, .file-info-panel, .buttons, .media-container,
.standby-wrapper {
  border-radius: calc(var(--master-radius, 15px) - 6px) !important;
}
.stat-card, .temp-card, .fans-vertical-wrapper, .clean-tabs-wrapper,
.file-info-panel, .standby-wrapper {
  background: var(--master-inner-bg, rgba(255,255,255,0.05)) !important;
}

.clean-tabs-wrapper {
  padding: 4px;
  border: 1px solid var(--master-inner-border, rgba(255,255,255,0.05));
}
.tab-btn {
  border-radius: calc(var(--master-radius, 15px) - 8px) !important;
  font-weight: 800 !important;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  height: 38px !important;
}
.active-tab   { background: rgba(255,255,255,0.1) !important; color: #fff !important; }
.inactive-tab { background: transparent !important; color: #888 !important; }

.media-container {
  width: 100%;
  min-height: 380px;
  background: #000;
  position: relative;
  display: flex;
  overflow: hidden;
}

.cam-progress-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(15, 15, 20, 0.75);
  backdrop-filter: blur(12px);
  padding: 8px 16px;
  border-radius: calc(var(--master-radius, 15px) - 6px);
  border: 1px solid var(--panel-inner-border);
  z-index: 10;
  font-size: 1.1rem;
}

.media-controls-overlay {
  position: absolute; bottom: 0; left: 0; width: 100%; z-index: 35; pointer-events: none;
}
.fs-btn-clean {
  pointer-events: auto !important;
  background: rgba(0,0,0,0.6) !important;
  margin: 15px;
  border-radius: 8px !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
}

.standby-wrapper {
  background: rgba(0,0,0,0.4) !important;
  border: 1px solid var(--master-inner-border, rgba(255,255,255,0.05));
  overflow: hidden;
}
.standby-header {
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.standby-mini-tabs {
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  height: 30px; margin: 0 8px; border-radius: 4px;
}
.mini-tab {
  display: flex; align-items: center; justify-content: center;
  padding: 2px 0; cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s;
}
.active-mini-tab { border-bottom: 2px solid #2196f3; }
.standby-content { max-height: 280px; overflow-y: auto; padding: 8px !important; }
.badge {
  background: rgba(255,255,255,0.15); color: #fff;
  font-size: 0.65rem; padding: 2px 6px;
  border-radius: 12px; font-weight: bold;
}
.history-item {
  border-bottom: 1px solid rgba(255,255,255,0.03);
  margin-bottom: 4px;
}

.overlay-progress-wrapper {
  position: absolute; top: 15px; right: 15px;
  width: 80px; height: 80px;
  background: rgba(15,15,20,0.75);
  backdrop-filter: blur(12px);
  border-radius: calc(var(--master-radius, 15px) - 6px);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--panel-inner-border); z-index: 10;
}
.square-svg { position: absolute; width: 100%; height: 100%; transform: rotate(-90deg); }
.border-ghost  { fill: none; stroke: var(--panel-svg-track, rgba(255,255,255,0.1)); stroke-width: 6; }
.border-active { fill: none; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 0.8s ease; }
.overlay-content {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: center;
}

.file-info-panel {
  border: 1px solid var(--master-inner-border, rgba(255,255,255,0.05));
  min-height: 80px; padding: 12px 20px !important;
}
.info-label { font-size: 0.65rem; color: #888; text-transform: uppercase; display: block; font-weight: bold; }
.info-value  { font-size: 1rem; }

.stat-card { text-align: center; padding: 12px !important; margin: 4px !important; }
.temp-card { width: 100%; min-height: 58px; display: flex; padding: 0 20px !important; margin-bottom: 8px; }

.fan-card-compact {
  background: rgba(0,0,0,0.15);
  border-radius: calc(var(--master-radius, 15px) - 8px);
  margin: 4px 8px;
  padding: 8px 12px !important;
}

.led-value-badge {
  min-width: 34px;
  text-align: right;
  font-size: 0.75rem;
}

.custom-switch ::v-deep .v-input--switch__thumb { color: white !important; }
.custom-switch ::v-deep .v-input--switch__track { background-color: rgba(255,255,255,0.2) !important; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter, .fade-slide-leave-to            { opacity: 0; transform: translateY(-4px); }

.buttons { letter-spacing: 1px; text-transform: uppercase; border: 1px solid var(--master-inner-border, rgba(255,255,255,0.1)); }
.big-btn { height: 56px !important; font-size: 1.1rem !important; }

.white--text  { color: var(--panel-text-main, #fff) !important; }
.h-100        { height: 100% !important; }
.flex-shrink-0{ flex-shrink: 0 !important; }
.relative     { position: relative; }
</style>