<template>
    <v-app :style="cssVars" id="app">
        <template v-if="socketIsConnected && guiIsReady">
            <the-topbar />
            
            <v-main id="content" class="main-no-sidebar">
                <v-container id="page-container" fluid class="pa-0 ma-0 full-width-container">
                    
                    <transition name="fade" mode="out-in">
                        <div class="page-wrapper" :key="$route.path">
                            <router-view />
                        </div>
                    </transition>

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
import BottomNav from '@/components/BottomNav.vue'
import Component from 'vue-class-component'
import BaseMixin from '@/components/mixins/base'
import ThemeMixin from './components/mixins/theme'
import TheTopbar from '@/components/TheTopbar.vue'
import { Mixins } from 'vue-property-decorator'
import { panelToolbarHeight, topbarHeight } from '@/store/variables'

@Component({
    components: {
        BottomNav, 
        TheTopbar,
    },
})
export default class App extends Mixins(BaseMixin, ThemeMixin) {
    get title() { return this.$store.getters['getTitle'] }
    get primaryColor() { return this.$store.state.gui.uiSettings.primary }
    get logoColor() { return this.$store.state.gui.uiSettings.logo }
    get boolBottomNav() { return this.$store.state.gui.view.boolBottomNav ?? true }

    get cssVars() {
        return {
            '--v-btn-text-primary': '#ffffff',
            '--color-logo': this.logoColor,
            '--color-primary': this.primaryColor,
            '--panel-toolbar-icon-btn-width': panelToolbarHeight + 'px',
            '--topbar-icon-btn-width': (this.$vuetify.breakpoint.xsOnly ? 64 : topbarHeight) + 'px',
        }
    }

    private baseDPR = window.devicePixelRatio

    mounted() {
        document.documentElement.style.setProperty('--app-height', window.innerHeight + 'px')
        this.$vuetify.application.left = 0
        this.updateAntiZoom()
        window.addEventListener('resize', this.updateAntiZoom)
    }

    beforeDestroy() {
        window.removeEventListener('resize', this.updateAntiZoom)
    }

    updateAntiZoom() {
        const scale = this.baseDPR / window.devicePixelRatio
        document.documentElement.style.setProperty('--anti-zoom', String(scale))
    }
}
</script>

<style>
@import './assets/styles/fonts.css';
@import './assets/styles/page.css';

html, body {
    height: 100vh !important;
    overflow: hidden !important; 
}

.v-app-bar__nav-icon { display: none !important; }

.v-app-bar {
    zoom: var(--anti-zoom, 1) !important;
}

.main-no-sidebar { padding-left: 0px !important; margin-left: 0px !important; }

.full-width-container {
    max-width: 100vw !important;
    width: 100vw !important;
    height: calc(100vh - 64px) !important;
    overflow-x: hidden !important;
    overflow-y: auto !important; 
}

.page-wrapper {
    max-width: 1600px;
    margin: 0 auto;
    padding: 10px 20px !important;
    padding-bottom: 20px !important; 
    width: 100%;
}

.page-gcodeviewer .v-card__title {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    font-size: 0.9rem !important;
}

.page-gcodeviewer .v-card__text,
.page-gcodeviewer .gcode-viewer-container,
.page-gcodeviewer canvas {
    height: 32vh !important; 
    max-height: 32vh !important;
    min-height: 180px !important;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.01s linear !important;
}
.fade-enter, .fade-leave-to { opacity: 0 !important; }

#app, .v-application, .v-application--wrap, .theme--dark.v-application {
    background: linear-gradient(170deg, #252525 0%, #070707 100%) !important;
    background-attachment: fixed !important;
    min-height: 100vh !important;
}

.v-main, .theme--dark.v-main, .full-width-container, .page-wrapper { 
    background: transparent !important; 
}

.v-application, .text--primary, .v-card__text, .v-list-item__title, .v-label {
    color: #ffffff !important;
}

.blocks-icon {
    object-fit: contain !important;
    filter: brightness(0) invert(1) !important; 
}

.orange-fix {
    filter: none !important; 
    -webkit-filter: none !important;
}
</style>