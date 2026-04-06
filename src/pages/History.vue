<template>
    <v-container fluid class="pa-4 pa-md-8">
        <v-row>
            <v-col cols="12">
                <history-statistics-panel />
            </v-col>
        </v-row>
        <v-row class="mt-4">
            <v-col cols="12">
                <history-list-panel />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import HistoryListPanel from '@/components/panels/HistoryListPanel.vue'
import HistoryStatisticsPanel from '@/components/panels/HistoryStatisticsPanel.vue'

@Component({
    components: { HistoryListPanel, HistoryStatisticsPanel },
})
export default class PageHistory extends Mixins(BaseMixin) {}
</script>