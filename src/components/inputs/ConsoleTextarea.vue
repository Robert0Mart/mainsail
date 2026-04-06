<template>
    <v-textarea
        ref="gcodeCommandField"
        v-model="gcode"
        :items="items"
        :placeholder="$t('Panels.MiniconsolePanel.SendCode')"
        flat
        class="gcode-command-field custom-premium-input"
        autocomplete="off"
        no-resize
        auto-grow
        :rows="rows"
        hide-details
        outlined
        dense
        :prepend-inner-icon="isTouchDevice ? mdiChevronDoubleRight : ''"
        :append-icon="'blocks-send-icon'"
        @keydown.enter.prevent.stop="doSend"
        @keydown.up="onKeyUp"
        @keydown.down="onKeyDown"
        @keydown.tab="onAutocomplete"
        @click:prepend-inner="onAutocomplete"
        @click:append="doSend" />
</template>

<script lang="ts">
import { Component, Mixins, Ref } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ConsoleMixin from '@/components/mixins/console'
import { mdiSend, mdiChevronDoubleRight } from '@mdi/js'
import { VTextareaType } from '@/store/printer/types'
import { strLongestEqual } from '@/plugins/helpers'

@Component
export default class ConsoleTextarea extends Mixins(BaseMixin, ConsoleMixin) {
    mdiSend = mdiSend
    mdiChevronDoubleRight = mdiChevronDoubleRight

    @Ref() readonly gcodeCommandField!: VTextareaType

    gcode = ''
    lastCommandNumber: number | null = null
    items = []

    get rows(): number {
        return this.gcode?.split('\n').length ?? 1
    }

    getCurrentLine(): number {
        const textarea = this.gcodeCommandField.$refs.input
        const textBeforeCursor = textarea.value.substring(0, textarea.selectionStart)
        return textBeforeCursor.split('\n').length
    }

    setGcode(gcode: string): void {
        this.gcode = gcode

        this.$nextTick(() => {
            this.gcodeCommandField.focus()
        })
    }

    onKeyUp(event: KeyboardEvent): void {
        const currentLine = this.getCurrentLine()
        if (this.rows > 1 && currentLine > 1) return

        event.preventDefault()
        if (this.lastCommandNumber === null && this.lastCommands.length) {
            this.lastCommandNumber = this.lastCommands.length - 1
            this.gcode = this.lastCommands[this.lastCommandNumber]
        } else if (this.lastCommandNumber && this.lastCommandNumber > 0) {
            this.lastCommandNumber--
            this.gcode = this.lastCommands[this.lastCommandNumber]
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        const currentLine = this.getCurrentLine()
        if (this.rows > currentLine) return

        event.preventDefault()

        if (this.lastCommandNumber === null) return

        if (this.lastCommandNumber < this.lastCommands.length - 1) {
            this.lastCommandNumber++
            this.gcode = this.lastCommands[this.lastCommandNumber]
        } else if (this.lastCommandNumber === this.lastCommands.length - 1) {
            this.lastCommandNumber = null
            this.gcode = ''
        }
    }

    doSend(cmd: KeyboardEvent) {
        if (cmd?.shiftKey) {
            this.gcode += '\n'
            return
        }

        if (this.gcode === '') return

        this.$store.dispatch('printer/sendGcode', this.gcode)
        this.$store.dispatch('gui/gcodehistory/addToHistory', this.gcode)
        this.gcode = ''
        this.lastCommandNumber = null
    }

    onAutocomplete(e: Event): void {
        e.preventDefault()

        if (!this.gcode.length) return

        const textarea = this.gcodeCommandField.$refs.input
        const currentPosition = textarea.selectionStart
        const beforeCursor = this.gcode.substring(0, currentPosition)
        const lastNewlineIndex = beforeCursor.lastIndexOf('\n')
        const currentLine = beforeCursor.substring(lastNewlineIndex + 1)

        const currentLineUpperCase = currentLine.toUpperCase()
        const commands = this.helplist.filter((element) => element.command.startsWith(currentLineUpperCase))

        if (commands.length === 0) return

        if (commands?.length === 1) {
            this.updateGcode(commands[0].command, lastNewlineIndex, currentPosition)
            return
        }

        const longestCommon = commands.reduce((acc, val) => {
            return strLongestEqual(acc, val.command)
        }, commands[0].command)

        let output = ''
        commands.forEach(
            (command) => (output += `<a class="command font-weight-bold">${command.command}</a>: ${command.help}<br />`)
        )

        this.$store.dispatch('server/addEvent', { message: output, type: 'autocomplete' })

        this.updateGcode(longestCommon, lastNewlineIndex, currentPosition)
    }

    updateGcode(text: string, start: number, end: number) {
        this.gcode = this.gcode.substring(0, start + 1) + text + this.gcode.substring(end)
    }
}
</script>

<style scoped>
.gcode-command-field {
    font-family: 'Roboto Mono', monospace;
}

.custom-premium-input ::v-deep .v-input__slot {
    background: rgba(0, 0, 0, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 6px !important;
    min-height: 44px !important;
    padding-top: 4px !important;
}

.custom-premium-input ::v-deep fieldset {
    border: none !important;
}

.custom-premium-input ::v-deep label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5) !important;
}

.custom-premium-input ::v-deep textarea {
    color: #e0e0e0 !important;
    font-size: 0.95rem;
    padding-top: 8px !important;
}

::v-deep .v-input__append-inner {
    margin-top: 6px !important;
}

::v-deep .v-input__append-inner .v-icon.blocks-send-icon {
    background-image: url('/img/icons/blocks_icons/playsvg.svg') !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
    width: 20px !important;
    height: 20px !important;
    opacity: 0.8 !important;
    transition: opacity 0.2s;
}

::v-deep .v-input__append-inner .v-icon.blocks-send-icon:hover {
    opacity: 1 !important;
}

::v-deep .v-icon.blocks-send-icon svg,
::v-deep .v-icon.blocks-send-icon::before {
    display: none !important;
}
</style>