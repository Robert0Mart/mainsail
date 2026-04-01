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
            <v-menu v-if="showButtons" left offset-y :close-on-content-click="false" class="pa-0">
                <template #activator="{ on, attrs }">
                    <v-btn icon tile v-bind="attrs" :disabled="['printing'].includes(printer_state)" v-on="on">
                        <v-icon>{{ mdiDotsVertical }}</v-icon>
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-item v-if="controlStyle !== 'bars' && actionButton !== 'm84'">
                        <v-btn small style="width: 100%" @click="doSend('M84')">
                            <img src="/img/icons/blocks_icons/disable_stepperssvg.svg" style="width: 18px; height: 18px; margin-right: 8px;" />
                            {{ $t('Settings.ControlTab.MotorsOff', { isDefault: '' }) }}
                        </v-btn>
                    </v-list-item>
                    <v-list-item v-if="controlStyle !== 'bars' && existsZtilt && actionButton !== 'ztilt'">
                        <v-btn small style="width: 100%" @click="doZtilt">Z-Tilt Adjust</v-btn>
                    </v-list-item>
                    <v-list-item v-if="controlStyle !== 'bars' && existsQGL && actionButton !== 'qgl'">
                        <v-btn small style="width: 100%" @click="doQGL">Quad Gantry Level</v-btn>
                    </v-list-item>
                    <v-list-item v-if="existsBedTilt">
                        <v-btn small style="width: 100%" @click="doSend('BED_TILT_CALIBRATE')">
                            BED TILT CALIBRATE
                        </v-btn>
                    </v-list-item>
                    <v-list-item v-if="existsBedScrews">
                        <v-btn small style="width: 100%" @click="doSend('BED_SCREWS_ADJUST')">BED SCREWS ADJUST</v-btn>
                    </v-list-item>
                    <v-list-item v-if="existsDeltaCalibrate">
                        <v-btn small style="width: 100%" @click="doSend('DELTA_CALIBRATE')">DELTA CALIBRATE</v-btn>
                    </v-list-item>
                    <v-list-item v-if="existsScrewsTilt">
                        <div class="d-flex align-center" style="width: 100%">
                            <v-btn
                                small
                                style="border-top-right-radius: 0; border-bottom-right-radius: 0"
                                @click="doSend('SCREWS_TILT_CALCULATE')">
                                SCREWS TILT CALCULATE
                            </v-btn>
                            <v-menu offset-y left :close-on-content-click="false">
                                <template #activator="{ on, attrs }">
                                    <v-btn
                                        small
                                        v-bind="attrs"
                                        class="px-0"
                                        style="min-width: 32px; border-top-left-radius: 0; border-bottom-left-radius: 0"
                                        v-on="on">
                                        <v-icon>{{ mdiMenuDown }}</v-icon>
                                    </v-btn>
                                </template>
                                <v-list dense>
                                    <v-list-item>
                                        <v-btn
                                            small
                                            style="width: 100%"
                                            @click="doSend('SCREWS_TILT_CALCULATE DIRECTION=CW')">
                                            <v-icon left small style="transform: scaleX(-1)">{{ mdiRestore }}</v-icon>
                                            <span>CW</span>
                                        </v-btn>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-btn
                                            small
                                            style="width: 100%"
                                            @click="doSend('SCREWS_TILT_CALCULATE DIRECTION=CCW')">
                                            <v-icon left small>{{ mdiRestore }}</v-icon>
                                            <span>CCW</span>
                                        </v-btn>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-list-item>
                </v-list>
            </v-menu>
            <toolhead-panel-settings />
        </template>
        
        <move-to-control v-if="showControl" />
        
        <v-container v-if="axisControlVisible" class="pa-0">
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
}
</script>