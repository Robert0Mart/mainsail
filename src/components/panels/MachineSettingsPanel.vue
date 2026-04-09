<template>
    <panel
        v-if="klipperReadyForGui"
        :icon="mdiSpeedometer"
        title="Speed"
        :collapsible="true"
        card-class="machine-settings-panel custom-glass-panel">
        <v-card-text class="pt-5 pb-6">
            <div class="speed-factor-section">
                <div class="d-flex align-center justify-space-between mb-2">
                    <div class="d-flex align-center">
                        <v-icon small class="mr-2 white--text">{{ mdiSpeedometer }}</v-icon>
                        <span class="text-subtitle-2 white--text font-weight-bold">{{ $t('Panels.ToolheadControlPanel.SpeedFactor') }}</span>
                    </div>
                    <div class="d-flex align-center premium-input-box">
                        <span class="primary--text font-weight-bold mr-1">{{ speedFactor }}</span>
                        <span class="grey--text text--darken-1 mr-2">%</span>
                        <v-btn icon x-small @click="sendSpeedFactor(100)">
                            <v-icon x-small color="grey darken-1">{{ mdiHistory }}</v-icon>
                        </v-btn>
                    </div>
                </div>
                <v-slider
                    v-model="speedFactor"
                    min="1"
                    max="200"
                    hide-details
                    class="custom-slider"
                    @change="sendSpeedFactor">
                    <template #prepend>
                        <v-icon small @click="sendSpeedFactor(speedFactor - 1)">{{ mdiMinus }}</v-icon>
                    </template>
                    <template #append>
                        <v-icon small @click="sendSpeedFactor(speedFactor + 1)">{{ mdiPlus }}</v-icon>
                    </template>
                </v-slider>
            </div>
        </v-card-text>
    </panel>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import Panel from '@/components/ui/Panel.vue'
import { mdiSpeedometer, mdiHistory, mdiPlus, mdiMinus } from '@mdi/js'

@Component({
    components: { Panel },
})
export default class MachineSettingsPanel extends Mixins(BaseMixin) {
    mdiSpeedometer = mdiSpeedometer
    mdiHistory = mdiHistory
    mdiPlus = mdiPlus
    mdiMinus = mdiMinus

    get speedFactor(): number {
        return Math.round((this.$store.state.printer?.gcode_move?.speed_factor ?? 1) * 100)
    }

    set speedFactor(val: number) { }

    sendSpeedFactor(val: number) {
        const gcode = `M220 S${val}`
        this.$socket.emit('printer.gcode.script', { script: gcode })
    }
}
</script>