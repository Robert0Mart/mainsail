<template>
    <v-row no-gutters align="center" class="py-1">
        <v-col class="d-flex align-center flex-wrap">
            <div class="d-flex flex-column mr-4">
                <span class="custom-tiny-label">{{ $t('Files.CurrentPath') }}</span>
                <div class="path-nav-container">
                    <path-navigation
                        :path="currentPath"
                        :base-directory-label="'/gcodes'"
                        :on-segment-click="clickPathNavGoToDirectory" />
                </div>
            </div>
        </v-col>

        <v-spacer />

        <v-col cols="auto">
            <v-tooltip v-if="disk_usage !== null" top color="rgba(20, 20, 20, 0.95)">
                <template #activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on" class="d-flex flex-column align-end disk-usage-trigger">
                        <span class="custom-tiny-label">{{ $t('Files.FreeDisk') }}</span>
                        <span class="text-body-2 font-weight-bold primary--text">
                            {{ formatFilesize(disk_usage.free) }}
                        </span>
                    </div>
                </template>
                <div class="pa-2 custom-tooltip-content">
                    <div class="d-flex justify-space-between mb-1">
                        <span class="grey--text text--lighten-1 mr-4">{{ $t('Files.Used') }}:</span>
                        <span class="font-weight-medium">{{ formatFilesize(disk_usage.used) }}</span>
                    </div>
                    <div class="d-flex justify-space-between mb-1">
                        <span class="grey--text text--lighten-1 mr-4">{{ $t('Files.Free') }}:</span>
                        <span class="font-weight-medium success--text">{{ formatFilesize(disk_usage.free) }}</span>
                    </div>
                    <v-divider class="my-2" style="border-color: rgba(255,255,255,0.1) !important;" />
                    <div class="d-flex justify-space-between">
                        <span class="grey--text text--lighten-1 mr-4">{{ $t('Files.Total') }}:</span>
                        <span class="font-weight-medium">{{ formatFilesize(disk_usage.total) }}</span>
                    </div>
                </div>
            </v-tooltip>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import GcodefilesMixin from '@/components/mixins/gcodefiles'
import { formatFilesize } from '@/plugins/helpers'

@Component
export default class GcodefilesPanelHeaderPathSize extends Mixins(BaseMixin, GcodefilesMixin) {
    formatFilesize = formatFilesize

    get directory() {
        return this.$store.getters['files/getDirectory']('gcodes' + this.currentPath)
    }

    get disk_usage() {
        return this.directory?.disk_usage ?? { used: 0, free: 0, total: 0 }
    }

    clickPathNavGoToDirectory(segment: { location: string }) {
        this.currentPath = segment.location
    }
}
</script>

<style scoped>
.custom-tiny-label {
    font-size: 0.65rem !important;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 700;
    margin-bottom: 2px;
}

.path-nav-container {
    background-color: rgba(255, 255, 255, 0.03);
    padding: 2px 10px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    display: inline-flex;
    align-items: center;
}

.path-nav-container ::v-deep .path-navigation-segment {
    font-size: 0.85rem !important;
    color: #e0e0e0 !important;
}

.disk-usage-trigger {
    cursor: help;
    padding: 2px 8px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
}

.disk-usage-trigger:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.custom-tooltip-content {
    font-size: 0.8rem;
    min-width: 160px;
}
</style>