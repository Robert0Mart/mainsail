<template>
  <panel
    title="Machine Axis & Z-Offset"
    icon="mdi-axis-arrow"
    card-class="blocks-axis-panel"
    center-title
  >
    <div class="pa-6">
      <div v-for="axis in axes" :key="axis.id" class="mb-8">
        <v-row align="center" no-gutters>
          <v-col cols="1">
            <span class="text-h6 font-weight-black primary--text">{{ axis.id }}</span>
          </v-col>
          
          <v-col cols="7" class="px-4">
            <v-slider
              v-model="axis.manualValue"
              :min="axis.min"
              :max="axis.max"
              step="0.1"
              hide-details
              color="primary"
              track-color="rgba(255,255,255,0.1)"
              @change="moveAxis(axis.id, axis.manualValue)"
            />
          </v-col>

          <v-col cols="4" class="d-flex align-center">
            <v-text-field
              v-model.number="axis.manualValue"
              type="number"
              hide-details
              dense
              outlined
              suffix="mm"
              class="axis-input-field"
              background-color="rgba(255,255,255,0.03)"
              @change="moveAxis(axis.id, axis.manualValue)"
            />
            <v-btn icon small color="primary" class="ml-2" @click="homeAxis(axis.id)">
              <v-icon small>mdi-home</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-divider class="my-6" style="opacity: 0.1;"></v-divider>

      <div class="z-offset-card px-6 py-4 d-flex align-center">
        <span class="text-caption grey--text font-weight-bold mr-8">Z-OFFSET</span>
        <v-slider
          v-model="zOffsetLocal"
          hide-details
          min="-2"
          max="2"
          step="0.005"
          color="amber darken-2"
          track-color="rgba(255,255,255,0.1)"
          class="flex-grow-1"
          @change="updateZOffset"
        >
          <template v-slot:append>
            <span class="white--text font-weight-bold text-h6 ml-3" style="min-width: 85px; text-align: right;">
              {{ (zOffsetLocal > 0 ? '+' : '') + zOffsetLocal.toFixed(3) }}
            </span>
          </template>
        </v-slider>
      </div>
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
.axis-input-field { max-width: 120px !important; }
.z-offset-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.white--text { color: #f0f0f5 !important; }
</style>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import Panel from '@/components/ui/Panel.vue'
import BaseMixin from '@/components/mixins/base'

@Component({ components: { Panel } })
export default class AxisPanel extends Mixins(BaseMixin) {
  zOffsetLocal = 0
  axes = [
    { id: 'X', manualValue: 0, min: 0, max: 300 },
    { id: 'Y', manualValue: 0, min: 0, max: 300 },
    { id: 'Z', manualValue: 0, min: 0, max: 350 }
  ]

  @Watch('printer.toolhead.position', { immediate: true, deep: true })
  onPositionChange(pos: number[]) {
    if (pos && pos.length >= 3) {
      this.axes[0].manualValue = parseFloat(pos[0].toFixed(2))
      this.axes[1].manualValue = parseFloat(pos[1].toFixed(2))
      this.axes[2].manualValue = parseFloat(pos[2].toFixed(2))
    }
  }

  @Watch('printer.gcode_move.homing_origin', { immediate: true, deep: true })
  onHomingOriginChange(newVal: any) {
    if (newVal && newVal[2] !== undefined) this.zOffsetLocal = newVal[2];
  }

  moveAxis(axis: string, value: number) {
    this.$socket.emit('printer.gcode.script', { script: `G1 ${axis}${value} F6000` });
  }

  homeAxis(axis: string) {
    this.$socket.emit('printer.gcode.script', { script: `G28 ${axis}` });
  }

  updateZOffset(val: number) {
    this.$socket.emit('printer.gcode.script', { script: `SET_GCODE_OFFSET Z=${val.toFixed(3)} MOVE=1` });
  }
}
</script>