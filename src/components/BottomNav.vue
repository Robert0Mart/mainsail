<template>
    <div
        class="bottom-nav-wrapper"
        :class="{ 'nav-inactive': isInactive }"
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
    public isAdvanced: boolean = localStorage.getItem('advancedMode') === 'true'
    public isInactive: boolean = false
    private inactivityTimer: any = null
    private lastActivityTime: number = 0

    mounted() {
        this.$root.$on('advancedModeChanged', (val: boolean) => {
            this.isAdvanced = val
        })
        document.addEventListener('mousemove', this.onActivity, { passive: true })
        document.addEventListener('touchstart', this.onActivity, { passive: true })
        this.startInactivityTimer()
    }

    beforeDestroy() {
        this.$root.$off('advancedModeChanged')
        document.removeEventListener('mousemove', this.onActivity)
        document.removeEventListener('touchstart', this.onActivity)
        if (this.inactivityTimer) clearTimeout(this.inactivityTimer)
    }

    onActivity() {
        const now = Date.now()
        if (now - this.lastActivityTime < 300) return
        this.lastActivityTime = now
        this.isInactive = false
        this.startInactivityTimer()
    }

    startInactivityTimer() {
        if (this.inactivityTimer) clearTimeout(this.inactivityTimer)
        this.inactivityTimer = setTimeout(() => {
            this.isInactive = true
            this.inactivityTimer = null
        }, 5000)
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
.bottom-nav-wrapper {
    position: fixed;
    bottom: 20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 100;
    pointer-events: none;
}

.bottom-nav-pill {
    background-color: #212121;
    border-radius: 40px;
    padding: 5px 10px;
    display: flex;
    gap: 4px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255,255,255,0.05);
    pointer-events: auto;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.nav-inactive .bottom-nav-pill {
    opacity: 0.2;
    transform: translateY(8px) scale(0.92);
    transition: opacity 1.2s ease, transform 1.2s ease;
}

.nav-btn {
    color: rgba(255, 255, 255, 0.6) !important;
    transition: color 0.2s ease;
    width: 34px !important;
    height: 34px !important;
}

.active-btn {
    background-color: #2196f3 !important;
    color: #ffffff !important;
}

.nav-btn:hover {
    color: #ffffff !important;
}

@media (max-width: 1280px) {
    .bottom-nav-pill {
        padding: 10px 18px;
        gap: 14px;
    }
    .nav-btn {
        width: 54px !important;
        height: 54px !important;
    }
    ::v-deep .nav-btn .v-icon {
        font-size: 28px !important;
    }
}
</style>
