<template>
    <div class="d-flex align-center">
        <v-btn tile color="primary" @click="btnCoolDown" text>
            <img src="/img/icons/blocks_icons/cooldownsvg.svg" 
                 class="blocks-icon mr-2" 
                 style="width: 29px; height: 29px;" alt="cooldown" />
            <span style="color: #ffffff !important; font-weight: bold;">{{ $t('Panels.TemperaturePanel.Cooldown') }}</span>
        </v-btn>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'

@Component({})
export default class TemperaturePanelPresets extends Mixins(BaseMixin) {
    btnCoolDown() { 
        this.$socket.emit('printer.gcode.script', { script: 'TURN_OFF_HEATERS' }) 
    }
}
</script>