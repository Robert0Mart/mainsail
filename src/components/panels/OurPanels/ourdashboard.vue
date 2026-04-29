<template>
  <panel 
    title="Printing Dashboard" 
    icon="mdi-monitor-dashboard" 
    card-class="blocks-main-panel"
    center-title
  >
    <div class="pa-6 h-100"> 
      <v-row align="stretch" class="h-100">
        
        <v-col cols="12" lg="6" xl="5" class="pr-lg-6 mb-6 mb-lg-0 d-flex flex-column col-left-wrapper h-100">
          
          <div class="clean-tabs-wrapper d-flex mb-4 flex-shrink-0">
            <v-btn 
              class="tab-btn flex-grow-1" 
              :class="!showThumbnailView ? 'active-tab' : 'inactive-tab'" 
              depressed 
              @click="showThumbnailView = false"
            >
              <img src="/img/icons/blocks_icons/sensorssvg.svg" width="18" height="18" class="mr-2 flex-shrink-0" style="max-width: 18px; max-height: 18px; filter: brightness(0) invert(1);" /> 
              <span class="white--text">CAM</span>
            </v-btn>
            <v-btn 
              class="tab-btn flex-grow-1" 
              :class="showThumbnailView ? 'active-tab' : 'inactive-tab'" 
              depressed 
              @click="showThumbnailView = true"
            >
              <img src="/img/icons/blocks_icons/file_iconsvg.svg" width="18" height="18" class="mr-2 flex-shrink-0" style="max-width: 18px; max-height: 18px; filter: brightness(0) invert(1);" /> 
              <span class="white--text">{{ isStandby ? 'FILES' : '3D' }}</span>
            </v-btn>
          </div>

          <div class="media-container flex-grow-1 shadow-xl relative overflow-hidden" ref="mediaBox">
            
            <div v-if="!showThumbnailView" class="h-100 w-100 absolute-fill-wrapper d-flex align-center justify-center">
              <webcam-wrapper v-if="isLive" :webcam="currentCam" page="dashboard" class="h-100 w-100 inner-rounded webcam-hero" />
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
                  <img src="/img/icons/blocks_icons/printsvg.svg" width="64" height="64" class="flex-shrink-0" style="max-width: 64px; max-height: 64px; opacity: 0.1; filter: brightness(0) invert(1);" />
                  <span class="white--text text-caption mt-2">PREVIEWING MODEL...</span>
                </div>
              </div>

              <div v-else class="standby-wrapper d-flex flex-column h-100 w-100 inner-rounded">
                <div class="standby-header d-flex align-center justify-space-between pa-4 flex-shrink-0">
                  <div class="d-flex align-center">
                    <img src="/img/icons/blocks_icons/infosvg.svg" width="20" height="20" class="mr-3 flex-shrink-0" style="max-width: 20px; max-height: 20px; filter: brightness(0) invert(1);" />
                    <span class="white--text font-weight-regular text-h6">Standby</span>
                  </div>
                  <img src="/img/icons/blocks_icons/downsvg.svg" width="16" height="16" class="flex-shrink-0" style="max-width: 16px; max-height: 16px; filter: brightness(0) invert(1);" />
                </div>

                <div class="standby-mini-tabs d-flex flex-shrink-0 mx-2">
                  <div class="mini-tab flex-grow-1" :class="standbyTab === 0 ? 'active-mini-tab' : ''" @click="standbyTab = 0">
                    <img src="/img/icons/blocks_icons/file_iconsvg.svg" width="16" height="16" class="flex-shrink-0" style="max-width: 16px; max-height: 16px; filter: brightness(0) invert(1);" />
                    <span class="mini-tab-label ml-2 white--text">Files</span>
                  </div>
                  <div class="mini-tab flex-grow-1" :class="standbyTab === 1 ? 'active-mini-tab' : ''" @click="standbyTab = 1">
                    <img src="/img/icons/blocks_icons/timesvg.svg" width="16" height="16" class="flex-shrink-0" style="max-width: 16px; max-height: 16px; filter: brightness(0) invert(1);" />
                    <span class="mini-tab-label ml-2 white--text">Queue</span>
                    <span class="badge ml-2 white--text">{{ queuedJobs.length }}</span>
                  </div>
                </div>

                <div class="standby-content flex-grow-1 px-2 py-2">
                  <template v-if="standbyTab === 0">
                    <div v-for="(file, index) in recentFiles" :key="index" class="history-item d-flex align-center pa-3 mx-1">
                      
                      <div class="mr-4 d-flex align-center justify-center flex-shrink-0" style="width: 32px; height: 32px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                        <img v-if="file.thumbUrl" :src="file.thumbUrl" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px;" />
                        <img v-else src="/img/icons/blocks_icons/file_iconsvg.svg" width="20" height="20" class="flex-shrink-0" style="max-width: 20px; max-height: 20px; filter: brightness(0) invert(1); opacity: 0.7;" />
                      </div>

                      <div class="flex-grow-1 overflow-hidden pr-3">
                        <div class="white--text text-body-2 text-truncate">{{ file.name }}</div>
                        <div class="white--text text-caption text-truncate" style="opacity: 0.7;">Filament: {{ file.filament }} | Time: {{ file.time }}</div>
                      </div>

                      <img :src="'/img/icons/blocks_icons/' + file.statusIcon" width="20" height="20" class="flex-shrink-0" style="max-width: 20px; max-height: 20px;" />
                    </div>
                    
                    <div v-if="recentFiles.length === 0" class="d-flex align-center justify-center pa-6 h-100">
                      <span class="white--text text-body-2 text-center">No history found.</span>
                    </div>
                  </template>
                  
                  <template v-else-if="standbyTab === 1">
                    <div v-for="(job, index) in queuedJobs" :key="'job-'+index" class="history-item d-flex align-center pa-3 mx-1">
                      <img src="/img/icons/blocks_icons/timesvg.svg" width="24" height="24" class="mr-4 flex-shrink-0" style="max-width: 24px; max-height: 24px; filter: brightness(0) invert(1); opacity: 0.7;" />
                      <div class="flex-grow-1 overflow-hidden pr-3">
                        <div class="white--text text-body-2 text-truncate">{{ job.filename }}</div>
                      </div>
                    </div>
                    <div v-if="queuedJobs.length === 0" class="d-flex align-center justify-center pa-6 h-100">
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

          <div class="d-flex align-center pa-4 mt-4 inner-rounded flex-shrink-0 overflow-hidden" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); min-height: 85px;">
            <div class="d-flex align-center flex-grow-1 overflow-hidden">
              <v-progress-circular 
                :rotate="-90" 
                :size="48" 
                :width="4" 
                :value="displayProgress" 
                color="var(--v-primary-base)"
                class="mr-4 flex-shrink-0"
              >
                <span class="white--text font-weight-bold" style="font-size: 0.75rem;">{{ displayProgress }}%</span>
              </v-progress-circular>
              
              <div class="d-flex flex-column overflow-hidden mr-2" style="min-width: 100px; max-width: 220px;">
                <span class="white--text font-weight-bold text-uppercase primary--text" style="letter-spacing: 1px; font-size: 0.8rem;">
                  {{ isStandby ? 'Standby' : (isPrinting ? 'Printing' : 'Paused') }}
                </span>
                <span class="white--text text-caption text-truncate" style="opacity: 0.7;">
                  {{ activeFilename ? activeFilename : 'Ready to print' }}
                </span>
              </div>

              <v-divider vertical class="mx-3" style="height: 35px; opacity: 0.2;" v-if="!isStandby"></v-divider>
              
              <div v-if="!isStandby" class="d-flex align-center flex-grow-1 justify-space-around px-1 text-center overflow-hidden">
                <div class="d-flex flex-column mx-1">
                  <span class="white--text" style="font-size: 0.6rem; opacity: 0.5; font-weight: bold;">ESTIMATE</span>
                  <span class="white--text font-weight-bold" style="font-size: 0.9rem;">{{ printEstimate }}</span>
                </div>
                <div class="d-flex flex-column mx-1">
                  <span class="white--text" style="font-size: 0.6rem; opacity: 0.5; font-weight: bold;">SLICER EST.</span>
                  <span class="white--text font-weight-bold" style="font-size: 0.9rem;">{{ slicerEstimatedTime }}</span>
                </div>
                <div class="d-flex flex-column mx-1">
                  <span class="white--text" style="font-size: 0.6rem; opacity: 0.5; font-weight: bold;">TOTAL</span>
                  <span class="white--text font-weight-bold" style="font-size: 0.9rem;">{{ totalTime }}</span>
                </div>
                <div class="d-flex flex-column mx-1">
                  <span class="white--text" style="font-size: 0.6rem; opacity: 0.5; font-weight: bold;">ETA</span>
                  <span class="white--text font-weight-bold" style="font-size: 0.9rem;">{{ etaTime }}</span>
                </div>
              </div>
            </div>
            
            <div class="d-flex align-center flex-shrink-0 ml-4" style="gap: 12px;">
              <v-btn fab small :color="isPrinting ? 'amber darken-2' : 'success darken-1'" depressed @click="dynamicStartAction">
                <img :src="'/img/icons/blocks_icons/' + dynamicStartIcon" width="20" height="20" style="filter: brightness(0) invert(1);" />
              </v-btn>
              <v-btn v-if="!isStandby" fab small color="error" depressed @click="$socket.emit('printer.print.cancel')">
                <img src="/img/icons/blocks_icons/stopsvg.svg" width="20" height="20" style="filter: brightness(0) invert(1);" />
              </v-btn>
            </div>
          </div>

        </v-col>

        <v-col cols="12" md="6" lg="3" xl="4" class="px-lg-4 mb-6 mb-md-0 d-flex flex-column h-100">
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

          <div class="fans-vertical-wrapper mt-4 pa-4 flex-grow-1 overflow-y-auto">
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
                      <img src="/img/icons/blocks_icons/LEDssvg.svg" width="18" height="18" class="flex-shrink-0" style="max-width: 18px; max-height: 18px; filter: brightness(0) invert(1);" />
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
                    <img src="/img/icons/blocks_icons/light_barsvg.svg" width="18" height="18" class="flex-shrink-0" style="max-width: 18px; max-height: 18px; filter: brightness(0) invert(1);" />
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
                    <img src="/img/icons/blocks_icons/sun svg.svg" width="18" height="18" class="flex-shrink-0" style="max-width: 18px; max-height: 18px; filter: brightness(0) invert(1);" />
                    <span class="white--text text-caption font-weight-bold led-value-badge">
                      {{ led.brightness }}%
                    </span>
                  </div>
                </transition>

              </div>

            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="3" xl="3" class="pl-lg-6 d-flex flex-column h-100">
          <div class="d-flex flex-column flex-grow-1 overflow-y-auto" style="gap: 16px;"> 
            
            <div v-for="temp in visibleTemperatureCards" :key="temp.n" class="temp-card d-flex align-center px-4 flex-shrink-0"> 
              <img :src="'/img/icons/blocks_icons/' + temp.i" width="24" height="24" class="mr-3 flex-shrink-0" style="max-width: 24px; max-height: 24px; filter: brightness(0) invert(1);" />
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

            <div class="temp-card d-flex flex-column align-center justify-center py-4 mt-2 flex-shrink-0" style="height: auto;">
              <mmu-clog-meter style="max-width: 140px; width: 100%; margin-bottom: 12px;" />
              <span class="white--text font-weight-regular text-body-1" style="opacity: 0.7;">Clog/Tangle Detection</span>
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
import WebcamWrapper from "@/components/webcams/WebcamWrapper.vue"
import MmuClogMeter from '@/components/panels/Mmu/MmuClogMeter.vue' 

