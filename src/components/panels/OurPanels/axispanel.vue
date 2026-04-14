<template>
  <panel
    title="Machine Axis & Z-Offset"
    icon="mdi-axis-arrow"
    card-class="blocks-axis-panel"
    center-title
  >
    <div class="pa-6 d-flex flex-row align-center justify-space-between">
      
      <div class="d-flex flex-grow-1 justify-start">
        <div class="z-offset-card px-2 py-4 d-flex flex-column align-center">
          <span class="text-caption grey--text font-weight-bold mb-3">Z-OFFSET</span>
          
          <v-btn 
            v-for="step in [0.05, 0.01, 0.005]" 
            :key="`z-pos-${step}`"
            class="z-jog-btn mb-1"
            elevation="0"
            @click="adjustZOffset(step)"
          >
            <span class="font-weight-bold">+{{ step }}</span>
          </v-btn>

          <span class="white--text font-weight-bold text-h6 my-3 text-center" style="min-width: 70px;">
            {{ (zOffsetLocal > 0 ? '+' : '') + zOffsetLocal.toFixed(3) }}
          </span>

          <v-btn 
            v-for="step in [0.005, 0.01, 0.05]" 
            :key="`z-neg-${step}`"
            class="z-jog-btn mt-1"
            elevation="0"
            @click="adjustZOffset(-step)"
          >
            <span class="font-weight-bold">−{{ step }}</span>
          </v-btn>
        </div>
      </div>

      <div class="axis-container d-flex justify-center align-center pa-4">
        <div 
          v-for="axis in axesConfig" 
          :key="axis.id" 
          class="axis-column d-flex flex-column align-center mx-1"
        >
          <v-btn 
            v-for="step in axis.steps" 
            :key="`pos-${step}`"
            class="jog-btn mb-1"
            elevation="0"
            @click="jog(axis.id, step)"
          >
            <span class="font-weight-bold">+{{ step }}</span>
          </v-btn>

          <v-btn 
            class="home-btn my-3"
            :color="getAxisColor(axis.id)"
            elevation="4"
            fab
            @click="homeAxis(axis.id)"
          >
            <div class="d-flex flex-column align-center justify-center pt-1">
              <span class="font-weight-black text-subtitle-1" style="line-height: 1;">{{ axis.id }}</span>
            </div>
          </v-btn>

          <v-btn 
            v-for="step in [...axis.steps].reverse()" 
            :key="`neg-${step}`"
            class="jog-btn mt-1"
            elevation="0"
            @click="jog(axis.id, -step)"
          >
            <span class="font-weight-bold">−{{ step }}</span>
          </v-btn>
        </div>
      </div>

      <div class="d-flex flex-grow-1"></div>

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

  axesConfig = [
    { id: 'X', steps: [100, 10, 1] },
    { id: 'Y', steps: [100, 10, 1] },
    { id: 'Z', steps: [25, 1, 0.1] }
  ]

  getAxisColor(id: string) {
    if (id === 'X') return 'red darken-1';
    if (id === 'Y') return 'green darken-1';
    return 'primary';
  }

  jog(axis: string, distance: number) {
    const feedrate = axis === 'Z' ? 600 : 6000;
    const script = `G91\nG1 ${axis}${distance} F${feedrate}\nG90`;
    this.$socket.emit('printer.gcode.script', { script });
  }

  homeAxis(axis: string) {
    this.$socket.emit('printer.gcode.script', { script: `G28 ${axis}` });
  }

  @Watch('printer.gcode_move.homing_origin', { immediate: true, deep: true })
  onHomingOriginChange(newVal: any) {
    if (newVal && newVal[2] !== undefined) this.zOffsetLocal = newVal[2];
  }

  adjustZOffset(step: number) {
    let newVal = this.zOffsetLocal + step;
    if (newVal > 2) newVal = 2;
    if (newVal < -2) newVal = -2;
    this.zOffsetLocal = newVal;
    this.$socket.emit('printer.gcode.script', { script: `SET_GCODE_OFFSET Z=${this.zOffsetLocal.toFixed(3)} MOVE=1` });
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

.axis-container {
  border: 1px solid rgba(255, 82, 82, 0.3); 
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.01);
  width: fit-content; 
}

