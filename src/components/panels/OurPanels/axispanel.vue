<template>
  <panel title="Machine Control & Tools" icon="mdi-tools" card-class="blocks-axis-panel" center-title>
    <div class="pa-4">
      <v-row align="stretch" justify="center">

        <v-col cols="12" lg="6" xl="4" class="d-flex flex-column mb-4 px-3">
          <div class="dark-wrapper d-flex flex-column flex-sm-row align-stretch w-100 h-100" style="gap: 15px;">
            
            <div class="d-flex flex-column py-1 h-100 w-100" style="flex: 1;">
              <div class="control-module z-offset-box d-flex flex-column align-center px-4 py-8 h-100 w-100">
                <span class="section-title mb-4">Z-OFFSET</span>
                <v-btn class="unified-btn mb-1" depressed @click="adjustZOffset(0.05)">+0.05</v-btn>
                <v-btn class="unified-btn mb-1" depressed @click="adjustZOffset(0.01)">+0.01</v-btn>
                <v-btn class="unified-btn mb-4" depressed @click="adjustZOffset(0.005)">+0.005</v-btn>

                <v-spacer></v-spacer>
                <div class="z-value-glow my-2">{{ zOffsetLocal.toFixed(3) }}</div>
                <v-spacer></v-spacer>

                <v-btn class="unified-btn mb-1 mt-4" depressed @click="adjustZOffset(-0.005)">-0.005</v-btn>
                <v-btn class="unified-btn mb-1" depressed @click="adjustZOffset(-0.01)">-0.01</v-btn>
                <v-btn class="unified-btn mb-4" depressed @click="adjustZOffset(-0.05)">-0.05</v-btn>

                <v-btn class="unified-btn mb-2" depressed icon @click="adjustZOffset(0.1)">
                  <img src="/img/icons/blocks_icons/afastar_aproximar_aproximar.svg" width="24" height="24" />
                </v-btn>

                <v-btn class="unified-btn" depressed icon @click="adjustZOffset(-0.1)">
                  <img src="/img/icons/blocks_icons/afastar_aproximar_afastar.svg" width="24" height="24" />
                </v-btn>
              </div>
            </div>

            <div class="d-flex flex-column justify-start py-1 w-100" style="flex: 1.5; gap: 15px;">
              <div class="control-module d-flex justify-center px-4 py-8 h-100" style="gap: 20px;">
                <div v-for="axis in ['X', 'Y', 'Z']" :key="axis" class="axis-col d-flex flex-column align-center">
                  <template v-if="axis === 'Z'">
                    <v-btn class="unified-btn mb-2" depressed @click="moveAxis('Z', 25)">+25</v-btn>
                    <v-btn class="unified-btn mb-2" depressed @click="moveAxis('Z', 1)">+1</v-btn>
                    <v-btn class="unified-btn mb-4" depressed @click="moveAxis('Z', 0.1)">+0.1</v-btn>
                  </template>
                  <template v-else>
                    <v-btn class="unified-btn mb-2" depressed @click="moveAxis(axis, 100)">+100</v-btn>
                    <v-btn class="unified-btn mb-2" depressed @click="moveAxis(axis, 10)">+10</v-btn>
                    <v-btn class="unified-btn mb-4" depressed @click="moveAxis(axis, 1)">+1</v-btn>
                  </template>

                  <v-btn height="40" width="40" min-width="40" :color="axisColor(axis)" class="my-1 elevation-3 font-weight-bold rounded-lg" @click="homeAxis(axis)">
                    {{ axis }}
                  </v-btn>

                  <template v-if="axis === 'Z'">
                    <v-btn class="unified-btn mb-2 mt-4" depressed @click="moveAxis('Z', -0.1)">-0.1</v-btn>
                    <v-btn class="unified-btn mb-2" depressed @click="moveAxis('Z', -1)">-1</v-btn>
                    <v-btn class="unified-btn" depressed @click="moveAxis('Z', -25)">-25</v-btn>
                  </template>
                  <template v-else>
                    <v-btn class="unified-btn mb-2 mt-4" depressed @click="moveAxis(axis, -1)">-1</v-btn>
                    <v-btn class="unified-btn mb-2" depressed @click="moveAxis(axis, -10)">-10</v-btn>
                    <v-btn class="unified-btn" depressed @click="moveAxis(axis, -100)">-100</v-btn>
                  </template>
                </div>
              </div>
              <div class="control-module d-flex justify-space-between flex-wrap px-3 py-3" style="gap: 10px;">
                <v-btn class="bottom-action-btn flex-grow-1 font-weight-bold rounded-lg" height="40" depressed @click="sendGcode('G28')">HOME ALL</v-btn>
                <v-btn class="bottom-action-btn flex-grow-1 font-weight-bold rounded-lg" height="40" depressed @click="sendGcode('M84')">MOTORS OFF</v-btn>
                <v-btn class="bottom-action-btn flex-grow-1 font-weight-bold rounded-lg" height="40" depressed @click="sendGcode('MACRO_1')">Z TILT</v-btn>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" lg="6" xl="4" class="d-flex flex-column mb-4 px-3">
          <div class="dark-wrapper d-flex flex-column flex-sm-row align-stretch h-100 w-100" style="gap: 15px;">
            <div class="d-flex flex-column py-1 h-100 align-center">
              <div class="control-module pa-3 d-flex flex-column align-center justify-center h-100 w-100" style="min-width: 110px; gap: 24px;"> 
                <span class="d-flex align-center">
                  <v-icon x-small color="grey lighten-1" class="mr-1">mdi-speedometer</v-icon>
                  <span class="section-title">SPEED</span>
                </span>
                <v-slider v-model="speedFactor" vertical min="1" max="200" hide-details color="blue" track-color="rgba(255,255,255,0.1)" thumb-size="32" track-size="8" class="big-slider flex-grow-1 my-4" @change="updateSpeedFactor" />
                <v-text-field v-model.number="speedFactor" type="number" step="any" dense outlined hide-details suffix="%" class="sleek-input" style="max-width: 95px;" @change="updateSpeedFactor" />
              </div>
            </div>
            <div class="d-flex flex-column py-1 w-100" style="gap: 15px; flex: 1;">
              <div class="control-module pa-6">
                <div class="d-flex align-center mb-4">
                  <v-icon small color="grey lighten-1" class="mr-3">mdi-printer-3d-nozzle</v-icon>
                  <span class="section-title">EXTRUDER FACTOR</span>
                </div>
                <v-row align="center" no-gutters>
                  <v-col cols="8" class="pr-2"><v-slider v-model="extrusionFactor" min="1" max="200" hide-details color="blue" track-color="rgba(255,255,255,0.05)" @change="updateExtrusionFactor" /></v-col>
                  <v-col cols="4"><v-text-field v-model.number="extrusionFactor" type="number" step="any" dense outlined hide-details suffix="%" class="sleek-input" @change="updateExtrusionFactor" /></v-col>
                </v-row>
              </div>

              <div class="control-module pa-6 d-flex flex-column justify-center h-100" style="gap: 30px;">
                <div class="d-flex flex-row justify-center flex-wrap" style="gap: 15px;">
                  <div class="d-flex flex-column" style="gap: 15px; flex: 1; min-width: 120px;">
                    <span class="micro-label">PRESSURE ADVANCE</span>
                    <v-text-field v-model="pressureAdvance" type="number" dense outlined hide-details suffix="s" class="sleek-input mt-1" @change="updatePressureAdvance" />
                    <span class="micro-label">FILAMENT LENGTH</span>
                    <v-text-field v-model.number="extrudeLength" type="number" dense outlined hide-details suffix="mm" class="sleek-input mt-1 mb-1" />
                    <div class="d-flex flex-row" style="gap: 4px;">
                      <v-btn v-for="n in [50, 10, 1]" :key="`len-${n}`" x-small depressed class="pill-btn flex-grow-1" @click="extrudeLength = n">{{ n }}</v-btn>
                    </div>
                  </div>
                  <div class="d-flex flex-column" style="gap: 15px; flex: 1; min-width: 120px;">
                    <span class="micro-label">SMOOTH TIME</span>
                    <v-text-field v-model="smoothTime" type="number" dense outlined hide-details suffix="s" class="sleek-input mt-1" @change="updatePressureAdvance" />
                    <span class="micro-label">FEEDRATE</span>
                    <v-text-field v-model.number="extrudeRate" type="number" dense outlined hide-details suffix="mm/s" class="sleek-input mt-1 mb-1" />
                    <div class="d-flex flex-row" style="gap: 4px;">
                      <v-btn v-for="n in [10, 5, 1]" :key="`feed-${n}`" x-small depressed class="pill-btn flex-grow-1" @click="extrudeRate = n">{{ n }}</v-btn>
                    </div>
                  </div>
                </div>

                <div class="d-flex flex-column align-center" style="gap: 8px;">
                  <div class="d-flex flex-row flex-wrap justify-center w-100" style="gap: 8px;">
                    <v-btn class="font-weight-black rounded-lg flex-grow-1" color="warning darken-1" height="40" depressed @click="runExtrusion('retract')">RETRACT</v-btn>
                    <v-btn class="font-weight-black rounded-lg flex-grow-1" color="blue" height="40" depressed @click="runExtrusion('extrude')">EXTRUDE</v-btn>
                  </div>
                  <div class="d-flex flex-row flex-wrap justify-center w-100" style="gap: 8px;">
                    <v-btn class="font-weight-black rounded-lg flex-grow-1" color="teal" height="40" depressed @click="sendGcode('LOAD_FILAMENT')">LOAD</v-btn>
                    <v-btn class="font-weight-black rounded-lg flex-grow-1" color="error" height="40" depressed @click="sendGcode('UNLOAD_FILAMENT')">UNLOAD</v-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" lg="12" xl="4" class="d-flex flex-column mb-4 px-3">
          <div class="dark-wrapper d-flex flex-column align-stretch h-100 w-100 pa-4" style="gap: 15px;">
            <div class="d-flex align-center mb-2 flex-shrink-0">
              <v-icon small color="grey lighten-1" class="mr-3">mdi-palette-swatch</v-icon>
              <span class="section-title">MMU CONTROL</span>
            </div>
            
            <div class="mmu-fix-wrapper w-100 flex-grow-1 overflow-y-auto overflow-x-hidden">
              <div class="mmu-scale-wrapper">
                <mmu-panel class="custom-mmu-panel" />
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
import Panel from '@/components/ui/Panel.vue'
import BaseMixin from '@/components/mixins/base'
import MmuPanel from '@/components/panels/MmuPanel.vue' 

