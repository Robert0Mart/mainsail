<template>
  <panel
    title="Machine Control & Tools"
    icon="mdi-tools"
    card-class="blocks-axis-panel"
    center-title
  >
    <div class="pa-8">
      <v-row align="stretch">
        <v-col cols="12" lg="5" xl="5" class="d-flex justify-space-around align-center pr-lg-6 border-right">
          <div class="control-module d-flex flex-column align-center px-6 py-5 h-100 justify-center">
            <span class="section-title mb-4">Z-OFFSET</span>
            <v-btn class="numpad-btn mb-1" depressed @click="adjustZOffset(0.05)">+0.05</v-btn>
            <v-btn class="numpad-btn mb-1" depressed @click="adjustZOffset(0.01)">+0.01</v-btn>
            <v-btn class="numpad-btn mb-4" depressed @click="adjustZOffset(0.005)">+0.005</v-btn>
            <div class="z-value-glow my-2">{{ zOffsetLocal.toFixed(3) }}</div>
            <v-btn class="numpad-btn mb-1 mt-4" depressed @click="adjustZOffset(-0.005)">-0.005</v-btn>
            <v-btn class="numpad-btn mb-1" depressed @click="adjustZOffset(-0.01)">-0.01</v-btn>
            <v-btn class="numpad-btn" depressed @click="adjustZOffset(-0.05)">-0.05</v-btn>
          </div>

          <div class="control-module px-8 py-5 h-100 d-flex align-center">
            <div class="d-flex justify-center" style="gap: 20px;">
              <div class="d-flex flex-column align-center">
                <v-btn class="numpad-btn mb-1" depressed @click="moveAxis('X', 100)">+100</v-btn>
                <v-btn class="numpad-btn mb-1" depressed @click="moveAxis('X', 10)">+10</v-btn>
                <v-btn class="numpad-btn mb-4" depressed @click="moveAxis('X', 1)">+1</v-btn>
                <v-btn fab small color="#ff5252" class="my-2 elevation-3 font-weight-bold" @click="homeAxis('X')">X</v-btn>
                <v-btn class="numpad-btn mb-1 mt-4" depressed @click="moveAxis('X', -1)">-1</v-btn>
                <v-btn class="numpad-btn mb-1" depressed @click="moveAxis('X', -10)">-10</v-btn>
                <v-btn class="numpad-btn" depressed @click="moveAxis('X', -100)">-100</v-btn>
              </div>

              <div class="d-flex flex-column align-center">
                <v-btn class="numpad-btn mb-1" depressed @click="moveAxis('Y', 100)">+100</v-btn>
                <v-btn class="numpad-btn mb-1" depressed @click="moveAxis('Y', 10)">+10</v-btn>
                <v-btn class="numpad-btn mb-4" depressed @click="moveAxis('Y', 1)">+1</v-btn>
                <v-btn fab small color="#4caf50" class="my-2 elevation-3 font-weight-bold" @click="homeAxis('Y')">Y</v-btn>
                <v-btn class="numpad-btn mb-1 mt-4" depressed @click="moveAxis('Y', -1)">-1</v-btn>
                <v-btn class="numpad-btn mb-1" depressed @click="moveAxis('Y', -10)">-10</v-btn>
                <v-btn class="numpad-btn" depressed @click="moveAxis('Y', -100)">-100</v-btn>
              </div>

              <div class="d-flex flex-column align-center">
                <v-btn class="numpad-btn mb-1" depressed @click="moveAxis('Z', 25)">+25</v-btn>
                <v-btn class="numpad-btn mb-1" depressed @click="moveAxis('Z', 1)">+1</v-btn>
                <v-btn class="numpad-btn mb-4" depressed @click="moveAxis('Z', 0.1)">+0.1</v-btn>
                <v-btn fab small color="#2196f3" class="my-2 elevation-3 font-weight-bold" @click="homeAxis('Z')">Z</v-btn>
                <v-btn class="numpad-btn mb-1 mt-4" depressed @click="moveAxis('Z', -0.1)">-0.1</v-btn>
                <v-btn class="numpad-btn mb-1" depressed @click="moveAxis('Z', -1)">-1</v-btn>
                <v-btn class="numpad-btn" depressed @click="moveAxis('Z', -25)">-25</v-btn>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="4" xl="4" class="px-lg-6 mt-8 mt-lg-0 d-flex flex-column">
          <div class="control-module pa-6 mb-6">
            <div class="d-flex align-center mb-4">
              <v-icon small color="grey lighten-1" class="mr-3">mdi-speedometer</v-icon>
              <span class="section-title">SPEED FACTOR</span>
            </div>
            <v-row align="center" no-gutters>
              <v-col cols="9">
                <v-slider v-model="speedFactor" min="1" max="200" hide-details color="blue" track-color="rgba(255,255,255,0.05)" @change="updateSpeedFactor" />
              </v-col>
              <v-col cols="3" class="pl-5">
                <v-text-field v-model.number="speedFactor" type="number" dense outlined hide-details suffix="%" class="sleek-input" @change="updateSpeedFactor" />
              </v-col>
            </v-row>
          </div>

          <div class="control-module pa-6 flex-grow-1 d-flex flex-column justify-center">
            <div class="d-flex align-center mb-4">
              <v-icon small color="grey lighten-1" class="mr-3">mdi-printer-3d-nozzle</v-icon>
              <span class="section-title">EXTRUDER FACTOR</span>
            </div>
            <v-row align="center" no-gutters class="mb-6">
              <v-col cols="9">
                <v-slider v-model="extrusionFactor" min="1" max="200" hide-details color="blue" track-color="rgba(255,255,255,0.05)" @change="updateExtrusionFactor" />
              </v-col>
              <v-col cols="3" class="pl-5">
                <v-text-field v-model.number="extrusionFactor" type="number" dense outlined hide-details suffix="%" class="sleek-input" @change="updateExtrusionFactor" />
              </v-col>
            </v-row>

            <v-row dense class="mb-3" style="gap: 12px 0;">
              <v-col cols="6" class="pr-2">
                <span class="micro-label">PRESSURE ADVANCE</span>
                <v-text-field v-model="pressureAdvance" type="number" dense outlined hide-details suffix="s" class="sleek-input" @change="updatePressureAdvance" />
              </v-col>
              <v-col cols="6" class="pl-2">
                <span class="micro-label">SMOOTH TIME</span>
                <v-text-field v-model="smoothTime" type="number" dense outlined hide-details suffix="s" class="sleek-input" @change="updatePressureAdvance" />
              </v-col>
            </v-row>

            <v-row dense class="mb-6" style="gap: 12px 0;">
              <v-col cols="6" class="pr-2">
                <span class="micro-label">FILAMENT LENGTH</span>
                <v-text-field v-model.number="extrudeLength" type="number" dense outlined hide-details suffix="mm" class="sleek-input mb-2" />
                <div class="d-flex justify-space-between px-1">
                  <v-btn v-for="n in [50, 25, 10, 5, 1]" :key="`len-${n}`" x-small depressed class="pill-btn" @click="extrudeLength = n">{{ n }}</v-btn>
                </div>
              </v-col>
              
              <v-col cols="6" class="pl-2">
                <span class="micro-label">EXTRUSION FEEDRATE</span>
                <v-text-field v-model.number="extrudeRate" type="number" dense outlined hide-details suffix="mm/s" class="sleek-input mb-2" />
                <div class="d-flex justify-space-between px-1">
                  <v-btn v-for="n in [10, 5, 2, 1]" :key="`feed-${n}`" x-small depressed class="pill-btn" @click="extrudeRate = n">{{ n }}</v-btn>
                </div>
              </v-col>
            </v-row>

            <v-row dense style="gap: 0 12px;" class="mt-auto">
              <v-col cols="6">
                <v-btn block color="warning darken-1" class="font-weight-black rounded-lg" height="44" depressed @click="runExtrusion('retract')">
                  RETRACT
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="blue" class="font-weight-black rounded-lg" height="44" depressed @click="runExtrusion('extrude')">
                  EXTRUDE
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="3" xl="3" class="pl-lg-6 mt-8 mt-lg-0 border-left">
          <div class="control-module pa-6 h-100 d-flex flex-column">
            <div class="d-flex align-center mb-6">
              <v-icon small color="grey lighten-1" class="mr-3">mdi-flash</v-icon>
              <span class="section-title">QUICK MACROS</span>
            </div>
            
            <div class="d-flex flex-column flex-grow-1 justify-space-around" style="gap: 16px;">
              <v-btn block class="macro-btn glow-green" height="54" @click="runMacro('PRINT_START')">
                <v-icon left>mdi-play-circle-outline</v-icon> Print Start
              </v-btn>
              
              <v-btn block class="macro-btn glow-red" height="54" @click="runMacro('PRINT_END')">
                <v-icon left>mdi-stop-circle-outline</v-icon> Print End
              </v-btn>
              
              <v-btn block class="macro-btn glow-blue" height="54" @click="runMacro('COOLDOWN')">
                <v-icon left>mdi-snowflake</v-icon> Cooldown
              </v-btn>
              
              <v-btn block class="macro-btn glow-purple" height="54" @click="runMacro('BED_MESH_STRESS_TEST')">
                <v-icon left>mdi-grid</v-icon> bedmesh stress Test
              </v-btn>
              
              <v-btn block class="macro-btn glow-orange" height="54" @click="runMacro('TEMP_CHECK')">
                <v-icon left>mdi-thermometer</v-icon> temp check
              </v-btn>
            </div>
          </div>
        </v-col>

      </v-row>
    </div>
  </panel>
