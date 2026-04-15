<template>
  <panel
    title="Machine Control & Tools"
    icon="mdi-tools"
    card-class="blocks-axis-panel"
    center-title
  >
    <div class="pa-8">
      <v-row align="stretch" justify="center" style="gap: 10%;">
        
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
              <div class="control-module d-flex justify-center px-6 py-10">
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
          <div class="dark-wrapper d-flex flex-row align-stretch h-100" style="gap: 20px;">
            
            <div class="control-module pa-3 d-flex flex-column align-center right-module" style="width: 115px; flex-shrink: 0;">
              <div class="d-flex align-center mb-6 mt-2">
                <v-icon x-small color="grey lighten-1" class="mr-1">mdi-speedometer</v-icon>
                <span class="section-title" style="font-size: 0.7rem; letter-spacing: 1px;">SPEED</span>
              </div>
              
              <v-slider
                v-model="speedFactor"
                vertical
                min="1"
                max="200"
                hide-details
                color="blue"
                track-color="rgba(255,255,255,0.1)"
                thumb-size="24"
                track-size="6"
                height="300"
                @change="updateSpeedFactor"
              />

              <v-text-field
                v-model.number="speedFactor"
                type="number"
                dense
                outlined
                hide-details
                suffix="%"
                class="sleek-input mt-6 mb-2"
                style="max-width: 85px;"
                @change="updateSpeedFactor"
              />
            </div>

            <div class="control-module pa-6 d-flex flex-column right-module" style="flex: 1; justify-content: space-between;">
              
              <div>
                <div class="d-flex align-center mb-4">
                  <v-icon small color="grey lighten-1" class="mr-3">mdi-printer-3d-nozzle</v-icon>
                  <span class="section-title">EXTRUDER FACTOR</span>
                </div>
                <v-row align="center" no-gutters>
                  <v-col cols="8">
                    <v-slider v-model="extrusionFactor" min="1" max="200" hide-details color="blue" track-color="rgba(255,255,255,0.05)" @change="updateExtrusionFactor" />
                  </v-col>
                  <v-col cols="4" class="pl-4">
                    <v-text-field v-model.number="extrusionFactor" type="number" dense outlined hide-details suffix="%" class="sleek-input" @change="updateExtrusionFactor" />
                  </v-col>
                </v-row>
              </div>

              <v-row align="end" no-gutters style="gap: 20px;">
                
                <v-col cols="6" class="d-flex flex-column" style="gap: 15px;">
                  <v-row no-gutters style="gap: 10px;">
                    <v-col>
                      <span class="micro-label">PRESSURE ADVANCE</span>
                      <v-text-field v-model="pressureAdvance" type="number" dense outlined hide-details suffix="s" class="sleek-input" @change="updatePressureAdvance" />
                    </v-col>
                    <v-col>
                      <span class="micro-label">SMOOTH TIME</span>
                      <v-text-field v-model="smoothTime" type="number" dense outlined hide-details suffix="s" class="sleek-input" @change="updatePressureAdvance" />
                    </v-col>
                  </v-row>
                  <v-row no-gutters style="gap: 10px;">
                    <v-col>
                      <span class="micro-label">FILAMENT LENGTH</span>
                      <v-text-field v-model.number="extrudeLength" type="number" dense outlined hide-details suffix="mm" class="sleek-input mb-2" />
                      <div class="d-flex justify-space-between px-1">
                        <v-btn v-for="n in [50, 25, 10, 5, 1]" :key="`len-${n}`" x-small depressed class="pill-btn" @click="extrudeLength = n">{{ n }}</v-btn>
                      </div>
                    </v-col>
                    <v-col>
                      <span class="micro-label">FEEDRATE</span>
                      <v-text-field v-model.number="extrudeRate" type="number" dense outlined hide-details suffix="mm/s" class="sleek-input mb-2" />
                      <div class="d-flex justify-space-between px-1">
                        <v-btn v-for="n in [10, 5, 2, 1]" :key="`feed-${n}`" x-small depressed class="pill-btn" @click="extrudeRate = n">{{ n }}</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col class="d-flex flex-column justify-end" style="gap: 10px;">
                  <v-btn block color="warning darken-1" class="font-weight-black rounded-lg" height="44" depressed @click="runExtrusion('retract')">RETRACT</v-btn>
                  <v-btn block color="blue" class="font-weight-black rounded-lg" height="44" depressed @click="runExtrusion('extrude')">EXTRUDE</v-btn>
                  <v-row no-gutters style="gap: 10px;">
                    <v-col>
                      <v-btn block color="teal" class="font-weight-black rounded-lg" height="44" depressed @click="sendGcode('LOAD_FILAMENT')">LOAD</v-btn>
                    </v-col>
                    <v-col>
                      <v-btn block color="error" class="font-weight-black rounded-lg" height="44" depressed @click="sendGcode('UNLOAD_FILAMENT')">UNLOAD</v-btn>
                    </v-col>
                  </v-row>
                </v-col>

              </v-row>
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

.micro-label {
  font-size: 0.65rem;
  color: #757575;
  text-transform: uppercase;
  display: block;
  margin-bottom: 6px;
  font-weight: 700;
}

.sleek-input ::v-deep fieldset {
  border-color: rgba(255,255,255,0.08) !important;
}

.sleek-input ::v-deep input {
  text-align: center;
  font-weight: bold;
  color: #fff !important;
}

.pill-btn {
  background: rgba(247, 0, 0, 0.04) !important;
  min-width: 0 !important;
  padding: 0 6px !important;
  color: #888 !important;
  border-radius: 4px !important;
  font-size: 0.65rem !important;
}

.w-100 { width: 100% !important; }
.h-100 { height: 100% !important; }
</style>