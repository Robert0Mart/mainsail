<template>
    <v-app :style="cssVars">
        <template v-if="socketIsConnected && guiIsReady">
            <the-sidebar />
            <the-topbar />
            <v-main id="content" :style="mainStyle">
                <v-container id="page-container" fluid :class="containerClasses">
                    
                    <div class="horizontal-track">
                        
                        <div id="section-dashboard" class="scroll-section">
                            <div class="page-wrapper">
                                <PageDashboard />
                            </div>
                        </div>
                        
                        <div id="section-console" class="scroll-section">
                            <div class="page-wrapper">
                                <PageConsole />
                            </div>
                        </div>

                        <div id="section-heightmap" class="scroll-section">
                            <div class="page-wrapper">
                                <PageHeightmap />
                            </div>
                        </div>

                        <div id="section-files" class="scroll-section">
                            <div class="page-wrapper">
                                <PageFiles />
                            </div>
                        </div>

                        <div id="section-viewer" class="scroll-section">
                            <div class="page-wrapper">
                                <PageViewer />
                            </div>
                        </div>

                        <div id="section-history" class="scroll-section">
                            <div class="page-wrapper">
                                <PageHistory />
                            </div>
                        </div>

                        <div id="section-machine" class="scroll-section">
                            <div class="page-wrapper">
                                <PageMachine />
                            </div>
                        </div>

                    </div>

                </v-container>
            </v-main>
            <BottomNav />
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
import PageViewer from '@/pages/Viewer.vue' // Added Viewer import
import PageHistory from '@/pages/History.vue'
import PageMachine from '@/pages/Machine.vue'

import BottomNav from '@/components/BottomNav.vue'
import Component from 'vue-class-component'
import TheSidebar from '@/components/TheSidebar.vue'
import BaseMixin from '@/components/mixins/base'
import ThemeMixin from './components/mixins/theme'
import TheTopbar from '@/components/TheTopbar.vue'
import { Mixins, Watch } from 'vue-property-decorator'
import TheUpdateDialog from '@/components/TheUpdateDialog.vue'
import TheConnectingDialog from '@/components/TheConnectingDialog.vue'
import TheSelectPrinterDialog from '@/components/TheSelectPrinterDialog.vue'
import TheEditor from '@/components/TheEditor.vue'
import { panelToolbarHeight, topbarHeight, navigationItemHeight } from '@/store/variables'
import TheTimelapseRenderingSnackbar from '@/components/TheTimelapseRenderingSnackbar.vue'
import TheFullscreenUpload from '@/components/TheFullscreenUpload.vue'
import TheUploadSnackbar from '@/components/TheUploadSnackbar.vue'
import TheManualProbeDialog from '@/components/dialogs/TheManualProbeDialog.vue'
import { setAndLoadLocale } from './plugins/i18n'
import TheBedScrewsDialog from '@/components/dialogs/TheBedScrewsDialog.vue'
import TheScrewsTiltAdjustDialog from '@/components/dialogs/TheScrewsTiltAdjustDialog.vue'
import TheMacroPrompt from '@/components/dialogs/TheMacroPrompt.vue'

@Component({
    components: {
        PageDashboard, PageConsole, PageHeightmap, PageFiles, PageViewer, PageHistory, PageMachine,
        BottomNav, TheMacroPrompt, TheTimelapseRenderingSnackbar, TheEditor,
        TheSelectPrinterDialog, TheConnectingDialog, TheUpdateDialog,
        TheTopbar, TheSidebar, TheFullscreenUpload, TheUploadSnackbar,
        TheManualProbeDialog, TheBedScrewsDialog, TheScrewsTiltAdjustDialog,
    },
})
export default class App extends Mixins(BaseMixin, ThemeMixin) {
    get title(): string {
        let title = this.$store.getters['getTitle']
        if (this.isPrinterPowerOff) title = this.$t('App.Titles.PrinterOff')
        return title
    }

    get naviDrawer(): boolean { return this.$store.state.naviDrawer }
    get navigationStyle() { return this.$store.state.gui.uiSettings.navigationStyle }

    get mainStyle() {
        const style: any = {}
        if (this.mainBgImage !== null) style.backgroundImage = 'url(' + this.mainBgImage + ')'
        return style
    }

    get customStylesheet() { return this.$store.getters['files/getCustomStylesheet'] }
    get customFavicons(): string | null { return this.$store.getters['files/getCustomFavicons'] ?? null }
    get language(): string { return this.$store.state.gui.general.language }
    get current_file(): string { return this.$store.state.printer.print_stats?.filename ?? '' }
    get mode(): string { return this.$store.state.gui.uiSettings.mode }
    get logoColor(): string { return this.$store.state.gui.uiSettings.logo }
    get primaryColor(): string { return this.$store.state.gui.uiSettings.primary }
    get warningColor(): string { return this.$vuetify?.theme?.currentTheme?.warning?.toString() ?? '#ff8300' }

