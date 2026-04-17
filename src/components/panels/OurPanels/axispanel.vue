<template>
  <panel
    title="Machine Control & Tools"
    icon="mdi-tools"
    card-class="blocks-axis-panel"
    center-title
  >
    <div class="pa-8">
      <v-row align="stretch" justify="center" style="gap: 5%;">
        
        <v-col cols="12" lg="auto" class="d-flex justify-center align-self-start px-0">
          <div class="dark-wrapper d-flex flex-row align-stretch w-100" style="gap: 20px;">
            <div class="d-flex flex-column py-1 h-100">
              <div class="control-module z-offset-box d-flex flex-column align-center px-6 py-10 h-100">
                <span class="section-title mb-4">Z-OFFSET</span>
                <v-btn class="unified-btn mb-1" depressed @click="adjustZOffset(0.05)">+0.05</v-btn>
                <v-btn class="unified-btn mb-1" depressed @click="adjustZOffset(0.01)">+0.01</v-btn>
                <v-btn class="unified-btn mb-4" depressed @click="adjustZOffset(0.005)">+0.005</v-btn>
                <v-spacer></v-spacer>
                <div class="z-value-glow my-2">{{ zOffsetLocal.toFixed(3) }}</div>
                <v-spacer></v-spacer>
                <v-btn class="unified-btn mb-1 mt-4" depressed @click="adjustZOffset(-0.005)">-0.005</v-btn>
                <v-btn class="unified-btn mb-1" depressed @click="adjustZOffset(-0.01)">-0.01</v-btn>
                <v-btn class="unified-btn" depressed @click="adjustZOffset(-0.05)">-0.05</v-btn>
              </div>
            </div>

            <div class="d-flex flex-column justify-start py-1" style="flex: 1; gap: 20px;">
              <div class="control-module d-flex justify-center px-7 py-10" style="gap: 35px;">
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
                  <v-btn fab small :color="axisColor(axis)" class="my-2 elevation-3 font-weight-bold" @click="homeAxis(axis)">{{ axis }}</v-btn>
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
              <div class="control-module d-flex justify-space-between flex-wrap px-6 py-4" style="gap: 12px;">
                <v-btn class="bottom-action-btn flex-grow-1 font-weight-bold rounded-lg" height="40" depressed @click="sendGcode('G28')">HOME ALL</v-btn>
                <v-btn class="bottom-action-btn flex-grow-1 font-weight-bold rounded-lg" height="40" depressed @click="sendGcode('M84')">MOTORS OFF</v-btn>
                <v-btn class="bottom-action-btn flex-grow-1 font-weight-bold rounded-lg" height="40" depressed @click="sendGcode('MACRO_1')">Z TILT</v-btn>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" lg="auto" class="d-flex justify-center mt-8 mt-lg-0 px-0">
          <div class="dark-wrapper d-flex flex-row align-stretch h-100" style="gap: 20px; min-height: 450px;">            
            
            <div class="d-flex flex-column py-1 h-100">
              <div class="control-module pa-3 d-flex flex-column align-center justify-center h-100" style="width: 110px; gap: 24px;"> 
                <span class="d-flex align-center">
                  <v-icon x-small color="grey lighten-1" class="mr-1">mdi-speedometer</v-icon>
                  <span class="section-title" style="font-size: 0.65rem; letter-spacing: 1px;">SPEED</span>
                </span>
                
                <v-slider
                  v-model="speedFactor"
                  vertical
                  min="1"
                  max="200"
                  hide-details
                  color="blue"
                  track-color="rgba(255,255,255,0.1)"
                  thumb-size="32"
                  track-size="8"
                  style="height: 300px;" 
                  class="big-slider"
                  @change="updateSpeedFactor"
                />

                <v-text-field
                  v-model.number="speedFactor"
                  type="number"
                  step="any"
                  dense outlined hide-details suffix="%"
                  class="sleek-input"
                  style="max-width: 95px;" @change="updateSpeedFactor"
                />
              </div>
            </div>

            <div class="d-flex flex-column py-1" style="gap: 20px; flex: 1;">
              
              <div class="control-module pa-6">
                <div class="d-flex align-center mb-4">
                  <v-icon small color="grey lighten-1" class="mr-3">mdi-printer-3d-nozzle</v-icon>
                  <span class="section-title">EXTRUDER FACTOR</span>
                </div>
                <v-row align="center" no-gutters>
                  <v-col cols="8">
                    <v-slider v-model="extrusionFactor" min="1" max="200" hide-details color="blue" track-color="rgba(255,255,255,0.05)" @change="updateExtrusionFactor" />
                  </v-col>
                  <v-col cols="4" class="pl-4">
                    <v-text-field v-model.number="extrusionFactor" type="number" step="any" dense outlined hide-details suffix="%" class="sleek-input" @change="updateExtrusionFactor" />
                  </v-col>
                </v-row>
              </div>

              <div class="control-module pa-6 d-flex flex-column justify-center" style="gap: 50px; flex: 1;">
  
                <div class="d-flex flex-row justify-center" style="gap: 15px;">
                  <div class="d-flex flex-column" style="gap: 15px; width: 40%;">
                    <div>
                      <span class="micro-label">PRESSURE ADVANCE</span>
                      <v-text-field
                        v-model="pressureAdvance"
                        type="number"
                        step="any"
                        dense outlined hide-details suffix="s"
                        class="sleek-input mt-1"
                        @change="updatePressureAdvance"
                      />
                    </div>
                    <div>
                      <span class="micro-label">FILAMENT LENGTH</span>
                      <v-text-field
                        v-model.number="extrudeLength"
                        type="number"
                        step="any"
                        dense outlined hide-details suffix="mm"
                        class="sleek-input mt-1 mb-1"
                      />
                      <div class="d-flex flex-row" style="gap: 4px;">
                        <v-btn v-for="n in [50, 10, 1]" :key="`len-${n}`" x-small depressed class="pill-btn flex-grow-1" style="min-width: 0;" @click="extrudeLength = n">{{ n }}</v-btn>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex flex-column" style="gap: 15px; width: 40%;">
                    <div>
                      <span class="micro-label">SMOOTH TIME</span>
                      <v-text-field
                        v-model="smoothTime"
                        type="number"
                        step="any"
                        dense outlined hide-details suffix="s"
                        class="sleek-input mt-1"
                        @change="updatePressureAdvance"
                      />
                    </div>
                    <div>
                      <span class="micro-label">FEEDRATE</span>
                      <v-text-field
                        v-model.number="extrudeRate"
                        type="number"
                        step="any"
                        dense outlined hide-details suffix="mm/s"
                        class="sleek-input mt-1 mb-1"
                      />
                      <div class="d-flex flex-row" style="gap: 4px;">
                        <v-btn v-for="n in [10, 5, 1]" :key="`feed-${n}`" x-small depressed class="pill-btn flex-grow-1" style="min-width: 0;" @click="extrudeRate = n">{{ n }}</v-btn>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="d-flex flex-column align-center" style="gap: 8px;">
                  <div class="d-flex flex-row" style="gap: 8px;">
                    <v-btn class="font-weight-black rounded-lg" color="warning darken-1" height="40" width="200" depressed @click="runExtrusion('retract')">RETRACT</v-btn>
                    <v-btn class="font-weight-black rounded-lg" color="blue" height="40" width="200" depressed @click="runExtrusion('extrude')">EXTRUDE</v-btn>
                  </div>
                  <div class="d-flex flex-row" style="gap: 8px;">
                    <v-btn class="font-weight-black rounded-lg" color="teal" height="40" width="200" depressed @click="sendGcode('LOAD_FILAMENT')">LOAD</v-btn>
                    <v-btn class="font-weight-black rounded-lg" color="error" height="40" width="200" depressed @click="sendGcode('UNLOAD_FILAMENT')">UNLOAD</v-btn>
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
import Panel from '@/components/ui/Panel.vue'
import BaseMixin from '@/components/mixins/base'

