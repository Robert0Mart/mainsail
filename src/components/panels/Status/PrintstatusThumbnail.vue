<template>
    <div v-if="current_filename" ref="wrapper" class="statusPanel-printstatus-thumbnail">
        <v-container v-if="boolBigThumbnail" class="pa-0">
            <v-row no-gutters align="center" class="flex-nowrap">
                
                <v-col cols="4" sm="3" md="2" class="flex-shrink-0 pr-4">
                    <v-img
                        ref="bigThumbnail"
                        :src="thumbnailBig"
                        tabindex="-1"
                        class="statusPanel-big-thumbnail rounded"
                        contain
                        aspect-ratio="1.33"
                        style="max-width: 100%; height: auto;"
                        :style="thumbnailStyle"
                        @focus="focus = true"
                        @blur="focus = false" />
                </v-col>

                <v-col class="text-truncate">
                    <span class="subtitle-2 text-truncate px-0 text--disabled d-block">
                        <v-icon small class="mr-2">{{ mdiFileOutline }}</v-icon>
                        {{ current_filename }}
                    </span>
                </v-col>

            </v-row>
        </v-container>

        <template v-else>
            <v-container>
                <v-row>
                    <v-col
                        :class="thumbnailSmall ? 'py-3' : 'py-2'"
                        :style="thumbnailSmall ? 'width: calc(100% - 40px);' : ''">
                        <span class="subtitle-2 text-truncate d-block px-0 text--disabled">
                            <v-icon small class="mr-2">{{ mdiFileOutline }}</v-icon>
                            {{ current_filename }}
                        </span>
                    </v-col>
                    <v-col v-if="thumbnailSmall" class="pa-2 pl-0 col-auto">
                        <template v-if="thumbnailSmall && thumbnailBig">
                            <v-tooltip top content-class="tooltip__content-opacity1">
                                <template #activator="{ on, attrs }">
                                    <vue-load-image class="d-flex">
                                        <img
                                            slot="image"
                                            :src="thumbnailSmall"
                                            width="32"
                                            height="32"
                                            :alt="current_filename"
                                            v-bind="attrs"
                                            v-on="on" />
                                        <div slot="preloader">
                                            <v-progress-circular indeterminate color="primary" />
                                        </div>
                                        <div slot="error">
                                            <v-icon>{{ mdiFile }}</v-icon>
                                        </div>
                                    </vue-load-image>
                                </template>
                                <span><img :src="thumbnailBig" width="250" :alt="current_filename" /></span>
                            </v-tooltip>
                        </template>
                        <template v-else-if="thumbnailSmall">
                            <vue-load-image>
                                <img
                                    slot="image"
                                    :src="thumbnailSmall"
                                    width="32"
                                    height="32"
                                    :alt="current_filename" />
                                <div slot="preloader">
                                    <v-progress-circular indeterminate color="primary" />
                                </div>
                                <div slot="error">
                                    <v-icon>{{ mdiFile }}</v-icon>
                                </div>
                            </vue-load-image>
                        </template>
                    </v-col>
                </v-row>
            </v-container>
        </template>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins, Ref, Watch } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { defaultBigThumbnailBackground, thumbnailBigMin, thumbnailSmallMax, thumbnailSmallMin } from '@/store/variables'
import { mdiFileOutline, mdiFile } from '@mdi/js'
import { Debounce } from 'vue-debounce-decorator'
import { escapePath } from '@/plugins/helpers'
import Vue from 'vue'

@Component({})
export default class StatusPanelPrintstatusThumbnail extends Mixins(BaseMixin) {
    mdiFileOutline = mdiFileOutline
    mdiFile = mdiFile

    focus = false
    thumbnailFactor = 0
    resizeObserver: ResizeObserver | null = null

    @Ref() readonly wrapper!: HTMLDivElement
    @Ref() readonly bigThumbnail!: Vue

    get current_filename() { return this.$store.state.printer.print_stats?.filename ?? '' }
    get current_file() { return this.$store.state.printer.current_file ?? {} }

