<template>
    <v-card flat>
        <v-card-text>
            <v-row align="center">
                <v-col cols="12" class="py-0">
                    <v-switch
                        v-model="advancedMode"
                        label="Use advanced mode?"
                        color="primary"
                        @change="saveSettings"
                    ></v-switch>
                </v-col>
                <v-col cols="12" class="pt-0">
                    <p class="text-caption grey--text">
                        Enable this to see everything in the dashboard.
                    </p>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SettingsAdvancedTab extends Vue {
    // 1. Inicializa o estado lendo do localStorage para não resetar ao atualizar
    private advancedMode = localStorage.getItem('advancedMode') === 'true'

    saveSettings(value: boolean) {
        // 2. Guarda a preferência localmente
        localStorage.setItem('advancedMode', value.toString())
        
        // 3. Emite um evento global para que o Dashboard saiba que mudou sem refresh
        this.$root.$emit('advancedModeChanged', value)
        
        // Se o teu projeto usa Vuex (Store), o ideal seria:
        // this.$store.commit('setAdvancedMode', value)
    }
}
</script>