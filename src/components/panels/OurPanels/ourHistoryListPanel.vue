<template>
  <v-card class="unified-history-panel pa-6">
    <v-row align="center" class="mb-6" dense>
      <v-col cols="12" md="auto" class="d-flex align-center">
        <v-icon color="white" class="mr-3">{{ mdiFileDocumentMultipleOutline }}</v-icon>
        <span class="text-h6 font-weight-bold white--text">{{ $t('History.PrintHistory') }}</span>
      </v-col>

      <v-col cols="12" md="4" class="mx-md-6 mt-4 mt-md-0">
        <v-text-field
          v-model="search"
          :append-icon="mdiMagnify"
          :label="$t('History.Search')"
          single-line
          outlined
          clearable
          hide-details
          dense
          class="dashboard-search-input"
        ></v-text-field>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" md="auto" class="d-flex align-center justify-end gap-2 mt-4 mt-md-0">
        <v-fade-transition>
          <v-btn v-if="selectedJobsTable.length" color="error" depressed small @click="deleteSelectedDialog = true" class="mr-2 rounded-lg font-weight-bold">
            <v-icon left small>{{ mdiDelete }}</v-icon>
            {{ $t('Buttons.Delete') }}
          </v-btn>
        </v-fade-transition>

        <v-btn icon color="grey lighten-1" @click="addMaintenanceDialog = true"><v-icon>{{ mdiNotebookPlus }}</v-icon></v-btn>
        <v-btn icon color="primary" :loading="loadings.includes('historyLoadAll')" @click="refreshHistory"><v-icon>{{ mdiDatabaseArrowDownOutline }}</v-icon></v-btn>
        <v-btn icon color="grey lighten-1" @click="exportHistory"><v-icon>{{ mdiDatabaseExportOutline }}</v-icon></v-btn>
        
        <v-menu offset-y :close-on-content-click="false" content-class="dashboard-menu-shadow">
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" color="grey lighten-1"><v-icon>{{ mdiCog }}</v-icon></v-btn>
          </template>
          <v-list dense class="dark-settings-list pa-2">
            <v-subheader class="grey--text text-uppercase font-weight-bold" style="font-size: 0.7rem;">Configuração</v-subheader>
            <v-list-item v-for="(header, index) in configHeaders" :key="index" class="minHeight36">
              <v-checkbox v-model="header.visible" dense hide-details :label="header.text" color="primary" @change="changeColumnVisible(header.value)" />
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <v-data-table
      v-model="selectedJobsTable"
      :items="entries"
      :headers="filteredHeaders"
      :search="search"
      :items-per-page.sync="countPerPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :item-class="() => 'dark-wrapper'"
      item-key="select_id"
      show-select
      class="dashboard-table"
      mobile-breakpoint="0"
    >
      <template #item="{ item, isSelected, select }">
        <history-list-entry-job
          v-if="item.type === 'job'"
          :is-selected="isSelected"
          :item="item"
          :table-fields="tableFields"
          @select="select" />
        <history-list-entry-maintenance
          v-else-if="item.type === 'maintenance'"
          :is-selected="isSelected"
          :item="item"
          :table-fields="tableFields"
          @select="select" />
      </template>
      
      <template #no-data>
        <div class="text-center pa-12 grey--text">
          <v-icon size="48" color="grey darken-2" class="mb-4">mdi-history</v-icon>
          <div class="text-body-1">{{ $t('History.Empty') }}</div>
        </div>
      </template>
    </v-data-table>

    <confirmation-dialog v-model="deleteSelectedDialog" :title="$t('History.Delete')" :text="deleteSelectedQuestion" @action="deleteSelectedJobs" />
    <history-list-panel-add-maintenance v-model="addMaintenanceDialog" />
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import HistoryMixin from '@/components/mixins/history'
import HistoryStatsMixin from '@/components/mixins/historyStats'
import {
    mdiCog, mdiDatabaseArrowDownOutline, mdiDatabaseExportOutline,
    mdiDelete, mdiFileDocumentMultipleOutline, mdiMagnify, mdiNotebookPlus
} from '@mdi/js'

import HistoryListEntryJob from '@/components/panels/History/HistoryListEntryJob.vue'
import HistoryListEntryMaintenance from '@/components/panels/History/HistoryListEntryMaintenance.vue'
import HistoryListPanelAddMaintenance from '@/components/dialogs/HistoryListPanelAddMaintenance.vue'
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue'

@Component({
    components: {
        HistoryListEntryJob,
        HistoryListEntryMaintenance,
        HistoryListPanelAddMaintenance,
        ConfirmationDialog
    },
})
export default class OurHistoryListPanel extends Mixins(BaseMixin, HistoryMixin, HistoryStatsMixin) {
    mdiCog = mdiCog
    mdiDatabaseArrowDownOutline = mdiDatabaseArrowDownOutline
    mdiDatabaseExportOutline = mdiDatabaseExportOutline
    mdiDelete = mdiDelete
    mdiFileDocumentMultipleOutline = mdiFileDocumentMultipleOutline
    mdiMagnify = mdiMagnify
    mdiNotebookPlus = mdiNotebookPlus

    search = ''
    sortBy = 'start_time'
    sortDesc = true
    addMaintenanceDialog = false
    deleteSelectedDialog = false

