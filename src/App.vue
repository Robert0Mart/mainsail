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
            '--topbar-icon-btn-width': topbarHeight + 'px',
        }
    }

    mounted() {
        // Define a altura real do ecrã para evitar problemas em mobile
        document.documentElement.style.setProperty('--app-height', window.innerHeight + 'px')
        // Remove espaço da sidebar caso exista
        this.$vuetify.application.left = 0
    }
}
</script>

<style>
@import './assets/styles/fonts.css';
@import './assets/styles/page.css';

/* Remove ícones desnecessários da topbar */
.v-app-bar__nav-icon { display: none !important; }
.main-no-sidebar { padding-left: 0px !important; margin-left: 0px !important; }

/* Contentor principal com Scroll Ativo */
.full-width-container {
    max-width: 100vw !important;
    width: 100vw !important;
    height: calc(var(--app-height) - 64px) !important;
    overflow-x: hidden !important;
    overflow-y: auto !important; 
}

/* Wrapper das páginas com margens ajustadas */
.page-wrapper {
    max-width: 1600px;
    margin: 0 auto;
    padding: 10px 20px !important;
    padding-bottom: 160px !important; 
    width: 100%;
}

/* --- AJUSTE DO G-CODE VIEWER (COMPACTO) --- */
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

/* Transição de página instantânea */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.01s linear !important;
}
.fade-enter, .fade-leave-to { opacity: 0 !important; }

/* CONFIGURAÇÃO DO FUNDO (BACKGROUND) */
html, body, #app, .v-application, .v-application--wrap, .theme--dark.v-application {
    background-color: transparent !important;
    
background: hsla(207, 76%, 31%, 1);

background: linear-gradient(135deg, hsla(207, 76%, 31%, 1) 0%, hsla(207, 77%, 7%, 1) 100%);

background: -moz-linear-gradient(135deg, hsla(207, 76%, 31%, 1) 0%, hsla(207, 77%, 7%, 1) 100%);

background: -webkit-linear-gradient(135deg, hsla(207, 76%, 31%, 1) 0%, hsla(207, 77%, 7%, 1) 100%);

filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#13548A", endColorstr="#04131F", GradientType=1 );    background-size: cover !important;
    background-position: center center !important;
    background-attachment: fixed !important;
}

/* Transparência dos componentes */
.v-main, .theme--dark.v-main, .full-width-container, .page-wrapper { 
    background: transparent !important; 
}

/* Forçar cor de texto branca em toda a app */
.v-application, .text--primary, .v-card__text, .v-list-item__title, .v-label {
    color: #ffffff !important;
}

/* --- REGRAS PARA ÍCONES --- */

/* Força ícones normais do Blocks a ficarem brancos */
.blocks-icon {
    object-fit: contain !important;
    filter: brightness(0) invert(1) !important; 
}

/* FIX NUCLEAR: Garante que o ícone de erro mantém a cor LARANJA original */
.orange-fix {
    filter: none !important; 
    -webkit-filter: none !important;
}
</style>