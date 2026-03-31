<template>
    <div class="bottom-nav-wrapper">
        <div class="bottom-nav-pill">
            
            <v-btn icon exact to="/" class="nav-btn" active-class="active-btn">
                <v-icon>{{ mdiViewDashboard }}</v-icon>
            </v-btn>
            
            <v-btn icon to="/console" class="nav-btn" active-class="active-btn">
                <v-icon>{{ mdiConsole }}</v-icon>
            </v-btn>
            
            <v-btn icon to="/heightmap" class="nav-btn" active-class="active-btn">
                <v-icon>{{ mdiGrid }}</v-icon>
            </v-btn>
            
            <v-btn icon to="/files" class="nav-btn" active-class="active-btn">
                <v-icon>{{ mdiFileDocumentOutline }}</v-icon>
            </v-btn>
            
            <v-btn icon to="/viewer" class="nav-btn" active-class="active-btn">
                <v-icon>{{ mdiEye }}</v-icon>
            </v-btn>
            
            <v-btn icon to="/history" class="nav-btn" active-class="active-btn">
                <v-icon>{{ mdiHistory }}</v-icon>
            </v-btn>
            
            <v-btn icon to="/config" class="nav-btn" active-class="active-btn">
                <v-icon>{{ mdiWrench }}</v-icon>
            </v-btn>

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
    mdiViewDashboard,
    mdiConsole,
    mdiGrid,
    mdiFileDocumentOutline,
    mdiEye,
    mdiHistory,
    mdiWrench
} from '@mdi/js'

@Component
export default class BottomNav extends Vue {
    // Icons
    mdiViewDashboard = mdiViewDashboard
    mdiConsole = mdiConsole
    mdiGrid = mdiGrid
    mdiFileDocumentOutline = mdiFileDocumentOutline
    mdiEye = mdiEye
    mdiHistory = mdiHistory
    mdiWrench = mdiWrench
}
</script>

<style scoped>
/* Wrapper */
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

/* Pill */
.bottom-nav-pill {
    background-color: #1e1e1e;
    border-radius: 40px;
    padding: 8px 16px;
    display: flex;
    gap: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    pointer-events: auto; 
}

/* Buttons */
.nav-btn {
    color: rgba(255, 255, 255, 0.6) !important;
    transition: all 0.3s ease;
    width: 45px !important;
    height: 45px !important;
}

/* Active */
.active-btn {
    background-color: rgba(255, 255, 255, 0.15) !important;
    color: #ffffff !important;
}

.nav-btn:hover {
    color: #ffffff !important;
}
</style>