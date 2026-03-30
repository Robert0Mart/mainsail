<template>
    <panel
        v-if="klipperReadyForGui"
        :title="$t('Panels.TemperaturePanel.Headline')"
        :collapsible="true"
        card-class="temperature-panel">
        
        <template #icon>
            <img src="/img/icons/blocks_icons/temperaturesvg.svg" 
                 class="blocks-icon mr-2" 
                 style="width: 35px; height: 35px;" alt="temp" />
        </template>

        <template #buttons>
            <temperature-panel-presets />
            <temperature-panel-settings />
        </template>
        
        <v-card-text class="pa-0">
            <temperature-panel-list />
            <v-divider v-if="boolTempchart" class="my-0" />
            <temp-chart v-if="boolTempchart" />
        </v-card-text>
    </panel>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ControlMixin from '@/components/mixins/control'
import TempChart from '@/components/charts/TempChart.vue'
import Panel from '@/components/ui/Panel.vue'
import TemperaturePanelPresets from '@/components/panels/Temperature/TemperaturePanelPresets.vue'
import TemperaturePanelSettings from '@/components/panels/Temperature/TemperaturePanelSettings.vue'
import TemperaturePanelList from '@/components/panels/Temperature/TemperaturePanelList.vue'

@Component({
    components: { Panel, TempChart, TemperaturePanelPresets, TemperaturePanelSettings, TemperaturePanelList },
})
export default class TemperaturePanel extends Mixins(BaseMixin, ControlMixin) {
    get boolTempchart() { return this.$store.state.gui.view.tempchart.boolTempchart ?? false }
}
</script>