    get thumbnailBig() {
        if ('thumbnails' in this.current_file && this.current_file.thumbnails.length) {
            const thumbnail = this.current_file.thumbnails.find((thumb: any) => thumb.width >= thumbnailBigMin)
            if (thumbnail && 'relative_path' in thumbnail) {
                let relative_url = ''
                if (this.current_file.filename.lastIndexOf('/') !== -1) {
                    relative_url = this.current_file.filename.substr(0, this.current_file.filename.lastIndexOf('/') + 1)
                }
                return `${this.apiUrl}/server/files/gcodes/${escapePath(
                    relative_url + thumbnail.relative_path
                )}?timestamp=${this.current_file.modified}`
            }
        }
        return ''
    }

    get thumbnailBigHeight() {
        if ('thumbnails' in this.current_file && this.current_file.thumbnails.length) {
            const thumbnail = this.current_file.thumbnails.find((thumb: any) => thumb.width >= thumbnailBigMin)
            if (thumbnail && 'height' in thumbnail) return thumbnail.height
        }
        return 200
    }

    get thumbnailBigWidth() {
        if ('thumbnails' in this.current_file && this.current_file.thumbnails.length) {
            const thumbnail = this.current_file.thumbnails.find((thumb: any) => thumb.width >= thumbnailBigMin)
            if (thumbnail && 'width' in thumbnail) return thumbnail.width
        }
        return 300
    }

    get thumbnailSmall() {
        if ('thumbnails' in this.current_file && this.current_file.thumbnails.length) {
            const thumbnail = this.current_file.thumbnails.find(
                (thumb: any) =>
                    thumb.width >= thumbnailSmallMin &&
                    thumb.width <= thumbnailSmallMax &&
                    thumb.height >= thumbnailSmallMin &&
                    thumb.height <= thumbnailSmallMax
            )
            if (thumbnail && 'relative_path' in thumbnail) {
                let relative_url = ''
                if (this.current_file.filename.lastIndexOf('/') !== -1) {
                    relative_url = this.current_file.filename.substr(0, this.current_file.filename.lastIndexOf('/') + 1)
                }
                return `${this.apiUrl}/server/files/gcodes/${escapePath(
                    relative_url + thumbnail.relative_path
                )}?timestamp=${this.current_file.modified}`
            }
        }
        return ''
    }

    get boolBigThumbnail() {
        const setting = this.$store.state.gui.uiSettings.boolBigThumbnail ?? true
        return this.current_filename && setting && this.thumbnailBig
    }

    get bigThumbnailBackground() {
        return this.$store.state.gui.uiSettings.bigThumbnailBackground ?? defaultBigThumbnailBackground
    }

    get thumbnailStyle() {
        const output: { backgroundColor?: string } = {}
        if (defaultBigThumbnailBackground.toLowerCase() !== this.bigThumbnailBackground.toLowerCase()) {
            output.backgroundColor = this.bigThumbnailBackground
        }
        return output
    }

    get printstatusThumbnailZoom() {
        return this.$store.state.gui.uiSettings.printstatusThumbnailZoom ?? true
    }

    mounted() { this.setupResizeObserver() }
    beforeDestroy() { this.resizeObserver?.disconnect() }

    calcThumbnailFactor() {
        const thumbnailClientWidth = this.bigThumbnail?.$el.clientWidth ?? 0
        if (!thumbnailClientWidth || !this.thumbnailBigWidth) this.thumbnailFactor = 0
        return (this.thumbnailFactor = thumbnailClientWidth / this.thumbnailBigWidth)
    }

    setupResizeObserver() {
        this.resizeObserver?.disconnect()
        if (!this.wrapper) return
        this.resizeObserver = new ResizeObserver(() => this.handleResize())
        this.resizeObserver.observe(this.wrapper)
    }

    @Debounce(200)
    handleResize() {
        this.$nextTick(() => { this.calcThumbnailFactor() })
    }

    @Watch('current_filename')
    onCurrentFilenameChanged() {
        this.$nextTick(() => this.calcThumbnailFactor())
    }
}
</script>

<style scoped>
.statusPanel-big-thumbnail {
    transition: all 0.25s ease-out;
    border-radius: 6px;
}

.statusPanel-printstatus-thumbnail {
    position: relative;
}
</style>