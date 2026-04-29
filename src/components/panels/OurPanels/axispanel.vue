<template>
  <panel title="Machine Control & Tools" icon="mdi-tools" card-class="blocks-axis-panel" center-title>
    <div class="pa-4" style="max-height: 75vh; overflow: hidden;">
      <v-row align="stretch" justify="center" style="max-height: 75vh;">

        <v-col cols="12" lg="6" xl="6" class="d-flex flex-column mb-4 px-3">
          <div class="dark-wrapper d-flex flex-column w-100 h-100" style="gap: 15px;">

            <div class="d-flex flex-column flex-xl-row align-stretch w-100 flex-grow-1" style="gap: 15px;">

              <div class="d-flex flex-column flex-sm-row w-100" style="flex: 1.2; gap: 15px;">
                <div class="dark-wrapper d-flex flex-column align-center pa-3 w-100"
                  style="flex: 1; background: rgba(0,0,0,0.2); border-radius: 8px; min-height: 260px;">
                  <div class="d-flex flex-column align-center mb-2">
                    <img src="/img/icons/blocks_icons/nozzlesvg.svg" width="32" height="32" class="mb-1" />
                    <span class="micro-label" style="font-size: 0.85rem; font-weight: bold; text-align: center;">SPEED
                      FACTOR</span>
                  </div>

                  <div class="slider-fill flex-grow-1 d-flex justify-center w-100 py-2">
                    <v-slider v-model="speedFactor" min="1" max="200" vertical hide-details color="blue"
                      @change="updateSpeedFactor" />
                  </div>

                  <v-text-field v-model.number="speedFactor" type="number" dense outlined hide-details suffix="%"
                    class="sleek-input slider-number-input mt-2" style="max-width: 90px;" @change="updateSpeedFactor" />
                </div>

                <div class="dark-wrapper d-flex flex-column align-center pa-3 w-100"
                  style="flex: 1; background: rgba(0,0,0,0.2); border-radius: 8px; min-height: 220px;">
                  <div class="d-flex flex-column align-center mb-2">
                    <img src="/img/icons/blocks_icons/extrudesvg.svg" width="32" height="32" class="mb-1" />
                    <span class="micro-label"
                      style="font-size: 0.85rem; font-weight: bold; text-align: center;">EXTRUDER FACTOR</span>
                  </div>

                  <div class="slider-fill flex-grow-1 d-flex justify-center w-100 py-2">
                    <v-slider v-model="extrusionFactor" min="1" max="200" vertical hide-details color="blue"
                      @change="updateExtrusionFactor" />
                  </div>

                  <v-text-field v-model.number="extrusionFactor" type="number" dense outlined hide-details suffix="%"
                    class="sleek-input slider-number-input mt-2" style="max-width: 90px;"
                    @change="updateExtrusionFactor" />
                </div>
              </div>

              <div
                class="control-module z-offset-box d-flex flex-column align-center justify-space-between px-4 py-6 w-100 h-100"
                style="flex: 0.8; min-width: 100px;">
                <span class="section-title mb-4">Z-OFFSET</span>
                <v-btn class="unified-btn mb-3 w-100" depressed @click="adjustZOffset(0.25)">0.100</v-btn>
                <v-btn class="unified-btn mb-3 w-100" depressed @click="adjustZOffset(0.05)">0.050</v-btn>
                <v-btn class="unified-btn mb-3 w-100" depressed @click="adjustZOffset(0.01)">0.025</v-btn>
                <v-btn class="unified-btn mb-4 w-100" depressed @click="adjustZOffset(0.005)">0.010</v-btn>
                <div class="z-value-glow my-4">{{ zOffsetLocal.toFixed(3) }}</div>

                <v-btn class="unified-btn mb-3 w-100" depressed icon @click="adjustZOffset(0.1)">
                  <img src="/img/icons/blocks_icons/afastar_aproximar_aproximar.svg" width="30" height="30" />
                </v-btn>
                <v-btn class="unified-btn mb-3 w-100" depressed icon @click="adjustZOffset(-0.1)">
                  <img src="/img/icons/blocks_icons/afastar_aproximar_afastar.svg" width="30" height="30" />
                </v-btn>
              </div>

              <div class="control-module d-flex flex-nowrap justify-space-between px-4 py-6 w-100"
                style="flex: 2.5; gap: 8px; min-width: 240px;">
                <div v-for="axis in ['X', 'Y', 'Z', 'Ext']" :key="axis"
                  class="axis-col d-flex flex-column align-center justify-space-between" style="flex: 1;">
                  <div v-if="axis === 'Ext'" class="font-weight-black mb-1 text-center"
                    style="font-size: 0.55rem; color: #4caf50; letter-spacing: 0.5px; line-height: 1;">EXTRUDE</div>
                  <div v-else style="height: 12px; margin-bottom: 4px;"></div>

                  <template v-if="axis === 'Z'">
                    <v-btn class="unified-btn mb-3 w-100" depressed @click="moveAxis('Z', 25)">+25</v-btn>
                    <v-btn class="unified-btn mb-3 w-100" depressed @click="moveAxis('Z', 1)">+1</v-btn>
                    <v-btn class="unified-btn mb-5 w-100" depressed @click="moveAxis('Z', 0.1)">+0.1</v-btn>
                  </template>
                  <template v-else>
                    <v-btn class="unified-btn mb-3 w-100" depressed @click="moveAxis(axis, 100)">+100</v-btn>
                    <v-btn class="unified-btn mb-3 w-100" depressed @click="moveAxis(axis, 10)">+10</v-btn>
                    <v-btn class="unified-btn mb-5 w-100" depressed @click="moveAxis(axis, 1)">+1</v-btn>
                  </template>

                  <v-btn height="36" width="100%" :color="axisColor(axis)"
                    class="my-2 elevation-3 font-weight-bold rounded-lg label-btn" @click="homeAxis(axis)">
                    <img v-if="axis === 'X'" src="/img/icons/blocks_icons/home_xsvg.svg" width="22" height="22" />
                    <img v-else-if="axis === 'Y'" src="/img/icons/blocks_icons/home_ysvg.svg" width="22" height="22" />
                    <img v-else-if="axis === 'Z'" src="/img/icons/blocks_icons/home_zsvg.svg" width="22" height="22" />
                    <span v-else>{{ axis }}</span>
                  </v-btn>

                  <template v-if="axis === 'Z'">
                    <v-btn class="unified-btn mb-2 mt-3 w-100" depressed @click="moveAxis('Z', -0.1)">-0.1</v-btn>
                    <v-btn class="unified-btn mb-2 w-100" depressed @click="moveAxis('Z', -1)">-1</v-btn>
                    <v-btn class="unified-btn w-100" depressed @click="moveAxis('Z', -25)">-25</v-btn>
                  </template>
                  <template v-else>
                    <v-btn class="unified-btn mb-2 mt-3 w-100" depressed @click="moveAxis(axis, -1)">-1</v-btn>
                    <v-btn class="unified-btn mb-2 w-100" depressed @click="moveAxis(axis, -10)">-10</v-btn>
                    <v-btn class="unified-btn w-100" depressed @click="moveAxis(axis, -100)">-100</v-btn>
                  </template>

                  <div v-if="axis === 'Ext'" class="font-weight-black mt-2 text-center"
                    style="font-size: 0.55rem; color: #ff5252; letter-spacing: 0.5px; line-height: 1;">RETRACT</div>
                  <div v-else style="height: 12px; margin-top: 8px;"></div>
                </div>
              </div>
            </div>
            <v-row dense class="flex-grow-0" align="stretch">
              <v-col cols="12" class="d-flex px-2">
                <div class="dark-wrapper pa-3 w-100 h-100 d-flex flex-row justify-center align-center"
                  style="background: rgba(0,0,0,0.25); border-radius: 8px; gap: 12px;">
                  <v-btn class="bottom-action-btn font-weight-bold rounded-lg flex-grow-1" height="60" depressed
                    @click="doSend('G28')">
                    <img src="/img/icons/blocks_icons/home_allsvg.svg" width="24" height="24" class="mr-2" />
                    HOME ALL
                  </v-btn>
                  <v-btn class="bottom-action-btn font-weight-bold rounded-lg flex-grow-1" height="60" depressed
                    @click="doSend('M84')">
                    <img src="/img/icons/blocks_icons/disable_stepperssvg.svg" width="24" height="24" class="mr-2" />
                    MOTORS OFF
                  </v-btn>
                  <v-btn class="bottom-action-btn font-weight-bold rounded-lg flex-grow-1" height="60" depressed
                    @click="doSend('MACRO_1')">
                    <img src="/img/icons/blocks_icons/z_tiltsvg.svg" width="25" height="25" class="mr-2" />
                    Z TILT
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>

        <v-col cols="12" lg="6" xl="6" class="d-flex flex-column mb-4 px-3">
          <div class="dark-wrapper pa-2 d-flex flex-column w-100 h-100"
            style="background: rgba(0,0,0,0.2); border-radius: 8px; gap: 15px;">

            <div class="dark-wrapper pa-4" style="background: rgba(0,0,0,0.2); border-radius: 8px;">
              <div class="d-flex flex-row flex-wrap justify-center" style="gap: 12px; width: 100%;">
                <v-col v-for="n in activeGateCount" :key="`gate-icon-${n}`" cols="auto"
                  class="d-flex flex-column align-center px-2">
                  <span class="gate-label mb-2">Gate {{ n - 1 }}</span>
                  <div class="gate-img-wrapper mb-2" :class="{ 'active-gate': n - 1 === selectedGate }"
                    @click="selectedGate = n - 1"
                    style="display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <img src="/img/icons/blocks_icons/AMU spoll 1svg.svg" width="56" height="56" class="gate-icon" />
                  </div>
                  <div class="gate-filament-status"
                    :style="{ backgroundColor: getGateColor(n - 1), width: '100%', height: '8px', borderRadius: '4px', opacity: n - 1 === selectedGate ? 1 : 0.4 }">
                  </div>
                </v-col>
              </div>
            </div>

            <div v-if="gates.length > 0" class="d-flex flex-column flex-xl-row align-stretch w-100 flex-grow-1"
              style="gap: 15px;">
              <div class="dark-wrapper pa-2 d-flex flex-column justify-center align-center"
                style="flex: 1.5; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <div class="mmu-graph-area w-100 d-flex justify-center" style="height: 400px;">
                  <mmu-filament-status />
                </div>
              </div>

              <div class="d-flex flex-column" style="flex: 1; gap: 15px;">
                <div class="dark-wrapper pa-4 d-flex flex-column"
                  style="background: rgba(0,0,0,0.2); border-radius: 8px; gap: 12px;">
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
                      :style="{ backgroundColor: gates[selectedGate] ? gates[selectedGate].color : '#333', width: '18px', height: '18px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)' }">
                    </div>
                  </div>
                  <div class="d-flex justify-space-between align-center">
                    <span class="gate-data-key text-uppercase grey--text" style="font-size: 0.75rem;">Material</span>
                    <span class="gate-data-val font-weight-black" style="font-size: 1.1rem;">
                      {{ gates[selectedGate] ? gates[selectedGate].material : '--' }}
                    </span>
                  </div>
                </div>

                <div class="dark-wrapper pa-4 d-flex flex-column flex-grow-1"
                  style="background: rgba(0,0,0,0.2); border-radius: 8px; gap: 8px;">
                  <v-btn small class="font-weight-black rounded-lg mmu-action-btn" color="black" height="45" depressed
                    @click="doSend('LOAD_FILAMENT')">
                    <span class="btn-inner">
                      <img src="/img/icons/blocks_icons/load_filamentsvg.svg" width="25" />
                      <span>LOAD</span>
                    </span>
                  </v-btn>
                  <v-btn small class="font-weight-black rounded-lg mmu-action-btn" color="black" height="45" depressed
                    @click="doSend('UNLOAD_FILAMENT')">
                    <span class="btn-inner">
                      <img src="/img/icons/blocks_icons/change_filamentsvg.svg" width="25" />
                      <span>UNLOAD</span>
                    </span>
                  </v-btn>
                  <v-btn small class="font-weight-black rounded-lg mmu-action-btn" color="black" height="45"
                    depressed @click="doSend('EJECT')">
                    <span class="btn-inner">
                      <img src="/img/icons/blocks_icons/ejectsvg.svg" width="25" />
                      <span>EJECT</span>
                    </span>
                  </v-btn>
                  <v-btn small class="font-weight-black rounded-lg mmu-action-btn" color="black" height="45" depressed
                    @click="doSend('CHECK_GATES')">
                    <span class="btn-inner">
                      <img src="/img/icons/blocks_icons/routine_checksvg.svg" width="25" />
                      <span>CHECK GATES</span>
                    </span>
                  </v-btn>
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
    const colors: Record<string, string> = { X: '#ff5252', Y: '#4caf50', Z: '#2196f3', 'Ext': '#ff9800' }
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

.label-btn {
  font-size: 0.85rem !important;
  letter-spacing: 0 !important;
  padding: 0 !important;
}

.unified-btn {
  background: rgba(247, 202, 0, 0.04) !important;
  color: #b0bec5 !important;
  border-radius: 8px !important;
  min-width: 0 !important;
  padding: 0 4px !important;
  font-size: 0.85rem !important;
}

.bottom-action-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #b0bec5 !important;
}

.sleek-input ::v-deep .v-input__slot {
  min-height: 36px !important;
  padding: 0 12px !important;
}

.slider-fill {
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: center;
  flex: 0 0 auto;
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

.mmu-graph-area :deep(svg) {
  width: 100% !important;
  height: 100% !important;
}

.mmu-action-btn {
  width: 100% !important;
}

.mmu-action-btn .btn-inner {
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  width: 100%;
}

.mmu-action-btn .btn-inner span {
  text-align: center;
}
</style>