    get entries() {
        let entries: any[] = []
        if (this.showPrintJobs) {
            entries = [...this.jobs].map((job) => ({ ...job, type: 'job', select_id: `job_${job.job_id}` }))
        }
        if (this.sortBy === 'start_time' && this.showMaintenanceEntries) {
            const maint = this.$store.getters['gui/maintenance/getEntries'] ?? []
            entries = [...entries, ...maint.map((e: any) => ({ ...e, type: 'maintenance', select_id: `maintenance_${e.id}` }))]
        }
        return entries
    }

    get headers() {
        return [
            { text: '', value: '', align: 'left', configable: false, visible: true },
            { text: this.$t('History.Filename').toString(), value: 'filename', align: 'left', configable: false, visible: true },
            { text: '', value: 'status', align: 'left', configable: false, visible: true },
            { text: this.$t('History.StartTime').toString(), value: 'start_time', align: 'left', configable: true, visible: true },
            { text: this.$t('History.PrintTime').toString(), value: 'print_duration', align: 'left', configable: true, visible: true },
            { text: this.$t('History.FilamentUsed').toString(), value: 'filament_used', align: 'left', configable: true, visible: true },
            { text: this.$t('History.Slicer').toString(), value: 'slicer', align: 'left', configable: true, visible: true },
        ]
    }

    get filteredHeaders() { return this.headers.filter((h: any) => h.visible) }
    get configHeaders() { return this.headers.filter((h: any) => h.configable) }
    get tableFields() { return this.filteredHeaders.filter((col: any) => !['filename', 'status'].includes(col.value) && col.value !== '') }

    get selectedJobsTable() { return this.$store.state.gui.view.history.selectedJobs ?? [] }
    set selectedJobsTable(val) { this.$store.dispatch('gui/saveSetting', { name: 'view.history.selectedJobs', value: val }) }
    get countPerPage() { return this.$store.state.gui.view.history.countPerPage ?? 10 }
    set countPerPage(val) { this.$store.dispatch('gui/saveSetting', { name: 'view.history.countPerPage', value: val }) }
    get showMaintenanceEntries() { return this.$store.state.gui.view.history.showMaintenanceEntries }
    get showPrintJobs() { return this.$store.state.gui.view.history.showPrintJobs }

    refreshHistory() {
        this.$store.dispatch('socket/addLoading', { name: 'historyLoadAll' })
        this.$socket.emit('server.history.list', { start: 0, limit: 50 }, { action: 'server/history/getHistory' })
    }

    changeColumnVisible(name: string) {
        const header = this.headers.find(h => h.value === name)
        if (header) this.$store.dispatch('gui/setHistoryColumns', { name: name, value: header.visible })
    }

    deleteSelectedJobs() {
        this.selectedJobsTable.forEach((item: any) => {
            if (item.type === 'maintenance') this.$store.dispatch('gui/maintenance/delete', item.id)
            else if ('job_id' in item) this.$socket.emit('server.history.delete_job', { uid: item.job_id }, { action: 'server/history/getDeletedJobs' })
        })
        this.selectedJobsTable = []
    }

    get deleteSelectedQuestion() {
        return this.selectedJobsTable.length === 1 
            ? this.$t('History.DeleteSingleJobQuestion').toString() 
            : this.$t('History.DeleteSelectedQuestion', { count: this.selectedJobsTable.length }).toString()
    }
}
</script>

<style scoped>
.unified-history-panel {
    background-color: #212121 !important;
    border-radius: 15px !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    box-shadow: 0 15px 35px rgba(0,0,0,0.4) !important;
}

.dashboard-search-input ::v-deep .v-input__slot {
    background-color: rgba(236, 2, 2, 0.3) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 10px !important;
    padding-left: 12px !important;
}

.dashboard-table {
    background-color: transparent !important;
}

.dashboard-table ::v-deep table {
    border-collapse: separate !important;
    border-spacing: 0 10px !important;
    padding: 0 16px;
}

.dashboard-table ::v-deep th {
    border-bottom: none !important;
    color: rgba(255, 255, 255, 0.5) !important;
    text-transform: uppercase;
    font-size: 0.7rem !important;
    padding-bottom: 4px !important;
}

.dashboard-table ::v-deep tr.dark-wrapper {
    background-color: #1e1e1e !important;
    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2),
                0px 2px 2px 0px rgba(0,0,0,0.14),
                0px 1px 5px 0px rgba(0,0,0,0.12) !important;
}

.dashboard-table ::v-deep tr.dark-wrapper td {
    border-bottom: none !important;
    background-color: transparent !important;
    height: 54px;
}

.dashboard-table ::v-deep tr.dark-wrapper td:first-child {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
}

.dashboard-table ::v-deep tr.dark-wrapper td:last-child {
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
}

.dashboard-table ::v-deep tr.dark-wrapper:hover {
    background-color: #2a2a2a !important;
    cursor: pointer;
}

.dashboard-table ::v-deep .v-data-table__wrapper > table > tbody > tr > td {
    border-bottom: none !important;
}

.dark-settings-list {
    background-color: #1a1a1a !important;
    border-radius: 8px;
}

.dashboard-menu-shadow {
    box-shadow: 0 10px 20px rgba(0,0,0,0.5) !important;
}

.gap-2 { gap: 8px; }
</style>