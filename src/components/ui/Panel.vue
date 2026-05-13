<template>
    <v-card
        :class="['panel', cardClass, marginBottom ? 'panel-spaced' : '', !expand ? 'expanded' : '', fullscreen ? 'panel-fullscreen' : '']"
        :loading="loading" :elevation="elevation" :dense="dense">
        <v-toolbar flat dense :color="toolbarColor" :class="getToolbarClass" :height="panelToolbarHeight"
            class="panel-toolbar">
            <slot name="buttons-left" />
            <v-toolbar-title class="d-flex align-center">
                <slot v-if="hasIconSlot" name="icon" />
                <v-icon v-if="icon !== null && !hasIconSlot" left class="panel-icon">{{ icon }}</v-icon>
                <div class="d-flex flex-column ml-2">
                    <span v-if="title" class="subheading">{{ title }}</span>
                    <span v-if="subtitle" class="caption grey--text text--darken-1">{{ subtitle }}</span>
                </div>
            </v-toolbar-title>
            <slot name="buttons-title" />
            <v-spacer />
            <v-toolbar-items v-show="hasButtonsSlot || closable || fullscreenable">
                <div class="d-flex align-center">
                    <slot name="buttons" />
                </div>
                <v-btn v-if="fullscreenable" icon class="btn-fullscreen" @click="toggleFullscreen">
                    <v-icon>{{ fullscreen ? mdiFullscreenExit : mdiFullscreen }}</v-icon>
                </v-btn>
                <v-btn v-if="closable" icon class="btn-close" @click="closePanel">
                    <v-icon>{{ mdiClose }}</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <v-expand-transition>
            <div v-show="expand || !collapsible">
                <v-card-text class="panel-content">
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
    mdiChevronDown = mdiChevronDown; mdiClose = mdiClose; mdiFullscreen = mdiFullscreen; mdiFullscreenExit = mdiFullscreenExit;
    panelToolbarHeight = panelToolbarHeight; fullscreen = false;

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
    @Prop({ default: false }) declare readonly closable: boolean
    @Prop({ default: false }) declare readonly fullscreenable: boolean
    @Prop({ default: undefined }) declare readonly elevation: string | number | undefined
    @Prop({ default: false }) declare readonly dense: boolean

    get expand() { return this.$store.getters['gui/getPanelExpand'](this.cardClass, this.viewport) }
    set expand(newVal) { this.$store.dispatch('gui/saveExpandPanel', { name: this.cardClass, value: newVal, viewport: this.viewport }) }
    get hasIconSlot() { return !!this.$slots.icon }
    get hasButtonsSlot() { return !!this.$slots.buttons }
    get hasFooterSlot() { return !!this.$slots.footer }
    get getToolbarClass() { return this.toolbarClass + (this.collapsible ? ' collapsible' : '') }
    toggleFullscreen() { this.fullscreen = !this.fullscreen; this.$emit('fullscreen', this.fullscreen); }
    @Emit('close') closePanel() { }
}
</script>

<style scoped>
.btn-close>*,
.btn-fullscreen>* {
    will-change: transform;
    transition: all 0.3s ease;
}