interface LedItem {
  name: string;
  klipperName: string;
  brightness: number;
  enabled: boolean;
}

@Component({ components: { WebcamWrapper, MiscellaneousSlider, MmuClogMeter } })
export default class OurDashboardPanel extends Mixins(BaseMixin, AfcMixin, WebcamMixin, MiscellaneousMixin) {
  isLive = true;
  showThumbnailView = false;
  standbyTab = 0;
  isAdvancedMode: boolean = localStorage.getItem('advancedMode') === 'true';
  thumbnailUrl: string = ''; 
  historyJobs: any[] = [];
  fetchedMoonrakerFiles: any[] = [];

  ledItems: LedItem[] = [
    { name: 'Led', klipperName: 'Chamber_lightning', brightness: 100, enabled: true },
  ];

  mounted() {
    this.$root.$on('advancedModeChanged', (value: boolean) => {
      this.isAdvancedMode = value;
    });
    this.fetchMoonrakerData();
  }

  beforeDestroy() {
    this.$root.$off('advancedModeChanged');
  }

  async fetchMoonrakerData() {
    const IP_PRINTER = "192.168.1.120";  

    try {
      let histRes = await fetch('/server/history/list?limit=15');
      if (!histRes.ok) histRes = await fetch(`http://${IP_PRINTER}/server/history/list?limit=15`);
      if (histRes.ok) {
        const histData = await histRes.json();
        if (histData?.result?.jobs) {
          this.historyJobs = histData.result.jobs;
        }
      }
    } catch (e) {
      try {
        const fallbackRes = await fetch(`http://${IP_PRINTER}/server/history/list?limit=15`);
        const fallbackData = await fallbackRes.json();
        if (fallbackData?.result?.jobs) this.historyJobs = fallbackData.result.jobs;
      } catch(err) {}
    }

    try {
      let fileRes = await fetch('/server/files/list?root=gcodes');
      if (!fileRes.ok) fileRes = await fetch(`http://${IP_PRINTER}/server/files/list?root=gcodes`);
      if (fileRes.ok) {
        const fileData = await fileRes.json();
        if (fileData?.result) {
          this.fetchedMoonrakerFiles = fileData.result;
        }
      }
    } catch (e) {
       try {
        const fallbackRes = await fetch(`http://${IP_PRINTER}/server/files/list?root=gcodes`);
        const fallbackData = await fallbackRes.json();
        if (fallbackData?.result) this.fetchedMoonrakerFiles = fallbackData.result;
      } catch(err) {}
    }
  }

