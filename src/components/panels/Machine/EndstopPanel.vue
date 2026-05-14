<template>
    <div>
        <panel
            :title="$t('Machine.EndstopPanel.Endstops')"
            :icon="mdiArrowExpandVertical"
            card-class="machine-endstop-panel"
            >
            <template #buttons>
                <v-tooltip top>
                    <template #activator="{ on, attrs }">
                        <v-btn
                            icon
                            tile
                            color="primary"
                            :loading="loadings.includes('queryEndstops')"
                            v-bind="attrs"
                            v-on="on"
                            @click="syncEndstops">
                            <v-icon>{{ mdiSync }}</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('Machine.EndstopPanel.Endstops') }}</span>
                </v-tooltip>
            </template>

            <v-card-text class="pb-0 pt-6">
                <EndstopPanelItem v-for="item in items" :key="item.name" :item="item" />
                <v-row v-if="items.length === 0">
                    <v-col class="pt-0">
                        <p class="mb-0">{{ $t('Machine.EndstopPanel.EndstopInfo') }}</p>
                    </v-col>
                </v-row>
            </v-card-text>
        </panel>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '../../mixins/base'
import Panel from '@/components/ui/Panel.vue'
import { mdiArrowExpandVertical, mdiSync } from '@mdi/js'

export interface EndstopItem {
    type: 'endstop' | 'probe'
    name: string
    value: string
}

@Component({
    components: { Panel },
})
export default class EndstopPanel extends Mixins(BaseMixin) {
    mdiArrowExpandVertical = mdiArrowExpandVertical
    mdiSync = mdiSync

    get items() {
        let output: EndstopItem[] = []

        const endstops = this.$store.state.printer.endstops ?? {}
        Object.keys(endstops).forEach((key) => {
            output.push({ type: 'endstop', name: key, value: endstops[key] })
        })

        // dont show probe values if there are no endstop values
        if (output.length === 0) return []

        output = output.sort((a, b) => a.name.localeCompare(b.name))

        if ('probe' in this.$store.state.printer && 'last_query' in this.$store.state.printer.probe) {
            const value = this.$store.state.printer.probe.last_query ? 'TRIGGERED' : 'open'

            output.push({
                type: 'probe',
                name: this.$store.state.printer.probe.name ?? 'probe',
                value,
            })
        }

        return output
    }

    get existsQueryProbe() {
        const commands = this.$store.state.printer.gcode?.commands ?? null
        if (commands) {
            return 'QUERY_PROBE' in commands
        }

        // fallback for older Klipper versions
        return 'probe' in this.$store.state.printer
    }

    syncEndstops() {
        this.$socket.emit(
            'printer.query_endstops.status',
            {},
            { action: 'printer/getEndstopStatus', loading: 'queryEndstops' }
        )

        if (this.existsQueryProbe) {
            this.$store.dispatch('server/addEvent', { message: 'QUERY_PROBE', type: 'command' })
            this.$socket.emit('printer.gcode.script', { script: 'QUERY_PROBE' })
        }
    }
}
</script>
