<template>
    <v-container class="px-0 py-2">
        <v-row>
            <v-col :class="pwm ? 'pb-1' : 'pb-3'">
                <v-subheader class="_fan-slider-subheader">
                    <template v-if="type === 'led'">
                        <img 
                            v-if="target > 0"
                            src="/img/icons/blocks_icons/LEDssvg.svg" 
                            class="mr-2 blocks-icon" 
                            @click="ledOff" 
                        />
                        <img 
                            v-else
                            src="/img/icons/blocks_icons/LEDs_offsvg.svg" 
                            class="mr-2 blocks-icon" 
                            @click="ledOn" 
                        />
                    </template>

                    <template v-else-if="type.includes('fan')">
                        <img 
                            src="/img/icons/blocks_icons/FANsvg.svg" 
                            class="mr-2 blocks-icon" 
                            :class="fanClasses" 
                        />
                    </template>

                    <v-icon v-else small class="mr-2">{{ mdiDipSwitch }}</v-icon>

                    <span class="text-truncate">{{ convertName(name) }}</span>
                    <v-spacer />
                    
                    <small v-if="rpm !== null" :class="rpmClasses" class="mr-2">
                        {{ Math.round(rpm ?? 0) }} RPM
                    </small>

                    <span v-if="!controllable" class="font-weight-bold">
                        {{ Math.round(parseFloat(value) * 100) }} %
                    </span>

                    <v-icon v-if="controllable && !pwm" @click="switchOutputPin">
                        {{ value ? mdiToggleSwitch : mdiToggleSwitchOffOutline }}
                    </v-icon>

                    <form @submit.prevent="submitInput">
                        <v-text-field
                            v-if="controllable && pwm"
                            v-model="inputValue"
                            :error="errors.length > 0"
                            suffix="%"
                            type="number"
                            hide-spin-buttons
                            hide-details
                            outlined
                            dense
                            class="_slider-input pt-1"
                            @blur="inputValue = Math.round(parseFloat(sliderValue) * 100)"
                            @focus="$event.target.select()"
                            @keydown="checkInvalidChars" />
                    </form>
                </v-subheader>

                <v-card-text v-if="controllable && pwm" class="py-0 pb-2 d-flex align-center">
                    <v-slider
                        v-model="sliderValue"
                        v-touch="{ start: resetLockTimer }"
                        :disabled="isLocked"
                        :min="0.0"
                        :max="1.0"
                        :step="0.01"
                        :color="sliderValue < off_below && sliderValue > 0 ? 'red' : undefined"
                        hide-details
                        @change="changeSliderValue">
                        <template #prepend>
                            <v-icon :disabled="isLocked || sliderValue <= min" @click="decrement">{{ mdiMinus }}</v-icon>
                        </template>
                        <template #append>
                            <v-icon :disabled="isLocked || sliderValue >= 1" @click="increment">{{ mdiPlus }}</v-icon>
                        </template>
                    </v-slider>
                </v-card-text>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import BaseMixin from '@/components/mixins/base'
import { convertName } from '@/plugins/helpers'
import { mdiMinus, mdiPlus, mdiToggleSwitch, mdiToggleSwitchOffOutline, mdiDipSwitch } from '@mdi/js'

@Component
export default class MiscellaneousSlider extends Mixins(BaseMixin) {
    mdiMinus = mdiMinus
    mdiPlus = mdiPlus
    mdiToggleSwitch = mdiToggleSwitch
    mdiToggleSwitchOffOutline = mdiToggleSwitchOffOutline
    mdiDipSwitch = mdiDipSwitch
    convertName = convertName

    private isLocked = false
    private sliderValue = 0
    private inputValue = 0
    private min = 0
    private invalidChars = ['e', 'E', '+']
    declare private timeout: any

    @Prop({ type: Number, required: true }) declare target: number
    @Prop({ type: Number, default: 1 }) declare max: number
    @Prop({ type: String, default: '' }) declare name: string
    @Prop({ type: String, default: '' }) declare type: string
    @Prop({ type: Boolean, default: false }) declare controllable: boolean
    @Prop({ type: Boolean, default: false }) declare pwm: boolean
    @Prop({ type: [Number, Boolean], default: false }) declare rpm: number | boolean
    @Prop({ type: Number, default: 1 }) declare multi: number
    @Prop({ type: Number, default: 0 }) declare off_below: number
    @Prop({ type: String, default: '' }) declare colorOrder: string

    get value(): number { return Math.round((this.target / this.max) * 100) / 100 }
    get lockSliders() { return this.$store.state.gui.uiSettings.lockSlidersOnTouchDevices }
    get lockSlidersDelay() { return this.$store.state.gui.uiSettings.lockSlidersDelay }

    @Watch('lockSliders', { immediate: true })
    lockSlidersChanged() { this.isLocked = this.lockSliders && this.isTouchDevice }

    @Debounce(500)
    changeSliderValue() {
        if (this.sliderValue < this.value && this.sliderValue < this.off_below) this.sliderValue = 0
        else if (this.sliderValue > this.value && this.sliderValue < this.off_below) this.sliderValue = this.off_below
        this.sendCmd(this.sliderValue)
    }

    sendCmd(newVal: number) {
        newVal = newVal * this.multi
        let gcode = `SET_PIN PIN=${this.name} VALUE=${newVal.toFixed(2)}`
        if (this.type === 'fan') gcode = `M106 S${newVal.toFixed(0)}`
        if (this.type === 'fan_generic') gcode = `SET_FAN_SPEED FAN=${this.name} SPEED=${newVal}`
        if (this.type === 'led') gcode = `SET_LED LED=${this.name} WHITE=${newVal.toFixed(2)} SYNC=0 TRANSMIT=1`
        this.$socket.emit('printer.gcode.script', { script: gcode })
    }

    ledOff() { this.sendCmd(0) }
    ledOn() { this.sendCmd(1) }
    switchOutputPin() { this.sendCmd(this.value ? 0 : 1) }
    decrement() { this.sendCmd(Math.max(0, this.value - 0.01)) }
    increment() { this.sendCmd(Math.min(1, this.value + 0.01)) }

    mounted() { this.sliderValue = this.value }
    @Watch('value') valueChanged(newVal: number) { this.sliderValue = newVal }
    @Watch('sliderValue', { immediate: true }) sliderValueChanged(newVal: number) { this.inputValue = Math.round(newVal * 100) }

    checkInvalidChars(event: any) { if (this.invalidChars.includes(event.key)) event.preventDefault() }
    get errors() { return this.inputValue.toString() === '' ? ['Error'] : [] }
    
    get fanClasses() { 
        // Esta classe faz o SVG rodar quando a ventoinha está ligada
        return (!this.$store.state.gui.uiSettings.disableFanAnimation && this.value > 0) ? 'icon-rotate' : '' 
    }
    
    get rpmClasses() { return (this.rpm === 0 && this.value > 0) ? 'red--text' : '' }
    resetLockTimer() { clearTimeout(this.timeout) }
}
</script>

<style scoped>
._fan-slider-subheader { height: auto; }
._slider-input { min-width: 4.2rem; max-width: 5rem; margin-left: 12px; }
._slider-input >>> .v-input__slot { min-height: 1rem !important; }

.blocks-icon {
    height: 18px;
    width: 18px;
    object-fit: contain;
}

/* Animação de rotação para o SVG da Ventoinha */
.icon-rotate {
    animation: icon-rotate 2s infinite linear;
}

@keyframes icon-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(359deg); }
}
</style>