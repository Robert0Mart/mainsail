<template>
  <panel
    v-if="klipperReadyForGui"
    :title="$t('Panels.ToolheadControlPanel.Headline')"
    :collapsible="true"
    card-class="toolhead-control-panel">

    <template #icon>
      <img src="/img/icons/blocks_icons/motionsvg.svg" style="width: 24px; height: 24px; margin-right: 8px;" />
    </template>

    <div v-if="showControl" class="px-2">
      <move-to-control />
    </div>

    <v-container v-if="axisControlVisible" class="pa-0 wide-control-container">
      <component :is="`${controlStyle}-control`" />
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
import ZoffsetControl from '@/components/panels/ToolheadControls/ZoffsetControl.vue'
import { mdiDotsVertical, mdiEngineOff, mdiGamepad, mdiMenuDown } from '@mdi/js'

@Component({
  components: { BarsControl, CircleControl, CrossControl, MoveToControl, Panel, ZoffsetControl },
})
export default class ToolheadControlPanel extends Mixins(BaseMixin, ControlMixin) {
  mdiDotsVertical = mdiDotsVertical
  mdiEngineOff = mdiEngineOff
  mdiGamepad = mdiGamepad
  mdiMenuDown = mdiMenuDown

  get controlStyle(): string { return this.$store.state.gui.control.style ?? 'bars' }
  get isPrinting() { return ['printing'].includes(this.printer_state) }
  get axisControlVisible() {
    if (!this.showControl) return false
    return !(this.isPrinting && (this.$store.state.gui.control.hideDuringPrint ?? false))
  }
  get showControl(): boolean { return this.$store.state.gui.view.toolhead.showControl ?? true }
}
</script>

<style scoped>
.v-container.pa-0.wide-control-container { max-width: 100% !important; width: 100% !important; display: flex; justify-content: center; margin: 15px 0; }
.toolhead-control-panel { width: 100% !important; }
.px-2 { width: 100%; max-width: 100%; }
</style>