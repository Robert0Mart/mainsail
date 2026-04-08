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
    // 1. Estado inicial lido do localStorage
    private isAdvanced = localStorage.getItem('advancedMode') === 'true'

    mounted() {
        // 2. Escuta a mudança global do evento que criámos no SettingsAdvancedTab
        this.$root.$on('advancedModeChanged', (val: boolean) => {
            this.isAdvanced = val;
        });
    }

    // 3. Definição da lista de itens
    get navItems() {
        return [
            { to: '/', icon: mdiViewDashboard, exact: true, advanced: false },
            { to: '/console', icon: mdiConsole, exact: false, advanced: true }, // Marcado como avançado
            { to: '/files', icon: mdiFileDocumentOutline, exact: false, advanced: false },
            { to: '/history', icon: mdiHistory, exact: false, advanced: false },
            { to: '/config', icon: mdiWrench, exact: false, advanced: false },
        ]
    }

    // 4. Filtro que decide o que mostrar
    get filteredNavItems() {
        return this.navItems.filter(item => {
            // Se o modo avançado estiver desativado e o item for avançado, esconde-o
            if (!this.isAdvanced && item.advanced) {
                return false;
            }
            return true;
        });
    }
}
</script>

<style scoped>
/* O teu CSS mantém-se igual */
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
    background-color: #1e1e1e;
    border-radius: 40px;
    padding: 8px 16px;
    display: flex;
    gap: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    pointer-events: auto; 
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
</style>