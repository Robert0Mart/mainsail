<template>
    <div>
        <template v-if="redesignMode">
                <v-row justify="center" class="mt-4 ma-0 pa-0">
                    <v-col cols="12" class="pa-0 ma-0">
                    <div class="d-flex flex-column" style="gap: 50px;">

                        <v-card class="d-flex flex-column flex-md-row clean-dashboard-card" elevation="4">
                            <div class="flex-grow-1 w-100 pa-5" style="flex-basis: 50%;">
                                <our-dashboard-panel class="transparent-bg" />
                            </div>
                            <v-divider vertical class="hidden-sm-and-down clean-divider"></v-divider>
                            <v-divider class="hidden-md-and-up clean-divider"></v-divider>
                        </v-card>

                        <v-card class="d-flex flex-column clean-dashboard-card" elevation="4">
                            <div class="flex-grow-1 w-100 pa-5">
                                <axis-panel class="transparent-bg" />
                            </div>
                        </v-card>

                    </div>
                </v-col>
            </v-row>
        </template>

        <template v-else>
            <v-row v-if="isMobile">
                <v-col>
                    <status-panel />
                    <template v-for="component in mobileLayout">
                        <component
                            v-if="shouldShowPanel(component.name)"
                            :is="extractPanelName(component.name)"
                            :key="'dashboard-mobileLayout-' + component.name"
                            :panel-id="extractPanelId(component.name)"></component>
                    </template>
                </v-col>
            </v-row>
            <v-row v-else-if="isTablet">
                <v-col class="col-6">
                    <status-panel />
                    <template v-for="component in tabletLayout1">
                        <component
                            v-if="shouldShowPanel(component.name)"
                            :is="extractPanelName(component.name)"
                            :key="'dashboard-tabletLayout1-' + component.name"
                            :panel-id="extractPanelId(component.name)"></component>
                    </template>
                </v-col>
                <v-col class="col-6">
                    <template v-for="component in tabletLayout2">
                        <component
                            v-if="shouldShowPanel(component.name)"
                            :is="extractPanelName(component.name)"
                            :key="'dashboard-tabletLayout2-' + component.name"
                            :panel-id="extractPanelId(component.name)"></component>
                    </template>
                </v-col>
            </v-row>
            <v-row v-else-if="isDesktop">
                <v-col class="col-5">
                    <status-panel />
                    <template v-for="component in desktopLayout1">
                        <component
                            v-if="shouldShowPanel(component.name)"
                            :is="extractPanelName(component.name)"
                            :key="'dashboard-desktopLayout1-' + component.name"
                            :panel-id="extractPanelId(component.name)"></component>
                    </template>
                </v-col>
                <v-col class="col-7">
                    <template v-for="component in desktopLayout2">
                        <component
                            v-if="shouldShowPanel(component.name)"
                            :is="extractPanelName(component.name)"
                            :key="'dashboard-desktopLayout2-' + component.name"
                            :panel-id="extractPanelId(component.name)"></component>
                    </template>
                </v-col>
            </v-row>
            <v-row v-else-if="isWidescreen">
                <v-col class="col-3">
                    <status-panel />
                    <template v-for="component in widescreenLayout1">
                        <component
                            v-if="shouldShowPanel(component.name)"
                            :is="extractPanelName(component.name)"
                            :key="'dashboard-desktopLayout1-' + component.name"
                            :panel-id="extractPanelId(component.name)"></component>
                    </template>
                </v-col>
                <v-col class="col-5">
                    <template v-for="component in widescreenLayout2">
                        <component
                            v-if="shouldShowPanel(component.name)"
                            :is="extractPanelName(component.name)"
                            :key="'dashboard-desktopLayout2-' + component.name"
                            :panel-id="extractPanelId(component.name)"></component>
                    </template>
                </v-col>
                <v-col class="col-4">
                    <template v-for="component in widescreenLayout3">
                        <component
                            v-if="shouldShowPanel(component.name)"
                            :is="extractPanelName(component.name)"
                            :key="'dashboard-desktopLayout3-' + component.name"
                            :panel-id="extractPanelId(component.name)"></component>
                    </template>
                </v-col>
            </v-row>
        </template>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins } from 'vue-property-decorator'
import AfcPanel from '@/components/panels/AfcPanel.vue'
import ExtruderControlPanel from '@/components/panels/ExtruderControlPanel.vue'
import DashboardMixin from '@/components/mixins/dashboard'
import KlippyStatePanel from '@/components/panels/KlippyStatePanel.vue'
import LedEffectsPanel from '@/components/panels/LedEffectsPanel.vue'
import MachineSettingsPanel from '@/components/panels/MachineSettingsPanel.vue'
import MacrogroupPanel from '@/components/panels/MacrogroupPanel.vue'
import MacrosPanel from '@/components/panels/MacrosPanel.vue'
import MiniconsolePanel from '@/components/panels/MiniconsolePanel.vue'
import MinSettingsPanel from '@/components/panels/MinSettingsPanel.vue'
import MiscellaneousPanel from '@/components/panels/MiscellaneousPanel.vue'
import SpoolmanPanel from '@/components/panels/SpoolmanPanel.vue'
import MmuPanel from '@/components/panels/MmuPanel.vue'
import StatusPanel from '@/components/panels/StatusPanel.vue'
import ToolheadControlPanel from '@/components/panels/ToolheadControlPanel.vue'
import TemperaturePanel from '@/components/panels/TemperaturePanel.vue'
import WebcamPanel from '@/components/panels/WebcamPanel.vue'