.axis-column {
  width: 76px; 
}

.jog-btn {
  width: 70%;
  height: 32px !important; 
  font-size: 0.85rem !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #c9c9c9 !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
}

.jog-btn:hover {
  background-color: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.2);
}

.home-btn {
  width: 35px !important;
  height: 35px !important;
  border: 2px solid rgba(255, 255, 255, 0.1);
  justify-content: center !important;
}

.z-offset-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  width: 95px; /* Fixed width to frame the vertical buttons properly */
}

.z-jog-btn {
  width: 75px !important; /* Made wider than jog-btn to fit the -0.005 text comfortably */
  height: 32px !important; 
  font-size: 0.85rem !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #c9c9c9 !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  padding: 0 !important;
}

.z-jog-btn:hover {
  background-color: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.2);
}

.white--text { color: #f0f0f5 !important; }
</style>

<style scoped>
::v-deep .blocks-axis-panel { 
  background: linear-gradient(145deg, #1c1c22, #141419) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
}

.axis-container {
  border: 1px solid rgba(255, 82, 82, 0.3); 
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.01);
  width: fit-content; 
}

.axis-column {
  width: 76px; 
}

.jog-btn {
  width: 70%;
  height: 32px !important; 
  font-size: 0.85rem !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #c9c9c9 !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
}

.jog-btn:hover {
  background-color: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.2);
}

.home-btn {
  width: 35px !important;
  height: 35px !important;
  border: 2px solid rgba(255, 255, 255, 0.1);
  justify-content: center !important;
}

.z-offset-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  width: fit-content; /* Keeps the card tightly wrapped around the new buttons */
}

/* Dedicated class for Z-Offset buttons so they fit the horizontal layout */
.z-jog-btn {
  min-width: 50px !important;
  height: 32px !important; 
  font-size: 0.85rem !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #c9c9c9 !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  padding: 0 8px !important;
}

.z-jog-btn:hover {
  background-color: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.2);
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

  axesConfig = [
    { id: 'X', steps: [100, 10, 1] },
    { id: 'Y', steps: [100, 10, 1] },
    { id: 'Z', steps: [25, 1, 0.1] }
  ]

  // Returns specific colors for the home buttons
  getAxisColor(id: string) {
    if (id === 'X') return 'red darken-1';
    if (id === 'Y') return 'green darken-1';
    return 'primary'; // Fallback for Z (typically blue/primary theme color)
  }

  jog(axis: string, distance: number) {
    const feedrate = axis === 'Z' ? 600 : 6000;
    const script = `G91\nG1 ${axis}${distance} F${feedrate}\nG90`;
    this.$socket.emit('printer.gcode.script', { script });
  }

  homeAxis(axis: string) {
    this.$socket.emit('printer.gcode.script', { script: `G28 ${axis}` });
  }

  getZOffsetLabels() {
    const min = -2;
    const max = 2;
    const step = 0.005;
    const totalSteps = Math.round((max - min) / step);
    const labels = new Array(totalSteps + 1).fill('');
    const interval = totalSteps / 6;

    const predefinedLabels = ['-2', '-1.3', '-0.6', '0', '0.6', '1.3', '2'];

    for (let i = 0; i <= 6; i++) {
      const index = Math.round(interval * i);
      labels[index] = predefinedLabels[i];
    }
    return labels;
  }

  @Watch('printer.gcode_move.homing_origin', { immediate: true, deep: true })
  onHomingOriginChange(newVal: any) {
    if (newVal && newVal[2] !== undefined) this.zOffsetLocal = newVal[2];
  }

  updateZOffset(val: number) {
    this.$socket.emit('printer.gcode.script', { script: `SET_GCODE_OFFSET Z=${val.toFixed(3)} MOVE=1` });
  }
}
</script>