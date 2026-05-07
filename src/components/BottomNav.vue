<template>
    <div class="bottom-nav-wrapper">
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
    isAdvanced = localStorage.getItem('advancedMode') === 'true'

    mounted() {
        this.$root.$on('advancedModeChanged', (val: boolean) => {
            this.isAdvanced = val;
        });
    }

    beforeDestroy() {
        this.$root.$off('advancedModeChanged');
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
        return this.navItems.filter(item => {
            if (item.advanced) {
                return this.isAdvanced === true;
            }
            return true;
        });
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
    padding: 8px 16px;
    display: flex;
    gap: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    pointer-events: auto; 
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