<template>
  <panel
    v-if="klipperReadyForGui"
    :title="$t('Panels.ToolheadControlPanel.Headline')"
    :collapsible="true"
    card-class="toolhead-control-panel">

    <template #icon>
      <img src="/img/icons/blocks_icons/motionsvg.svg" style="width: 24px; height: 24px; margin-right: 8px;" />
    </template>

    <template #buttons>
    </template>

    <div v-if="showControl" class="px-2">
      <move-to-control />
    </div>

    <v-container v-if="axisControlVisible" class="pa-0 wide-control-container">
      <component :is="`${controlStyle}-control`" />
    </v-container>

    <v-container v-if="showSpeedFactor" class="pa-0 px-4 mt-4">
      <tool-slider
        :label="$t('Panels.ToolheadControlPanel.SpeedFactor')"
        :icon-image="'/img/icons/blocks_icons/speedsvg.svg'"
        :target="speedFactor"
        :min="1"
        :max="200"
        :multi="100"
        :step="5"
        :dynamic-range="true"
        :has-input-field="true"
        command="M220"
        attribute-name="S" />
    </v-container>
  </panel>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BarsControl from '@/components/panels/ToolheadControls/BarsControl.vue'
import BaseMixin from '../mixins/base'
import CircleControl from '@/components/panels/ToolheadControls/CircleControl.vue'
import ControlMixin from '@/components/mixins/control'
import CrossControl from '@/components/panels/ToolheadControls/CrossControl.vue'
import MoveToControl from '@/components/panels/ToolheadControls/MoveToControl.vue'
import Panel from '@/components/ui/Panel.vue'
import ToolSlider from '@/components/inputs/ToolSlider.vue'
import ZoffsetControl from '@/components/panels/ToolheadControls/ZoffsetControl.vue'
import { mdiDotsVertical, mdiEngineOff, mdiGamepad, mdiSpeedometer, mdiMenuDown, mdiRestore } from '@mdi/js'

@Component({
  components: {
    BarsControl,
    CircleControl,
    CrossControl,
    MoveToControl,
    Panel,
    ToolSlider,
    ZoffsetControl,
  },
})
export default class ToolheadControlPanel extends Mixins(BaseMixin, ControlMixin) {
  mdiDotsVertical = mdiDotsVertical
  mdiEngineOff = mdiEngineOff
  mdiGamepad = mdiGamepad
  mdiSpeedometer = mdiSpeedometer
  mdiRestore = mdiRestore
  mdiMenuDown = mdiMenuDown

  get controlStyle(): string {
    return this.$store.state.gui.control.style ?? 'bars'
  }

  get actionButton(): string {
    return this.$store.state.gui.control.actionButton ?? this.defaultActionButton
  }

  get isPrinting() {
    return ['printing'].includes(this.printer_state)
  }

  get axisControlVisible() {
    if (!this.showControl) return false
    return !(this.isPrinting && (this.$store.state.gui.control.hideDuringPrint ?? false))
  }

  get showButtons() {
    if (this.controlStyle !== 'bars' && (this.existsZtilt || this.existsQGL)) return true
    return this.existsBedScrews || this.existsBedTilt || this.existsDeltaCalibrate || this.existsScrewsTilt
  }

  get showControl(): boolean {
    return this.$store.state.gui.view.toolhead.showControl ?? true
  }

  get showSpeedFactor(): boolean {
    return this.$store.state.gui.view.toolhead.showSpeedFactor ?? true
  }
}
</script>

<style scoped>
/* Remove qualquer trava de largura do container onde os botões moram */
.v-container.pa-0.wide-control-container {
  max-width: 100% !important;
  width: 100% !important;
  display: flex;
  justify-content: center;
  margin: 15px 0;
}

/* Garante que o painel (card) principal não limite o crescimento dos botões */
.toolhead-control-panel {
  width: 100% !important;
}

/* Ajuste opcional: se o MoveToControl estiver desalinhado com o novo tamanho */
.px-2 {
  width: 100%;
  max-width: 100%;
}

/* Melhora o espaçamento do slider para não ficar colado na borda agora que alargamos o pai */
.px-4 {
  margin-bottom: 40px !important;
}
</style>