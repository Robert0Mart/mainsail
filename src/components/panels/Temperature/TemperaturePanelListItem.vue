<template>
    <tr v-if="printerObject" v-longpress:600="(e) => openContextMenu(e)" @contextmenu.prevent="openContextMenu($event)">
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
            <span class="white--text font-weight-bold" style="font-size: 1.2rem;">{{ formatTemperature }}</span>
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
        if (this.isExtruder) filter = 'invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%) contrast(117%)'
        else if (this.isBed) filter = 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(186deg) brightness(101%) contrast(101%)'
        else if (name.includes('chamber')) filter = 'invert(65%) sepia(85%) saturate(1251%) hue-rotate(128deg) brightness(96%) contrast(101%)'
        else if (name.includes('board') || name.includes('controller')) filter = 'invert(32%) sepia(91%) saturate(2852%) hue-rotate(224deg) brightness(93%) contrast(101%)'
        else if (name.includes('soc') || name.includes('host') || name.includes('mcu') || name.includes('pi')) filter = 'invert(85%) sepia(77%) saturate(1145%) hue-rotate(358deg) brightness(103%) contrast(105%)'
        else if (name.includes('scanner')) filter = 'invert(26%) sepia(91%) saturate(3736%) hue-rotate(274deg) brightness(92%) contrast(111%)'
        return { width: '22px', height: '22px', filter: filter }
    }

    get isExtruder() { return this.objectName.startsWith('extruder') }
    get isBed() { return this.objectName === 'heater_bed' }
    get isFan() { return this.objectName.startsWith('temperature_fan') || this.objectName.startsWith('fan') }
    get printerObject() { return this.$store.state.printer[this.objectName] }
    get name() { const splits = this.objectName.split(' '); return splits.length === 1 ? this.objectName : splits[1] }
    get formatName() { return convertName(this.name) }
    get color() { return this.$store.getters['printer/tempHistory/getDatasetColor'](this.objectName) ?? '#FFFFFF' }
    get state() { return this.printerObject?.power ?? this.printerObject?.speed ?? null }
    get formatState() { return this.state === null ? null : `${Math.round(this.state * 100)} %` }
    get temperature() { return this.printerObject?.temperature ?? null }
    get formatTemperature() { return `${this.temperature?.toFixed(1) ?? '--'}°C` }
    get min_temp() { return parseInt(this.$store.state.printer?.configfile?.settings[this.objectName.toLowerCase()]?.min_temp ?? 0) }
    get max_temp() { return parseInt(this.$store.state.printer?.configfile?.settings[this.objectName.toLowerCase()]?.max_temp ?? 0) }
    get target() { return this.printerObject?.target ?? null }
    get rpm() { return this.printerObject?.rpm ?? null }
    get rpmClass() { return (this.rpm === 0 && (this.printerObject?.speed ?? 0) > 0) ? 'red--text' : '' }
    get presets() { return this.$store.getters['gui/presets/getPresetsFromHeater']({ name: this.objectName }) ?? [] }
    get isHeater() { return (this.$store.state.printer.heaters?.available_heaters ?? []).includes(this.objectName) }
    get command() { if (this.objectName.startsWith('temperature_fan')) return 'SET_TEMPERATURE_FAN_TARGET'; if (this.isHeater) return 'SET_HEATER_TEMPERATURE'; return null }
    get commandAttributeName() { return this.command === 'SET_HEATER_TEMPERATURE' ? 'HEATER' : 'TEMPERATURE_FAN' }
    openContextMenu(event: MouseEvent) { this.showContextMenu = true; this.contextMenuX = event.clientX; this.contextMenuY = event.clientY }
    openEditDialog() { this.showEditDialog = true }
}
</script>

<style scoped>
.ultra-clean-target ::v-deep input { text-align: right !important; color: #2196f3 !important; font-weight: bold !important; font-size: 1.1rem !important; padding: 0 !important; }
.ultra-clean-target ::v-deep .v-text-field__slot { margin-right: 4px !important; }
</style>