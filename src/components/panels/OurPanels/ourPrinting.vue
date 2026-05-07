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
              <img src="/img/icons/blocks_icons/sensorssvg.svg" width="18" height="18" class="mr-2 flex-shrink-0" style="filter: brightness(0) invert(1);" /> 
              <span class="white--text">CAM</span>
            </v-btn>
            <v-btn 
              class="tab-btn flex-grow-1" 
              :class="showThumbnailView ? 'active-tab' : 'inactive-tab'" 
              depressed 
              @click="showThumbnailView = true"
            >
              <img src="/img/icons/blocks_icons/file_iconsvg.svg" width="18" height="18" class="mr-2 flex-shrink-0" style="filter: brightness(0) invert(1);" /> 
              <span class="white--text">{{ isStandby ? 'FILES' : '3D' }}</span>
            </v-btn>
          </div>
          <div class="media-container flex-grow-1 shadow-xl relative overflow-hidden" ref="mediaBox">
            <div v-if="!showThumbnailView" class="h-100 w-100 absolute-fill-wrapper d-flex align-center justify-center">
              <webcam-wrapper v-if="isLive" :webcam="currentCam" page="dashboard" class="h-100 w-100 inner-rounded webcam-hero" />
            </div>
            <div v-else class="h-100 w-100 absolute-fill-wrapper d-flex flex-column">
              <div v-if="!isStandby" class="thumbnail-wrapper h-100 w-100 relative inner-rounded flex-grow-1">
                <v-img v-if="thumbnailUrl" :src="thumbnailUrl" class="responsive-thumbnail inner-rounded h-100 w-100" contain />
                <div v-else class="no-thumb-bg d-flex flex-column align-center justify-center inner-rounded h-100 w-100 absolute-fill-wrapper">
                  <img src="/img/icons/blocks_icons/printsvg.svg" width="64" height="64" style="opacity: 0.1; filter: brightness(0) invert(1);" />
                  <span class="white--text text-caption mt-2">PREVIEWING MODEL...</span>
                </div>
              </div>
              <div v-else class="standby-wrapper d-flex flex-column h-100 w-100 inner-rounded absolute-fill-wrapper">
                <div class="standby-header d-flex align-center justify-space-between pa-4 flex-shrink-0">
                  <div class="d-flex align-center">
                    <img src="/img/icons/blocks_icons/infosvg.svg" width="20" height="20" class="mr-3" style="filter: brightness(0) invert(1);" />
                    <span class="white--text font-weight-regular text-h6">Standby</span>
                  </div>
                  <img src="/img/icons/blocks_icons/downsvg.svg" width="16" height="16" style="filter: brightness(0) invert(1);" />
                </div>
                <div class="standby-mini-tabs d-flex flex-shrink-0 mx-4">
                  <div class="mini-tab" :class="standbyTab === 0 ? 'active-mini-tab' : ''" @click="standbyTab = 0">
                    <img src="/img/icons/blocks_icons/file_iconsvg.svg" width="16" height="16" class="tab-icon" />
                    <span class="mini-tab-label ml-2">Files</span>
                  </div>
                  <div class="mini-tab" style="margin-left: 60px;" :class="standbyTab === 1 ? 'active-mini-tab' : ''" @click="standbyTab = 1">
                    <img src="/img/icons/blocks_icons/timesvg.svg" width="16" height="16" class="tab-icon" />
                    <span class="mini-tab-label ml-2">Queue</span>
                    <span class="badge ml-2 white--text">{{ queuedJobs.length }}</span>
                  </div>
                </div>
                <div class="standby-content flex-grow-1 px-2 py-2">
                  <template v-if="standbyTab === 0">
                    <div v-for="(file, index) in recentFiles" :key="index" class="history-item d-flex align-center pa-3 mx-1">
                      <div class="mr-4 d-flex align-center justify-center flex-shrink-0" style="width: 32px; height: 32px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                        <img v-if="file.thumbUrl" :src="file.thumbUrl" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px;" />
                        <img v-else src="/img/icons/blocks_icons/file_iconsvg.svg" width="20" height="20" style="filter: brightness(0) invert(1); opacity: 0.7;" />
                      </div>
                      <div class="flex-grow-1 overflow-hidden pr-3">
                        <div class="white--text text-body-2 text-truncate">{{ file.name }}</div>
                        <div class="white--text text-caption text-truncate" style="opacity: 0.7;">Filament: {{ file.filament }} | Time: {{ file.time }}</div>
                      </div>
                      <img :src="'/img/icons/blocks_icons/' + file.statusIcon" width="20" height="20" />
                    </div>
                  </template>
                  <template v-else-if="standbyTab === 1">
                    <div v-for="(job, index) in queuedJobs" :key="'job-'+index" class="history-item d-flex align-center pa-3 mx-1">
                      <img src="/img/icons/blocks_icons/timesvg.svg" width="24" height="24" class="mr-4" style="filter: brightness(0) invert(1); opacity: 0.7;" />
                      <div class="flex-grow-1 overflow-hidden pr-3">
                        <div class="white--text text-body-2 text-truncate">{{ job.filename }}</div>
                      </div>
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
              <v-progress-circular :rotate="-90" :size="48" :width="4" :value="displayProgress" color="var(--v-primary-base)" class="mr-4 flex-shrink-0">
                <span class="white--text font-weight-bold" style="font-size: 0.75rem;">{{ displayProgress }}%</span>
              </v-progress-circular>
              <div class="d-flex flex-column overflow-hidden mr-4" style="min-width: 100px; max-width: 250px;">
                <span class="white--text font-weight-bold text-uppercase primary--text" style="letter-spacing: 1px; font-size: 0.8rem;">{{ isStandby ? 'Standby' : (isPrinting ? 'Printing' : 'Paused') }}</span>
                <span class="white--text text-caption text-truncate" style="opacity: 0.7;">{{ activeFilename ? activeFilename : 'Ready to print' }}</span>
              </div>
              <v-divider vertical class="mx-2" style="height: 35px; opacity: 0.2;" v-if="!isStandby"></v-divider>
              <div v-if="!isStandby" class="d-flex align-center flex-grow-1 justify-space-around px-2 text-center overflow-hidden">
                <div class="d-flex flex-column"><span class="white--text" style="font-size: 0.6rem; opacity: 0.5; font-weight: bold;">ESTIMATE</span><span class="white--text font-weight-bold" style="font-size: 0.85rem;">{{ printEstimate }}</span></div>
                <div class="d-flex flex-column"><span class="white--text" style="font-size: 0.6rem; opacity: 0.5; font-weight: bold;">TOTAL</span><span class="white--text font-weight-bold" style="font-size: 0.85rem;">{{ totalTime }}</span></div>
                <div class="d-flex flex-column"><span class="white--text" style="font-size: 0.6rem; opacity: 0.5; font-weight: bold;">ETA</span><span class="white--text font-weight-bold" style="font-size: 0.85rem;">{{ etaTime }}</span></div>
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
        <v-col cols="12" md="6" lg="3" xl="4" class="px-lg-4 mb-6 mb-md-0">
          <div class="flex-shrink-0" v-if="isAdvancedMode">
            <v-row dense>
              <v-col cols="6" v-for="stat in mainStats" :key="stat.label">
                <div class="stat-card mb-3 pa-4">
                  <span class="text-caption white--text text-uppercase font-weight-bold">{{ stat.label }}</span>
                  <div class="white--text font-weight-bold text-subtitle-1">{{ stat.value }} <small class="white--text">{{ stat.unit }}</small></div>
                </div>
              </v-col>
            </v-row>
          </div>
          <div class="fans-vertical-wrapper pa-4 d-flex flex-column" :class="isAdvancedMode ? 'mt-4' : 'mt-0'">
            <span class="text-caption white--text font-weight-bold mb-3 d-block px-1 flex-shrink-0">CONTROLS</span>
            <div class="d-flex flex-column" style="gap: 12px;">
              <div v-for="(object, index) in displayFans" :key="'fan-'+index" class="fan-card-compact px-3 py-1">
                <div class="white--text font-weight-bold px-1 mb-1 text-truncate" style="font-size: 0.75rem; letter-spacing: 0.5px;">{{ object.name.replace(/_/g, ' ') }}</div>
                <div class="slider-wrapper-hide-label">
                  <miscellaneous-slider :name="object.name" :type="object.type" :target="object.power" :rpm="object.rpm" :controllable="object.controllable" :pwm="object.pwm" :off_below="object.off_below" :max="object.max_power" :multi="parseInt(object.scale || '1')" />
                </div>
              </div>
            </div>
            <v-divider class="my-3" style="border-color: rgba(255,255,255,0.1)"></v-divider>
            <div v-for="(led, index) in displayLeds" :key="'led-'+index" class="fan-card-compact px-3 py-3">
              <div class="d-flex align-center justify-space-between mb-2 px-1">
                <span class="white--text text-body-2 font-weight-bold d-flex align-center"><img src="/img/icons/blocks_icons/LEDssvg.svg" width="18" height="18" class="mr-2" style="filter: brightness(0) invert(1);" /> {{ led.name }}</span>
                <v-switch v-model="led.enabled" dense hide-details class="mt-0 pt-0 custom-switch" color="primary" @change="onLedToggle(led)" />
              </div>
              <transition name="fade-slide">
                <div v-if="led.enabled" class="d-flex align-center px-1" style="gap: 8px;">
                  <img src="/img/icons/blocks_icons/light_barsvg.svg" width="18" height="18" style="filter: brightness(0) invert(1);" />
                  <v-slider v-model="led.brightness" :min="0" :max="100" :step="1" hide-details dense color="amber darken-1" class="flex-grow-1 my-0" @change="onLedBrightnessChange(led)" />
                  <img src="/img/icons/blocks_icons/sun svg.svg" width="18" height="18" style="filter: brightness(0) invert(1);" />
                </div>
              </transition>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6" lg="3" xl="3" class="pl-lg-6">
          <div class="d-flex flex-column" style="gap: 16px;"> 
            <div v-for="temp in visibleTemperatureCards" :key="temp.n" class="temp-card d-flex align-center px-3 flex-shrink-0"> 
              <img :src="'/img/icons/blocks_icons/' + temp.i" width="22" height="22" class="mr-3" style="filter: brightness(0) invert(1);" />
              <span class="text-caption white--text font-weight-bold text-truncate pr-2" style="flex: 1 1 auto; min-width: 0;">{{ temp.n }}</span>
              <div class="d-flex align-center justify-end flex-shrink-0" style="gap: 8px;">
                <div class="text-right">
                  <div class="white--text" style="font-size: 0.55rem; font-weight: bold; text-transform: uppercase; line-height: 1;">Current</div>
                  <div class="white--text font-weight-bold" style="font-size: 0.9rem; line-height: 1.2;">{{ temp.v }}°C</div>
                </div>
                <div v-if="temp.t != null" class="text-left pl-2" style="border-left: 1px solid rgba(255,255,255,0.3);">
                  <div class="white--text" style="font-size: 0.55rem; font-weight: bold; text-transform: uppercase; line-height: 1; margin-bottom: 2px;">Target</div>
                  <div v-if="temp.k" class="d-flex align-center">
                    <input type="number" class="target-input font-weight-bold" :placeholder="temp.t" @keyup.enter="(e) => { if(e.target.value !== '') setTemperature(temp.k, e.target.value); e.target.blur(); }" />
                    <span class="white--text ml-1 font-weight-bold" style="font-size: 0.85rem;">°C</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-shrink-0" v-if="!isAdvancedMode">
              <v-row dense>
                <v-col cols="6" v-for="stat in mainStats" :key="stat.label">
                  <div class="stat-card mb-1 pa-4">
                    <span class="text-caption white--text text-uppercase font-weight-bold">{{ stat.label }}</span>
                    <div class="white--text font-weight-bold text-subtitle-1">{{ stat.value }} <small class="white--text">{{ stat.unit }}</small></div>
                  </div>
                </v-col>
              </v-row>
            </div>
            <div class="temp-card d-flex flex-column align-center justify-center py-4 mb-0 flex-grow-1" style="min-height: 220px;">
              <span class="white--text font-weight-regular text-body-1 mb-3" style="opacity: 0.85;">Clog/Tangle Detection</span>
              <mmu-flowguard-meter style="max-width: 140px; width: 100%;" />
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
import MmuFlowguardMeter from '@/components/panels/Mmu/MmuFlowguardMeter.vue' 

