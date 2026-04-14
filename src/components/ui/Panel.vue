<template>
    <v-card
        :class="'panel ' + cardClass + ' ' + (marginBottom ? 'mb-3 mb-md-6' : '') + ' ' + (!expand ? 'expanded' : '')"
        :loading="loading">
        <v-toolbar
            flat
            dense
            :color="toolbarColor"
            :class="getToolbarClass"
            :height="panelToolbarHeight"
            class="panel-toolbar">
            <slot name="buttons-left" />
            <v-toolbar-title class="d-flex align-center">
                <slot v-if="hasIconSlot" name="icon" />
                <v-icon v-if="icon !== null && !hasIconSlot" left>{{ icon }}</v-icon>
                <span v-if="title" class="subheading">{{ title }}</span>
            </v-toolbar-title>
            <slot name="buttons-title" />
            <v-spacer />
            <v-toolbar-items v-show="hasButtonsSlot || collapsible">
                <div v-if="expand || !hideButtonsOnCollapse" class="d-flex align-center">
                    <slot name="buttons" />
                </div>
                <v-btn v-if="collapsible" icon class="btn-collapsible" :ripple="true" @click="expand = !expand">
                    <v-icon :class="expand ? '' : 'icon-rotate-90'">{{ mdiChevronDown }}</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-expand-transition>
            <div v-show="expand || !collapsible">
                <slot />
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { panelToolbarHeight } from '@/store/variables'
import { mdiChevronDown } from '@mdi/js'
import { TranslateResult } from 'vue-i18n'

@Component
export default class Panel extends Mixins(BaseMixin) {
    mdiChevronDown = mdiChevronDown
    panelToolbarHeight = panelToolbarHeight

    @Prop({ default: null }) declare readonly icon: string | null
    @Prop({ required: true, default: '' }) declare readonly title: string | TranslateResult
    @Prop({ default: false }) declare readonly collapsible: boolean
    @Prop({ required: true }) declare readonly cardClass: string
    @Prop({ default: '' }) declare readonly toolbarColor: string 
    @Prop({ default: '' }) declare readonly toolbarClass: string
    @Prop({ default: false }) declare readonly loading: boolean
    @Prop({ default: true }) declare readonly marginBottom: boolean
    @Prop({ default: false }) declare readonly hideButtonsOnCollapse: boolean

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

    get getToolbarClass() {
        let output = this.toolbarClass
        if (this.collapsible) output += ' collapsible'
        return output
    }
}
</script>

<style>
/* =========================================================================
   👑 GLOBAL DESIGN MASTER CONTROL
   Because this is in Dashboard.vue (the top parent) and NOT scoped, 
   these variables will successfully flow down to every single panel.
   ========================================================================= */
:root {
    /* Set to RED and 24px roundness temporarily so we KNOW when it works */
    --master-bg: rgb(58, 58, 108); 
    --master-radius: 24px;
    --master-border: 1px solid #ffffff;

    /* Inner elements */
    --master-inner-bg: rgba(255, 255, 255, 0.05);
    --master-inner-border: rgba(255, 255, 255, 0.1);
}

/* NUCLEAR OVERRIDE FOR THE REDESIGN WRAPPER
  This explicitly targets Vuetify's dark mode card class to ensure it can't be overwritten.
*/
html body .v-application .theme--dark .v-card.clean-dashboard-card,
html body .v-application .theme--light .v-card.clean-dashboard-card,
html body .v-application .v-card.clean-dashboard-card {
    background-color: var(--master-bg) !important;
    background: var(--master-bg) !important;
    border-radius: var(--master-radius) !important;
    border: var(--master-border) !important;
}
</style>

<style scoped>
/* Keep your existing scoped styles exactly as they were! */
.clean-divider {
    border-color: rgba(255, 255, 255, 0.03) !important;
}

::v-deep .transparent-bg,
::v-deep .transparent-bg .v-card,
::v-deep .transparent-bg .v-sheet {
    background-color: transparent !important;
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
    margin: 0 !important;
}

::v-deep .transparent-bg .v-card__title {
    background: transparent !important;
}
</style>