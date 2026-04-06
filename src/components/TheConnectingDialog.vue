<template>
    <v-dialog v-model="showDialog" persistent :fullscreen="!connectingFailed" :width="connectingFailed ? 400 : undefined" :content-class="!connectingFailed ? 'blocks-splash-overlay' : ''">
        
        <div v-if="!connectingFailed" class="blocks-splash-container">
            <img src="/img/icons/blocks_icons/logotipo_BLOCKSsvg.svg" alt="Blocks Logo" class="blocks-logo" />
            <div class="loading-square"></div>
            <div class="blocks-loading-text">{{ titleText }}</div>
        </div>

        <panel v-else :title="titleText" :icon="mdiConnection" card-class="the-connection-dialog" :margin-bottom="false">
            <v-card-text class="pt-5">
                <connection-status :moonraker="false" />
                <p class="text-center mt-3 mb-0">
                    {{ $t('ConnectionDialog.CannotConnectTo', { host: formatHostname }) }}
                </p>
                <p v-if="connectionFailedMessage" class="text-center mt-1 red--text">
                    {{ $t('ConnectionDialog.ErrorMessage', { message: connectionFailedMessage }) }}
                </p>
                <template v-if="counter > 2">
                    <v-divider class="my-3" />
                    <p>{{ $t('ConnectionDialog.CheckMoonrakerLog') }}</p>
                    <ul>
                        <li>~/printer_data/logs/moonraker.log</li>
                    </ul>
                    <v-divider class="mt-4 mb-5" />
                </template>
                <div class="text-center mt-3">
                    <v-btn v-if="helpButtonUrl" class="text--disabled mr-3" :href="helpButtonUrl" target="_blank">
                        <v-icon left>{{ mdiHelp }}</v-icon>
                        {{ $t('ConnectionDialog.Help') }}
                    </v-btn>
                    <v-btn class="primary--text" @click="reconnect">{{ $t('ConnectionDialog.TryAgain') }}</v-btn>
                </div>
            </v-card-text>
        </panel>

    </v-dialog>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'

import ThemeMixin from '@/components/mixins/theme'
import ConnectionStatus from '@/components/ui/ConnectionStatus.vue'
import { mdiConnection, mdiHelp } from '@mdi/js'

@Component({
    components: {
        ConnectionStatus,
    },
})
export default class TheConnectingDialog extends Mixins(BaseMixin, ThemeMixin) {
    mdiConnection = mdiConnection
    mdiHelp = mdiHelp

    counter = 0

    get hostname() { return this.$store.state.socket.hostname }
    get port() { return this.$store.state.socket.port }
    get path() { return this.$store.state.socket.path }

    get formatHostname() {
        return parseInt(this.port) !== 80 && this.port !== ''
            ? this.hostname + ':' + this.port + this.path
            : this.hostname + this.path
    }

    get isConnecting() { return this.$store.state.socket.isConnecting }
    get connectingFailed() { return this.$store.state.socket.connectingFailed }
    get showDialog() { return true }

    get titleText() {
        if (this.connectingFailed) return this.$t('ConnectionDialog.Failed', { host: this.formatHostname })
        if (this.isConnecting) return this.$t('ConnectionDialog.Connecting', { host: this.formatHostname })
        if (!this.guiIsReady) return this.$t('ConnectionDialog.Initializing')

        return this.formatHostname
    }

    get connectionFailedMessage() { return this.$store.state.socket.connectionFailedMessage ?? null }

    get helpButtonUrl() {
        if (!this.$store.state.socket.connectionFailedMessage) return null
        return `https://docs.mainsail.xyz/faq/mainsail_errors/connection-${this.connectionFailedMessage?.toLowerCase()}`
    }

    reconnect() {
        this.counter++
        this.$store.dispatch('socket/setData', { connectingFailed: false })
        this.$socket.connect()
    }
}
</script>

<style>
/* Remove o fundo escurecido padrão do dialog quando estamos em modo Splash */
.blocks-splash-overlay {
    background-color: #121212 !important;
    box-shadow: none !important;
}

.blocks-splash-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #121212;
}

.blocks-logo {
    width: 280px;
    max-width: 80vw;
    margin-bottom: 40px;
}

.blocks-loading-text {
    margin-top: 30px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    font-family: sans-serif;
    letter-spacing: 1px;
}

/* Animação do Quadrado a Rodar */
.loading-square {
    width: 40px;
    height: 40px;
    background-color: #ffffff;
    animation: flipSquare 1.2s infinite ease-in-out;
}

@keyframes flipSquare {
    0% { 
        transform: perspective(120px) rotateX(0deg) rotateY(0deg); 
    }
    50% { 
        transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); 
    }
    100% { 
        transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); 
    }
}
</style>