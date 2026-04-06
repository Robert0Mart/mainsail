<template>
    <v-container fluid class="pa-4 pa-md-8">
        <v-row>
            <v-col cols="12" md="6">
                <klippy-state-panel class="mb-6"></klippy-state-panel>
                <system-panel></system-panel>
            </v-col>
            
            <v-col cols="12" md="6">
                <update-panel class="mb-6"></update-panel>
                
                <v-row>
                    <v-col v-if="klipperState === 'ready'" cols="12" sm="6">
                        <endstop-panel></endstop-panel>
                    </v-col>
                    <v-col cols="12" :sm="klipperState === 'ready' ? 6 : 12">
                        <logfiles-panel></logfiles-panel>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import KlippyStatePanel from '@/components/panels/KlippyStatePanel.vue'
import UpdatePanel from '@/components/panels/Machine/UpdatePanel.vue'
import LogfilesPanel from '@/components/panels/Machine/LogfilesPanel.vue'
import EndstopPanel from '@/components/panels/Machine/EndstopPanel.vue'
import SystemPanel from '@/components/panels/Machine/SystemPanel.vue'

@Component({
    components: {
        SystemPanel,
        EndstopPanel,
        LogfilesPanel,
        UpdatePanel,
        KlippyStatePanel,
    },
})
export default class PageMachine extends Mixins(BaseMixin) {}
</script>