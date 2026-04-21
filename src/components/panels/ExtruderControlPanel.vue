<template>
    <panel
        v-if="showPanel"
        :icon="mdiPrinter3dNozzle"
        :title="$t('Panels.ExtruderControlPanel.Headline')"
        :collapsible="true"
        card-class="extruder-control-panel">
        
        <template #buttons>
            <v-menu v-if="showFilamentMacros" :offset-y="true" :close-on-content-click="false" left>
                <template #activator="{ on, attrs }">
                    <v-btn icon tile v-bind="attrs" v-on="on">
                        <v-icon>{{ mdiDotsVertical }}</v-icon>
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-item v-if="unloadFilamentMacro">
                        <v-tooltip top :disabled="canExecuteUnloadMacro" color="secondary">
                            <template #activator="{ on }">
                                <div v-on="on">
                                    <macro-button
                                        :macro="unloadFilamentMacro"
                                        :alias="$t('Panels.ExtruderControlPanel.UnloadFilament')"
                                        :disabled="!canExecuteUnloadMacro || printerIsPrintingOnly"
                                        color="#272727" />
                                </div>
                            </template>
                            <span>
                                {{ $t('Panels.ExtruderControlPanel.ExtruderTempTooLow') }}
                                {{ minExtrudeTemp }} °C
                            </span>
                        </v-tooltip>
                    </v-list-item>
                    <v-list-item v-if="loadFilamentMacro">
                        <v-tooltip top :disabled="canExecuteLoadMacro" color="secondary">
                            <template #activator="{ on }">
                                <div v-on="on">
                                    <macro-button
                                        :macro="loadFilamentMacro"
                                        :alias="$t('Panels.ExtruderControlPanel.LoadFilament')"
                                        :disabled="!canExecuteLoadMacro || printerIsPrintingOnly"
                                        color="#272727" />
                                </div>
                            </template>
                            <span>
                                {{ $t('Panels.ExtruderControlPanel.ExtruderTempTooLow') }}
                                {{ minExtrudeTemp }} °C
                            </span>
                        </v-tooltip>
                    </v-list-item>
                    <v-list-item v-if="purgeFilamentMacro">
                        <v-tooltip top :disabled="canExecutePurgeMacro" color="secondary">
                            <template #activator="{ on }">
                                <div v-on="on">
                                    <macro-button
                                        :macro="purgeFilamentMacro"
                                        :alias="$t('Panels.ExtruderControlPanel.PurgeFilament')"
                                        :disabled="!canExecutePurgeMacro || printerIsPrintingOnly"
                                        color="#272727" />
                                </div>
                            </template>
                            <span>
                                {{ $t('Panels.ExtruderControlPanel.ExtruderTempTooLow') }}
                                {{ minExtrudeTemp }} °C
                            </span>
                        </v-tooltip>
                    </v-list-item>
                    <v-list-item v-if="cleanNozzleMacro">
                        <macro-button
                            :macro="cleanNozzleMacro"
                            :alias="$t('Panels.ExtruderControlPanel.CleanNozzle')"
                            :disabled="printerIsPrintingOnly"
                            color="#272727" />
                    </v-list-item>
                </v-list>
            </v-menu>
            <extruder-panel-settings />
        </template>

        <extruder-control-panel-tools v-if="showTools && toolchangeMacros.length" />
        
        <template v-if="showExtrusionFactor">
            <v-divider v-if="showTools" />
            <div class="extrusion-factor-wrapper mx-4">
                <extrusion-factor-settings />
            </div>
        </template>

        <template v-if="showPressureAdvance">
            <v-divider v-if="showTools || showExtrusionFactor" />
            <div class="mx-4 pb-4">
                <extruder-pressure-advance-settings v-if="extruderSteppers.length === 0" />
                <template v-else>
                    <extruder-stepper-pressure-advance-settings
                        v-for="(extruderStepper, index) in extruderSteppers"
                        :key="extruderStepper"
                        :class="{ 'pt-3': index === 0 }"
                        :extruder-stepper="extruderStepper" />
                </template>
            </div>
        </template>

        <template v-if="showFirmwareRetraction">
            <v-divider v-if="showTools || showExtrusionFactor || showPressureAdvance" />
            <div class="mx-4">
                <firmware-retraction-settings />
            </div>
        </template>

        <template v-if="showExtruderControl">
            <v-divider v-if="showTools || showExtrusionFactor || showPressureAdvance || showFirmwareRetraction" />
            <div class="mx-4">
                <extruder-control-panel-control />
            </div>
        </template>
    </panel>
</template>

<script lang="ts">
import { mdiPrinter3dNozzle, mdiDotsVertical } from '@mdi/js'
import { Component, Mixins } from 'vue-property-decorator'
import { PrinterStateMacro } from '@/store/printer/types'
import BaseMixin from '@/components/mixins/base'
import ControlMixin from '@/components/mixins/control'
import ExtruderMixin from '@/components/mixins/extruder'

