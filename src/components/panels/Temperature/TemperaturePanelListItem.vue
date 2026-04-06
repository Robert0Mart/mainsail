<template>
    <tr v-longpress:600="(e) => openContextMenu(e)" @contextmenu.prevent="openContextMenu($event)">
        <td class="icon text-center">
            <img :src="iconSrc" class="blocks-icon" :style="customIconStyle" @click="openEditDialog" />
        </td>

        <td class="name">
            <span class="cursor-pointer white--text font-weight-medium" @click="openEditDialog">{{ formatName }}</span>
        </td>

        <td v-if="!isResponsiveMobile" class="state text-right">
            <div v-if="state !== null" class="grey--text text--lighten-1">{{ formatState }}</div>
        </td>

        <td class="current text-right">
            <span class="white--text font-weight-bold" style="font-size: 1.25rem;">{{ formatTemperature }}</span>
            <div v-if="rpm !== null">
                <small :class="rpmClass">{{ rpm }} RPM</small>
            </div>
        </td>

        <td class="target ultra-clean-target text-right">
            <temperature-input
                v-if="command !== null"
                :name="name"
                :target="target"
                :presets="presets"
                :min_temp="min_temp"
                :max_temp="max_temp"
                :command="command"
                :input-digits="inputDigits"
                :attribute-name="commandAttributeName" />
        </td>

        <temperature-panel-list-item-edit
            v-model="showEditDialog"
            :object-name="objectName"
            :name="name"
            :format-name="formatName"
            :icon="mdiThermometer"
            :color="color" />

        <v-menu v-model="showContextMenu" :position-x="contextMenuX" :position-y="contextMenuY" absolute offset-y>
            <v-list dense>
                <v-list-item v-if="isHeater" :disabled="!isHeaterActive" @click="turnOffHeater">
                    <img src="/img/icons/blocks_icons/cooldownsvg.svg" class="blocks-icon mr-2" style="width: 18px; height: 18px;" />
                    <v-list-item-title>{{ $t('Panels.TemperaturePanel.TurnHeaterOff') }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="openEditDialog">
                    <img src="/img/icons/blocks_icons/printer_settingsvg.svg" class="blocks-icon mr-2" style="width: 18px; height: 18px;" />
                    <v-list-item-title>{{ $t('Panels.TemperaturePanel.Settings') }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </tr>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { convertName } from '@/plugins/helpers'
import { mdiThermometer } from '@mdi/js'
import { EventBus, CLOSE_CONTEXT_MENU } from '@/plugins/eventBus'

@Component
export default class TemperaturePanelListItem extends Mixins(BaseMixin) {
    mdiThermometer = mdiThermometer

    @Prop({ type: String, required: true }) readonly objectName!: string
    @Prop({ type: Boolean, required: true }) readonly isResponsiveMobile!: boolean
    @Prop({ type: Number, default: 3 }) readonly inputDigits!: number

    showEditDialog = false
    showContextMenu = false
    contextMenuX = 0
    contextMenuY = 0

    get iconSrc() {
        if (this.isExtruder) return '/img/icons/blocks_icons/extrudesvg.svg'
        if (this.isBed) return '/img/icons/blocks_icons/temperature_platesvg.svg'
        if (this.isFan) return '/img/icons/blocks_icons/blowersvg.svg'
        return '/img/icons/blocks_icons/standart_temperaturesvg.svg'
    }

    get customIconStyle() {
        let filter = 'none'
        const name = this.objectName.toLowerCase()
        if (this.isExtruder) filter = 'invert(20%) sepia(90%) saturate(3000%) hue-rotate(350deg)' 
        else if (this.isBed) filter = 'invert(40%) sepia(80%) saturate(2000%) hue-rotate(200deg)'
        else if (name.includes('chamber')) filter = 'invert(60%) sepia(90%) saturate(1000%) hue-rotate(140deg)'
        else if (name.includes('board') || name.includes('controller')) filter = 'invert(30%) sepia(80%) saturate(2500%) hue-rotate(220deg)'
        else if (name.includes('soc') || name.includes('host')) filter = 'invert(80%) sepia(80%) saturate(1000%) hue-rotate(10deg)'
        else if (name.includes('scanner')) filter = 'invert(30%) sepia(80%) saturate(2500%) hue-rotate(270deg)'
        return { width: '24px', height: '24px', cursor: 'pointer', filter: filter }
    }

    get isExtruder() { return this.objectName.startsWith('extruder') }
    get isBed() { return this.objectName === 'heater_bed' }
    get isFan() { return this.objectName.startsWith('temperature_fan') || this.objectName.startsWith('fan') }
    get isHeater() { return (this.$store.state.printer.heaters?.available_heaters ?? []).includes(this.objectName) }
    get isHeaterActive() { return (this.target ?? 0) > 0 }
    get printerObject() { return this.$store.state.printer[this.objectName] ?? {} }
    get printerObjectSettings() { return this.$store.state.printer?.configfile?.settings[this.objectName.toLowerCase()] ?? {} }
    get name() { const splits = this.objectName.split(' '); return splits.length === 1 ? this.objectName : splits[1] }
    get formatName() { return convertName(this.name) }
    get color() { return this.$store.getters['printer/tempHistory/getDatasetColor'](this.objectName) ?? '#FFFFFF' }
    get state(): number | null { return this.printerObject.power ?? this.printerObject.speed ?? null }
    get formatState() { return this.state === null ? null : `${Math.round(this.state * 100)} %` }
    get temperature(): number | null { return this.printerObject?.temperature ?? null }
    get formatTemperature() { return `${this.temperature?.toFixed(1) ?? '--'}°C` }
    get min_temp() { return parseInt(this.printerObjectSettings.min_temp ?? 0) }
    get max_temp() { return parseInt(this.printerObjectSettings.max_temp ?? 0) }
    get target() { return this.printerObject?.target ?? null }
    get rpm() { return this.printerObject.rpm ? parseInt(this.rpm) : null }
    get rpmClass() { return (this.rpm === 0 && (this.printerObject.speed ?? 0) > 0) ? 'red--text' : '' }
    get presets() { return this.$store.getters['gui/presets/getPresetsFromHeater']({ name: this.objectName }) ?? [] }
    get command() { if (this.objectName.startsWith('temperature_fan')) return 'SET_TEMPERATURE_FAN_TARGET'; if (this.isHeater || this.objectName.startsWith('heater_')) return 'SET_HEATER_TEMPERATURE'; return null }
    get commandAttributeName() { if (this.command === 'SET_HEATER_TEMPERATURE') return 'HEATER'; if (this.command === 'SET_TEMPERATURE_FAN_TARGET') return 'TEMPERATURE_FAN'; return '' }
    mounted() { EventBus.$on(CLOSE_CONTEXT_MENU, this.closeContextMenu) }
    beforeDestroy() { EventBus.$off(CLOSE_CONTEXT_MENU, this.closeContextMenu) }
    openContextMenu(event: MouseEvent) { EventBus.$emit(CLOSE_CONTEXT_MENU); this.showContextMenu = true; this.contextMenuX = event?.clientX || event?.pageX; this.contextMenuY = event?.clientY || event?.pageY }
    closeContextMenu() { this.showContextMenu = false }
    openEditDialog() { this.closeContextMenu(); this.showEditDialog = true }
    turnOffHeater() { const gcode = `SET_HEATER_TEMPERATURE HEATER=${this.name} TARGET=0`; this.$socket.emit('printer.gcode.script', { script: gcode }) }
}
</script>

<style scoped>
.ultra-clean-target ::v-deep .v-input__slot { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
.ultra-clean-target ::v-deep fieldset { display: none !important; }
.ultra-clean-target ::v-deep input { text-align: right !important; color: #00E5FF !important; font-weight: bold !important; padding: 0 !important; font-size: 1.1rem !important; }
.ultra-clean-target ::v-deep .v-text-field__suffix { color: rgba(255, 255, 255, 0.5) !important; }
</style>