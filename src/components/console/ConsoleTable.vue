<template>
    <div :class="'consoleTable ' + (isMini ? 'mini' : 'pa-4')">
        <template v-if="events.length === 0">
            <v-row class="pa-0 ma-0">
                <v-col class="text-center py-8 grey--text text--darken-1 font-italic">
                    {{ $t('Console.Empty') }}
                </v-col>
            </v-row>
        </template>
        <template v-else>
            <div class="console-entries-wrapper">
                <console-table-entry
                    v-for="(event, index) of events"
                    :key="index"
                    class="consoleTableRow"
                    :event="event"
                    @command-click="commandClick" />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'
import ConsoleTableEntry from '@/components/console/ConsoleTableEntry.vue'

@Component({
    components: { ConsoleTableEntry },
})
export default class ConsoleTable extends Vue {
    @Prop({ required: true })
    declare readonly events: any[]

    @Prop({ required: false, default: false })
    declare readonly isMini: boolean

    commandClick(msg: string) {
        this.$emit('command-click', msg)
    }
}
</script>

<style scoped>
.consoleTable {
    font-family: 'Roboto Mono', monospace;
    font-size: 0.85rem;
}

.console-entries-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

::v-deep .consoleTableRow {
    padding: 2px 0;
    transition: background-color 0.15s;
    border-radius: 4px;
}

::v-deep .consoleTableRow:hover {
    background-color: rgba(255, 255, 255, 0.03);
}

.mini {
    padding: 8px !important;
}
</style>