    get primaryTextColor(): string {
        const splits = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.primaryColor)
        if (splits) {
            const r = parseInt(splits[1], 16) * 0.2126
            const g = parseInt(splits[2], 16) * 0.7152
            const b = parseInt(splits[3], 16) * 0.0722
            const perceivedLightness = (r + g + b) / 255
            return perceivedLightness > 0.7 ? '#222' : '#fff'
        }
        return '#ffffff'
    }

    get cssVars(): { [key: string]: string } {
        return {
            '--v-btn-text-primary': this.primaryTextColor,
            '--color-logo': this.logoColor,
            '--color-primary': this.primaryColor,
            '--color-warning': this.warningColor,
            '--panel-toolbar-icon-btn-width': panelToolbarHeight + 'px',
            '--panel-toolbar-text-btn-height': panelToolbarHeight + 'px',
            '--topbar-icon-btn-width': topbarHeight + 'px',
            '--sidebar-menu-item-height': navigationItemHeight + 'px',
        }
    }

    get print_percent(): number { return Math.floor(this.$store.getters['printer/getPrintPercent'] * 100) }

    get containerClasses() {
        return {
            'px-0': true, 'py-0': true, 'mx-0': true,
            fullscreen: false,
        }
    }

    get progressAsFavicon() { return this.$store.state.gui.uiSettings.progressAsFavicon }

    @Watch('title', { immediate: true }) titleChanged(newVal: string): void { document.title = newVal }
    @Watch('language') async languageChanged(newVal: string): Promise<void> { await setAndLoadLocale(newVal) }
    @Watch('current_file') current_fileChanged(newVal: string): void { if (newVal) this.$socket.emit('server.files.metadata', { filename: newVal }, { action: 'files/getMetadataCurrentFile' }) }
    @Watch('primaryColor') primaryColorChanged(newVal: string): void { this.$nextTick(() => { this.$vuetify.theme.currentTheme.primary = newVal }) }
    
    @Watch('mode') modeChanged(newVal: string): void {
        const dark = newVal !== 'light'
        this.$vuetify.theme.dark = dark
        document.documentElement.className = dark ? 'theme--dark' : 'theme--light'
    }

    async drawFavicon(val: number): Promise<void> { /* ... */ }

    @Watch('customFavicons') customFaviconsChanged(): void { this.drawFavicon(this.print_percent) }
    @Watch('progressAsFavicon') progressAsFaviconChanged(): void { this.drawFavicon(this.print_percent) }
    @Watch('logoColor') logoColorChanged(): void { this.drawFavicon(this.print_percent) }
    @Watch('print_percent') print_percentChanged(newVal: number): void { this.drawFavicon(newVal); this.refreshSpoolman() }
    @Watch('printerIsPrinting') printerIsPrintingChanged(): void { this.drawFavicon(this.print_percent) }

    refreshSpoolman(): void {
        if (this.moonrakerComponents.includes('spoolman')) this.$store.dispatch('server/spoolman/refreshActiveSpool', null, { root: true })
    }

    appHeight() {
        this.$nextTick(() => { document.documentElement.style.setProperty('--app-height', window.innerHeight + 'px') })
    }

    mounted(): void {
        this.drawFavicon(this.print_percent)
        this.appHeight()
        window.addEventListener('resize', this.appHeight)
        window.addEventListener('orientationchange', this.appHeight)
        
        this.$store.dispatch('setNaviDrawer', false)
    }
}
</script>

<style>
@import './assets/styles/fonts.css';
@import './assets/styles/toastr.css';
@import './assets/styles/page.css';
@import './assets/styles/sidebar.css';
@import './assets/styles/utils.css';
@import './assets/styles/updateManager.css';

:root { --app-height: 100%; }

#content { background-attachment: fixed; background-size: cover; background-repeat: no-repeat; }
.v-btn:not(.v-btn--outlined).primary { color: var(--v-btn-text-primary); }
.v-app-bar__nav-icon { display: none !important; }

#page-container {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
}

.v-main {
    padding-left: 0 !important;
    margin-left: 0 !important;
    width: 100vw !important;
}

/* Horizontal flex track */
.horizontal-track {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
}

/* Individual page panels */
.scroll-section {
    flex: 0 0 100%; 
    width: 100%;
    height: calc(var(--app-height) - 64px); 
    overflow-y: auto; 
    box-sizing: border-box;
}

/* Limits the width of the content internally */
.page-wrapper {
    max-width: 1600px; 
    margin: 0 auto; 
    padding: 24px 24px 120px 24px; 
    box-sizing: border-box;
}
</style>