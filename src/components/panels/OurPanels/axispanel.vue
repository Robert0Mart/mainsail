<template>
  <panel title="Machine Control & Tools" icon="mdi-tools" card-class="blocks-axis-panel" center-title>
    <div class="pa-4">
      <v-row align="stretch" justify="center">

        <v-col cols="12" lg="6" xl="6" class="d-flex flex-column mb-4 px-3">
          <div class="dark-wrapper d-flex flex-column align-stretch w-100 h-100" style="gap: 15px;">

            <div class="d-flex flex-column flex-xl-row align-stretch w-100" style="gap: 15px;">
              
              <div class="d-flex flex-column flex-sm-row w-100" style="flex: 1.2; gap: 15px;">
                <div class="dark-wrapper d-flex flex-column align-center pa-4 w-100"
                  style="flex: 1; min-height: 300px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                  <v-icon small color="grey lighten-1" class="mb-2">mdi-speedometer</v-icon>
                  <span class="micro-label mb-4" style="font-size: 0.65rem; text-align: center;">SPEED</span>
                  <div class="slider-fill">
                    <v-slider v-model="speedFactor" min="1" max="200" vertical hide-details color="blue"
                      @change="updateSpeedFactor" />
                  </div>
                  <v-text-field v-model.number="speedFactor" type="number" dense outlined hide-details
                    class="sleek-input slider-number-input mt-4" style="max-width: 80px;" @change="updateSpeedFactor" />
                </div>
                <div class="dark-wrapper d-flex flex-column align-center pa-4 w-100"
                  style="flex: 1; min-height: 300px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                  <v-icon small color="grey lighten-1" class="mb-2">mdi-printer-3d-nozzle</v-icon>
                  <span class="micro-label mb-4" style="font-size: 0.65rem; text-align: center;">EXTRUDER</span>
                  <div class="slider-fill">
                    <v-slider v-model="extrusionFactor" min="1" max="200" vertical hide-details color="blue"
                      @change="updateExtrusionFactor" />
                  </div>
                  <v-text-field v-model.number="extrusionFactor" type="number" dense outlined hide-details
                    class="sleek-input slider-number-input mt-4" style="max-width: 80px;"
                    @change="updateExtrusionFactor" />
                </div>
              </div>

              <div class="control-module z-offset-box d-flex flex-column align-center px-4 py-7 w-100" style="flex: 0.8;">
                <span class="section-title mb-4">Z-OFFSET</span>
                <v-btn class="unified-btn mb-1" depressed @click="adjustZOffset(0.25)">0.25</v-btn>
                <v-btn class="unified-btn mb-1" depressed @click="adjustZOffset(0.05)">0.05</v-btn>
                <v-btn class="unified-btn mb-1" depressed @click="adjustZOffset(0.01)">0.01</v-btn>
                <v-btn class="unified-btn mb-4" depressed @click="adjustZOffset(0.005)">0.005</v-btn>
                <div class="z-value-glow my-2">{{ zOffsetLocal.toFixed(3) }}</div>
                <v-btn class="unified-btn mb-2" depressed icon @click="adjustZOffset(0.1)">
                  <img src="/img/icons/blocks_icons/afastar_aproximar_aproximar.svg" width="24" height="24" />
                </v-btn>
                <v-btn class="unified-btn" depressed icon @click="adjustZOffset(-0.1)">
                  <img src="/img/icons/blocks_icons/afastar_aproximar_afastar.svg" width="24" height="24" />
                </v-btn>
              </div>

              <div class="control-module d-flex flex-wrap justify-center px-4 py-8 w-100" style="flex: 2; gap: 20px;">
                <div v-for="axis in ['X', 'Y', 'Z', 'E/R']" :key="axis" class="axis-col d-flex flex-column align-center">
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
                  
                  <v-btn height="40" width="40" min-width="40" :color="axisColor(axis)"
                    class="my-1 elevation-3 font-weight-bold rounded-lg" @click="homeAxis(axis)">{{ axis }}</v-btn>
                    
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
            </div>

            <v-row dense class="mt-2" align="center">

              <v-col cols="12" xl="7" class="d-flex px-2 px-xl-0 pr-xl-2 mb-4 mb-xl-0">
                <div class="dark-wrapper pa-3 w-100 d-flex flex-column justify-center"
                  style="background: rgba(0,0,0,0.25); border-radius: 8px;">

                  <v-row dense>
                    <v-col cols="12" sm="6" class="d-flex flex-column mb-2 mb-sm-0" style="gap: 4px;">
                      <span class="micro-label">PRESSURE ADVANCE</span>
                      <v-text-field v-model="pressureAdvance" type="number" dense outlined hide-details suffix="s"
                        class="sleek-input" @change="updatePressureAdvance" />
                    </v-col>
                    <v-col cols="12" sm="6" class="d-flex flex-column" style="gap: 4px;">
                      <span class="micro-label">SMOOTH TIME</span>
                      <v-text-field v-model="smoothTime" type="number" dense outlined hide-details suffix="s"
                        class="sleek-input" @change="updatePressureAdvance" />
                    </v-col>
                  </v-row>

                </div>
              </v-col>

              <v-col cols="12" xl="5" class="d-flex px-2 px-xl-0 pl-xl-2">
                <div class="dark-wrapper pa-3 w-100 d-flex flex-column justify-center"
                  style="background: rgba(0,0,0,0.25); border-radius: 8px; gap: 8px;">
                  <v-btn class="bottom-action-btn font-weight-bold rounded-lg" height="34" depressed
                    @click="doSend('G28')">HOME
                    ALL</v-btn>
                  <v-btn class="bottom-action-btn font-weight-bold rounded-lg" height="34" depressed
                    @click="doSend('M84')">MOTORS
                    OFF</v-btn>
                  <v-btn class="bottom-action-btn font-weight-bold rounded-lg" height="34" depressed
                    @click="doSend('MACRO_1')">Z
                    TILT</v-btn>
                </div>
              </v-col>

            </v-row>
          </div>
        </v-col>

        <v-col cols="12" lg="6" xl="6" class="d-flex flex-column mb-4 px-3">
          <div class="control-module pa-6 d-flex flex-column h-100 w-100" style="gap: 15px;">
            <div class="dark-wrapper pa-4 d-flex flex-column w-100 overflow-y-auto"
              style="background: rgba(0,0,0,0.2); border-radius: 8px; flex-grow: 1; min-height: 0;">

              <div class="d-flex flex-row flex-wrap justify-center mb-6" style="gap: 12px; width: 100%;">
                <v-col v-for="n in activeGateCount" :key="`gate-icon-${n}`" cols="auto"
                  class="d-flex flex-column align-center px-1">
                  <span class="gate-label mb-1">Gate {{ n - 1 }}</span>
                  <div class="gate-img-wrapper mb-2" :class="{ 'active-gate': n - 1 === selectedGate }"
                    @click="selectedGate = n - 1" style="display: flex; align-items: center; justify-content: center;">
                    <img src="/img/icons/blocks_icons/spool-full.svg" width="80" height="80" class="gate-icon" />
                  </div>
                  <div class="gate-filament-status"
                    :style="{ backgroundColor: getGateColor(n - 1), width: '100%', height: '8px', borderRadius: '4px', opacity: n - 1 === selectedGate ? 1 : 0.4 }">
                  </div>
                </v-col>
              </div>

              <div v-if="gates.length > 0" class="d-flex flex-column flex-xl-row align-center w-100" style="gap: 15px; flex-grow: 1;">
                
                <div class="d-flex justify-center mmu-graph-area w-100" style="flex: 1 1 auto; min-height: 350px; height: auto;">
                  <mmu-filament-status />
                </div>

                <div class="d-flex flex-column justify-center w-100" style="flex: 1; gap: 20px; min-width: 160px; max-width: 100%;">

                  <div class="d-flex flex-column w-100" style="gap: 12px;">
                    <div class="d-flex justify-space-between align-center">
                      <span class="gate-data-key text-uppercase grey--text" style="font-size: 0.75rem;">Slot</span>
                      <span class="gate-data-val font-weight-bold" style="font-size: 0.9rem;">{{ selectedGate }}</span>
                    </div>

                    <div class="d-flex justify-space-between align-center">
                      <span class="gate-data-key text-uppercase grey--text" style="font-size: 0.75rem;">Status</span>
                      <span class="gate-data-val font-weight-bold" style="font-size: 0.9rem;"
                        :style="{ color: gates[selectedGate] && (gates[selectedGate].status === 'Ready' || gates[selectedGate].status === 'Buffered') ? '#4caf50' : '#ff5252' }">
                        {{ gates[selectedGate] ? gates[selectedGate].status : '--' }}
                      </span>
                    </div>

                    <div class="d-flex justify-space-between align-center">
                      <span class="gate-data-key text-uppercase grey--text" style="font-size: 0.75rem;">Color</span>
                      <div
                        :style="{ backgroundColor: gates[selectedGate] ? gates[selectedGate].color : '#333', width: '14px', height: '14px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)' }">
                      </div>
                    </div>

                    <div class="d-flex justify-space-between align-center">
                      <span class="gate-data-key text-uppercase grey--text" style="font-size: 0.75rem;">Material</span>
                      <span class="gate-data-val font-weight-black" style="font-size: 1.1rem;">
                        {{ gates[selectedGate] ? gates[selectedGate].material : '--' }}
                      </span>
                    </div>
                  </div>

                  <div class="d-flex flex-column w-100" style="gap: 8px;">
                    <v-btn small class="font-weight-black rounded-lg" color="black" height="35" depressed
                      @click="doSend('LOAD_FILAMENT')">LOAD</v-btn>
                    <v-btn small class="font-weight-black rounded-lg" color="black" height="35" depressed
                      @click="doSend('UNLOAD_FILAMENT')">UNLOAD</v-btn>
                    <v-btn small class="font-weight-black rounded-lg" color="black" height="35" depressed
                      @click="doSend('EJECT')">EJECT</v-btn>
                    <v-btn small class="font-weight-black rounded-lg" color="black" height="35" depressed
                      @click="doSend('CHECK_GATES')">CHECK GATES</v-btn>
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
import MmuMixin, {
  GATE_UNKNOWN,
  GATE_EMPTY,
  GATE_AVAILABLE,
  GATE_AVAILABLE_FROM_BUFFER
} from '@/components/mixins/mmu'
import MmuPanel from '@/components/panels/MmuPanel.vue'
import MmuFilamentStatus from '@/components/panels/Mmu/MmuFilamentStatus.vue'

