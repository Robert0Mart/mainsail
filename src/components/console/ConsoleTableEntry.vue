<template>
    <v-row :class="entryStyle" no-gutters>
        <v-col class="col-auto pr-3 console-time">{{ entryFormatTime }}</v-col>
        
        <v-col
            v-if="!rawOutput"
            :class="messageClass"
            class="console-message-col"
            @click.capture="commandClick"
            v-html="event.formatMessage" />
        
        <v-col 
            v-else 
            :class="messageClass" 
            class="console-message-col" 
            @click.capture="commandClick" 
            v-text="event.message" />
    </v-row>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins, Prop } from 'vue-property-decorator'
import { ServerStateEvent } from '@/store/server/types'
import BaseMixin from '@/components/mixins/base'

@Component
export default class ConsoleTableEntry extends Mixins(BaseMixin) {
    @Prop({ required: true })
    declare readonly event: ServerStateEvent

    get entryStyle() {
        const classes = ['ma-0', 'flex-nowrap', 'console-entry-row']
        // Mantém a compatibilidade com as definições de estilo do utilizador
        classes.push(this.$store.state.gui.console.entryStyle ?? 'default')
        if (['action', 'debug'].includes(this.event.type)) classes.push('text--disabled')

        return classes
    }

    get entryFormatTime() {
        return this.formatTime(this.event.date.getTime(), true)
    }

    get messageClass() {
        const classes = ['console-message']

        // Lógica de cores baseada no tipo de mensagem
        if (['action', 'debug'].includes(this.event.type)) classes.push('msg-debug')
        else if (this.event.message.startsWith('!! ')) classes.push('msg-error')
        else if (this.event.type === 'command') classes.push('msg-command')
        else classes.push('msg-response')

        return classes
    }

    get rawOutput() {
        return this.$store.state.gui.console.rawOutput ?? false
    }

    commandClick(event: Event) {
        const eventTarget = event.target as Element
        if (eventTarget.localName === 'a' && eventTarget.className.indexOf('command') !== -1) {
            const command = eventTarget.innerHTML.replace(/<br>/g, '\n')
            this.$emit('command-click', command)
        }
    }
}
</script>

<style scoped>
/* Estilo base da linha da consola */
.console-entry-row {
    font-family: 'Roboto Mono', monospace;
    font-size: 0.85rem;
    line-height: 1.4;
    border-radius: 4px;
}

/* TIMESTAMPS: Visibilidade de 50% para ser fácil de ler sem distrair */
.console-time {
    color: rgba(255, 255, 255, 0.5) !important;
    font-size: 0.75rem;
    user-select: none;
    min-width: 85px;
    font-weight: 500;
}

.console-message-col {
    min-width: 0;
    word-break: break-all;
}

/* CORES DAS MENSAGENS - TERMINAL STYLE */
.msg-response {
    color: #e0e0e0 !important; /* Branco suave para respostas da impressora */
}

.msg-command {
    color: #00E5FF !important; /* Ciano vibrante para os comandos que tu envias */
    font-weight: 500;
}

.msg-error {
    color: #ff5252 !important; /* Vermelho para erros graves */
}

.msg-debug {
    color: rgba(255, 255, 255, 0.35) !important;
}

/* LIMPEZA DE LINHAS E BORDAS */
.console-entry-row.default .col {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    border-top: none !important; /* Removemos as linhas brancas horizontais */
}

.console-entry-row.compact .col {
    padding-top: 1px !important;
    padding-bottom: 1px !important;
}

/* Estilo para sugestões de comando (links clicáveis) */
::v-deep .command {
    color: #00E5FF !important;
    text-decoration: none;
    border-bottom: 1px dashed rgba(0, 229, 255, 0.4);
}

::v-deep .command:hover {
    background: rgba(0, 229, 255, 0.1);
    border-radius: 2px;
}
</style>