</template>

<style scoped>
::v-deep .blocks-axis-panel { 
  background: linear-gradient(145deg, #1c1c22, #141419) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
}

@media (min-width: 1264px) {
  .border-right { border-right: 1px solid rgba(255, 255, 255, 0.05); }
  .border-left { border-left: 1px solid rgba(255, 255, 255, 0.05); }
}

.control-module {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  box-shadow: inset 0 4px 20px rgba(0,0,0,0.1);
}

.section-title {
  font-size: 0.75rem;
  letter-spacing: 1.5px;
  font-weight: 700;
  color: #9e9e9e;
  text-transform: uppercase;
}

.micro-label {
  font-size: 0.65rem;
  color: #757575;
  text-transform: uppercase;
  display: block;
  margin-bottom: 6px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.numpad-btn {
  background: rgba(255, 255, 255, 0.04) !important;
  color: #b0bec5 !important;
  border-radius: 8px !important;
  min-width: 54px !important;
  height: 34px !important;
  font-size: 0.85rem !important;
  transition: all 0.2s ease;
}

.numpad-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

.z-value-glow {
  font-size: 1.8rem;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 0 12px rgba(255,255,255,0.2);
}

.sleek-input ::v-deep fieldset {
  border-color: rgba(255,255,255,0.08) !important;
  transition: border-color 0.2s ease;
}

.sleek-input:hover ::v-deep fieldset {
  border-color: rgba(255,255,255,0.2) !important;
}

.sleek-input ::v-deep input {
  text-align: center;
  font-weight: bold;
  color: #fff !important;
}

.pill-btn {
  background: rgba(255, 255, 255, 0.04) !important;
  min-width: 0 !important;
  padding: 0 8px !important;
  color: #888 !important;
  border-radius: 6px !important;
}

.pill-btn:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  color: #fff !important;
}

.macro-btn {
  border-radius: 12px !important;
  font-weight: 800 !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.glow-green { background: rgba(76, 175, 80, 0.05) !important; color: #4caf50 !important; }
.glow-green:hover { background: rgba(76, 175, 80, 0.15) !important; box-shadow: 0 0 20px rgba(76, 175, 80, 0.3) !important; border-color: rgba(76, 175, 80, 0.4) !important; }

.glow-red { background: rgba(244, 67, 54, 0.05) !important; color: #ff5252 !important; }
.glow-red:hover { background: rgba(244, 67, 54, 0.15) !important; box-shadow: 0 0 20px rgba(244, 67, 54, 0.3) !important; border-color: rgba(244, 67, 54, 0.4) !important; }

.glow-blue { background: rgba(33, 150, 243, 0.05) !important; color: #2196f3 !important; }
.glow-blue:hover { background: rgba(33, 150, 243, 0.15) !important; box-shadow: 0 0 20px rgba(33, 150, 243, 0.3) !important; border-color: rgba(33, 150, 243, 0.4) !important; }

.glow-purple { background: rgba(156, 39, 176, 0.05) !important; color: #ba68c8 !important; }
.glow-purple:hover { background: rgba(156, 39, 176, 0.15) !important; box-shadow: 0 0 20px rgba(156, 39, 176, 0.3) !important; border-color: rgba(156, 39, 176, 0.4) !important; }

.glow-orange { background: rgba(255, 152, 0, 0.05) !important; color: #ffb300 !important; }
.glow-orange:hover { background: rgba(255, 152, 0, 0.15) !important; box-shadow: 0 0 20px rgba(255, 152, 0, 0.3) !important; border-color: rgba(255, 152, 0, 0.4) !important; }

.h-100 { height: 100% !important; }
</style>

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

  runMacro(macroName: string) {
    this.$socket.emit('printer.gcode.script', { script: macroName });
  }
}
</script>