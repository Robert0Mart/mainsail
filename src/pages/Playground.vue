<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2" class="rounded-lg">
          
          <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-thermometer</v-icon>
            Temperatura da Sovol SV07+
          </v-card-title>
          
          <v-divider></v-divider>

          <v-card-text>
            <div class="text-h3 text-center my-4 font-weight-bold">
              {{ temperaturaAtual }} °C
            </div>
            <p class="text-center text-medium-emphasis">
              Alvo: {{ temperaturaAlvo }} °C
            </p>
          </v-card-text>

          <v-card-actions class="justify-center pa-4">
            <v-btn color="error" depressed class="mr-2" @click="aquecerTeste">
              Aquecer para 50°C
            </v-btn>
            <v-btn color="grey" outlined @click="desligarTeste">
              Desligar
            </v-btn>
          </v-card-actions>
          
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Playground',
  computed: {
    temperaturaAtual(): string {
      const extruder = this.$store.state.printer?.extruder;
      return extruder && extruder.temperature !== undefined 
        ? extruder.temperature.toFixed(1) 
        : '--';
    },
    temperaturaAlvo(): string {
      const extruder = this.$store.state.printer?.extruder;
      return extruder && extruder.target !== undefined 
        ? extruder.target.toFixed(1) 
        : '--';
    }
  },
  methods: {
    // Função ligada ao botão vermelho
    async aquecerTeste() {
      try {
        // Envia o G-Code "M104 S50" para a API do Moonraker
        await fetch('http://192.168.1.118:7125/printer/gcode/script?script=M104 S50', {
          method: 'POST'
        });
        console.log("✅ Comando de AQUECER enviado com sucesso!");
      } catch (erro) {
        console.error("Erro ao comunicar com a impressora:", erro);
      }
    },
    
    // Função ligada ao botão cinzento
    async desligarTeste() {
      try {
        // Envia o G-Code "M104 S0" para a API do Moonraker
        await fetch('http://192.168.1.118:7125/printer/gcode/script?script=M104 S0', {
          method: 'POST'
        });
        console.log("❄️ Comando de DESLIGAR enviado com sucesso!");
      } catch (erro) {
        console.error("Erro ao comunicar com a impressora:", erro);
      }
    }
  }
})
</script>

<style scoped>
</style>