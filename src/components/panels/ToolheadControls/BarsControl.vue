<template>
    <div>
        <div class="d-flex justify-center align-start">
            
            <div class="axis-control-section">
                <v-row dense justify="center">
                    <v-col cols="12" class="d-flex justify-center mb-2">
                        <div class="global-row-container">
                            <v-btn small
                                :disabled="['printing'].includes(printer_state)"
                                :color="homedAxes.includes('xyz') ? 'primary' : 'warning'"
                                class="btn-global"
                                @click="doHome">
                                <img src="/img/icons/blocks_icons/home_allsvg.svg"
                                     style="width: 20px; height: 20px; margin-right: 6px;" />
                                ALL
                            </v-btn>

                            <v-btn v-if="existsZtilt"
                                small
                                :disabled="['printing'].includes(printer_state)"
                                :color="colorZTilt"
                                class="btn-global"
                                @click="doZtilt">
                                Z-TILT
                            </v-btn>

                            <v-btn small
                                :disabled="['printing'].includes(printer_state)"
                                class="btn-global btn-motor"
                                @click="doSend('M84')">
                                <img src="/img/icons/blocks_icons/disable_stepperssvg.svg" style="width: 18px;" />
                            </v-btn>
                        </div>
                    </v-col>

                    <v-col v-for="axis in ['X', 'Y', 'Z']" :key="axis" cols="auto" class="axis-col">
                        <v-item-group class="_btn-group-vertical axis-movement">
                            <v-btn v-for="steps of (axis === 'Z' ? stepsZsorted : stepsXYsorted)"
                                :key="axis + '+' + steps"
                                :disabled="['printing'].includes(printer_state)"
                                class="btnGroup vertical-btn"
                                @click="doSendMove(axis + '+' + steps, axis === 'Z' ? feedrateZ : feedrateXY)">
                                <span class="body-2">+{{ steps }}</span>
                            </v-btn>

                            <v-btn
                                :disabled="['printing'].includes(printer_state)"
                                :class="['btnHomeAxis', 'btnGroup', 'vertical-btn', 'btn-axis-' + axis.toLowerCase()]"
                                @click="axis === 'X' ? doHomeX() : axis === 'Y' ? doHomeY() : doHomeZ()">
                                <img :src="'/img/icons/blocks_icons/home_' + axis.toLowerCase() + 'svg.svg'"
                                     style="width: 24px; height: 24px;" />
                            </v-btn>

                            <v-btn v-for="steps in (axis === 'Z' ? stepsZsortedReverse : stepsXYsortedReverse)"
                                :key="axis + '-' + steps"
                                :disabled="['printing'].includes(printer_state)"
                                class="btnGroup vertical-btn"
                                @click="doSendMove(axis + '-' + steps, axis === 'Z' ? feedrateZ : feedrateXY)">
                                <span class="body-2">–{{ steps }}</span>
                            </v-btn>
                        </v-item-group>
                    </v-col>
                </v-row>
            </div>

            <div class="z-offset-section ml-2">
                <v-item-group class="_btn-group-vertical z-offset-column">
                    <v-btn v-for="val in zOffsetStepsSorted" :key="'zo+' + val"
                        :class="['btnGroup', 'vertical-btn', val === 0.005 ? 'btn-axis-z' : '']"
                        @click="doZOffset(val)">
                        <v-icon small left v-if="val === 0.005" color="white">{{ mdiArrowUp }}</v-icon>
                        <span class="body-2">+{{ val }}</span>
                    </v-btn>
                    
                    <div class="text-center my-1 grey--text text--lighten-1 caption font-weight-bold" style="line-height: 1; font-size: 0.65rem !important;">
                        Z-OFFSET
                    </div>

                    <v-btn v-for="val in zOffsetStepsSortedReverse" :key="'zo-' + val"
                        :class="['btnGroup', 'vertical-btn', val === 0.005 ? 'btn-axis-z' : '']"
                        @click="doZOffset(-val)">
                        <v-icon small left v-if="val === 0.005" color="white">{{ mdiArrowDown }}</v-icon>
                        <span class="body-2">–{{ val }}</span>
                    </v-btn>
                </v-item-group>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ControlMixin from '@/components/mixins/control'
import { mdiEngineOff, mdiHome, mdiArrowUp, mdiArrowDown } from '@mdi/js'

@Component
export default class BarsControl extends Mixins(BaseMixin, ControlMixin) {
    mdiEngineOff = mdiEngineOff
    mdiHome = mdiHome
    mdiArrowUp = mdiArrowUp
    mdiArrowDown = mdiArrowDown

    get enableXYHoming(): boolean { return this.$store.state.gui.control.enableXYHoming }

    get zOffsetSteps() { return [0.05, 0.025, 0.01, 0.005] }
    get zOffsetStepsSorted() { return [...this.zOffsetSteps].sort((a, b) => b - a) }
    get zOffsetStepsSortedReverse() { return [...this.zOffsetSteps].sort((a, b) => a - b) }

    get stepsXYsorted() { return [...this.$store.state.gui.control.stepsXY].sort((a, b) => b - a) }
    get stepsXYsortedReverse() { return [...this.$store.state.gui.control.stepsXY].sort((a, b) => a - b) }

    get stepsZsorted() { return [...this.$store.state.gui.control.stepsZ].sort((a, b) => b - a) }
    get stepsZsortedReverse() { return [...this.$store.state.gui.control.stepsZ].sort((a, b) => a - b) }

    doZOffset(value: number) {
        this.$store.dispatch('server/gcode/send', `SET_GCODE_OFFSET Z_ADJUST=${value} MOVE=1`)
    }
}
</script>

<style scoped lang="scss">
/* GERAL */
.axis-col {
    padding: 0 !important;
}

.d-flex.justify-center.align-start {
    padding: 10%;
}

.btnGroup {
    height: 32px !important;
    width: 100% !important;
    min-width: 0 !important;
}

/* CONTENTOR DOS BOTÕES DE TOPO (ALL, Z-TILT...) */
.global-row-container {
    display: flex;
    flex-direction: row;
    gap: 4px;
    width: 194px; /* Largura das 3 colunas de eixos + gaps */
}

.btn-global {
    flex: 1; 
    min-width: 0 !important;
    height: 32px !important;
    padding: 0 4px !important;
    font-size: 10px !important;
    border-radius: 4px !important;
    margin-bottom: 10px !important;
}

/* COLUNA DO Z-OFFSET LADO A LADO */
.z-offset-section {
    padding-left: 40px;
}

/* GRUPOS VERTICAIS */
._btn-group-vertical {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 0px;

    &.axis-movement {
        width: 62px;
        margin-top: 12px;
    }

    &.z-offset-column {
        width: 80px;
        margin-top: -2px;
    }

    .vertical-btn {
        border-radius: 7px !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: none !important;
        padding: 0 2px !important;

        &:hover:not(.v-btn--disabled) {
            filter: brightness(1.2);
            transform: translateY(-1px);
        }
    }
}

/* CORES E ESTILOS ESPECÍFICOS */
.btn-motor {
    background: linear-gradient(45deg, #ff7b00, #ff9500) !important;
    color: white !important;
    display: flex;
    justify-content: center;
    align-items: center;
}

.btn-axis-x { background: linear-gradient(180deg, #ff416c, #ff4b2b) !important; }
.btn-axis-y { background: linear-gradient(180deg, #11998e, #38ef7d) !important; }
.btn-axis-z { 
    background: linear-gradient(180deg, #667eea, #764ba2) !important; 
    color: white !important;
}
</style>