@Component({ components: { Panel, MmuPanel, MmuFilamentStatus } })
export default class AxisPanel extends Mixins(MmuMixin) {
  zOffsetLocal = 0
  speedFactor = 100
  extrusionFactor = 100
  pressureAdvance = 0.055
  smoothTime = 0.04
  selectedGate = 0

  get activeGateCount() {
    return this.mmu?.gate_status?.length || 0
  }

  get gates() {
    const mmu = this.mmu
    if (!mmu || !mmu.gate_status) return []

    const statusMap: Record<number, string> = {
      [GATE_UNKNOWN]: 'Unknown',
      [GATE_EMPTY]: 'Empty',
      [GATE_AVAILABLE]: 'Ready',
      [GATE_AVAILABLE_FROM_BUFFER]: 'Buffered'
    }

    return mmu.gate_status.map((rawStatus: number, index: number) => {
      return {
        status: statusMap[rawStatus] || 'Unknown',
        material: mmu.gate_material?.[index] || '--',
        color: this.formColorString(mmu.gate_color?.[index]) 
      }
    })
  }

  getGateColor(index: number) {
    return this.gates[index]?.color || '#333'
  }

  @Watch('printer.gcode_move.homing_origin', { immediate: true, deep: true })
  onHomingOriginChange(newVal: any) {
    if (newVal && newVal[2] !== undefined) this.zOffsetLocal = newVal[2]
  }