interface LedItem { name: string; klipperName: string; brightness: number; enabled: boolean; }

@Component({ components: { WebcamWrapper, MiscellaneousSlider, MmuFlowguardMeter } })
export default class OurPrintingPanel extends Mixins(BaseMixin, AfcMixin, WebcamMixin, MiscellaneousMixin) {
  isLive = true; showThumbnailView = false; standbyTab = 0;
  isAdvancedMode: boolean = localStorage.getItem('advancedMode') === 'true';
  thumbnailUrl: string = ''; historyJobs: any[] = []; fetchedMoonrakerFiles: any[] = [];
  ledItems: LedItem[] = [{ name: 'Led', klipperName: 'Chamber_lightning', brightness: 100, enabled: true }];

  mounted() { 
    this.$root.$on('advancedModeChanged', (v: boolean) => { this.isAdvancedMode = v; }); 
    this.fetchMoonrakerData(); 
  }
  beforeDestroy() { this.$root.$off('advancedModeChanged'); }

  async fetchMoonrakerData() {
    const IP = "192.168.1.120";
    try {
      let res = await fetch(`http://${IP}/server/history/list?limit=15`);
      if (res.ok) { const d = await res.json(); this.historyJobs = d.result.jobs; }
      let resF = await fetch(`http://${IP}/server/files/list?root=gcodes`);
      if (resF.ok) { const dF = await resF.json(); this.fetchedMoonrakerFiles = dF.result; }
    } catch(e) {}
  }

