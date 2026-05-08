<template>
    <div>
        <template v-if="redesignMode">
            <nav class="dot-nav">
                <div
                    v-for="panel in dotNavPanels"
                    :key="panel.id"
                    class="dot-nav-item"
                    :class="{ 'dot-nav-active': activePanel === panel.id }"
                    @click="scrollToPanel(panel.id)"
                >
                    <span class="dot-nav-tooltip">{{ panel.label }}</span>
                </div>
            </nav>

            <v-row justify="center" class="ma-0 pa-0">
                <v-col cols="12" class="pa-0 ma-0">
                    <div class="d-flex flex-column" style="gap: 120px;">

                        <v-card id="panel-printing" class="d-flex flex-column flex-md-row clean-dashboard-card" elevation="4" style="scroll-snap-align: center;">
                            <div class="flex-grow-1 w-100 pa-5" style="flex-basis: 50%;">
                                <our-dashboard-panel class="transparent-bg" />
                            </div>
                        </v-card>

                        <v-card id="panel-axis" class="d-flex flex-column clean-dashboard-card" elevation="4" style="scroll-snap-align: center;">
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

import OurDashboardPanel from '@/components/panels/OurPanels/ourDashboard.vue'
import AxisPanel from '@/components/panels/OurPanels/axispanel.vue'
import OurPrintingPanel from '@/components/panels/OurPanels/ourPrinting.vue'

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
        OurPrintingPanel
    },
})
export default class PageDashboard extends Mixins(DashboardMixin) {
    readonly redesignMode = true

    private isAdvanced = localStorage.getItem('advancedMode') === 'true'

    private advancedPanels = [
        'miniconsole-panel',
        'extruder-control-panel',
    ]

    dotNavPanels = [
        { id: 'panel-printing', label: 'Printing Dashboard' },
        { id: 'panel-axis', label: 'Axis Control' },
    ]
    activePanel = 'panel-printing'
    private observer: IntersectionObserver | null = null

    mounted() {
        this.$root.$on('advancedModeChanged', (val: boolean) => {
            this.isAdvanced = val
        })
        this.$nextTick(() => {
            this.setupObserver()
            if (this.redesignMode) {
                document.getElementById('page-container')?.classList.add('dashboard-snap')
            }
        })
    }

    beforeDestroy() {
        this.$root.$off('advancedModeChanged')
        if (this.observer) this.observer.disconnect()
        document.getElementById('page-container')?.classList.remove('dashboard-snap')
    }

    setupObserver() {
        const scrollContainer = document.getElementById('page-container')
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) this.activePanel = entry.target.id
                })
            },
            { root: scrollContainer, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
        )
        this.dotNavPanels.forEach(panel => {
            const el = document.getElementById(panel.id)
            if (el) this.observer!.observe(el)
        })
    }

    scrollToPanel(id: string) {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
#page-container.dashboard-snap {
    scroll-snap-type: y mandatory;
}
</style>

<style scoped>
.clean-dashboard-card {
    background-color: transparent !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    min-height: var(--master-panel-height) !important;
    width: var(--master-panel-width) !important;
    display: flex;
    overflow: hidden;
}

.dot-nav {
    position: fixed;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 200;
    display: flex;
    flex-direction: column;
    gap: 14px;
    zoom: var(--anti-zoom, 1);
}

.dot-nav-item {
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
}

.dot-nav-item:hover {
    background: rgba(255, 255, 255, 0.7);
    transform: scale(1.3);
}

.dot-nav-active {
    background: #2196f3 !important;
    transform: scale(1.4);
}

.dot-nav-tooltip {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.75);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 600;
    white-space: nowrap;
    padding: 4px 8px;
    border-radius: 6px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.dot-nav-item:hover .dot-nav-tooltip {
    opacity: 1;
}
</style>