import OurDashboardPanel from '@/components/panels/OurPanels/ourdashboard.vue'
import AxisPanel from '@/components/panels/OurPanels/axispanel.vue'

@Component({
    components: {
        AfcPanel,
        ExtruderControlPanel,
        KlippyStatePanel,
        LedEffectsPanel,
        MachineSettingsPanel,
        MacrogroupPanel,
        MacrosPanel,
        MiniconsolePanel,
        MinSettingsPanel,
        MiscellaneousPanel,
        SpoolmanPanel,
        MmuPanel,
        StatusPanel,
        ToolheadControlPanel,
        TemperaturePanel,
        WebcamPanel,
        OurDashboardPanel,
        AxisPanel,
    },
})
export default class PageDashboard extends Mixins(DashboardMixin) {
    readonly redesignMode = true

    private isAdvanced = localStorage.getItem('advancedMode') === 'true'

    private advancedPanels = [
        'miniconsole-panel',
        'extruder-control-panel',
    ]

    mounted() {
        this.$root.$on('advancedModeChanged', (val: boolean) => {
            this.isAdvanced = val
        })
    }

    shouldShowPanel(componentName: string) {
        if (this.isAdvanced) return true
        const panelName = this.extractPanelName(componentName)
        return !this.advancedPanels.includes(panelName)
    }

    get mobileLayout() { return this.$store.getters['gui/getPanels']('mobile', 0, true) }
    get tabletLayout1() { return this.$store.getters['gui/getPanels']('tablet', 1, true) }
    get tabletLayout2() { return this.$store.getters['gui/getPanels']('tablet', 2, true) }
    get desktopLayout1() { return this.$store.getters['gui/getPanels']('desktop', 1, true) }
    get desktopLayout2() { return this.$store.getters['gui/getPanels']('desktop', 2, true) }
    get widescreenLayout1() { return this.$store.getters['gui/getPanels']('widescreen', 1, true) }
    get widescreenLayout2() { return this.$store.getters['gui/getPanels']('widescreen', 2, true) }
    get widescreenLayout3() { return this.$store.getters['gui/getPanels']('widescreen', 3, true) }

    extractPanelName(name: string) { return name.split('_')[0] + '-panel' }
    extractPanelId(name: string) { return name.split('_')[1] ?? null }
}
</script>

<style>
/* =========================================================================
   👑 GLOBAL DESIGN MASTER CONTROL (The "Brain")
   We keep this in Dashboard.vue so the wrapper card can see it.
   ========================================================================= */
:root {
    /* Colors & Borders */
    --master-bg: rgb(44, 14, 89); 
    --master-radius: 24px;
    --master-border: 1px solid rgba(255, 255, 255, 0.1);

    /* Dimensions */
    --master-panel-height: 65vh; 
    --master-panel-width: calc(100vw - 32px); /* adjust 32px to match your padding */

    /* Inner elements */
    --master-inner-bg: rgba(255, 255, 255, 0.05);
    --master-inner-border: rgba(255, 255, 255, 0.1);
}
</style>

<style scoped>
/* =========================================================================
   HOOK INTO THE GLOBAL DESIGN SYSTEM
   ========================================================================= */
.clean-dashboard-card {
    /* Use our new Master variables */
    background-color: var(--master-bg) !important;
    border-radius: var(--master-radius) !important;
    border: var(--master-border) !important;
    
    /* Apply the global height/width to the wrapper as well */
    min-height: var(--master-panel-height) !important;
    width: var(--master-panel-width) !important;
    
    display: flex;
    overflow: hidden; /* Keeps the corners clean */
}

.clean-divider {
    border-color: rgba(255, 255, 255, 0.03) !important;
}

/* The "Eraser": This makes sure the PANELS inside this wrapper don't 
   have their own backgrounds, so we only see the Redesign Card's background.
*/
::v-deep .transparent-bg,
::v-deep .transparent-bg .v-card,
::v-deep .transparent-bg .v-sheet {
    background-color: transparent !important;
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
    margin: 0 !important;
    /* We reset the height here so the inner content just fills the parent */
    min-height: auto !important; 
    height: 100% !important;
}

::v-deep .transparent-bg .v-card__title {
    background: transparent !important;
}
</style>