  get recentFiles() {
    const IP = "192.168.1.120";
    let jobs = this.historyJobs.length > 0 ? this.historyJobs : (this.$store.state.history?.jobs?.slice(0, 15) || []);
    return jobs.map((job: any) => {
      let thumbUrl = null;
      let files = [...(this.fetchedMoonrakerFiles || [])];
      const jobBaseName = (job.filename || '').split('/').pop();
      let found = files.find((f: any) => (f.filename || '').split('/').pop() === jobBaseName);
      if (found && found.thumbnails?.length > 0) {
        const thumb = [...found.thumbnails].sort((a: any, b: any) => (b.width || 0) - (a.width || 0))[0];
        thumbUrl = `http://${IP}/server/files/gcodes/${thumb.relative_path.startsWith('/') ? thumb.relative_path.substring(1) : thumb.relative_path}`;
      }
      return {
        name: jobBaseName || 'Unknown',
        filament: job.filament_used ? `${(job.filament_used / 1000).toFixed(2)} m` : '--',
        time: job.print_duration ? `${Math.floor(job.print_duration / 3600)}h ${Math.floor((job.print_duration % 3600) / 60)}m` : '--',
        statusIcon: job.status === 'completed' ? 'yessvg.svg' : 'nosvg.svg',
        thumbUrl: thumbUrl
      };
    });
  }

