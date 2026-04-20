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
              <v-icon small left color="white">mdi-camera</v-icon> <span class="white--text">CAM</span>
            </v-btn>
            <v-btn 
              class="tab-btn flex-grow-1" 
              :class="showThumbnailView ? 'active-tab' : 'inactive-tab'" 
              depressed 
              @click="showThumbnailView = true"
            >
              <v-icon small left color="white">mdi-printer-3d/Files</v-icon> <span class="white--text">3D/Files</span>
            </v-btn>
          </div>

          <div class="media-container flex-grow-1 mb-4 shadow-xl relative overflow-hidden" ref="mediaBox">
            
            <div v-if="!showThumbnailView" class="h-100 w-100 absolute-fill-wrapper">
              <webcam-wrapper v-if="isLive" :webcam="currentCam" page="dashboard" class="h-100 w-100 inner-rounded" style="background: #000;" />
              <div class="cam-progress-badge d-flex align-center justify-center" v-if="!isStandby">
                <span class="white--text font-weight-black">{{ displayProgress }}%</span>
              </div>
            </div>

            <div v-else class="h-100 w-100 absolute-fill-wrapper">
              <div v-if="!isStandby" class="thumbnail-wrapper h-100 w-100 relative inner-rounded">
                <v-img 
                  v-if="thumbnailUrl" 
                  :src="thumbnailUrl" 
                  class="responsive-thumbnail inner-rounded h-100 w-100" 
                  contain 
                />
                <div v-else class="no-thumb-bg d-flex flex-column align-center justify-center inner-rounded h-100 w-100">
                  <v-icon size="64" color="white" style="opacity: 0.1">mdi-cube-scan</v-icon>
                  <span class="white--text text-caption mt-2">PREVIEWING MODEL...</span>
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

                <div class="standby-mini-tabs d-flex flex-shrink-0 mx-2">
                  <div class="mini-tab flex-grow-1" :class="standbyTab === 0 ? 'active-mini-tab' : ''" @click="standbyTab = 0">
                    <v-icon small color="white">mdi-file-document-outline</v-icon>
                    <span class="mini-tab-label ml-1 white--text">Files</span>
                  </div>
                  <div class="mini-tab flex-grow-1" :class="standbyTab === 1 ? 'active-mini-tab' : ''" @click="standbyTab = 1">
                    <v-icon small color="white">mdi-format-list-bulleted</v-icon>
                    <span class="mini-tab-label ml-1 white--text">Queue</span>
                    <span class="badge ml-2 white--text">0</span>
                  </div>
                </div>

                <div class="standby-content flex-grow-1 px-2 py-2">
                  <template v-if="standbyTab === 0">
                    <div v-for="(file, index) in mockHistory" :key="index" class="history-item d-flex align-center pa-3 mx-1">
                      <v-icon color="cyan lighten-2" class="mr-4">mdi-cube-scan</v-icon>
                      <div class="flex-grow-1 overflow-hidden pr-3">
                        <div class="white--text text-body-2 text-truncate">{{ file.name }}</div>
                        <div class="white--text text-caption text-truncate">Filament: {{ file.filament }} | Time: {{ file.time }}</div>
                      </div>
                      <v-icon :color="file.color">{{ file.icon }}</v-icon>
                    </div>
                  </template>
                  <template v-else-if="standbyTab === 1">
                    <div class="d-flex align-center justify-center pa-6 h-100">
                      <span class="white--text text-body-2 text-center">There is currently no file in the job queue.</span>
                    </div>
                  </template>
                </div>
              </div>

            </div>

            <div class="media-controls-overlay d-flex justify-start align-end pa-3" v-if="!isStandby || !showThumbnailView">
              <v-btn icon color="white" class="fs-btn-clean" @click="toggleFullscreen">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M5 5h5v2H7v3H5V5zm9 0h5v5h-2V7h-3V5zm5 9v5h-5v-2h3v-3h2zm-9 5H5v-5h2v3h3v2z"/>
                </svg>
              </v-btn>
            </div>
          </div>

          <div class="file-info-panel px-6 py-4 mb-4 flex-shrink-0">
            <v-row dense no-gutters>
              <v-col cols="3">
                <span class="info-label white--text">ESTIMATE</span>
                <div class="info-value white--text font-weight-bold">{{ printEstimate }}</div>
              </v-col>
              <v-col cols="3">
                <span class="info-label white--text">SLICER EST.</span>
                <div class="info-value white--text font-weight-bold text-truncate">{{ slicerEstimatedTime }}</div>
              </v-col>
              <v-col cols="3">
                <span class="info-label white--text">TOTAL</span>
                <div class="info-value white--text font-weight-bold">{{ totalTime }}</div>
              </v-col>
              <v-col cols="3">
                <span class="info-label white--text">ETA</span>
                <div class="info-value white--text font-weight-bold">{{ etaTime }}</div>
              </v-col>
            </v-row>
          </div>

          <v-row dense class="flex-shrink-0 mt-auto">
            <v-col cols="6">
              <v-btn block :color="dynamicStartColor" class="buttons big-btn font-weight-black" depressed @click="dynamicStartAction">
                <v-icon left color="white">{{ dynamicStartIcon }}</v-icon> <span class="white--text">{{ dynamicStartText }}</span>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn block color="error" class="buttons big-btn font-weight-black" depressed @click="() => {}">
                <v-icon left color="white">mdi-stop</v-icon> <span class="white--text">STOP PRINT</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="6" lg="3" xl="4" class="px-lg-4 mb-6 mb-md-0 d-flex flex-column">
          <div class="flex-shrink-0">
            <v-row dense>
              <v-col cols="6" v-for="stat in mainStats" :key="stat.label">
                <div class="stat-card mb-3 pa-4">
                  <span class="text-caption white--text text-uppercase font-weight-bold">{{ stat.label }}</span>
                  <div class="white--text font-weight-bold text-subtitle-1">{{ stat.value }} <small class="white--text">{{ stat.unit }}</small></div>
                </div>
              </v-col>
            </v-row>
          </div>

          <div class="fans-vertical-wrapper mt-4 pa-4">
            <span class="text-caption white--text font-weight-bold mb-3 d-block px-1">CONTROLS</span>
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
              
              <v-divider class="my-1" style="border-color: rgba(255,255,255,0.1)"></v-divider>

              <div v-for="(led, index) in displayLeds" :key="'led-'+index" class="fan-card-compact px-3 py-3">
                
                <div class="d-flex align-center justify-space-between mb-2 px-1">
                  <span class="white--text text-body-2 font-weight-bold d-flex align-center">
                    <span class="led-icon-wrap mr-2" :class="led.enabled ? 'led-on' : 'led-off'">
                      <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <line v-if="led.enabled" x1="12" y1="1"   x2="12" y2="3"   stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/>
                        <line v-if="led.enabled" x1="4.2"  y1="4.2"  x2="5.6"  y2="5.6"  stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/>
                        <line v-if="led.enabled" x1="1"   y1="12"  x2="3"   y2="12"  stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/>
                        <line v-if="led.enabled" x1="19.8" y1="4.2"  x2="18.4" y2="5.6"  stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/>
                        <line v-if="led.enabled" x1="23"  y1="12"  x2="21"  y2="12"  stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/>
                        <path d="M12 3C8.13 3 5 6.13 5 10c0 2.38 1.19 4.47 3 5.74V18c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" :fill="led.enabled ? '#FFD54F' : '#555'"/>
                        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z" :fill="led.enabled ? '#FFB300' : '#444'"/>
                      </svg>
                    </span>
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
                    <v-icon small color="white">mdi-brightness-4</v-icon>
                    <v-slider
                      v-model="led.brightness"
                      :min="0"
                      :max="100"
                      :step="1"
                      hide-details
                      dense
                      color="amber darken-1"
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

              </div>

            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="3" xl="3" class="pl-lg-6 d-flex flex-column">
          <div class="d-flex flex-column" style="gap: 16px;"> 
            <div v-for="temp in visibleTemperatureCards" :key="temp.n" class="temp-card d-flex align-center px-4"> 
              <v-icon x-small :color="temp.c + ' lighten-1'" class="mr-3">{{ temp.i }}</v-icon>
              <span class="text-caption white--text font-weight-bold mr-auto">{{ temp.n }}</span>
              
              <div class="d-flex align-center justify-end" style="gap: 12px;">
                <div class="text-right">
                  <div class="white--text" style="font-size: 0.6rem; font-weight: bold; text-transform: uppercase; line-height: 1;">Current</div>
                  <div class="white--text font-weight-bold" style="font-size: 0.95rem; line-height: 1.2;">{{ temp.v }}°C</div>
                  <div v-if="temp.h != null" class="white--text font-weight-bold" style="font-size: 0.7rem; line-height: 1;">{{ temp.h }}%</div>
                </div>
                
                <div v-if="temp.t != null" class="text-left pl-3" style="border-left: 1px solid rgba(255,255,255,0.3);">
                  <div class="white--text" style="font-size: 0.6rem; font-weight: bold; text-transform: uppercase; line-height: 1; margin-bottom: 2px;">Target</div>
                  
                  <div v-if="temp.k" class="d-flex align-center">
                    <input 
                      type="number" 
                      class="target-input font-weight-bold" 
                      :value="temp.t" 
                      @change="(e) => setTemperature(temp.k, e.target.value)"
                      @keyup.enter="(e) => { e.target.blur(); setTemperature(temp.k, e.target.value); }"
                    />
                    <span class="white--text ml-1 font-weight-bold" style="font-size: 0.95rem;">°C</span>
                  </div>
                  <div v-else class="white--text font-weight-bold" style="font-size: 0.95rem; line-height: 1.2;">
                    {{ temp.t }}°C
                  </div>
                </div>
              </div>

            </div>
          </div>
        </v-col>

      </v-row>
    </div>
  </panel>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
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
  isAdvancedMode: boolean = localStorage.getItem('advancedMode') === 'true';
  thumbnailUrl: string = ''; 

  ledItems: LedItem[] = [
    { name: 'Led', klipperName: 'Chamber_lightning', brightness: 100, enabled: true },
  ];

  mounted() {
    this.$root.$on('advancedModeChanged', (value: boolean) => {
      this.isAdvancedMode = value;
    });
  }

  beforeDestroy() {
    this.$root.$off('advancedModeChanged');
  }

  get activeFilename() {
    return this.printer?.print_stats?.filename || '';
  }

  @Watch('activeFilename', { immediate: true })
  async onFilenameChange(newFilename: string) {
    if (!newFilename) {
      this.thumbnailUrl = '';
      return;
    }
    
    try {
      const res = await fetch(`http://192.168.1.120/server/files/metadata?filename=${encodeURIComponent(newFilename)}`);
      const data = await res.json();
      const thumbs = data.result?.thumbnails;
      
      if (thumbs && thumbs.length > 0) {
        const best = [...thumbs].sort((a: any, b: any) => (b.width || 0) - (a.width || 0))[0];
        let cleanPath = best.relative_path;
        if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
        this.thumbnailUrl = `http://192.168.1.120/server/files/gcodes/${cleanPath}`;
      } else {
        this.thumbnailUrl = '';
      }
    } catch (e) {
      console.error('Failed to fetch Moonraker metadata:', e);
      this.thumbnailUrl = '';
    }
  }

  get currentCam() { 
    const cams = this.$store.getters['gui/webcams/getWebcams'];
    return (cams && cams.length > 0) ? cams[0] : { service: 'mjpeg', stream_url: '' }; 
  }
  
  get printer() { return this.$store.state.printer || {} }
  get isPrinting() { return this.$store.getters['printer/getIsPrinting'] || (this.printer?.print_stats?.state === 'printing'); }
  get isPaused() { return this.$store.getters['printer/getIsPaused'] || (this.printer?.print_stats?.state === 'paused'); }
  
  get isStandby() { 
    return !(this.isPrinting || this.isPaused);
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
    else document.exitFullscreen();
  }

  setTemperature(heater: string, value: string) {
    const target = parseInt(value, 10);
    if (isNaN(target)) return;
    this.$socket.emit('printer.gcode.script', { script: `SET_HEATER_TEMPERATURE HEATER=${heater} TARGET=${target}` });
  }

  get displayProgress() {
    const p = this.printer?.display_status?.progress ?? this.printer?.virtual_sdcard?.progress ?? 0;
    return Math.floor(p * 100);
  }

  get printEstimate() { 
    if (this.isStandby) return '--:--';
    const dur = this.printer?.print_stats?.print_duration || 0;
    const prog = this.printer?.display_status?.progress || this.printer?.virtual_sdcard?.progress || 0;
    if (prog > 0 && prog < 1) {
      const rem = (dur / prog) - dur;
      const h = Math.floor(rem / 3600);
      const m = Math.floor((rem % 3600) / 60);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
    return '--:--';
  }

  get slicerEstimatedTime() {
    if (this.isStandby) return '--:--';
    let est = this.printer?.print_stats?.info?.estimated_time;
    
    if (!est) {
      const activeFile = this.printer?.print_stats?.filename;
      try {
        const metaFunc = this.$store.getters['files/getFileMetadata'];
        if (typeof metaFunc === 'function' && activeFile) {
          const meta = metaFunc(activeFile);
          est = meta?.estimated_time;
        }
      } catch (_) {}
      
      if (!est) {
        try {
          const allFiles = this.$store.state.files?.gcodes?.items || [];
          const found = allFiles.find((f: any) => f.filename === activeFile);
          est = found?.metadata?.estimated_time;
        } catch (_) {}
      }
    }
    
    if (est) {
      const h = Math.floor(est / 3600);
      const m = Math.floor((est % 3600) / 60);
      return `${h}h ${m}m`;
    }
    return '--:--';
  }

  get totalTime() { 
    if (this.isStandby) return '--h --m'; 
    const dur = this.printer?.print_stats?.print_duration || 0;
    const prog = this.printer?.display_status?.progress || this.printer?.virtual_sdcard?.progress || 0;
    if (prog > 0) {
      const tot = dur / prog;
      const h = Math.floor(tot / 3600);
      const m = Math.floor((tot % 3600) / 60);
      return `${h}h ${m}m`;
    }
    return '--h --m';
  }

  get etaTime() { return this.$store.getters['printer/getEstimatedTimeETAFormat'] || '--:--'; }
  
  get displayFans() {
    const m = this.$store.getters['printer/getMiscellaneous'];
    return m ? m.filter((f: any) => f && f.name && 
      !f.name.toLowerCase().includes('hotend') && 
      !f.name.toLowerCase().includes('light') &&
      !f.name.toLowerCase().includes('led')
    ) : [];
  }

  get displayLeds(): LedItem[] { return this.ledItems; }

  onLedToggle(led: LedItem) {
    if (led.enabled) {
      this.onLedBrightnessChange(led);
    } else {
      this.$socket.emit('printer.gcode.script', { script: `SET_LED LED=${led.klipperName} WHITE=0 SYNC=0` });
    }
  }

  onLedBrightnessChange(led: LedItem) {
    if (!led.enabled) return;
    const v = parseFloat((led.brightness / 100).toFixed(2));
    this.$socket.emit('printer.gcode.script', { script: `SET_LED LED=${led.klipperName} WHITE=${v} SYNC=0` });
  }

  get mainStats() {
    const filUsedMm = this.printer?.print_stats?.filament_used || 0;
    const filUsedM = (filUsedMm / 1000).toFixed(2);

    return [
      { label: 'Speed',    value: this.printer?.motion_report?.live_velocity?.toFixed(0) || '0', unit: 'mm/s'  },
      { label: 'Flow',     value: (2.405 * (this.printer?.motion_report?.live_extruder_velocity || 0)).toFixed(1), unit: 'mm³/s' },
      { label: 'Layer',    value: `${this.current_layer} / ${this.max_layers}`, unit: ''      },
      { label: 'FILAMENT', value: filUsedM, unit: 'm' }
    ];
  }

  get current_layer() {
    const cl = this.printer?.print_stats?.info?.current_layer;
    if (cl !== undefined && cl !== null) return cl;
    try {
      return this.$store.getters['printer/getPrintCurrentLayer'] || 0;
    } catch (_) { return 0; }
  }

  get max_layers() {
    const ml = this.printer?.print_stats?.info?.total_layer;
    if (ml !== undefined && ml !== null && ml > 0) return ml;

    const activeFile = this.printer?.print_stats?.filename;
    if (activeFile) {
      try {
        const metaFunc = this.$store.getters['files/getFileMetadata'];
        if (typeof metaFunc === 'function') {
          const meta = metaFunc(activeFile);
          if (meta && meta.layer_count) return meta.layer_count;
        }
      } catch (_) {}
    }
    try {
      return this.$store.getters['printer/getPrintMaxLayers'] || 0;
    } catch (_) { return 0; }
  }

  getSensorData(name: string) {
    if (!this.printer) return { temp: '--.-', target: null, humidity: null };
    const normalizedSearch = name.toLowerCase().replace(/[_ ]/g, '');
    for (const key in this.printer) {
      const isSensor = key.startsWith('temperature_sensor ') || 
                       key.startsWith('temperature_fan ') || 
                       key.startsWith('heater_generic ') ||
                       key.startsWith('bme280 ') ||
                       key.startsWith('htu21d ') ||
                       key.startsWith('sht3x ');
      if (isSensor) {
        const keyName = key.substring(key.indexOf(' ') + 1).toLowerCase().replace(/[_ ]/g, '');
        if (keyName === normalizedSearch) {
          const data = this.printer[key];
          if (data && data.temperature !== undefined) {
            return {
              temp: data.temperature.toFixed(1),
              target: (data.target && data.target > 0) ? data.target.toFixed(0) : null,
              humidity: data.humidity !== undefined ? data.humidity.toFixed(0) : null
            };
          }
        }
      }
    }
    return { temp: '--.-', target: null, humidity: null };
  }

  get extruderTemp()   { return this.printer?.extruder?.temperature?.toFixed(1)   ?? '0.0'; }
  get extruderTarget() { return this.printer?.extruder?.target?.toFixed(0)        ?? '0'; }
  get bedTemp()        { return this.printer?.heater_bed?.temperature?.toFixed(1) ?? '0.0'; }
  get bedTarget()      { return this.printer?.heater_bed?.target?.toFixed(0)      ?? '0'; }

  get orderedTemperatureCards() {
    const chamber = this.getSensorData('chamber');
    const cb = this.getSensorData('controllerboard');
    const soc = this.getSensorData('soc');
    const thc = this.getSensorData('toolheadcontroller');
    const ths = this.getSensorData('toolheadscanner');

    return [
      { n: 'EXTRUDER', k: 'extruder', v: this.extruderTemp, t: this.extruderTarget, h: null, i: 'mdi-printer-3d-nozzle', c: 'red' },
      { n: 'BED', k: 'heater_bed', v: this.bedTemp, t: this.bedTarget, h: null, i: 'mdi-radiator', c: 'blue' },
      { n: 'CHAMBER', v: chamber.temp, t: chamber.target, h: chamber.humidity, i: 'mdi-thermometer-lines', c: 'orange' },
      { n: 'CONTROLLER BOARD', v: cb.temp, t: cb.target, h: cb.humidity, i: 'mdi-chip', c: 'green' },
      { n: 'SOC', v: soc.temp, t: soc.target, h: soc.humidity, i: 'mdi-raspberry-pi', c: 'purple' },
      { n: 'TOOLHEAD CONTROLLER', v: thc.temp, t: thc.target, h: thc.humidity, i: 'mdi-toolhead-plus', c: 'blue-grey' },
      { n: 'TOOLHEAD SCANNER', v: ths.temp, t: ths.target, h: ths.humidity, i: 'mdi-barcode-scan', c: 'grey' }
    ];
  }

  get visibleTemperatureCards() { 
    if (this.isAdvancedMode) {
      return this.orderedTemperatureCards;
    }
    return this.orderedTemperatureCards.slice(0, 3);
  }

  get mockHistory() {
    return [
      { name: 'winscreen_whiper_cap_peugeot_207_ASA_1h39m.gcode', filament: '6.80 m / 17 g',    time: '1h 38m 45s',    icon: 'mdi-check-circle-outline', color: '#4caf50' },
      { name: 'remake1-Volkswagen_ASA_19h24m.gcode',              filament: '76.75 m / 192 g',  time: '19h 23m 55s',   icon: 'mdi-alert-outline',         color: '#ff9800' },
      { name: 'ASA_1.gcode',                                       filament: '71.85 m / 180 g',  time: '16h 24m 17s',   icon: 'mdi-check-circle-outline',  color: '#4caf50' },
      { name: 'ASA_2.gcode',                                       filament: '74.22 m / 186 g',  time: '1d 11m 29s',    icon: 'mdi-close-circle-outline',  color: '#f44336' },
      { name: 'remake1-Volkswagen_ASA_1d9h45m.gcode',             filament: '178.58 m / 447 g', time: '1d 9h 44m 42s', icon: 'mdi-alert-outline',         color: '#ff9800' },
      { name: 'test_cube_PLA.gcode',                              filament: '2.10 m / 6 g',     time: '0h 25m 10s',    icon: 'mdi-check-circle-outline',  color: '#4caf50' },
      { name: 'benchy_PETG.gcode',                                filament: '4.50 m / 13 g',    time: '1h 05m 20s',    icon: 'mdi-check-circle-outline',  color: '#4caf50' }
    ];
  }
  
  get edgeStyle() {
    return {
      strokeDasharray: this.perimeter,
      strokeDashoffset: this.perimeter - (this.perimeter * (this.displayProgress / 100)),
      stroke: 'var(--v-primary-base)'
    };
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

.clean-tabs-wrapper { padding: 4px; border: 1px solid rgba(255,255,255,0.1); }
.tab-btn {
  border-radius: calc(var(--master-radius, 15px) - 8px) !important;
  font-weight: 800 !important; letter-spacing: 1px;
  transition: all 0.3s ease; height: 38px !important;
}
.active-tab   { background: rgba(255,255,255,0.15) !important; color: #fff !important; }
.inactive-tab { background: transparent !important; color: rgba(255,255,255,0.7) !important; }

.media-container { width: 100%; min-height: 380px; background: #000; position: relative; display: flex; overflow: hidden; }

.absolute-fill-wrapper {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
}

.cam-progress-badge {
  position: absolute; top: 15px; right: 15px;
  width: 60px; height: 60px;
  background: rgba(15,15,20,0.8); backdrop-filter: blur(12px);
  border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
  z-index: 10; font-size: 1.1rem;
}

.media-controls-overlay { position: absolute; bottom: 0; left: 0; width: 100%; z-index: 35; pointer-events: none; }
.fs-btn-clean {
  pointer-events: auto !important;
  background: rgba(0,0,0,0.6) !important; margin: 15px;
  border-radius: 8px !important; border: 1px solid rgba(255,255,255,0.1) !important;
}

.top-progress-bar-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: rgba(255,255,255,0.1); z-index: 25; }
.top-progress-fill { height: 100%; background: var(--v-primary-base); transition: width 0.5s ease; }

/* The fix for the scroll inside standby */
.standby-wrapper { 
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.4) !important; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; 
}
.standby-header  { background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.05); }
.standby-mini-tabs {
  display: flex;
  background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.05);
  height: 36px; margin: 0 8px; border-radius: 4px;
}
.mini-tab {
  display: flex; align-items: center; justify-content: center;
  padding: 2px 8px; cursor: pointer;
  border-bottom: 2px solid transparent; transition: border-color 0.2s;
}
.active-mini-tab  { border-bottom: 2px solid #2196f3; }
.mini-tab-label   { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.5px; }

/* Flexbox scroll trick */
.standby-content {
  flex: 1 1 auto;
  overflow-y: auto;
  height: 0; /* Crucial for flex scrolling */
  padding: 8px !important;
}
.standby-content::-webkit-scrollbar {
  width: 6px;
}
.standby-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
}
.standby-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.standby-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.badge { background: rgba(255,255,255,0.15); color: #fff; font-size: 0.65rem; padding: 2px 6px; border-radius: 12px; font-weight: bold; }
.history-item { border-bottom: 1px solid rgba(255,255,255,0.03); margin-bottom: 4px; }

.overlay-progress-wrapper {
  position: absolute; top: 15px; right: 15px; width: 80px; height: 80px;
  background: rgba(15,15,20,0.8); backdrop-filter: blur(12px);
  border-radius: calc(var(--master-radius, 15px) - 6px);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255,255,255,0.1); z-index: 10;
}
.square-svg { position: absolute; width: 100%; height: 100%; transform: rotate(-90deg); }
.border-ghost  { fill: none; stroke: rgba(255,255,255,0.1); stroke-width: 6; }
.border-active { fill: none; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 0.8s ease; }
.overlay-content { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; }

