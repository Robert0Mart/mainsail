<template>
    <tr v-longpress:600="(e) => openContextMenu(e)" @contextmenu.prevent="openContextMenu($event)">
        <td class="icon">
            <img v-if="isExtruder"
                 src="/img/icons/blocks_icons/extrudesvg.svg"
                 class="blocks-icon mr-2"
                 :style="customIconStyle"
                 @click="openEditDialog" />

            <img v-else-if="isBed"
                 src="/img/icons/blocks_icons/temperature_platesvg.svg"
                 class="blocks-icon mr-2"
                 :style="customIconStyle"
                 @click="openEditDialog" />

            <img v-else-if="isFan"
                 src="/img/icons/blocks_icons/blowersvg.svg"
                 class="blocks-icon mr-2"
                 :style="customIconStyle"
                 @click="openEditDialog" />

            <img v-else-if="objectName.startsWith('heater_generic')"
                 src="/img/icons/blocks_icons/hot_temperaturesvg.svg"
                 class="blocks-icon mr-2"
                 :style="customIconStyle"
                 @click="openEditDialog" />

            <img v-else
                 src="/img/icons/blocks_icons/standart_temperaturesvg.svg"
                 class="blocks-icon mr-2"
                 :style="customIconStyle"
                 @click="openEditDialog" />
        </td>

        <td class="name">
            <span class="cursor-pointer" @click="openEditDialog">{{ formatName }}</span>
        </td>

        <td v-if="!isResponsiveMobile" class="state">
            <v-tooltip v-if="state !== null" top>
                <template #activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">{{ formatState }}</div>
                </template>
                <span>{{ $t('Panels.TemperaturePanel.Avg') }}: {{ avgState }} %</span>
            </v-tooltip>
        </td>

        <td class="current">
            <v-tooltip top :disabled="!(measured_min_temp !== null || measured_max_temp !== null)">
                <template #activator="{ on, attrs }">
                    <span style="cursor: default" v-bind="attrs" v-on="on">
                        {{ formatTemperature }}
                    </span>
                </template>
                <span>
                    {{ $t('Panels.TemperaturePanel.Max') }}: {{ measured_max_temp }}°C
                    <br />
                    {{ $t('Panels.TemperaturePanel.Min') }}: {{ measured_min_temp }}°C
                </span>
            </v-tooltip>
            <div v-if="rpm !== null">
                <small :class="rpmClass">{{ rpm }} RPM</small>
            </div>
            <temperature-panel-list-item-additional-sensor
                v-if="additionalSensorName"
                :object-name="objectName"
                :additional-object-name="additionalSensorName" />
        </td>

        <td class="target">
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
            :additional-sensor-name="additionalSensorName"
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
import { additionalSensors, opacityHeaterActive, opacityHeaterInactive } from '@/store/variables'
import { CLOSE_CONTEXT_MENU, EventBus } from '@/plugins/eventBus'

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

    get customIconStyle() {
        return {
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            opacity: (this.target === null || this.target > 0) ? 1 : 0.4
        }
    }

    get isExtruder() { return this.objectName.startsWith('extruder') }
    get isBed() { return this.objectName === 'heater_bed' }
    get isFan() { return this.objectName.startsWith('temperature_fan') || this.objectName.startsWith('fan') }
    get isHeater() { return (this.$store.state.printer.heaters?.available_heaters ?? []).includes(this.objectName) }
    get isHeaterActive() { return (this.target ?? 0) > 0 }

    get printerObject() { return this.$store.state.printer[this.objectName] ?? {} }
    get printerObjectSettings() {
        const lowerCaseObjectName = this.objectName.toLowerCase()
        return this.$store.state.printer?.configfile?.settings[lowerCaseObjectName] ?? {}
    }

    get name() {
        const splits = this.objectName.split(' ')
        return splits.length === 1 ? this.objectName : splits[1]
    }

    get formatName() { return convertName(this.name) }
    get color() { return this.$store.getters['printer/tempHistory/getDatasetColor'](this.objectName) ?? '#FFFFFF' }
    get iconColor() { return (this.target === null || this.target > 0) ? `${this.color}${opacityHeaterActive}` : `${this.color}${opacityHeaterInactive}` }

    get state(): number | null { return this.printerObject.power ?? this.printerObject.speed ?? null }
    get formatState() {
        if (this.state === null) return null
        if (this.target === 0 && this.state === 0) return 'off'
        return `${Math.round(this.state * 100)} %`
    }

    get temperature(): number | null { return this.printerObject?.temperature ?? null }
    get formatTemperature() { return `${this.temperature?.toFixed(1) ?? '--'}°C` }
    get min_temp() { return parseInt(this.printerObjectSettings.min_temp ?? 0) }
    get max_temp() { return parseInt(this.printerObjectSettings.max_temp ?? 0) }
    get measured_min_temp() { return this.printerObject?.measured_min_temp?.toFixed(1) ?? null }
    get measured_max_temp() { return this.printerObject?.measured_max_temp?.toFixed(1) ?? null }
    get target() { return this.printerObject?.target ?? null }

    get additionalSensorName() {
        if (this.objectName === 'z_thermal_adjust') return 'z_thermal_adjust'
        const sensor = additionalSensors.find((s) => `${s} ${this.name}` in this.$store.state.printer)
        return sensor ? `${sensor} ${this.name}` : null
    }

    get rpm() { return this.printerObject.rpm ? parseInt(this.printerObject.rpm) : null }
    get rpmClass() { return (this.rpm === 0 && (this.printerObject.speed ?? 0) > 0) ? 'red--text' : '' }
    get presets() { return this.$store.getters['gui/presets/getPresetsFromHeater']({ name: this.objectName }) ?? [] }

    get command() {
        if (this.objectName.startsWith('temperature_fan')) return 'SET_TEMPERATURE_FAN_TARGET'
        if (this.isHeater || this.objectName.startsWith('heater_')) return 'SET_HEATER_TEMPERATURE'
        return null
    }

    get commandAttributeName() {
        if (this.command === 'SET_HEATER_TEMPERATURE') return 'HEATER'
        if (this.command === 'SET_TEMPERATURE_FAN_TARGET') return 'TEMPERATURE_FAN'
        return ''
    }

    mounted() { EventBus.$on(CLOSE_CONTEXT_MENU, this.closeContextMenu) }
    beforeDestroy() { EventBus.$off(CLOSE_CONTEXT_MENU, this.closeContextMenu) }

    openContextMenu(event: MouseEvent) {
        EventBus.$emit(CLOSE_CONTEXT_MENU)
        this.showContextMenu = true
        this.contextMenuX = event?.clientX || event?.pageX || window.screenX / 2
        this.contextMenuY = event?.clientY || event?.pageY || window.screenY / 2
    }

    closeContextMenu() { this.showContextMenu = false }
    openEditDialog() { this.closeContextMenu(); this.showEditDialog = true }

    turnOffHeater() {
        const gcode = `SET_HEATER_TEMPERATURE HEATER=${this.name} TARGET=0`
        this.$store.dispatch('server/addEvent', { message: gcode, type: 'command' })
        this.$socket.emit('printer.gcode.script', { script: gcode })
    }
}
</script>

<style scoped>
::v-deep .cursor-pointer { cursor: pointer; }
</style>