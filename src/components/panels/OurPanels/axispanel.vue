<template>
  <panel title="Machine Control & Tools" icon="mdi-tools" card-class="blocks-axis-panel" center-title>
    <div class="pa-1 pa-sm-4">
      <v-row align="stretch" justify="center" class="mx-0">

        <v-col cols="12" lg="6" class="d-flex flex-column mb-3 mb-sm-4 px-1 px-sm-3">
          <div class="dark-wrapper d-flex flex-column w-100 h-100" style="gap: clamp(10px, 2vw, 15px);">

            <div class="d-flex flex-column flex-lg-row align-stretch w-100 flex-grow-1"
              style="gap: clamp(10px, 2vw, 15px);">

              <div class="d-flex flex-column flex-md-row w-100" style="flex: 1.2; gap: clamp(8px, 2vw, 15px);">

                <div class="dark-wrapper d-flex justify-space-between align-center pa-2 pa-sm-3 w-100"
                  :class="$vuetify.breakpoint.mdAndUp ? 'flex-column' : 'flex-row'"
                  :style="{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', minHeight: $vuetify.breakpoint.mdAndUp ? '130px' : 'auto', height: '100%' }">

                  <div class="d-flex align-center justify-center"
                    :class="$vuetify.breakpoint.mdAndUp ? 'flex-column mb-2' : 'flex-column mr-3'"
                    style="min-width: 60px;">
                    <img src="/img/icons/blocks_icons/speedsvg.svg" width="28" height="28" class="mb-1" />
                    <span class="micro-label"
                      style="font-size: 0.65rem; font-weight: bold; text-align: center; line-height: 1.1;">SPEED<br>FACTOR</span>
                  </div>

                  <div class="d-flex align-center justify-center w-100"
                    :class="[$vuetify.breakpoint.mdAndUp ? 'slider-fill flex-grow-1 py-1 py-sm-2' : 'flex-grow-1']">
                    <v-slider v-model="speedFactor" min="1" max="200" :vertical="$vuetify.breakpoint.mdAndUp"
                      hide-details color="blue" @change="updateSpeedFactor" />
                  </div>

                  <v-text-field v-model.number="speedFactor" type="number" dense outlined hide-details suffix="%"
                    class="sleek-input slider-number-input"
                    :class="$vuetify.breakpoint.mdAndUp ? 'mt-1 mt-sm-2' : 'ml-3'" style="max-width: 80px;"
                    @change="updateSpeedFactor" />
                </div>

                <div class="dark-wrapper d-flex justify-space-between align-center pa-2 pa-sm-3 w-100"
                  :class="$vuetify.breakpoint.mdAndUp ? 'flex-column' : 'flex-row'"
                  :style="{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', minHeight: $vuetify.breakpoint.mdAndUp ? '130px' : 'auto', height: '100%' }">

                  <div class="d-flex align-center justify-center"
                    :class="$vuetify.breakpoint.mdAndUp ? 'flex-column mb-2' : 'flex-column mr-3'"
                    style="min-width: 60px;">
                    <img src="/img/icons/blocks_icons/extrudesvg.svg" width="28" height="28" class="mb-1" />
                    <span class="micro-label"
                      style="font-size: 0.65rem; font-weight: bold; text-align: center; line-height: 1.1;">EXTRUDER<br>FACTOR</span>
                  </div>

                  <div class="d-flex align-center justify-center w-100"
                    :class="[$vuetify.breakpoint.mdAndUp ? 'slider-fill flex-grow-1 py-1 py-sm-2' : 'flex-grow-1']">
                    <v-slider v-model="extrusionFactor" min="1" max="200" :vertical="$vuetify.breakpoint.mdAndUp"
                      hide-details color="blue" @change="updateExtrusionFactor" />
                  </div>

                  <v-text-field v-model.number="extrusionFactor" type="number" dense outlined hide-details suffix="%"
                    class="sleek-input slider-number-input"
                    :class="$vuetify.breakpoint.mdAndUp ? 'mt-1 mt-sm-2' : 'ml-3'" style="max-width: 80px;"
                    @change="updateExtrusionFactor" />
                </div>
              </div>

              <div class="d-flex flex-column flex-md-row align-stretch w-100"
                style="gap: clamp(10px, 2vw, 15px); flex: 3.3;">

                <div class="control-module z-offset-box d-flex flex-column align-center px-2 px-sm-4 py-3 py-md-5 w-100"
                  style="flex: 0.8; min-width: 0; gap: 6px;">
                  <span class="section-title mb-1 mb-sm-2" style="font-size: 0.9rem;">Z-OFFSET</span>

                  <div class="d-flex flex-wrap w-100" style="gap: 6px;">
                    <v-btn class="unified-btn px-0"
                      :style="$vuetify.breakpoint.smAndDown ? 'flex: 1 1 calc(50% - 3px);' : 'width: 100%;'" height="36"
                      depressed @click="addZStep(0.100)">0.100</v-btn>
                    <v-btn class="unified-btn px-0"
                      :style="$vuetify.breakpoint.smAndDown ? 'flex: 1 1 calc(50% - 3px);' : 'width: 100%;'" height="36"
                      depressed @click="addZStep(0.050)">0.050</v-btn>
                    <v-btn class="unified-btn px-0"
                      :style="$vuetify.breakpoint.smAndDown ? 'flex: 1 1 calc(50% - 3px);' : 'width: 100%;'" height="36"
                      depressed @click="addZStep(0.025)">0.025</v-btn>
                    <v-btn class="unified-btn px-0"
                      :style="$vuetify.breakpoint.smAndDown ? 'flex: 1 1 calc(50% - 3px);' : 'width: 100%;'" height="36"
                      depressed @click="addZStep(0.010)">0.010</v-btn>
                  </div>

                  <div class="z-value-glow my-1 font-weight-bold" style="font-size: 1.1rem; min-height: 28px;">
                    {{ (zOffsetStep || 0).toFixed(3) }}
                  </div>

                  <div class="d-flex flex-wrap w-100" style="gap: 6px;">
                    <v-btn class="unified-btn px-0"
                      :style="$vuetify.breakpoint.smAndDown ? 'flex: 1 1 calc(50% - 3px);' : 'width: 100%;'" height="36"
                      depressed @click="applyZStep(1)">
                      <img src="/img/icons/blocks_icons/afastar_aproximar_aproximar.svg" width="24" height="24" />
                    </v-btn>
                    <v-btn class="unified-btn px-0"
                      :style="$vuetify.breakpoint.smAndDown ? 'flex: 1 1 calc(50% - 3px);' : 'width: 100%;'" height="36"
                      depressed @click="applyZStep(-1)">
                      <img src="/img/icons/blocks_icons/afastar_aproximar_afastar.svg" width="24" height="24" />
                    </v-btn>
                  </div>

                  <v-btn class="unified-btn w-100 mt-1" height="36" depressed @click="zOffsetStep = 0">RESET</v-btn>
                </div>

                <div class="control-module d-flex flex-nowrap justify-space-around px-1 px-sm-3 py-3 py-md-5 w-100"
                  style="flex: 2.5; gap: 4px; min-width: 0; overflow-x: auto;">
                  <div v-for="axis in ['X', 'Y', 'Z', 'Ext']" :key="axis"
                    class="axis-col d-flex flex-column align-center justify-space-between"
                    style="flex: 1; min-width: 40px; max-width: 80px;">
                    <div v-if="axis === 'Ext'" class="font-weight-black mb-1 text-center"
                      style="font-size: 0.5rem; color: #4caf50; letter-spacing: 0px; line-height: 1;">EXTRUDE</div>
                    <div v-else style="height: 10px; margin-bottom: 4px;"></div>

                    <template v-if="axis === 'Z'">
                      <v-btn class="unified-btn mb-1 w-100 px-0" depressed height="36"
                        @click="moveAxis('Z', 25)">+25</v-btn>
                      <v-btn class="unified-btn mb-1 w-100 px-0" depressed height="36"
                        @click="moveAxis('Z', 1)">+1</v-btn>
                      <v-btn class="unified-btn mb-2 w-100 px-0" depressed height="36"
                        @click="moveAxis('Z', 0.1)">+0.1</v-btn>
                    </template>
                    <template v-else>
                      <v-btn class="unified-btn mb-1 w-100 px-0" depressed height="36"
                        @click="moveAxis(axis, 100)">+100</v-btn>
                      <v-btn class="unified-btn mb-1 w-100 px-0" depressed height="36"
                        @click="moveAxis(axis, 10)">+10</v-btn>
                      <v-btn class="unified-btn mb-2 w-100 px-0" depressed height="36"
                        @click="moveAxis(axis, 1)">+1</v-btn>
                    </template>

                    <v-btn height="40" width="100%" :color="axisColor(axis)"
                      class="my-1 elevation-3 font-weight-bold rounded-lg label-btn px-0" @click="homeAxis(axis)">
                      <img v-if="axis === 'X'" src="/img/icons/blocks_icons/home_xsvg.svg" width="30" height="30" />
                      <img v-else-if="axis === 'Y'" src="/img/icons/blocks_icons/home_ysvg.svg" width="30"
                        height="30" />
                      <img v-else-if="axis === 'Z'" src="/img/icons/blocks_icons/home_zsvg.svg" width="30"
                        height="30" />
                      <span v-else style="font-size: 0.85rem;">{{ axis }}</span>
                    </v-btn>

                    <template v-if="axis === 'Z'">
                      <v-btn class="unified-btn mb-1 mt-2 w-100 px-0" depressed height="36"
                        @click="moveAxis('Z', -0.1)">-0.1</v-btn>
                      <v-btn class="unified-btn mb-1 w-100 px-0" depressed height="36"
                        @click="moveAxis('Z', -1)">-1</v-btn>
                      <v-btn class="unified-btn w-100 px-0" depressed height="36"
                        @click="moveAxis('Z', -25)">-25</v-btn>
                    </template>
                    <template v-else>
                      <v-btn class="unified-btn mb-1 mt-2 w-100 px-0" depressed height="36"
                        @click="moveAxis(axis, -1)">-1</v-btn>
                      <v-btn class="unified-btn mb-1 w-100 px-0" depressed height="36"
                        @click="moveAxis(axis, -10)">-10</v-btn>
                      <v-btn class="unified-btn w-100 px-0" depressed height="36"
                        @click="moveAxis(axis, -100)">-100</v-btn>
                    </template>

                    <div v-if="axis === 'Ext'" class="font-weight-black mt-1 text-center"
                      style="font-size: 0.5rem; color: #ff5252; letter-spacing: 0px; line-height: 1;">RETRACT</div>
                    <div v-else style="height: 10px; margin-top: 4px;"></div>
                  </div>
                </div>

              </div>
            </div>

            <div
              class="dark-wrapper pa-2 pa-sm-3 w-100 d-flex flex-column flex-sm-row justify-center align-stretch align-sm-center"
              style="background: rgba(0,0,0,0.25); border-radius: 8px; gap: clamp(8px, 1.5vw, 10px);">
              <v-btn class="bottom-action-btn font-weight-bold rounded-lg flex-grow-1 py-2 py-sm-3" height="auto"
                min-height="48" depressed @click="doSend('G28')">
                <img src="/img/icons/blocks_icons/home_allsvg.svg" width="30" height="30" class="mr-2" />
                <span style="white-space: normal; text-align: center;">HOME ALL</span>
              </v-btn>
              <v-btn class="bottom-action-btn font-weight-bold rounded-lg flex-grow-1 py-2 py-sm-3" height="auto"
                min-height="48" depressed @click="doSend('M84')">
                <img src="/img/icons/blocks_icons/disable_stepperssvg.svg" width="30" height="30" class="mr-2" />
                <span style="white-space: normal; text-align: center;">MOTORS OFF</span>
              </v-btn>
              <v-btn class="bottom-action-btn font-weight-bold rounded-lg flex-grow-1 py-2 py-sm-3" height="auto"
                min-height="48" depressed @click="doSend('MACRO_1')">
                <img src="/img/icons/blocks_icons/bed_levellingsvg.svg" width="30" height="30" class="mr-2" />
                <span style="white-space: normal; text-align: center;">Z TILT</span>
              </v-btn>
            </div>

          </div>
        </v-col>

        <v-col cols="12" lg="6" class="d-flex flex-column mb-4 px-1 px-sm-3">
          <div class="dark-wrapper pa-2 d-flex flex-column w-100 h-100"
            style="background: rgba(0,0,0,0.2); border-radius: 8px; gap: clamp(10px, 2vw, 15px);">

            <div class="dark-wrapper pa-2 pa-sm-4" style="background: rgba(0,0,0,0.2); border-radius: 8px;">
              <v-row class="ma-0 w-100" justify="center">
                <v-col v-for="n in activeGateCount" :key="`gate-icon-${n}`" 
                  cols="6" md="auto"
                  class="d-flex flex-column align-center px-2 py-2">
                  <span class="gate-label mb-1 mb-sm-2" style="font-size: 0.8rem;">Gate {{ n - 1 }}</span>
                  <div class="gate-img-wrapper mb-1 mb-sm-2" :class="{ 'active-gate': n - 1 === selectedGate }"
                    @click="selectedGate = n - 1"
                    style="display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <img src="/img/icons/blocks_icons/AMU spoll 1svg.svg" width="40" height="40" class="gate-icon" />
                  </div>
                  <div class="gate-filament-status"
                    :style="{ backgroundColor: getGateColor(n - 1), width: '100%', height: '6px', borderRadius: '3px', opacity: n - 1 === selectedGate ? 1 : 0.4 }">
                  </div>
                </v-col>
              </v-row>
            </div>

            <div v-if="gates.length > 0" class="d-flex flex-column flex-lg-row align-stretch w-100 flex-grow-1"
              style="gap: clamp(10px, 2vw, 15px);">

              <div class="dark-wrapper pa-2 d-flex flex-column justify-center align-center"
                style="flex: 1.5; background: rgba(0,0,0,0.2); border-radius: 8px; min-height: 200px;">
                <div class="mmu-graph-area w-100 d-flex justify-center"
                  style="min-height: 200px; max-height: 300px; height: 100%;">
                  <mmu-filament-status />
                </div>
              </div>

              <div class="d-flex flex-column" style="flex: 1; gap: clamp(10px, 2vw, 15px);">
                <div class="dark-wrapper pa-3 pa-sm-4 d-flex flex-column"
                  style="background: rgba(0,0,0,0.2); border-radius: 8px; gap: 10px;">
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
                      :style="{ backgroundColor: gates[selectedGate] ? gates[selectedGate].color : '#333', width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)' }">
                    </div>
                  </div>
                  <div class="d-flex justify-space-between align-center">
                    <span class="gate-data-key text-uppercase grey--text" style="font-size: 0.75rem;">Material</span>
                    <span class="gate-data-val font-weight-black" style="font-size: 1rem;">
                      {{ gates[selectedGate] ? gates[selectedGate].material : '--' }}
                    </span>
                  </div>
                </div>

                <div class="dark-wrapper pa-2 pa-sm-3 d-flex flex-grow-1"
                  style="background: rgba(0,0,0,0.2); border-radius: 8px;">
                  <div class="d-flex flex-wrap w-100" style="gap: 8px;">
                    <v-btn small class="font-weight-black rounded-lg mmu-action-btn py-2 py-sm-3" color="black"
                      height="auto" min-height="45" depressed style="flex: 1 1 calc(50% - 4px);"
                      @click="doSend('LOAD_FILAMENT')">
                      <span class="btn-inner d-flex flex-column align-center">
                        <img src="/img/icons/blocks_icons/load_filamentsvg.svg" width="22" class="mb-1" />
                        <span style="font-size: 0.75rem;">LOAD</span>
                      </span>
                    </v-btn>
                    <v-btn small class="font-weight-black rounded-lg mmu-action-btn py-2 py-sm-3" color="black"
                      height="auto" min-height="45" depressed style="flex: 1 1 calc(50% - 4px);"
                      @click="doSend('UNLOAD_FILAMENT')">
                      <span class="btn-inner d-flex flex-column align-center">
                        <img src="/img/icons/blocks_icons/unload_filamentsvg.svg" width="22" class="mb-1" />
                        <span style="font-size: 0.75rem;">UNLOAD</span>
                      </span>
                    </v-btn>
                    <v-btn small class="font-weight-black rounded-lg mmu-action-btn py-2 py-sm-3" color="black"
                      height="auto" min-height="45" depressed style="flex: 1 1 calc(50% - 4px);"
                      @click="doSend('EJECT')">
                      <span class="btn-inner d-flex flex-column align-center">
                        <img src="/img/icons/blocks_icons/ejectsvg.svg" width="22" class="mb-1" />
                        <span style="font-size: 0.75rem;">EJECT</span>
                      </span>
                    </v-btn>
                    <v-btn small class="font-weight-black rounded-lg mmu-action-btn py-2 py-sm-3" color="black"
                      height="auto" min-height="45" depressed style="flex: 1 1 calc(50% - 4px);"
                      @click="doSend('CHECK_GATES')">
                      <span class="btn-inner d-flex flex-column align-center">
                        <img src="/img/icons/blocks_icons/routine_checksvg.svg" width="22" class="mb-1" />
                        <span style="font-size: 0.75rem; text-align: center; line-height: 1.1;">CHECK GATES</span>
                      </span>
                    </v-btn>
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
import { Component, Mixins } from 'vue-property-decorator'
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
  zOffsetStep = 0
  speedFactor = 100
  extrusionFactor = 100
  selectedGate = 0

  // Adds the chosen increment to the accumulator
  addZStep(value: number) {
    this.zOffsetStep = parseFloat((this.zOffsetStep + value).toFixed(3))
  }

  // Applies the accumulated step in the given direction (+1 or -1), then resets
  applyZStep(direction: number) {
    if (this.zOffsetStep === 0) return
    const amount = parseFloat((this.zOffsetStep * direction).toFixed(3))
    this.doSend(`SET_GCODE_OFFSET Z_ADJUST=${amount} MOVE=1`)
    this.zOffsetStep = 0
  }

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

  axisColor(axis: string) {
    const colors: Record<string, string> = { X: '#2196f3', Y: '#2196f3', Z: '#2196f3', Ext: '#ff9800' }
    return colors[axis] || '#fff'
  }

  moveAxis(axis: string, dist: number) {
    if (axis === 'Ext') {
      this.doSend(`G91\nG1 E${dist} F300\nG90`)
    } else {
      this.doSend(`G91\nG1 ${axis}${dist} F6000\nG90`)
    }
  }

  homeAxis(axis: string) {
    if (axis === 'Ext') return
    this.doSend(`G28 ${axis}`)
  }

  updateSpeedFactor() {
    this.doSend(`M220 S${this.speedFactor}`)
  }

  updateExtrusionFactor() {
    this.doSend(`M221 S${this.extrusionFactor}`)
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

.mmu-graph-area ::v-deep text {
  font-size: 17px !important;
  font-weight: bold !important;
}

.mmu-graph-area ::v-deep .filament-label,
.mmu-graph-area ::v-deep .status-text {
  font-size: 14px !important;
  font-weight: 800 !important;
}

.mmu-graph-area ::v-deep svg {
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