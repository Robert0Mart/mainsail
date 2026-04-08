<template>
    <div>
        <div class="d-flex justify-center align-start main-container-wrapper">
            
            <div class="axis-control-section">
                <div class="left-axis-container main-unified-panel">
                    <div class="panel-label">Axis</div>
                    
                    <div class="global-row-container mb-4">
                        <v-btn small
                            :disabled="['printing'].includes(printer_state)"
                            class="btn-global"
                            @click="doHome">
                            <img src="/img/icons/blocks_icons/home_allsvg.svg"
                                 style="width: 20px; height: 20px; margin-right: 6px;" />
                            ALL
                        </v-btn>

                        <v-btn v-if="existsZtilt"
                            small
                            :disabled="['printing'].includes(printer_state)"
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

                    <div class="d-flex justify-center axes-grid">
                        <div v-for="axis in ['X', 'Y', 'Z']" :key="axis" class="axis-col mx-1">
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
                        </div>
                    </div>
                </div>
            </div>

            <div class="z-offset-section ml-2">
                <div class="panel-label">Z-Offset</div>
                <v-item-group class="_btn-group-vertical z-offset-column">
                    <v-btn v-for="val in zOffsetStepsSorted" :key="'zo+' + val"
                        :class="['btnGroup', 'vertical-btn', val === 0.005 ? 'btn-axis-z' : '']"
                        @click="doZOffset(val)">
                        <v-icon small left v-if="val === 0.005" color="white">{{ mdiArrowUp }}</v-icon>
                        <span class="body-2">+{{ val }}</span>
                    </v-btn>
                    
                    <div class="my-1"></div>

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

/* LÓGICA PARA OS NOMES (LABELS) NA OUTLINE */
.panel-label {
    position: absolute;
    top: -11px;               /* Posiciona exatamente sobre a linha */
    background-color: #1e1e1e; /* COR CRUCIAL: Deve ser a cor do fundo do seu painel */
    padding: 0 8px;           /* Cria o "buraco" na linha ao redor do texto */
    font-size: 11px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 1px;
    z-index: 10;
}

/* CONTAINER UNIFICADO (O que recebe a borda) */
.left-axis-container {
    position: relative; /* Adicionado para o label se orientar aqui */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 15px; 
    border: 1px solid rgba(255, 255, 255, 0.1); 
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.02);
    margin-top: 10px; /* Espaço para o label não bater no topo */
}

/* LINHA DOS BOTÕES (ALL, Z-TILT, MOTOR) */
.global-row-container {
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: 100%; 
    max-width: 206px; 
    margin-bottom: 15px; 
}

.btn-global {
    flex: 1; 
    min-width: 0 !important;
    height: 32px !important;
    padding: 0 4px !important;
    font-size: 10px !important;
    border-radius: 4px !important;
    background-color:  #2196f3 !important; color: white !important;
}

/* GRID DOS EIXOS X, Y, Z */
.axis-control-section .d-flex.justify-center {
    display: flex !important;
    flex-direction: row !important;
    width: 100%;
}

/* COLUNA DO Z-OFFSET LADO A LADO */
.z-offset-section {
    position: relative; /* Adicionado para o label se orientar aqui */
    margin: 10px 12px !important; /* Ajustado para alinhar verticalmente com a nova margem */
    border: 1px solid rgba(255, 255, 255, 0.1) !important; /* Trocado outline por border para o corte funcionar melhor */
    border-radius: 9px !important;
    display: flex !important;
    flex-direction: column !important; 
    align-items: center !important;
    padding: 8px !important;
    width: 90px !important;        
    min-width: 90px !important;    
    flex: 0 0 auto !important;     
}

/* GRUPOS VERTICAIS */
._btn-group-vertical {
    display: flex;
    flex-direction: column;
    gap: 9px;
    border-radius: 10px !important;
}

.axis-movement {
    width: 62px;
    margin-top: 0 !important; 
}

.z-offset-column {
    width: 100% !important;    ;    
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    margin: 15px 0;   
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

.btn-motor {
    color: white !important;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* CORES DOS EIXOS */
.btn-axis-x { background-color: #ba1c00 !important; color: white !important; }
.btn-axis-y { background-color: #06ad00 !important; color: white !important; }
.btn-axis-z { background-color:  #2196f3 !important; color: white !important; }
</style>