.panel-toolbar {
    overflow-y: hidden;
    background-color: transparent !important;
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
:root {
    /* ── CORES PRINCIPAIS ── */
    --master-bg-color: #464646;
    --master-bg: color-mix(in srgb, var(--master-bg-color) 72%, transparent);
    --master-radius: 24px;
    --master-border: 1px solid rgba(255, 255, 255, 0.08);

    /* ── ESPAÇAMENTO GLOBAL DOS PAINÉIS ──
       Altere apenas estas três variáveis para ajustar todo o espaçamento da UI. */
    --panel-gap: 24px;        /* margem exterior entre painéis */
    --panel-padding: 15px;    /* padding do conteúdo interior de cada painel */
    --panel-inner-gap: 8px;   /* espaçamento entre elementos dentro de um painel */

    /* ── ELEMENTOS INTERNOS GERAIS (Dark Wrappers, Cards) ── */
    --master-inner-bg: rgba(0, 0, 0, 0.35);
    --master-inner-border: rgba(255, 255, 255, 0.05);
    --master-inner-radius: 20px;
    /* aliases para retrocompatibilidade */
    --master-inner-padding: var(--panel-padding);
    --master-inner-margin: var(--panel-inner-gap);
    --master-inner-gap: var(--panel-inner-gap);

    /* ── ITEMS INTERNOS (Botões, Inputs, Sliders) ── */
    --master-inner-item-bg: rgba(255, 255, 255, 0.1);
    --master-inner-item-hover: rgba(255, 255, 255, 0.15);
    --master-inner-item-radius: 12px;

    /* ── TIPOGRAFIA ── */
    --master-spacing: var(--panel-padding);
    --master-font-size: 14px;
    --master-text-color: #ffffff;
    --master-text-muted: rgba(255, 255, 255, 0.6);
}

/* 1. ESPAÇAMENTO EXTERIOR: margem abaixo de cada painel */
html body .v-application .panel.panel-spaced {
    margin-bottom: var(--panel-gap) !important;
}

/* 2. PADDING INTERIOR: conteúdo de todos os painéis */
html body .v-application .panel-content,
html body .v-application .v-card__text,
html body .v-application .console-container,
html body .v-application .v-data-table {
    padding: var(--panel-padding) !important;
}

/* 3. ESPAÇAMENTO ENTRE ELEMENTOS INTERNOS */
html body .v-application .panel-content > .v-row,
html body .v-application .panel-content > .row {
    margin-bottom: var(--panel-inner-gap) !important;
}

/* 4. RESTAURAR VISIBILIDADE GLOBAL DOS PAINÉIS */
html body .v-application .panel,
html body .v-application .unified-history-panel,
html body .v-application .console-card,
html body .v-application .v-card.v-sheet {
    background-color: var(--master-bg) !important;
    border-radius: var(--master-radius) !important;
    border: var(--master-border) !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6) !important;
    overflow: hidden !important;
}

/* 3. MANTER BACKGROUNDS ORIGINAIS LIMPOS */
html body .v-main,
html body .v-application--wrap,
html body .layout-wrapper,
html body .v-container--fluid {
    background: transparent !important;
}

/* 4. ELEMENTOS INTERNOS ESPECÍFICOS (Tabelas e Consola) */
html body .v-application .v-data-table,
html body .v-application .console-container,
html body .v-application .console-log {
    background-color: var(--master-inner-bg) !important;
    font-size: var(--master-font-size) !important;
    border-radius: var(--master-inner-radius) !important;
}

/* 5. INPUTS E PESQUISAS */
html body .v-application .v-text-field--outlined > .v-input__control > .v-input__slot,
html body .v-application .dashboard-search-input .v-input__slot {
    background-color: var(--master-inner-bg) !important;
    border: var(--master-inner-border) !important;
    border-radius: var(--master-inner-radius) !important;
    font-size: var(--master-font-size) !important;
}

/* 7. DASHBOARD ESPECÍFICO (Dark Wrappers) */
html body .v-application .v-card.v-card--flat,
html body .v-application .dark-wrapper {
    background-color: var(--master-inner-bg) !important;
    border-radius: var(--master-inner-radius) !important;
    padding: var(--panel-padding) !important;
    border: var(--master-inner-border) !important;
    font-size: var(--master-font-size) !important;
}

/* Previne que os Wrappers partam a estrutura */
html body .v-application .v-card.v-sheet.panel.blocks-main-panel,
html body .v-application .v-card.v-sheet.panel.blocks-axis-panel {
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
}

/* Settings dialog: fundo sólido (usa a mesma cor base de --master-bg) */
html body .v-application .v-card.v-sheet.panel.settings-menu-dialog {
    background-color: var(--master-bg-color) !important;
}
</style>