@Component
export default class ExtruderControlPanel extends Mixins(BaseMixin, ControlMixin, ExtruderMixin) {
    mdiPrinter3dNozzle = mdiPrinter3dNozzle
    mdiDotsVertical = mdiDotsVertical

    private heatWaitGcodes = ['printer.extruder.can_extrude', 'TEMPERATURE_WAIT', 'M109']

    get showPanel(): boolean {
        return this.klipperReadyForGui && this.extruders.length > 0
    }

    get macros() {
        return this.$store.getters['printer/getMacros']
    }

    get loadFilamentMacro(): PrinterStateMacro | undefined {
        const macros = ['LOAD_FILAMENT', 'FILAMENT_LOAD']
        return this.macros.find((macro: PrinterStateMacro) => macros.includes(macro.name.toUpperCase()))
    }

    get unloadFilamentMacro(): PrinterStateMacro | undefined {
        const macros = ['UNLOAD_FILAMENT', 'FILAMENT_UNLOAD']
        return this.macros.find((macro: PrinterStateMacro) => macros.includes(macro.name.toUpperCase()))
    }

    get purgeFilamentMacro(): PrinterStateMacro | undefined {
        const macros = ['PURGE_FILAMENT', 'FILAMENT_PURGE']
        return this.macros.find((macro: PrinterStateMacro) => macros.includes(macro.name.toUpperCase()))
    }

    get cleanNozzleMacro(): PrinterStateMacro | undefined {
        const macros = ['CLEAN_NOZZLE', 'NOZZLE_CLEAN', 'WIPE_NOZZLE', 'NOZZLE_WIPE']
        return this.macros.find((macro: PrinterStateMacro) => macros.includes(macro.name.toUpperCase()))
    }

    get canExecuteLoadMacro(): boolean {
        if (this.extrudePossible) return true
        return this.heatWaitGcodes.some((gcode) => this.loadFilamentMacro?.prop.gcode.includes(gcode))
    }

    get canExecuteUnloadMacro(): boolean {
        if (this.extrudePossible) return true
        return this.heatWaitGcodes.some((gcode) => this.unloadFilamentMacro?.prop.gcode.includes(gcode))
    }

    get canExecutePurgeMacro(): boolean {
        if (this.extrudePossible) return true
        return this.heatWaitGcodes.some((gcode) => this.purgeFilamentMacro?.prop.gcode.includes(gcode))
    }

    get showFilamentMacros(): boolean {
        return (
            this.loadFilamentMacro !== undefined ||
            this.unloadFilamentMacro !== undefined ||
            this.purgeFilamentMacro !== undefined ||
            this.cleanNozzleMacro !== undefined
        )
    }

    get showTools(): boolean {
        if (this.toolchangeMacros.length < 1) return false
        return this.$store.state.gui.view.extruder.showTools ?? true
    }

    get showExtrusionFactor(): boolean {
        return this.$store.state.gui.view.extruder.showExtrusionFactor ?? true
    }

    get extruderSteppers() {
        return Object.keys(this.$store.state.printer)
            .filter((e) => e.startsWith('extruder_stepper '))
            .sort((a, b) => a.localeCompare(b))
    }

    get showPressureAdvance(): boolean {
        return this.$store.state.gui.view.extruder.showPressureAdvance ?? true
    }

    get showFirmwareRetraction(): boolean {
        if (!this.existsFirmwareRetraction) return false
        return this.$store.state.gui.view.extruder.showFirmwareRetraction ?? true
    }

    get showExtruderControl(): boolean {
        return this.$store.state.gui.view.extruder.showExtrudeControl ?? true
    }
}
</script>

<style lang="scss" scoped>
/* 1. Ícone do Título em Azul */
.extruder-control-panel {
    ::v-deep .v-card__title {
        .v-icon {
            color: #2196F3 !important;
        }
    }
}

/* 2. Espaçamento Superior e Lateral do Slider */
.extrusion-factor-wrapper {
    margin-top: 25px !important;
    margin-bottom: 15px;
}

/* 3. Margens laterais (mx-4 no template) e cores dos ícones */
/* Mantém os botões + e - brancos, mas podemos pintar o ícone do bocal pequeno se quiseres */
.extrusion-factor-wrapper {
    ::v-deep .v-icon {
        // Se quiseres que o ícone pequeno ao lado de "Extrusion factor" também seja azul:
        &:first-child {
            color: #2196F3 !important;
        }
    }
}

/* Garante que o conteúdo tenha respiro lateral */
.mx-4 {
    margin-left: 16px !important;
    margin-right: 16px !important;
}
</style>