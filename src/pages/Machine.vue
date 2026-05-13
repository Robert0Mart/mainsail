<template>
    <v-container fluid class="pa-3 pa-md-5 machine-page-container">
        <v-row v-if="klipperState !== 'ready'" class="mb-3">
            <v-col cols="12">
                <klippy-state-panel></klippy-state-panel>
            </v-col>
        </v-row>

        <v-row align="stretch" class="machine-main-row">
            <v-col cols="12" md="5" lg="4" class="d-flex flex-column">
                <system-panel class="flex-grow-1"></system-panel>
            </v-col>

            <v-col cols="12" md="7" lg="6" class="update-abs-col">
                <div class="update-abs-inner">
                    <update-panel></update-panel>
                </div>
            </v-col>

            <v-col cols="12" md="12" lg="2" class="d-flex flex-column">
                <v-row dense class="flex-grow-1 ma-0">
                    <v-col
                        v-if="klipperState === 'ready'"
                        cols="12" sm="6" lg="12"
                        class="d-flex flex-column pa-0 pr-sm-2 pr-lg-0 pb-3">
                        <endstop-panel class="flex-grow-1"></endstop-panel>
                    </v-col>
                    <v-col
                        cols="12" :sm="klipperState === 'ready' ? 6 : 12" lg="12"
                        class="d-flex flex-column pa-0 pl-sm-2 pl-lg-0">
                        <logfiles-panel class="flex-grow-1"></logfiles-panel>
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

<style>
/* ── Page: vertically centered ── */
.machine-page-container {
    min-height: calc(var(--app-height, 100vh) - 64px);
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
}

/* Prevent rows from stretching to fill the container height */
.machine-page-container > .row {
    flex: 0 0 auto !important;
}

/* ── Update panel: absolute inside its column so it doesn't push row height ──
   Row height = max(System Loads, Right sidebar). Update panel fills that exact height. */
@media (min-width: 960px) {
    .update-abs-col {
        position: relative;
    }

    .update-abs-inner {
        position: absolute;
        top: 12px;
        left: 12px;
        right: 12px;
        bottom: 12px;
        display: flex;
        flex-direction: column;
    }

    /* UpdatePanel root div */
    .update-abs-inner > div {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }

    /* The v-card: relative reference for absolute children */
    .update-abs-inner .machine-update-panel {
        flex: 1 1 auto !important;
        display: flex !important;
        flex-direction: column !important;
        min-height: 0 !important;
        position: relative !important;
    }

    /* Toolbar: floats above the scroll content */
    .update-abs-inner .machine-update-panel .v-toolbar {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 2 !important;
    }

    /* v-expand-transition wrapper: fills the entire card from top to bottom */
    .update-abs-inner .machine-update-panel > div {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    /* panel-content fills the wrapper */
    html body .v-application .update-abs-inner .machine-update-panel .panel-content,
    html body .v-application .update-abs-inner .machine-update-panel .v-card__text {
        flex: 1 1 auto !important;
        display: flex !important;
        flex-direction: column !important;
        min-height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: hidden !important;
    }

    /* Scrollable list fills full height; padding-top reserves space for floating toolbar */
    html body .v-application .update-abs-inner .machine-update-panel .update-manager-list {
        flex: 1 1 auto !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        min-height: 0 !important;
        padding: 0 var(--panel-padding) !important;
        padding-top: 48px !important;
        margin: 0 !important;
    }
}

/* "Update All" footer stays pinned at the bottom while the list scrolls */
.update-abs-inner .machine-update-panel .update-all-footer {
    position: sticky !important;
    bottom: 0 !important;
    background-color: var(--master-bg) !important;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    z-index: 1 !important;
}

/* Mobile fallback: fixed max-height scroll */
@media (max-width: 959px) {
    .machine-update-panel .update-manager-list {
        max-height: 420px;
        overflow-y: auto !important;
        padding: 0 !important;
    }
}

/* ── System panel compaction ── */
.machine-systemload-panel .v-card__text > div > .v-divider {
    margin-top: 6px !important;
    margin-bottom: 6px !important;
}

.machine-systemload-panel .pr-4 {
    padding-right: 8px !important;
}

.machine-systemload-panel .pl-6 {
    padding-left: 10px !important;
}

.machine-systemload-panel .v-progress-circular {
    transform: scale(0.78);
    transform-origin: center;
}

.machine-systemload-panel .text-body-2 {
    line-height: 1.4 !important;
    font-size: 0.78rem !important;
}

/* ── Update panel entry compaction ── */
.machine-update-panel .update-manager-list .row {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
}

.machine-update-panel .pl-6 {
    padding-left: 12px !important;
}

.machine-update-panel .pr-6 {
    padding-right: 12px !important;
}
</style>
