<template>
    <v-container fluid class="pa-4 pa-md-8">
        <v-row>
            <v-col cols="12">
                <our-history-statistics />
            </v-col>
        </v-row>
        <v-row class="mt-4">
            <v-col cols="12">
                <our-history-list-panel />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'

import OurHistoryListPanel from '@/components/panels/OurPanels/ourHistoryListPanel.vue'
import OurHistoryStatistics from '@/components/panels/OurPanels/ourHistoryStatistics.vue'

@Component({
    components: { 
        OurHistoryListPanel, 
        OurHistoryStatistics 
    },
})
export default class PageHistory extends Mixins(BaseMixin) {}
</script>