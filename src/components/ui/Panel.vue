<template>
    <v-card :class="[
        'panel',
        cardClass,
        marginBottom ? 'mb-3 mb-md-6' : '',
        !expand ? 'expanded' : '',
        fullscreen ? 'panel-fullscreen' : ''
    ]" :loading="loading" :elevation="elevation" :dense="dense">
        <v-toolbar flat dense :color="toolbarColor" :class="getToolbarClass" :height="panelToolbarHeight"
            class="panel-toolbar">
            <slot name="buttons-left" />

            <v-toolbar-title class="d-flex align-center">
                <slot v-if="hasIconSlot" name="icon" />
                <v-icon v-if="icon !== null && !hasIconSlot" left>{{ icon }}</v-icon>

                <div class="d-flex flex-column ml-2">
                    <span v-if="title" class="subheading">{{ title }}</span>
                    <span v-if="subtitle" class="caption grey--text text--darken-1">{{ subtitle }}</span>
                </div>
            </v-toolbar-title>

            <slot name="buttons-title" />
            <v-spacer />

            <v-toolbar-items v-show="hasButtonsSlot || collapsible || closable || fullscreenable">
                <div v-if="expand || !hideButtonsOnCollapse" class="d-flex align-center">
                    <slot name="buttons" />
                </div>

                <v-btn v-if="fullscreenable" icon class="btn-fullscreen" :ripple="true" @click="toggleFullscreen">
                    <v-icon>{{ fullscreen ? mdiFullscreenExit : mdiFullscreen }}</v-icon>
                </v-btn>

                <v-btn v-if="collapsible" icon class="btn-collapsible" :ripple="true" @click="expand = !expand">
                    <v-icon :class="expand ? '' : 'icon-rotate-90'">{{ mdiChevronDown }}</v-icon>
                </v-btn>

                <v-btn v-if="closable" icon class="btn-close" :ripple="true" @click="closePanel">
                    <v-icon>{{ mdiClose }}</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <v-expand-transition>
            <div v-show="expand || !collapsible">
                <v-card-text>
                    <slot />
                </v-card-text>

                <v-divider v-if="hasFooterSlot" />
                <v-card-actions v-if="hasFooterSlot" class="panel-footer">
                    <slot name="footer" />
                </v-card-actions>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins, Prop, Emit } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { panelToolbarHeight } from '@/store/variables'
import { mdiChevronDown, mdiClose, mdiFullscreen, mdiFullscreenExit } from '@mdi/js'
import { TranslateResult } from 'vue-i18n'

@Component
export default class Panel extends Mixins(BaseMixin) {
    mdiChevronDown = mdiChevronDown
    mdiClose = mdiClose
    mdiFullscreen = mdiFullscreen
    mdiFullscreenExit = mdiFullscreenExit
    panelToolbarHeight = panelToolbarHeight

    @Prop({ default: null }) declare readonly icon: string | null
    @Prop({ required: true, default: '' }) declare readonly title: string | TranslateResult
    @Prop({ default: '' }) declare readonly subtitle: string | TranslateResult
    @Prop({ default: false }) declare readonly collapsible: boolean
    @Prop({ required: true }) declare readonly cardClass: string
    @Prop({ default: '' }) declare readonly toolbarColor: string
    @Prop({ default: '' }) declare readonly toolbarClass: string
    @Prop({ default: false }) declare readonly loading: boolean
    @Prop({ default: true }) declare readonly marginBottom: boolean
    @Prop({ default: false }) declare readonly hideButtonsOnCollapse: boolean

    // Added props to make the component more versatile and feature-rich
    @Prop({ default: false }) declare readonly closable: boolean
    @Prop({ default: false }) declare readonly fullscreenable: boolean
    @Prop({ default: undefined }) declare readonly elevation: string | number | undefined
    @Prop({ default: false }) declare readonly dense: boolean

    fullscreen = false

    get expand() {
        return this.$store.getters['gui/getPanelExpand'](this.cardClass, this.viewport)
    }

    set expand(newVal) {
        this.$store.dispatch('gui/saveExpandPanel', { name: this.cardClass, value: newVal, viewport: this.viewport })
    }

    get hasIconSlot() {
        return !!this.$slots.icon
    }

    get hasButtonsSlot() {
        return !!this.$slots.buttons
    }

    get hasFooterSlot() {
        return !!this.$slots.footer
    }

    get getToolbarClass() {
        let output = this.toolbarClass
        if (this.collapsible) output += ' collapsible'
        return output
    }

    toggleFullscreen() {
        this.fullscreen = !this.fullscreen
        this.$emit('fullscreen', this.fullscreen)
    }

    @Emit('close')
    closePanel() {
        // Emits 'close' event for the parent component to handle
    }
}
</script>

<style scoped>
/* Logic for panel interaction remains scoped */
.expanded header.v-toolbar {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

.btn-collapsible>*,
.btn-close>*,
.btn-fullscreen>* {
    will-change: transform;
    transition: transform 500ms;
}

.icon-rotate-90 {
    transform: rotate(90deg);
}

.panel-toolbar {
    overflow-y: hidden;
}

::v-deep .panel-toolbar .v-btn {
    height: 100% !important;
    max-height: none;
}

.panel-fullscreen {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 9999;
    border-radius: 0 !important;
    overflow-y: auto;
}
</style>

<style>
/* =========================================================================
   APPLY GLOBAL MASTER STYLES
   These rules look for the variables you set in Dashboard.vue
   ========================================================================= */
.dark-wrapper {
    background: rgba(0, 0, 0, 0.25);
    border-radius: 20px;
    padding: 10px;
}

/* This targets ALL v-cards across the entire app */
html body .v-application .v-card.panel.v-sheet,
html body .v-application .v-card.panel {
    background-color: var(--master-bg) !important;
    border-radius: var(--master-radius) !important;
    border: var(--master-border) !important;
}

.clean-dashboard-card .v-card.panel,
.transparent-bg .v-card.panel,
.inner-card-wrapper .v-card.panel,
.v-dialog .v-card.panel {
    min-height: auto !important;
    height: auto !important;
}

html body .v-application .v-card.panel .v-toolbar,
html body .v-application .v-card.panel .v-toolbar.theme--dark,
html body .v-application .v-card.panel .v-toolbar>.v-toolbar__content {
    background-color: transparent !important;
    background: transparent !important;
}
</style>

<style>
/* =========================================================================
   👑 GLOBAL DESIGN MASTER CONTROL (The "Brain")
   We keep this in Dashboard.vue so the wrapper card can see it.
   ========================================================================= */
:root {
    /* Colors & Borders */
    --master-bg: rgb(56, 56, 56);
    --master-radius: 24px;
    --master-border: 1px solid rgba(255, 255, 255, 0.1);

    /* Dimensions */
    --master-panel-height: 65vh;
    --master-panel-width: calc(100vw - 32px);
    /* adjust 32px to match your padding */

    /* Inner elements */
    --master-inner-bg: rgba(255, 255, 255, 0.05);
    --master-inner-border: rgba(255, 255, 255, 0.1);
}
</style>