@Component({ components: { Panel } })
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
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
}

.dark-wrapper {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  box-shadow: inset 0 6px 24px rgba(0, 0, 0, 0.15);
}

.control-module {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  box-shadow: inset 0 4px 20px rgba(0,0,0,0.1);
}

.z-offset-box {
  min-width: 130px;
}

.right-module {
  width: 440px;
  max-width: 100%;
}

.axis-movement-box {
  flex: 0 1 auto;
}

.axis-col {
  min-width: 64px;
}

.unified-btn {
  background: rgba(247, 202, 0, 0.04) !important;
  color: #b0bec5 !important;
  border-radius: 8px !important;
  width: 64px !important;
  min-width: 64px !important;
  height: 36px !important;
  font-size: 0.8rem !important;
  padding: 0 !important;
  transition: all 0.2s ease;
}

.unified-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

.bottom-action-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #b0bec5 !important;
  transition: all 0.2s ease;
}

.bottom-action-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

.section-title {
  font-size: 0.7rem;
  letter-spacing: 1.2px;
  font-weight: 700;
  color: #9e9e9e;
  text-transform: uppercase;
}

.z-value-glow {
  font-size: 1.5rem;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 0 12px rgba(255,255,255,0.2);
}

/* --- UPDATED LABEL SPACING --- */
.micro-label {
  font-size: 0.65rem;
  color: #757575;
  text-transform: uppercase;
  display: block;
  margin-top: 10px;
  margin-bottom: 4px;
  font-weight: 700;
}

div > .micro-label:first-child {
  margin-top: 0;
}

/* --- UPDATED SLEEK INPUT FIXES --- */
.sleek-input {
  margin-bottom: 4px;
}

.sleek-input ::v-deep fieldset {
  border-color: rgba(255,255,255,0.08) !important;
}

.sleek-input ::v-deep .v-input__slot {
  min-height: 32px !important; 
  height: 32px !important;
  padding: 0 12px !important; 
}

.sleek-input ::v-deep input {
  text-align: left;
  font-weight: bold;
  color: #fff !important;
  padding: 0 !important; /* Removed vertical padding causing misalignment */
}

.sleek-input ::v-deep .v-text-field__details {
  display: none !important;
}

/* Hides native browser up/down arrows that ruin input centering */
.sleek-input ::v-deep input[type=number]::-webkit-inner-spin-button, 
.sleek-input ::v-deep input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
.sleek-input ::v-deep input[type=number] {
  -moz-appearance: textfield;
}

.pill-btn {
  background: rgba(247, 0, 0, 0.04) !important;
  min-width: 0 !important;
  padding: 0 6px !important;
  color: #888 !important;
  border-radius: 4px !important;
  font-size: 0.65rem !important;
}

.big-slider ::v-deep .v-input__control,
.big-slider ::v-deep .v-input__slot,
.big-slider ::v-deep .v-slider {
  height: 100% !important;
  min-height: 100% !important;
}

.w-100 { width: 100% !important; }
.h-100 { height: 100% !important; }
</style>