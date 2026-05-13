<template>
    <v-container fluid class="pa-4 pa-md-8">
        <div class="d-flex flex-column">
            <v-row :class="consoleDirection === 'table' ? 'order-0 mb-4' : 'order-1 mt-4'" no-gutters>
                <v-col>
                    <v-card outlined class="premium-console-toolbar pa-2 d-flex align-center">
                        <div class="flex-grow-1 mr-2 d-flex align-center">
                            <console-textarea 
                                ref="gcodeCommandField" 
                                hide-details
                                dense
                                class="custom-console-input"
                            />
                        </div>

                        <div class="d-flex align-center gap-2">
                            <v-tooltip top>
                                <template #activator="{ on, attrs }">
                                    <v-btn outlined color="grey lighten-1" class="px-2 minwidth-0" v-bind="attrs" v-on="on" @click="clearConsole">
                                        <v-icon small>{{ mdiTrashCan }}</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('Console.ClearConsole') }}</span>
                            </v-tooltip>

                            <command-help-modal @onCommand="commandClick($event)" />

                            <v-menu
                                offset-y
                                :top="consoleDirection === 'shell'"
                                :close-on-content-click="false"
                                content-class="elevation-3">
                                <template #activator="{ on, attrs }">
                                    <v-btn outlined color="grey lighten-1" class="px-2 minwidth-0" v-bind="attrs" v-on="on">
                                        <v-icon small>{{ mdiCog }}</v-icon>
                                    </v-btn>
                                </template>
                                <v-list dense class="pa-2" style="background-color: #1e1e1e;">
                                    <v-subheader class="text-uppercase font-weight-bold grey--text text--lighten-1" style="height: 30px; font-size: 0.7rem;">Configurações</v-subheader>
                                    <v-list-item v-if="consoleDirection === 'shell'" class="minHeight36">
                                        <v-checkbox v-model="autoscroll" class="mt-0 pt-0" hide-details :label="$t('Panels.MiniconsolePanel.Autoscroll')" color="primary" />
                                    </v-list-item>
                                    <v-list-item class="minHeight36">
                                        <v-checkbox v-model="hideWaitTemperatures" class="mt-0 pt-0" hide-details :label="$t('Console.HideTemperatures')" color="primary" />
                                    </v-list-item>
                                    <v-list-item v-if="moonrakerComponents.includes('timelapse')" class="minHeight36">
                                        <v-checkbox v-model="hideTlCommands" class="mt-0 pt-0" hide-details :label="$t('Console.HideTimelapse')" color="primary" />
                                    </v-list-item>
                                    <v-list-item v-for="(filter, index) in customFilters" :key="index" class="minHeight36">
                                        <v-checkbox v-model="filter.bool" class="mt-0 pt-0" hide-details :label="filter.name" color="primary" @change="toggleFilter(index, filter)" />
                                    </v-list-item>
                                    <v-list-item class="minHeight36">
                                        <v-checkbox v-model="rawOutput" class="mt-0 pt-0" hide-details :label="$t('Panels.MiniconsolePanel.RawOutput')" color="primary" />
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-card>
                </v-col>
            </v-row>

            <v-row :class="consoleDirection === 'table' ? 'order-1' : 'order-0 mt-0'" no-gutters>
                <v-col>
                    <v-card outlined class="premium-console-card">
                        <v-card-text class="pa-0">
                            <overlay-scrollbars ref="consoleScroll" class="consoleScrollContainer d-flex flex-column">
                                <console-table
                                    ref="console"
                                    :is-mini="false"
                                    :events="events"
                                    @command-click="commandClick" />
                            </overlay-scrollbars>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Ref, Watch } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ConsoleTable from '@/components/console/ConsoleTable.vue'
import CommandHelpModal from '@/components/console/CommandHelpModal.vue'
import { mdiCog, mdiTrashCan } from '@mdi/js'
import ConsoleMixin from '@/components/mixins/console'
import ConsoleTextarea from '@/components/inputs/ConsoleTextarea.vue'

@Component({
    components: {
        CommandHelpModal,
        ConsoleTable,
    },
})
export default class PageConsole extends Mixins(BaseMixin, ConsoleMixin) {
    mdiCog = mdiCog
    mdiTrashCan = mdiTrashCan

    @Ref() readonly consoleScroll!: any
    @Ref() readonly gcodeCommandField!: typeof ConsoleTextarea

    get events() {
        return this.$store.getters['server/getConsoleEvents'](this.consoleDirection === 'table')
    }

    @Watch('events')
    eventsChanged() {
        if (this.consoleDirection === 'shell' && this.autoscroll) {
            setTimeout(() => {
                this.scrollToBottom()
            }, 50)
        }
    }

    @Watch('autoscroll')
    autoscrollChanged(newVal: boolean) {
        if (newVal) this.scrollToBottom()
    }

    commandClick(msg: string): void {
        this.gcodeCommandField.setGcode(msg)
    }

    mounted() {
        if (this.consoleDirection === 'shell') this.scrollToBottom()
    }

    scrollToBottom() {
        this.$nextTick(() => {
            if (!this.consoleScroll) return

            const overlayscroll = this.consoleScroll.osInstance()
            overlayscroll?.scroll({ y: '100%' })
        })
    }
}
</script>

<style scoped>
.consoleScrollContainer {
    min-height: 200px;
    height: calc(var(--app-height) - 200px);
}

.premium-console-toolbar {
    background-color: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 8px !important;
    /* Ensuring a fixed height for the bar helps alignment stay consistent */
    height: 64px; 
}

.premium-console-card {
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 8px !important;
    overflow: hidden;
}

.gap-2 {
    gap: 8px;
}

/* VERTICAL ALIGNMENT FIX 
   We target the internal Vuetify structure specifically.
*/
.custom-console-input ::v-deep .v-input__control {
    display: flex !important;
    flex-direction: column;
    justify-content: center !important;
    height: 100% !important;
}

.custom-console-input ::v-deep .v-input__slot {
    background: rgba(0, 0, 0, 0.2) !important;
    margin-bottom: 0 !important;
    display: flex !important;
    align-items: center !important; /* This centers the text vertically */
    min-height: 40px !important;   /* Matches common button height */
}

.custom-console-input ::v-deep .v-text-field__slot {
    display: flex !important;
    align-items: center !important;
}

/* Vuetify textareas often have a default top margin on the 'textarea' element itself */
.custom-console-input ::v-deep textarea {
    margin-top: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    align-self: center !important;
}

/* Ensure icons/append-inner align to center too */
.custom-console-input ::v-deep .v-input__append-inner {
    margin-top: 0 !important;
    align-self: center !important;
}
</style>