@Component({ components: { Panel, MmuPanel } }) 
export default class AxisPanel extends Mixins(BaseMixin) {
  zOffsetLocal = 0
  speedFactor = 100
  extrusionFactor = 100
  pressureAdvance = 0.055
  smoothTime = 0.04
  extrudeLength = 50
  extrudeRate = 5

  axisColor(axis: string) {
    if (axis === 'X') return '#ff5252'
    if (axis === 'Y') return '#4caf50'
    return '#2196f3'
  }

  @Watch('printer.gcode_move.homing_origin', { immediate: true, deep: true })
  onHomingOriginChange(newVal: any) {
    if (newVal && newVal[2] !== undefined) this.zOffsetLocal = newVal[2];
  }

  moveAxis(axis: string, dist: number) {
    this.$socket.emit('printer.gcode.script', { script: `G91\nG1 ${axis}${dist} F6000\nG90` });
  }

  homeAxis(axis: string) {
    this.$socket.emit('printer.gcode.script', { script: `G28 ${axis}` });
  }

  adjustZOffset(step: number) {
    this.$socket.emit('printer.gcode.script', { script: `SET_GCODE_OFFSET Z_ADJUST=${step} MOVE=1` });
  }

  updateSpeedFactor() {
    this.$socket.emit('printer.gcode.script', { script: `M220 S${this.speedFactor}` });
  }

