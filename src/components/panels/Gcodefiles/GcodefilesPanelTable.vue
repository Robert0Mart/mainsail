<template>
    <v-data-table
        v-model="selectedFiles"
        :items="files"
        class="files-table elevation-0 custom-data-table"
        :headers="filteredHeaders"
        :custom-sort="sortFiles"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :items-per-page.sync="countPerPage"
        :footer-props="{
            itemsPerPageText: $t('Files.Files'),
            itemsPerPageAllText: $t('Files.AllFiles'),
            itemsPerPageOptions: [10, 25, 50, 100, -1],
        }"
        item-key="filename"
        :search="search"
        :custom-filter="advancedSearch"
        :item-class="() => 'dark-wrapper'"
        mobile-breakpoint="0"
        show-select
        @current-items="refreshMetadata">
        
        <template #no-data>
            <div class="text-center pa-4 grey--text">{{ $t('Files.Empty') }}</div>
        </template>

        <template v-if="currentPath !== ''" #body.prepend>
            <gcodefiles-panel-table-row-back />
        </template>

        <template #item="{ index, item, isSelected, select }">
            <gcodefiles-panel-table-row-file
                v-if="!item.isDirectory"
                :key="`${index} ${item.filename}`"
                :item="item"
                :is-selected="isSelected"
                :select="select" />
            <gcodefiles-panel-table-row-directory
                v-else
                :key="`${index} ${item.filename}`"
                :item="item"
                :is-selected="isSelected"
                :select="select" />
        </template>
    </v-data-table>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { sortFiles } from '@/plugins/helpers'
import { FileStateGcodefile } from '@/store/files/types'
import GcodefilesMixin from '@/components/mixins/gcodefiles'
import GcodefilesPanelTableRowBack from '@/components/panels/Gcodefiles/GcodefilesPanelTableRowBack.vue'
import GcodefilesPanelTableRowDirectory from '@/components/panels/Gcodefiles/GcodefilesPanelTableRowDirectory.vue'
import GcodefilesPanelTableRowFile from '@/components/panels/Gcodefiles/GcodefilesPanelTableRowFile.vue'

@Component({
    components: {
        GcodefilesPanelTableRowBack,
        GcodefilesPanelTableRowDirectory,
        GcodefilesPanelTableRowFile,
    },
})
export default class GcodefilesPanelTable extends Mixins(BaseMixin, GcodefilesMixin) {
    sortFiles = sortFiles

    get sortBy() {
        return this.$store.state.gui.view.gcodefiles.sortBy ?? 'modified'
    }

    set sortBy(newVal) {
        if (newVal === undefined) newVal = 'modified'
        this.$store.dispatch('gui/saveSetting', { name: 'view.gcodefiles.sortBy', value: newVal })
    }

    get sortDesc() {
        return this.$store.state.gui.view.gcodefiles.sortDesc ?? true
    }

    set sortDesc(newVal) {
        if (newVal === undefined) newVal = false
        this.$store.dispatch('gui/saveSetting', { name: 'view.gcodefiles.sortDesc', value: newVal })
    }

    get countPerPage() {
        return this.$store.state.gui.view.gcodefiles.countPerPage ?? 10
    }

    set countPerPage(newVal) {
        this.$store.dispatch('gui/saveSetting', { name: 'view.gcodefiles.countPerPage', value: newVal })
    }

    advancedSearch(value: any, search: string | null) {
        if (search === null) return false
        if (typeof value !== 'string') return false

        value = value.toString().toLowerCase()
        const searchSplits = search.toLowerCase().split(' ')
        for (const searchWord of searchSplits) {
            if (!value.includes(searchWord)) return false
        }
        return true
    }

    refreshMetadata(data: FileStateGcodefile[]) {
        const items = data.filter((file) => !file.isDirectory && !file.metadataRequested && !file.metadataPulled)
        this.$store.dispatch(
            'files/requestMetadata',
            items.map((file: FileStateGcodefile) => ({
                filename: 'gcodes' + this.currentPath + '/' + file.filename,
            }))
        )
    }
}
</script>

<style scoped>
/* FIX FOR THE TOP CORNERS SHOWN IN YOUR IMAGE */
.custom-data-table {
    background-color: transparent !important;
    /* This rounds the actual container edges */
    border-radius: 12px !important; 
    overflow: hidden !important;
}

/* 1. Create a clear physical gap between rows */
.files-table ::v-deep table {
    border-collapse: separate !important;
    border-spacing: 0 12px !important; 
    padding: 0 16px; 
}

/* 2. Style the Table Header */
.files-table ::v-deep th {
    border-bottom: none !important;
    color: rgba(255, 255, 255, 0.5) !important;
    text-transform: uppercase;
    font-size: 0.7rem !important;
    padding-bottom: 4px !important;
}

/* 3. The "Dark Wrapper" Row Fix */
.files-table ::v-deep tr.dark-wrapper {
    background-color: #1e1e1e !important;
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 
                0px 2px 2px 0px rgba(0,0,0,0.14), 
                0px 1px 5px 0px rgba(0,0,0,0.12) !important;
}

/* 4. Cell cleanup & Individual Row Rounding */
.files-table ::v-deep tr.dark-wrapper td {
    border-bottom: none !important;
    background-color: transparent !important; 
    height: 54px;
}

/* Rounding the ends of the individual rows */
.files-table ::v-deep tr.dark-wrapper td:first-child {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
}

.files-table ::v-deep tr.dark-wrapper td:last-child {
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
}

/* 5. Hover Effect */
.files-table ::v-deep tr.dark-wrapper:hover {
    background-color: #2a2a2a !important;
    cursor: pointer;
}

/* 6. REMOVE VUETIFY LINES (Crucial for your screenshot) */
.files-table ::v-deep .v-data-table__wrapper > table > tbody > tr > td {
    border-bottom: none !important;
}
</style>