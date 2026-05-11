<template>
    <panel :title="$t('Files.GCodeFiles')" :icon="'blocks-gcode-icon'" card-class="gcode-files-panel mt-4">
        <v-card-text class="pa-4 pb-0">
            <div class="dark-wrapper mb-8">
                <gcodefiles-panel-header class="mb-2" />
                <gcodefiles-panel-header-path-size />
            </div>
        </v-card-text>
        
        <div class="mx-4 mb-4">
            <gcodefiles-panel-table />
        </div>
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

/* Esconder o ícone original */
.gcode-files-panel ::v-deep .v-icon.blocks-gcode-icon svg,
.gcode-files-panel ::v-deep .v-icon.blocks-gcode-icon::before {
    display: none !important;
}

</style>