  updateExtrusionFactor() {
    this.$socket.emit('printer.gcode.script', { script: `M221 S${this.extrusionFactor}` });
  }

  updatePressureAdvance() {
    this.$socket.emit('printer.gcode.script', { script: `SET_PRESSURE_ADVANCE ADVANCE=${this.pressureAdvance} SMOOTH_TIME=${this.smoothTime}` });
  }

  runExtrusion(type: 'extrude' | 'retract') {
    const dir = type === 'extrude' ? '' : '-';
    const speed = this.extrudeRate * 60;
    this.$socket.emit('printer.gcode.script', { script: `G91\nG1 E${dir}${this.extrudeLength} F${speed}\nG90` });
  }

  sendGcode(script: string) {
    this.$socket.emit('printer.gcode.script', { script });
  }
}
</script>

<style scoped>
::v-deep .blocks-axis-panel {
  background: linear-gradient(145deg, #1c1c22, #141419) !important;
  border-radius: 16px !important;
}
.dark-wrapper {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding: 10px;
}
.control-module {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
}
.section-title { font-size: 0.7rem; letter-spacing: 1.2px; font-weight: 700; color: #9e9e9e; text-transform: uppercase; }
.z-value-glow { font-size: 1.5rem; font-weight: 900; color: #ffffff; text-shadow: 0 0 12px rgba(255, 255, 255, 0.2); }
.micro-label { font-size: 0.65rem; color: #757575; text-transform: uppercase; display: block; margin-top: 10px; margin-bottom: 4px; font-weight: 700; }
.unified-btn {
  background: rgba(247, 202, 0, 0.04) !important;
  color: #b0bec5 !important;
  border-radius: 8px !important;
}
.bottom-action-btn { background: rgba(255, 255, 255, 0.05) !important; color: #b0bec5 !important; }
.pill-btn { background: rgba(255, 255, 255, 0.05) !important; color: #888 !important; border-radius: 4px !important; font-size: 0.65rem !important; }
.sleek-input ::v-deep .v-input__slot { min-height: 32px !important; height: 32px !important; padding: 0 12px !important; }

/* MMU UI Scaling */
.mmu-fix-wrapper { position: relative; min-height: 400px; overflow-x: hidden; }
.mmu-scale-wrapper {
  transform: scale(0.80);
  transform-origin: top center;
  width: 125%;
  margin-left: -12.5%;
}

/* MMU UI Cleanup */
::v-deep .custom-mmu-panel > .v-card { background: transparent !important; box-shadow: none !important; }
::v-deep .custom-mmu-panel header { display: none !important; }
::v-deep .custom-mmu-panel .v-card__text { padding: 0 !important; }

/* REMOVE CLOG METER - Target elements without volatile IDs */
::v-deep .custom-mmu-panel .mmu-clog-meter,
::v-deep .custom-mmu-panel div[class*="clog"],
::v-deep .custom-mmu-panel div[class*="Clog"],
::v-deep .custom-mmu-panel .v-card__text > .row > .col-5:last-child,
::v-deep .custom-mmu-panel svg + div.text-center {
  display: none !important;
}
</style>