  get queuedJobs() {
    return this.$store.state.jobQueue?.queued_jobs || this.$store.state.server?.job_queue?.queued_jobs || [];
  }

  get recentFiles() {
    const IP_PRINTER = "192.168.1.120"; 
    let jobs = this.historyJobs;
    if (!jobs || jobs.length === 0) {
      jobs = this.$store.state.history?.jobs?.slice(0, 15) || [];
    }

    if (jobs.length === 0) return [];

    return jobs.map((job: any) => {
      
      let fil = '--';
      if (job.filament_used) {
        const lengthM = (job.filament_used / 1000).toFixed(2);
        fil = `${lengthM} m`;
      }

      let time = '--';
      if (job.print_duration) {
        const h = Math.floor(job.print_duration / 3600);
        const m = Math.floor((job.print_duration % 3600) / 60);
        time = `${h}h ${m}m`;
      }

      let statusIcon = 'troubleshoot_orange.svg';
      if (job.status === 'completed') {
        statusIcon = 'yessvg.svg';
      } else if (job.status === 'error' || job.status === 'cancelled' || job.status === 'interrupted') {
        statusIcon = 'nosvg.svg';
      }

      let thumbUrl = null;
      let files = [];
      if (this.fetchedMoonrakerFiles && this.fetchedMoonrakerFiles.length > 0) {
        files = [...files, ...this.fetchedMoonrakerFiles];
      }
      const fs = this.$store.state.files;
      if (fs) {
        if (Array.isArray(fs.gcodes)) files = [...files, ...fs.gcodes];
        else if (fs.gcodes && Array.isArray(fs.gcodes.items)) files = [...files, ...fs.gcodes.items];
      }
      
      let found: any = null;
      const jobBaseName = (job.filename || '').split('/').pop();

      const search = (arr: any[]) => {
        if(!arr) return;
        for(const item of arr) {
          const itemBaseName = (item.filename || item.path || '').split('/').pop();
          if (itemBaseName === jobBaseName) {
            found = item;
            return;
          }
          if (item.children) search(item.children);
        }
      }
      search(files);

      if (found && found.thumbnails && found.thumbnails.length > 0) {
        const thumb = [...found.thumbnails].sort((a: any, b: any) => a.width - b.width)[0];
        let cleanPath = thumb.relative_path;
        if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
        thumbUrl = `http://${IP_PRINTER}/server/files/gcodes/${cleanPath}`;
      }

      return {
        name: jobBaseName || 'Unknown',
        filament: fil,
        time: time,
        statusIcon: statusIcon,
        thumbUrl: thumbUrl
      };
    });
  }

