<template>
    <div>
        <v-row no-gutters>
            <v-col class="col-12 pb-0 text-center">
                
                <v-btn
                    small
                    :disabled="['printing'].includes(printer_state)"
                    :loading="loadings.includes('homeAll')"
                    :color="homedAxes.includes('xyz') ? 'primary' : 'warning'"
                    @click="doHome">
                    <img src="/img/icons/blocks_icons/home_allsvg.svg" style="width: 24px; height: 24px;" />
                </v-btn>
                
                <v-btn
                    v-if="enableXYHoming"
                    :disabled="['printing'].includes(printer_state)"
                    :loading="loadings.includes('homeAll')"
                    :color="homedAxes.includes('xy') ? 'primary' : 'warning'"
                    small
                    class="ml-2"
                    @click="doHomeXY">
                    <img src="/img/icons/blocks_icons/home_allsvg.svg" style="width: 24px; height: 24px;" />
                </v-btn>
                
                <v-btn
                    v-if="existsQGL"
                    :disabled="['printing'].includes(printer_state)"
                    small
                    :loading="loadings.includes('qgl')"
                    :color="colorQuadGantryLevel"
                    class="ml-2"
                    @click="doQGL">
                    {{ $t('Panels.ToolheadControlPanel.QGL') }}
                </v-btn>
                
                <v-btn
                    v-if="existsZtilt"
                    :disabled="['printing'].includes(printer_state)"
                    small
                    :loading="loadings.includes('zTilt')"
                    :color="colorZTilt"
                    class="ml-2"
                    @click="doZtilt">
                    {{ $t('Panels.ToolheadControlPanel.ZTilt') }}
                </v-btn>
                
                <v-btn
                    small
                    :disabled="['printing'].includes(printer_state)"
                    class="ml-2 btn-motor"
                    @click="doSend('M84')">
                    <img src="/img/icons/blocks_icons/disable_stepperssvg.svg" style="width: 24px; height: 24px;" />
                </v-btn>
                
            </v-col>
        </v-row>
        
        <v-row dense class="mt-2">
            <v-col class="text-center">
                <v-item-group class="_btn-group row no-gutters">
                    <v-btn
                        v-for="steps of stepsXYsorted"
                        :key="'x-' + steps"
                        :disabled="['printing'].includes(printer_state)"
                        class="btnMinWidthAuto col btnGroup"
                        @click="doSendMove('X-' + steps, feedrateXY)">
                        <span class="body-2">–{{ steps }}</span>
                    </v-btn>
                    
                    <v-btn
                        :disabled="['printing'].includes(printer_state)"
                        class="font-weight-bold btnHomeAxis btnGroup btn-axis-x px-0"
                        :loading="loadings.includes('homeX')"
                        @click="doHomeX">
                        <img src="/img/icons/blocks_icons/home_xsvg.svg" style="width: 28px; height: 28px;" />
                    </v-btn>
                    
                    <v-btn
                        v-for="steps of stepsXYsortedReverse"
                        :key="'x+' + steps"
                        :disabled="['printing'].includes(printer_state)"
                        class="btnMinWidthAuto col btnGroup"
                        @click="doSendMove('X+' + steps, feedrateXY)">
                        <span class="body-2">+{{ steps }}</span>
                    </v-btn>
                </v-item-group>
            </v-col>
        </v-row>
        
        <v-row dense class="mt-2">
            <v-col class="text-center">
                <v-item-group class="_btn-group row no-gutters">
                    <v-btn
                        v-for="steps of stepsXYsorted"
                        :key="'y-' + steps"
                        :disabled="['printing'].includes(printer_state)"
                        class="btnMinWidthAuto col btnGroup"
                        @click="doSendMove('Y-' + steps, feedrateXY)">
                        <span class="body-2">–{{ steps }}</span>
                    </v-btn>
                    
                    <v-btn
                        :disabled="['printing'].includes(printer_state)"
                        class="font-weight-bold btnHomeAxis btnGroup btn-axis-y px-0"
                        :loading="loadings.includes('homeY')"
                        @click="doHomeY">
                        <img src="/img/icons/blocks_icons/home_ysvg.svg" style="width: 28px; height: 28px;" />
                    </v-btn>
                    
                    <v-btn
                        v-for="steps of stepsXYsortedReverse"
                        :key="'y+' + steps"
                        :disabled="['printing'].includes(printer_state)"
                        class="btnMinWidthAuto col btnGroup"
                        @click="doSendMove('Y+' + steps, feedrateXY)">
                        <span class="body-2">+{{ steps }}</span>
                    </v-btn>
                </v-item-group>
            </v-col>
        </v-row>
        
        <v-row dense class="mt-2">
            <v-col class="text-center">
                <v-item-group class="_btn-group row no-gutters">
                    <v-btn
                        v-for="steps of stepsZsorted"
                        :key="'z-' + steps"
                        :disabled="['printing'].includes(printer_state)"
                        class="btnMinWidthAuto col btnGroup"
                        @click="doSendMove('Z-' + steps, feedrateZ)">
                        <span class="body-2">–{{ steps }}</span>
                    </v-btn>
                    
                    <v-btn
                        :disabled="['printing'].includes(printer_state)"
                        class="font-weight-bold btnHomeAxis btnGroup btn-axis-z px-0"
                        :loading="loadings.includes('homeZ')"
                        @click="doHomeZ">
                        <img src="/img/icons/blocks_icons/home_zsvg.svg" style="width: 28px; height: 28px;" />
                    </v-btn>
                    
                    <v-btn
                        v-for="steps of stepsZsortedReverse"
                        :key="'z+' + steps"
                        :disabled="['printing'].includes(printer_state)"
                        class="btnMinWidthAuto col btnGroup"
                        @click="doSendMove('Z+' + steps, feedrateZ)">
                        <span class="body-2">+{{ steps }}</span>
                    </v-btn>
                </v-item-group>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ControlMixin from '@/components/mixins/control'
