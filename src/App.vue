<template>
    <v-app :style="cssVars">
        <template v-if="socketIsConnected && guiIsReady">
            <the-topbar />
            
            <v-main id="content" :style="mainStyle" class="main-no-sidebar">
                <v-container id="page-container" fluid class="pa-0 ma-0 full-width-container">
                    
                    <div class="horizontal-track">
                        <div id="section-dashboard" class="scroll-section">
                            <div class="page-wrapper"><PageDashboard /></div>
                        </div>
                        <div id="section-console" class="scroll-section">
                            <div class="page-wrapper"><PageConsole /></div>
                        </div>
                        <div id="section-heightmap" class="scroll-section">
                            <div class="page-wrapper"><PageHeightmap /></div>
                        </div>
                        <div id="section-files" class="scroll-section">
                            <div class="page-wrapper"><PageFiles /></div>
                        </div>
                        <div id="section-viewer" class="scroll-section">
                            <div class="page-wrapper"><PageViewer /></div>
                        </div>
                        <div id="section-history" class="scroll-section">
                            <div class="page-wrapper"><PageHistory /></div>
                        </div>
                        <div id="section-machine" class="scroll-section">
                            <div class="page-wrapper"><PageMachine /></div>
                        </div>
                    </div>

                </v-container>
            </v-main>

            <BottomNav v-if="boolBottomNav" />
            <the-service-worker />
            <the-update-dialog />
            <the-editor />
            <the-timelapse-rendering-snackbar />
            <the-fullscreen-upload />
            <the-upload-snackbar />
            <the-manual-probe-dialog />
            <the-bed-screws-dialog />
            <the-screws-tilt-adjust-dialog />
            <the-macro-prompt />
        </template>
        <the-select-printer-dialog v-else-if="instancesDB !== 'moonraker'" />
        <the-connecting-dialog v-else />
    </v-app>
</template>

<script lang="ts">
import PageDashboard from '@/pages/Dashboard.vue'
import PageConsole from '@/pages/Console.vue'
import PageHeightmap from '@/pages/Heightmap.vue'
import PageFiles from '@/pages/Files.vue'
import PageViewer from '@/pages/Viewer.vue' 
import PageHistory from '@/pages/History.vue'
import PageMachine from '@/pages/Machine.vue'
import BottomNav from '@/components/BottomNav.vue'
import Component from 'vue-class-component'
import BaseMixin from '@/components/mixins/base'
import ThemeMixin from './components/mixins/theme'
import TheTopbar from '@/components/TheTopbar.vue'
import { Mixins } from 'vue-property-decorator'
import { panelToolbarHeight, topbarHeight } from '@/store/variables'

@Component({
    components: {
        PageDashboard, PageConsole, PageHeightmap, PageFiles, PageViewer, PageHistory, PageMachine,
        BottomNav, TheTopbar,
    },
})
export default class App extends Mixins(BaseMixin, ThemeMixin) {
    get title() { return this.$store.getters['getTitle'] }
    get mainStyle() { return this.mainBgImage ? { backgroundImage: 'url(' + this.mainBgImage + ')' } : {} }
    get primaryColor() { return this.$store.state.gui.uiSettings.primary }
    get logoColor() { return this.$store.state.gui.uiSettings.logo }
    get boolBottomNav() { return this.$store.state.gui.view.boolBottomNav ?? true }

    get cssVars() {
        return {
            '--v-btn-text-primary': '#ffffff',
            '--color-logo': this.logoColor,
            '--color-primary': this.primaryColor,
            '--panel-toolbar-icon-btn-width': panelToolbarHeight + 'px',
            '--topbar-icon-btn-width': topbarHeight + 'px',
        }
    }

    mounted() {
        document.documentElement.style.setProperty('--app-height', window.innerHeight + 'px')
        // Força o Vuetify a ignorar a sidebar no cálculo de espaço
        this.$vuetify.application.left = 0
    }
}
</script>

<style>
@import './assets/styles/fonts.css';
@import './assets/styles/page.css';

/* 1. REMOVER OS TRÊS TRAÇOS (MENU HAMBÚRGUER) */
.v-app-bar__nav-icon {
    display: none !important;
}

/* 2. FORÇAR LARGURA TOTAL SEM SIDEBAR */
.main-no-sidebar {
    padding-left: 0px !important;
    margin-left: 0px !important;
}

.full-width-container {
    max-width: 100vw !important;
    width: 100vw !important;
}

/* 3. CONFIGURAÇÃO DO SLIDE HORIZONTAL SEM CORTES */
.horizontal-track {
    display: flex !important;
    flex-direction: row !important;
    width: 100%;
    height: calc(var(--app-height) - 64px);
    overflow-x: auto; /* Permite slide */
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
}

.scroll-section {
    flex: 0 0 100% !important; /* Cada página tem exatamente 100% da largura do ecrã */
    width: 100vw !important;
    height: 100%;
    overflow-y: auto;
    scroll-snap-align: start;
}

.page-wrapper {
    max-width: 1600px;
    margin: 0 auto;
    padding: 24px;
}

/* ESTILO DOS ÍCONES E CORES */
body .v-application { background: #000000 !important; }
.v-application, .text--primary, .v-card__text, .v-list-item__title, .v-label {
    color: #ffffff !important;
}

.blocks-icon {
    object-fit: contain;
    filter: brightness(0) invert(1);
}
</style>