  get activeFilename() {
    return this.printer?.print_stats?.filename || '';
  }

  @Watch('activeFilename', { immediate: true })
  async onFilenameChange(newFilename: string) {
    const IP_PRINTER = "192.168.1.120"; 
    if (!newFilename) {
      this.thumbnailUrl = '';
      return;
    }
    
    try {
      const res = await fetch(`http://${IP_PRINTER}/server/files/metadata?filename=${encodeURIComponent(newFilename)}`);
      const data = await res.json();
      const thumbs = data.result?.thumbnails;
      
      if (thumbs && thumbs.length > 0) {
        const best = [...thumbs].sort((a: any, b: any) => (b.width || 0) - (a.width || 0))[0];
        let cleanPath = best.relative_path;
        if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
        this.thumbnailUrl = `http://${IP_PRINTER}/server/files/gcodes/${cleanPath}`;
      } else {
        this.thumbnailUrl = '';
      }
    } catch (e) {
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
  
  get dynamicStartIcon() { return this.isPrinting ? 'pausesvg.svg' : 'playsvg.svg'; }
  
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
      { n: 'EXTRUDER', k: 'extruder', v: this.extruderTemp, t: this.extruderTarget, h: null, i: 'nozzlesvg.svg', c: 'red' },
      { n: 'BED', k: 'heater_bed', v: this.bedTemp, t: this.bedTarget, h: null, i: 'temperature_platesvg.svg', c: 'blue' },
      { n: 'CHAMBER', v: chamber.temp, t: chamber.target, h: chamber.humidity, i: 'chamber_temperaturesvg.svg', c: 'orange' },
      { n: 'CTRL BOARD', v: cb.temp, t: cb.target, h: cb.humidity, i: 'hot_temperaturesvg.svg', c: 'green' },
      { n: 'SOC', v: soc.temp, t: soc.target, h: soc.humidity, i: 'temperaturesvg.svg', c: 'purple' },
      { n: 'TOOLHEAD', v: thc.temp, t: thc.target, h: thc.humidity, i: 'temperaturesvg.svg', c: 'blue-grey' },
      { n: 'SCANNER', v: ths.temp, t: ths.target, h: ths.humidity, i: 'sensorssvg.svg', c: 'grey' }
    ];
  }