  axisColor(axis: string) {
    const colors: Record<string, string> = { X: '#ff5252', Y: '#4caf50', Z: '#2196f3', 'E/R': '#ff9800' }
    return colors[axis] || '#fff'
  }

  moveAxis(axis: string, dist: number) {
    if (axis === 'E/R') {
      this.doSend(`G91\nG1 E${dist} F300\nG90`)
    } else {
      this.doSend(`G91\nG1 ${axis}${dist} F6000\nG90`)
    }
  }

  homeAxis(axis: string) {
    if (axis === 'E/R') return
    this.doSend(`G28 ${axis}`)
  }

  adjustZOffset(step: number) {
    this.doSend(`SET_GCODE_OFFSET Z_ADJUST=${step} MOVE=1`)
  }

  updateSpeedFactor() {
    this.doSend(`M220 S${this.speedFactor}`)
  }

  updateExtrusionFactor() {
    this.doSend(`M221 S${this.extrusionFactor}`)
  }

  updatePressureAdvance() {
    this.doSend(`SET_PRESSURE_ADVANCE ADVANCE=${this.pressureAdvance} SMOOTH_TIME=${this.smoothTime}`)
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

.section-title {
  font-size: 0.75rem;
  letter-spacing: 1.5px;
  font-weight: 800;
  color: #9e9e9e;
  text-transform: uppercase;
}

.z-value-glow {
  font-size: 1.6rem;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
}

.micro-label {
  font-size: 0.7rem;
  color: #757575;
  text-transform: uppercase;
  display: block;
  font-weight: 800;
}

.gate-label {
  font-size: 0.7rem;
  font-weight: 900;
  color: #888;
}

.gate-img-wrapper {
  background: rgba(255, 255, 255, 0.04);
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.active-gate {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.1);
}

.gate-icon {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.gate-data-key {
  font-size: 0.65rem;
  color: #757575;
  text-transform: uppercase;
  font-weight: 800;
}

.gate-data-val {
  font-size: 0.85rem;
  font-weight: 800;
  color: #fff;
}

.unified-btn {
  background: rgba(247, 202, 0, 0.04) !important;
  color: #b0bec5 !important;
  border-radius: 8px !important;
}

.bottom-action-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #b0bec5 !important;
}

.pill-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #888 !important;
  border-radius: 4px !important;
  font-size: 0.65rem !important;
}

.sleek-input ::v-deep .v-input__slot {
  min-height: 36px !important;
  padding: 0 12px !important;
}

.slider-fill {
  width: 100%;
  display: flex;
  justify-content: center;
  flex: 1 1 auto;
}

.slider-fill ::v-deep .v-input,
.slider-fill ::v-deep .v-input__control,
.slider-fill ::v-deep .v-input__slot,
.slider-fill ::v-deep .v-slider,
.slider-fill ::v-deep .v-slider__track-container {
  height: 100% !important;
}

.slider-fill ::v-deep .v-input {
  margin: 0 !important;
}

.slider-number-input {
  width: 80px !important;
  max-width: 80px !important;
  flex: 0 0 auto !important;
}

.slider-number-input ::v-deep .v-input__slot {
  padding: 0 6px !important;
}

.slider-number-input ::v-deep input {
  text-align: center !important;
  padding: 0 !important;
  min-width: 0 !important;
  font-weight: 800 !important;
}

.slider-number-input ::v-deep input::-webkit-outer-spin-button,
.slider-number-input ::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.slider-number-input ::v-deep input[type="number"] {
  -moz-appearance: textfield;
}

.mmu-fix-wrapper {
  position: relative;
  min-height: 400px;
  overflow-x: hidden;
}

::v-deep .custom-mmu-panel>.v-card {
  background: transparent !important;
  box-shadow: none !important;
}

::v-deep .custom-mmu-panel header {
  display: none !important;
}

::v-deep .custom-mmu-panel .v-card__text {
  padding: 0 !important;
}

::v-deep .custom-mmu-panel .mmu-clog-meter,
::v-deep .custom-mmu-panel div[class*="clog"],
::v-deep .custom-mmu-panel div[class*="Clog"],
::v-deep .custom-mmu-panel .v-card__text>.row>.col-5:last-child,
::v-deep .custom-mmu-panel svg+div.text-center {
  display: none !important;
}

.mmu-graph-area :deep(text) {
  font-size: 17px !important;
  font-weight: bold !important;
}

.mmu-graph-area :deep(.filament-label),
.mmu-graph-area :deep(.status-text) {
  font-size: 14px !important;
  font-weight: 800 !important;
}
</style>