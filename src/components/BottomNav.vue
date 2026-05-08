<template>
    <div>
        <div class="nav-trigger-strip" @mouseenter="show" />
        <div
            class="bottom-nav-wrapper"
            :class="{ 'nav-visible': isVisible }"
            @mouseenter="show"
            @mouseleave="scheduleHide"
        >
            <div class="bottom-nav-pill">
                <v-btn
                    v-for="item in filteredNavItems"
                    :key="item.to"
                    icon
                    :exact="item.exact"
                    :to="item.to"
                    class="nav-btn"
                    active-class="active-btn"
                >
                    <v-icon>{{ item.icon }}</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
    mdiViewDashboard,
    mdiConsole,
    mdiFileDocumentOutline,
    mdiHistory,
    mdiWrench
} from '@mdi/js'

@Component
export default class BottomNav extends Vue {
    isAdvanced = localStorage.getItem('advancedMode') === 'true'
    isVisible = false
    private hideTimer: ReturnType<typeof setTimeout> | null = null

    mounted() {
        this.$root.$on('advancedModeChanged', (val: boolean) => { this.isAdvanced = val })
    }

    beforeDestroy() {
        this.$root.$off('advancedModeChanged')
        if (this.hideTimer) clearTimeout(this.hideTimer)
    }

    show() {
        if (this.hideTimer) { clearTimeout(this.hideTimer); this.hideTimer = null }
        this.isVisible = true
    }

    scheduleHide() {
        this.hideTimer = setTimeout(() => {
            this.isVisible = false
            this.hideTimer = null
        }, 600)
    }

    get navItems() {
        return [
            { to: '/', icon: mdiViewDashboard, exact: true, advanced: false },
            { to: '/console', icon: mdiConsole, exact: false, advanced: true },
            { to: '/files', icon: mdiFileDocumentOutline, exact: false, advanced: false },
            { to: '/history', icon: mdiHistory, exact: false, advanced: false },
            { to: '/config', icon: mdiWrench, exact: false, advanced: false },
        ]
    }

    get filteredNavItems() {
        return this.navItems.filter(item => !item.advanced || this.isAdvanced)
    }
}
</script>

<style scoped>
.nav-trigger-strip {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 32px;
    z-index: 99;
}

.bottom-nav-wrapper {
    position: fixed;
    bottom: -100px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 100;
    pointer-events: none;
    opacity: 0;
    transition: bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.nav-visible {
    bottom: 20px;
    opacity: 1;
    pointer-events: auto;
}

.bottom-nav-pill {
    background-color: #212121;
    border-radius: 40px;
    padding: 8px 16px;
    display: flex;
    gap: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255,255,255,0.05);
}

.nav-btn {
    color: rgba(255, 255, 255, 0.6) !important;
    transition: all 0.3s ease;
    width: 45px !important;
    height: 45px !important;
}

.active-btn {
    background-color: #2196f3 !important;
    color: #ffffff !important;
}

.nav-btn:hover {
    color: #ffffff !important;
}

@media (max-width: 600px) {
    .bottom-nav-pill {
        padding: 6px 12px;
        gap: 8px;
    }
    .nav-btn {
        width: 40px !important;
        height: 40px !important;
    }
}
</style>