  @Watch('activeFilename', { immediate: true })
  async onFilenameChange(newFilename: string) {
    const IP = "192.168.1.120";
    if (!newFilename) { this.thumbnailUrl = ''; return; }
    try {
      const safePath = newFilename.split('/').map(encodeURIComponent).join('/');
      let res = await fetch(`http://${IP}/server/files/metadata?filename=${safePath}`);
      if (!res.ok) res = await fetch(`http://${IP}/server/files/metadata?filename=${safePath}`);
      if (res.ok) {
        const data = await res.json();
        const thumbs = data.result?.thumbnails;
        if (thumbs?.length > 0) {
          const best = [...thumbs].sort((a: any, b: any) => (b.width || 0) - (a.width || 0))[0];
          this.thumbnailUrl = `http://${IP}/server/files/gcodes/${best.relative_path.startsWith('/') ? best.relative_path.substring(1) : best.relative_path}`;
          return;
        }
      }
    } catch (e) {}
    this.thumbnailUrl = '';
  }

  get activeFilename() { return this.printer?.print_stats?.filename || ''; }
  get queuedJobs() { return this.$store.state.jobQueue?.queued_jobs || []; }
  get currentCam() { const cams = this.$store.getters['gui/webcams/getWebcams']; return cams?.[0] || { service: 'mjpeg', stream_url: '' }; }
  get printer() { return this.$store.state.printer || {} }
  get isPrinting() { return this.printer?.print_stats?.state === 'printing'; }
  get isPaused() { return this.printer?.print_stats?.state === 'paused'; }
  get isStandby() { return !(this.isPrinting || this.isPaused); }
  get dynamicStartIcon() { return this.isPrinting ? 'pausesvg.svg' : 'playsvg.svg'; }
  dynamicStartAction() { if (this.isPrinting) this.$socket.emit('printer.print.pause'); else if (this.isPaused) this.$socket.emit('printer.print.resume'); }
  toggleFullscreen() { const el = this.$refs.mediaBox as HTMLElement; if (!document.fullscreenElement) el.requestFullscreen(); else if (document.exitFullscreen) document.exitFullscreen(); }
  setTemperature(heater: string, value: any) { this.$socket.emit('printer.gcode.script', { script: `SET_HEATER_TEMPERATURE HEATER=${heater} TARGET=${parseInt(value)}` }); }
  get displayProgress() { return Math.floor((this.printer?.display_status?.progress || 0) * 100); }
  get printEstimate() { 
    const p = this.printer?.display_status?.progress || 0;
    if (p > 0 && p < 1) {
      const rem = (this.printer?.print_stats?.print_duration / p) - this.printer?.print_stats?.print_duration;
      return `${Math.floor(rem / 3600).toString().padStart(2, '0')}:${Math.floor((rem % 3600) / 60).toString().padStart(2, '0')}`;
    }
    return '--:--';
  }
  get totalTime() { 
    const p = this.printer?.display_status?.progress || 0;
    if (p > 0) {
      const tot = (this.printer?.print_stats?.print_duration || 0) / p;
      return `${Math.floor(tot / 3600)}h ${Math.floor((tot % 3600) / 60)}m`;
    }
    return '--h --m';
  }
  get etaTime() { return this.$store.getters['printer/getEstimatedTimeETAFormat'] || '--:--'; }
  get displayFans() { return (this.$store.getters['printer/getMiscellaneous'] || []).filter((f: any) => f && f.name && !f.name.toLowerCase().includes('hotend') && !f.name.toLowerCase().includes('led')); }
  get displayLeds() { return this.ledItems; }
  onLedToggle(led: LedItem) { if (led.enabled) this.$socket.emit('printer.gcode.script', { script: `SET_LED LED=${led.klipperName} WHITE=1` }); else this.$socket.emit('printer.gcode.script', { script: `SET_LED LED=${led.klipperName} WHITE=0` }); }
  onLedBrightnessChange(led: LedItem) { this.$socket.emit('printer.gcode.script', { script: `SET_LED LED=${led.klipperName} WHITE=${led.brightness/100}` }); }
  get mainStats() { return [
    { label: 'Speed', value: this.printer?.motion_report?.live_velocity?.toFixed(0) || '0', unit: 'mm/s' },
    { label: 'Flow', value: (2.405 * (this.printer?.motion_report?.live_extruder_velocity || 0)).toFixed(1), unit: 'mm³/s' },
    { label: 'Layer', value: `${this.printer?.print_stats?.info?.current_layer || 0} / ${this.printer?.print_stats?.info?.total_layer || 0}`, unit: '' },
    { label: 'FILAMENT', value: ((this.printer?.print_stats?.filament_used || 0) / 1000).toFixed(2), unit: 'm' }
  ];}
  getSensorData(name: string) {
    const s = name.toLowerCase().replace(/_/g, '');
    for (const key in this.printer) {
      if (key.includes('temperature_sensor') || key.includes('heater_generic')) {
        if (key.toLowerCase().replace(/[_ ]/g, '').includes(s)) return { temp: this.printer[key].temperature.toFixed(1), target: this.printer[key].target?.toFixed(0) };
      }
    }
    return { temp: '--.-', target: null };
  }
  get orderedTemperatureCards() {
    const chamber = this.getSensorData('chamber');
    const cb = this.getSensorData('controllerboard');
    const soc = this.getSensorData('soc');
    const thc = this.getSensorData('toolheadcontroller');
    const ths = this.getSensorData('toolheadscanner');
    return [
      { n: 'EXTRUDER', k: 'extruder', v: this.printer?.extruder?.temperature?.toFixed(1) || '0.0', t: this.printer?.extruder?.target?.toFixed(0) || '0', i: 'nozzlesvg.svg' },
      { n: 'BED', k: 'heater_bed', v: this.printer?.heater_bed?.temperature?.toFixed(1) || '0.0', t: this.printer?.heater_bed?.target?.toFixed(0) || '0', i: 'temperature_platesvg.svg' },
      { n: 'CHAMBER', v: chamber.temp, t: chamber.target, i: 'chamber_temperaturesvg.svg' },
      { n: 'CTRL BOARD', v: cb.temp, t: cb.target, i: 'hot_temperaturesvg.svg' },
      { n: 'SOC', v: soc.temp, t: soc.target, i: 'temperaturesvg.svg' },
      { n: 'TOOLHEAD', v: thc.temp, t: thc.target, i: 'temperaturesvg.svg' },
      { n: 'SCANNER', v: ths.temp, t: ths.target, i: 'sensorssvg.svg' }
    ];
  }
  get visibleTemperatureCards() { return this.isAdvancedMode ? this.orderedTemperatureCards : this.orderedTemperatureCards.slice(0, 3); }
}
</script>