  get visibleTemperatureCards() { 
    if (this.isAdvancedMode) {
      return this.orderedTemperatureCards;
    }
    return this.orderedTemperatureCards.slice(0, 3);
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
.clean-tabs-wrapper, .file-info-panel, .standby-wrapper {
  border-radius: calc(var(--master-radius, 15px) - 6px) !important;
}
.media-container {
  border-radius: var(--master-radius, 15px) !important;
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
.active-tab   { background: rgba(255,255,255,0.15) !important; color: #ffffff !important; }
.inactive-tab { background: transparent !important; color: rgba(255,255,255,0.7) !important; }

/* AJUSTE CÂMARA: Mudado para Flex para garantir que o componente filho estica e mostra imagem */
.media-container {
  width: 100%;
  flex: 1 1 0; 
  min-height: 560px;
  max-height: 60vh; 
  background: #000000;
  position: relative;
  display: flex; 
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Garante que o wrapper da webcam ocupa o espaço todo */
::v-deep .webcam-hero {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

::v-deep .webcam-hero img,
::v-deep .webcam-hero video,
::v-deep .webcam-hero canvas,
::v-deep .webcam-hero .webcam-image {
  max-width: 100% !important;
  max-height: 100% !important;
  width: auto !important;
  height: auto !important;
  object-fit: contain !important; 
  display: block !important;
}

.absolute-fill-wrapper {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
}

.media-controls-overlay { position: absolute; bottom: 0; left: 0; width: 100%; z-index: 35; pointer-events: none; }
.fs-btn-clean {
  pointer-events: auto !important;
  background: rgba(0,0,0,0.6) !important; margin: 15px;
  border-radius: 8px !important; border: 1px solid rgba(255,255,255,0.1) !important;
}

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

.standby-content {
  flex: 1 1 auto;
  overflow-y: auto;
  height: 0; 
  padding: 8px !important;
}
.standby-content::-webkit-scrollbar {
  width: 6px;
}
.standby-content::-webkit-scrollbar-track {
  background: rgba(221, 221, 221, 0.02);
  border-radius: 4px;
}
.standby-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.standby-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.badge { background: rgba(255,255,255,0.15); color: #ffffff; font-size: 0.65rem; padding: 2px 6px; border-radius: 12px; font-weight: bold; }
.history-item { border-bottom: 1px solid rgba(255,255,255,0.03); margin-bottom: 4px; }

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

::v-deep .custom-switch .v-input--switch__thumb { color: #ffffff !important; }
::v-deep .custom-switch .v-input--switch__track { background-color: rgba(255,255,255,0.4) !important; }

.target-input {
  width: 50px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #ffffff;
  text-align: center;
  outline: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  -moz-appearance: textfield;
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

.white--text   { color: #ffffff !important; }
.h-100         { height: 100% !important; }
.flex-shrink-0 { flex-shrink: 0 !important; }
.relative      { position: relative; }
</style>