<template>
    <v-card class="history-statistics-panel mb-6" flat style="background: transparent;">
        <v-card-title class="pa-0 mb-4 d-flex align-center">
            <img 
                :src="mdiChartAreaspline" 
                style="width: 24px; height: 24px; margin-right: 12px; filter: brightness(0) invert(1);" 
                alt="Statistics Icon"
            />
            <span class="text-h6 font-weight-bold">{{ $t('History.Statistics') }}</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="collapsed = !collapsed">
                <v-icon>{{ collapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
            </v-btn>
        </v-card-title>

        <v-expand-transition>
            <div v-show="!collapsed">
                <v-row>
                    <v-col v-for="total in totals" :key="total.title" cols="6" sm="4" md="auto" class="flex-grow-1">
                        <v-card outlined class="pa-3 d-flex flex-column justify-center align-center text-center" style="height: 100%; border-color: rgba(255, 255, 255, 0.1); background-color: rgba(255, 255, 255, 0.02);">
                            <span class="text-caption grey--text text--lighten-1 mb-1 text-uppercase font-weight-medium" style="letter-spacing: 0.5px;">{{ total.title }}</span>
                            <span class="text-h5 font-weight-bold primary--text">{{ total.value }}</span>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row class="mt-4">
                    <v-col cols="12" md="6">
                        <v-card outlined class="pa-4 d-flex flex-column" style="height: 100%; border-color: rgba(255, 255, 255, 0.1); background-color: rgba(255, 255, 255, 0.02);">
                            <div class="d-flex justify-space-between align-center mb-4">
                                <v-btn-toggle v-model="toggleValue" small mandatory>
                                    <v-btn v-for="option in toggleValueOptions" :key="option.value" small :value="option.value">
                                        {{ option.text }}
                                    </v-btn>
                                </v-btn-toggle>
                                
                                <div class="d-flex align-center">
                                    <v-btn-toggle v-model="togglePrintStatus" small mandatory class="mr-2">
                                        <v-btn small value="chart">{{ $t('History.Chart') }}</v-btn>
                                        <v-btn small value="table">{{ $t('History.Table') }}</v-btn>
                                    </v-btn-toggle>

                                    <v-tooltip v-if="!allLoaded" top>
                                        <template #activator="{ on, attrs }">
                                            <v-btn
                                                outlined
                                                small
                                                :loading="loadings.includes('historyLoadAll')"
                                                class="minwidth-0 px-2"
                                                color="primary"
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="refreshHistory">
                                                <v-icon small>{{ mdiDatabaseArrowDownOutline }}</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ $t('History.LoadCompleteHistory') }}</span>
                                    </v-tooltip>
                                </div>
                            </div>
                            
                            <div class="flex-grow-1 d-flex align-center justify-center">
                                <history-all-print-status-chart v-if="togglePrintStatus === 'chart'" :value-name="toggleValue" style="width: 100%;" />
                                <history-all-print-status-table v-else :value-name="toggleValue" style="width: 100%;" />
                            </div>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-card outlined class="pa-4 d-flex flex-column" style="height: 100%; border-color: rgba(255, 255, 255, 0.1); background-color: rgba(255, 255, 255, 0.02);">
                            <div class="d-flex justify-center mb-4">
                                <v-btn-toggle v-model="toggleChart" small mandatory>
                                    <v-btn small value="filament_usage">{{ $t('History.FilamentUsage') }}</v-btn>
                                    <v-btn small value="printtime_avg">{{ $t('History.PrinttimeAvg') }}</v-btn>
                                </v-btn-toggle>
                            </div>
                            
                            <div class="flex-grow-1 d-flex align-center justify-center">
                                <history-filament-usage v-if="toggleChart === 'filament_usage'" style="width: 100%;" />
                                <history-printtime-avg v-else-if="toggleChart === 'printtime_avg'" style="width: 100%;" />
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import HistoryFilamentUsage from '@/components/charts/HistoryFilamentUsage.vue'
import HistoryPrinttimeAvg from '@/components/charts/HistoryPrinttimeAvg.vue'
import HistoryAllPrintStatusChart from '@/components/charts/HistoryAllPrintStatusChart.vue'
import {
    HistoryStatsValueNames,
    ServerHistoryStateJob,
    ServerHistoryStateJobAuxiliaryTotal,
} from '@/store/server/history/types'

import statisticssvg from '@/assets/styles/icons/statisticssvg.svg'
import { mdiDatabaseArrowDownOutline } from '@mdi/js'
import { formatPrintTime } from '@/plugins/helpers'
import HistoryMixin from '@/components/mixins/history'
import { TranslateResult } from 'vue-i18n'

@Component({
    components: { HistoryFilamentUsage, HistoryPrinttimeAvg, HistoryAllPrintStatusChart },
})
export default class HistoryStatisticsPanel extends Mixins(BaseMixin, HistoryMixin) {
    mdiChartAreaspline = statisticssvg
    mdiDatabaseArrowDownOutline = mdiDatabaseArrowDownOutline
    formatPrintTime = formatPrintTime

    collapsed = false
    toggleValue = 'jobs'

    get toggleValueOptions(): { text: TranslateResult; value: HistoryStatsValueNames }[] {
        return [
            { text: this.$t('History.Jobs'), value: 'jobs' },
            { text: this.$t('History.Filament'), value: 'filament' },
            { text: this.$t('History.Time'), value: 'time' },
        ]
    }

    get existsSelectedJobs() {
        return this.selectedJobs.length > 0
    }

    get totalPrintTime() {
        return this.$store.state.server.history.job_totals?.total_print_time ?? 0
    }

