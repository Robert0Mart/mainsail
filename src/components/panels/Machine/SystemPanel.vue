<template>
  <panel
    v-if="showPanel"
    :title="$t('Machine.SystemPanel.SystemLoad')"
    card-class="machine-systemload-panel elevation-0 custom-system-panel"
    :collapsible="true"
  >
    <template #icon>
      <v-avatar size="24" class="mr-3" tile color="transparent">
        <img 
          :src="customSystemIcon" 
          width="24"
          height="24"
          style="object-fit: contain; filter: brightness(0) invert(1); opacity: 0.85;"
        >
      </v-avatar>
    </template>

    <template #buttons>
      <v-btn outlined small color="grey lighten-1" class="d-none d-md-flex px-3 custom-device-btn" @click="dialogDevices = true">
        <v-icon small left>{{ mdiUsb }}</v-icon>
        {{ $t('Editor.DeviceDialog') }}
      </v-btn>
    </template>

    <v-card-text class="pa-4">
      <div v-for="(mcu, index) of mcus" :key="mcu.name">
        <v-divider v-if="index" class="custom-divider my-4" />
        <system-panel-mcu :mcu="mcu" />
      </div>
      <div v-if="hostStats">
        <v-divider v-if="mcus.length" class="custom-divider my-4" />
        <system-panel-host />
      </div>
    </v-card-text>
    <devices-dialog v-model="dialogDevices" />
  </panel>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '../../mixins/base'
import Panel from '@/components/ui/Panel.vue'
import { caseInsensitiveSort } from '@/plugins/helpers'
import { mdiCloseThick, mdiMemory, mdiUsb } from '@mdi/js'
import SystemPanelHost from '@/components/panels/Machine/SystemPanelHost.vue'
import SystemPanelMcu from '@/components/panels/Machine/SystemPanelMcu.vue'

import SystemIconFile from "@/assets/styles/icons/LCD_settingssvg.svg?url"

@Component({
  components: { SystemPanelMcu, SystemPanelHost, Panel },
})
export default class SystemPanel extends Mixins(BaseMixin) {
  mdiCloseThick = mdiCloseThick
  mdiMemory = mdiMemory
  mdiUsb = mdiUsb

  customSystemIcon = SystemIconFile

  dialogDevices = false

  get mcus() {
    if (!this.klipperReadyForGui) return []
    const mcus = this.$store.getters['printer/getMcus'] ?? []
    return caseInsensitiveSort(mcus, 'name')
  }

  get hostStats() {
    return this.$store.getters['server/getHostStats'] ?? null
  }

  get showPanel() {
    return this.mcus.length > 0 || this.hostStats
  }
}
</script>

<style scoped>
.custom-system-panel {
  background-color: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 8px !important;
}

.custom-divider {
  border-color: rgba(255, 255, 255, 0.05) !important;
}

.custom-device-btn {
  background-color: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.custom-device-btn:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>