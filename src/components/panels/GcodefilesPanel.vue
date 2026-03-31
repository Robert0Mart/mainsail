<template>
    <panel :title="$t('Files.GCodeFiles')" :icon="'blocks-gcode-icon'" card-class="gcode-files-panel">
        <v-card-text>
            <gcodefiles-panel-header />
            <gcodefiles-panel-header-path-size />
        </v-card-text>
        <v-divider class="mb-3" />
        <gcodefiles-panel-table />
    </panel>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import GcodefilesMixin from '@/components/mixins/gcodefiles'
import GcodefilesPanelHeader from '@/components/panels/Gcodefiles/GcodefilesPanelHeader.vue'
import { mdiFileDocumentMultipleOutline } from '@mdi/js'
import GcodefilesPanelHeaderPathSize from '@/components/panels/Gcodefiles/GcodefilesPanelHeaderPathSize.vue'

@Component({
    components: { GcodefilesPanelHeaderPathSize, GcodefilesPanelHeader },
})
export default class GcodefilesPanel extends Mixins(BaseMixin, GcodefilesMixin) {
    mdiFileDocumentMultipleOutline = mdiFileDocumentMultipleOutline
}
</script>

<style scoped>
/* INJEÇÃO DO ÍCONE DE FICHEIROS DA BLOCKS NO TÍTULO */
.gcode-files-panel ::v-deep .v-icon.blocks-gcode-icon {
    background-image: url('/img/icons/blocks_icons/file_iconsvg.svg') !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
    width: 24px !important;
    height: 24px !important;
    display: inline-block !important;
    opacity: 1 !important;
}

/* Esconder o ícone original (as folhas sobrepostas do sistema) */
.gcode-files-panel ::v-deep .v-icon.blocks-gcode-icon svg,
.gcode-files-panel ::v-deep .v-icon.blocks-gcode-icon::before {
    display: none !important;
}
</style>