    get selectedPrintTime() {
        let printtime = 0
        this.selectedJobs.forEach((job: ServerHistoryStateJob) => {
            printtime += job.print_duration
        })
        return printtime
    }

    get longestPrintTime() {
        return this.$store.state.server.history.job_totals?.longest_print ?? 0
    }

    get selectedLongestPrintTime() {
        let printtime = 0
        this.selectedJobs.forEach((job: ServerHistoryStateJob) => {
            if (job.print_duration > printtime) printtime = job.print_duration
        })
        return printtime
    }

    get avgPrintTime() {
        if (this.totalJobsCount > 0 && this.totalPrintTime > 0)
            return Math.round(this.totalPrintTime / this.totalJobsCount)
        return 0
    }

    get selectedAvgPrintTime() {
        if (this.selectedJobs.length > 0 && this.selectedPrintTime > 0)
            return Math.round(this.selectedPrintTime / this.selectedJobs.length)
        return 0
    }

    get totalFilamentUsed() {
        return this.$store.state.server.history.job_totals?.total_filament_used ?? 0
    }

    get totalFilamentUsedFormat() {
        const value = Math.round(this.totalFilamentUsed / 100) / 10
        return `${value} m`
    }

    get selectedFilamentUsed() {
        let filamentUsed = 0
        this.selectedJobs.forEach((job: ServerHistoryStateJob) => {
            filamentUsed += job.filament_used
        })
        return filamentUsed
    }

    get selectedFilamentUsedFormat() {
        const value = Math.round(this.selectedFilamentUsed / 100) / 10
        return `${value} m`
    }

    get totalJobsCount() {
        return this.$store.state.server.history.job_totals?.total_jobs ?? 0
    }

    get toggleChart() {
        return this.$store.state.gui.view.history.toggleChartCol3
    }

    set toggleChart(newVal) {
        this.$store.dispatch('gui/saveSetting', { name: 'view.history.toggleChartCol3', value: newVal })
    }

    get togglePrintStatus() {
        return this.$store.state.gui.view.history.toggleChartCol2
    }

    set togglePrintStatus(newVal) {
        this.$store.dispatch('gui/saveSetting', { name: 'view.history.toggleChartCol2', value: newVal })
    }

    get allLoaded() {
        return this.$store.state.server.history.all_loaded ?? false
    }

    get selectedTotals() {
        const output: { title: string; value: string }[] = [
            { title: this.$t('History.SelectedPrinttime') as string, value: this.formatPrintTime(this.selectedPrintTime, false) },
            { title: this.$t('History.LongestPrinttime') as string, value: this.formatPrintTime(this.selectedLongestPrintTime, false) },
            { title: this.$t('History.AvgPrinttime') as string, value: this.formatPrintTime(this.selectedAvgPrintTime, false) },
            { title: this.$t('History.SelectedFilamentUsed') as string, value: this.selectedFilamentUsedFormat },
            { title: this.$t('History.SelectedJobs') as string, value: this.selectedJobs.length.toString() },
        ]
        output.push(...this.auxiliarySelectedTotals)
        return output
    }

    get auxiliarySelectedTotals() {
        const output: { title: string; value: string }[] = []
        this.moonrakerHistoryFields.forEach((historyField) => {
            const value = this.selectedJobs.reduce((acc: number, job: ServerHistoryStateJob) => {
                const historyFieldName = historyField.name.replace('history_field_', '')
                const auxiliary_data = job.auxiliary_data?.find(
                    (auxiliary) => auxiliary.provider === historyField.provider && auxiliary.name === historyFieldName
                )
                if (!auxiliary_data || typeof auxiliary_data.value !== 'number') return acc
                return acc + auxiliary_data.value
            }, 0)
            output.push({ title: historyField.desc, value: `${Math.round(value * 1000) / 1000} ${historyField.unit}` })
        })
        return output
    }

    get genericTotals() {
        const output: { title: string; value: string }[] = [
            { title: this.$t('History.TotalPrinttime') as string, value: this.formatPrintTime(this.totalPrintTime, false) },
            { title: this.$t('History.LongestPrinttime') as string, value: this.formatPrintTime(this.longestPrintTime, false) },
            { title: this.$t('History.AvgPrinttime') as string, value: this.formatPrintTime(this.avgPrintTime, false) },
            { title: this.$t('History.TotalFilamentUsed') as string, value: this.totalFilamentUsedFormat },
            { title: this.$t('History.TotalJobs') as string, value: this.totalJobsCount.toString() },
        ]
        output.push(...this.auxiliaryTotals)
        return output
    }

    get auxiliaryTotals() {
        const auxiliaries = this.$store.state.server.history.auxiliary_totals ?? []
        const output: { title: string; value: string }[] = []
        auxiliaries.forEach((auxiliary: ServerHistoryStateJobAuxiliaryTotal) => {
            const historyFieldName = `history_field_${auxiliary.field}`
            const historyField = this.moonrakerHistoryFields.find(
                (historyField) => historyField.provider === auxiliary.provider && historyField.name === historyFieldName
            )
            const value = Math.round((auxiliary.total ?? 0) * 1000) / 1000
            output.push({ title: historyField?.desc ?? auxiliary.field, value: `${value} ${historyField?.unit}` })
        })
        return output
    }

    get totals() {
        return this.existsSelectedJobs ? this.selectedTotals : this.genericTotals
    }

    refreshHistory() {
        this.$store.dispatch('socket/addLoading', { name: 'historyLoadAll' })
        this.$socket.emit('server.history.list', { start: 0, limit: 50 }, { action: 'server/history/getHistory' })
    }
}
</script>