import { mdiEngineOff, mdiHome } from '@mdi/js'

@Component
export default class BarsControl extends Mixins(BaseMixin, ControlMixin) {
    mdiEngineOff = mdiEngineOff
    mdiHome = mdiHome

    get enableXYHoming(): boolean {
        return this.$store.state.gui.control.enableXYHoming
    }

    get stepsXYsorted() {
        return [...this.$store.state.gui.control.stepsXY].sort(function (a, b) {
            return b - a
        })
    }

    get stepsXYsortedReverse() {
        return [...this.$store.state.gui.control.stepsXY].sort(function (a, b) {
            return a - b
        })
    }

    get stepsZsorted() {
        return [...this.$store.state.gui.control.stepsZ].sort(function (a, b) {
            return b - a
        })
    }

    get stepsZsortedReverse() {
        return [...this.$store.state.gui.control.stepsZ].sort(function (a, b) {
            return a - b
        })
    }
}
</script>

<style scoped>
.btnHomeAxis {
    width: 36px;
    min-width: 36px !important;
}

.btnGroup {
    height: 28px !important;
}

.btnMinWidthAuto {
    min-width: auto !important;
}

/* Gradiente laranja para botão do motor */
.btn-motor {
    background: linear-gradient(45deg, #ff7b00, #ff9500) !important;
    color: white !important;
}

.btn-motor:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(255, 123, 0, 0.4) !important;
}

/* Gradientes para os botões dos eixos */
.btn-axis-x {
    background: linear-gradient(45deg, #ff416c, #ff4b2b) !important;
    color: white !important;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-axis-y {
    background: linear-gradient(45deg, #11998e, #38ef7d) !important;
    color: white !important;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-axis-z {
    background: linear-gradient(45deg, #667eea, #764ba2) !important;
    color: white !important;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-axis-x:hover,
.btn-axis-y:hover,
.btn-axis-z:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
}

._btn-group {
    border-radius: 4px;
    display: inline-flex;
    flex-wrap: nowrap;
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    gap: 5px;

    .v-btn {
        border-radius: 0;
        border-color: rgba(255, 255, 255, 0.12);
        border-style: solid;
        border-width: thin;
        box-shadow: none;
        height: 28px;
        opacity: 0.8;
        min-width: auto !important;
        border-right: 1px solid rgba(255, 255, 255, 0.2) !important;
    }

    .v-btn:last-child {
        border-right: none !important;
        border-top-right-radius: inherit;
        border-bottom-right-radius: inherit;
    }

    .v-btn:first-child {
        border-top-left-radius: inherit;
        border-bottom-left-radius: inherit;
    }

    .v-btn:not(:first-child):not(:last-child) {
        border-left: none !important;
    }
}

html.theme--light ._btn-group .v-btn {
    border-color: rgba(0, 0, 0, 0.12);
    border-right: 1px solid rgba(0, 0, 0, 0.2) !important;
}

html.theme--light ._btn-group .v-btn:last-child {
    border-right: none !important;
}
</style>