<style scoped>
.inner-rounded, .stat-card, .temp-card, .fans-vertical-wrapper, .clean-tabs-wrapper, .standby-wrapper { border-radius: 12px !important; background: rgba(255,255,255,0.05) !important; }
.clean-tabs-wrapper { padding: 4px; border: 1px solid rgba(255,255,255,0.1); }
.tab-btn { font-weight: 800 !important; height: 38px !important; }
.active-tab { background: rgba(255,255,255,0.15) !important; color: #fff !important; }
.inactive-tab { background: transparent !important; color: rgba(255,255,255,0.7) !important; }
.media-container { width: 100%; aspect-ratio: 4/3; background: #000; position: relative; overflow: hidden; border-radius: 15px !important; }
@media (min-width: 600px) { .media-container { aspect-ratio: auto; min-height: 350px; } }
@media (min-width: 960px) { .media-container { min-height: 450px; } }
.media-container:fullscreen { aspect-ratio: auto !important; height: 100vh !important; }
::v-deep .webcam-hero { display: flex !important; align-items: center !important; justify-content: center !important; }
::v-deep .webcam-hero img { max-width: 100% !important; max-height: 100% !important; object-fit: contain !important; margin: auto !important; }
.no-thumb-bg { background: rgba(255, 255, 255, 0.05) !important; }
.absolute-fill-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
.media-controls-overlay { position: absolute; bottom: 0; left: 0; width: 100%; z-index: 99; pointer-events: none; }
.fs-btn-clean { pointer-events: auto !important; background: rgba(0,0,0,0.6) !important; margin: 15px; border-radius: 8px !important; border: 1px solid rgba(255,255,255,0.1) !important; }
.standby-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4) !important; z-index: 10; }
.standby-mini-tabs { display: flex; height: 36px; margin: 0 16px; border-radius: 4px; gap: 40px; }
.mini-tab { display: flex; align-items: center; justify-content: center; padding: 4px 8px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s ease; opacity: 0.4; color: #ffffff; }
.mini-tab .tab-icon { filter: brightness(0) invert(1); transition: all 0.2s ease; }
.active-mini-tab { opacity: 1 !important; border-bottom: 2px solid #2196f3 !important; color: #2196f3 !important; }
.active-mini-tab .tab-icon { filter: brightness(0) invert(56%) sepia(91%) saturate(3015%) hue-rotate(188deg) brightness(101%) contrast(97%) !important; }
.stat-card { text-align: center; }
.temp-card { width: 100%; min-height: 58px; margin-bottom: 8px; }
.fan-card-compact { background: rgba(0,0,0,0.15); margin-bottom: 8px; border-radius: 8px; }
::v-deep .slider-wrapper-hide-label .v-icon + span { display: none !important; }
.target-input { width: 44px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: #fff; text-align: center; outline: none; font-size: 0.9rem; -moz-appearance: textfield !important; appearance: textfield !important; }
.target-input::placeholder { color: #fff; opacity: 1; }
.target-input::-webkit-outer-spin-button, .target-input::-webkit-inner-spin-button { -webkit-appearance: none !important; appearance: none !important; display: none !important; margin: 0 !important; }
.standby-content { flex: 1 1 auto; overflow-y: auto !important; min-height: 0 !important; padding: 8px !important; }
.white--text { color: #fff !important; }
.h-100 { height: 100% !important; }
.w-100 { width: 100% !important; }
.relative { position: relative; }
</style>