.file-info-panel { border: 1px solid rgba(255,255,255,0.05); min-height: 80px; padding: 12px 20px !important; }
.info-label { font-size: 0.65rem; color: rgba(255,255,255,0.7); text-transform: uppercase; display: block; font-weight: bold; }
.info-value  { font-size: 1rem; }

.stat-card { text-align: center; padding: 12px !important; margin: 4px !important; }
.temp-card { width: 100%; min-height: 58px; display: flex; padding: 0 20px !important; margin-bottom: 8px; }

.fan-card-compact {
  background: rgba(0,0,0,0.15);
  border-radius: calc(var(--master-radius, 15px) - 8px);
  margin: 4px 8px; padding: 8px 12px !important;
}

.led-icon-wrap { display: inline-flex; align-items: center; transition: filter 0.3s ease; }
.led-on  { filter: drop-shadow(0 0 5px rgba(255, 213, 79, 0.9)); }
.led-off { filter: none; opacity: 0.4; }
.led-value-badge { min-width: 34px; text-align: right; font-size: 0.75rem; }

.custom-switch ::v-deep .v-input--switch__thumb { color: white !important; }
.custom-switch ::v-deep .v-input--switch__track { background-color: rgba(255,255,255,0.4) !important; }

.target-input {
  width: 50px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  text-align: center;
  outline: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}
.target-input:focus {
  border-color: var(--v-primary-base, #2196f3);
  background: rgba(0, 0, 0, 0.5);
}
.target-input::-webkit-outer-spin-button,
.target-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter, .fade-slide-leave-to            { opacity: 0; transform: translateY(-4px); }

.buttons { letter-spacing: 1px; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.1); }
.big-btn { height: 56px !important; font-size: 1.1rem !important; }

.white--text   { color: #fff !important; }
.h-100         { height: 100% !important; }
.flex-shrink-0 { flex-shrink: 0 !important; }
.relative      { position: relative; }
</style>