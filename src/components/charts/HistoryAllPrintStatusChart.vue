<template>
    <e-chart
        ref="historyAllPrintStatus"
        v-observe-visibility="visibilityChanged"
        :option="chartOptions"
        :autoresize="true"
        :init-options="{ renderer: 'svg' }"
        style="height: 200px; width: 100%" />
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins, Prop, Ref, Watch } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ThemeMixin from '@/components/mixins/theme'
import HistoryStatsMixin from '@/components/mixins/historyStats'
import VueECharts from 'vue-echarts'
import type { ECharts } from 'echarts/core'
import { ECBasicOption } from 'echarts/types/dist/shared.d'
import { formatPrintTime } from '@/plugins/helpers'
import { HistoryStatsValueNames } from '@/store/server/history/types'

@Component({
    components: {},
})
export default class HistoryAllPrintStatusChart extends Mixins(BaseMixin, ThemeMixin, HistoryStatsMixin) {
    @Prop({ type: String, default: 'jobs' }) valueName!: HistoryStatsValueNames
    @Ref('historyAllPrintStatus') historyAllPrintStatus!: typeof VueECharts

    get coloredData() {
        return this.groupedPrintStatusArray.map((item: any) => {
            const name = (item.name || '').toLowerCase()
            
            // Estrutura base de um gradiente no ECharts
            let colorObj = {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 1,
                colorStops: [
                    { offset: 0, color: '#7f8c8d' }, // Cinza padrão para "Others"
                    { offset: 1, color: '#95a5a6' }
                ]
            }

            if (name === 'completed') {
                // GREEN
                colorObj.colorStops = [
                    { offset: 0, color: '#11998e' },
                    { offset: 1, color: '#38ef7d' }
                ]
            } else if (name === 'cancelled') {
                // BLUE
                colorObj.colorStops = [
                    { offset: 0, color: '#667eea' },
                    { offset: 1, color: '#764ba2' }
                ]
            } else if (name === 'interrupted') {
                // RED (Vermelho Vivo)
                colorObj.colorStops = [
                    { offset: 0, color: '#ff416c' },
                    { offset: 1, color: '#ff4b2b' }
                ]
            } else if (name === 'klippy_shutdown') {
                // DARK RED (Vermelho Escuro/Bordeaux para erro grave)
                colorObj.colorStops = [
                    { offset: 0, color: '#8b0000' },
                    { offset: 1, color: '#4a0000' }
                ]
            }

            return {
                ...item,
                itemStyle: { color: colorObj }
            }
        })
    }

    get chartOptions(): ECBasicOption {
        return {
            animation: false,
            grid: {
                top: 10,
                right: 0,
                bottom: 0,
                left: 10,
            },
            tooltip: {
                trigger: 'item',
                borderWidth: 0,
                valueFormatter: (value: number) => {
                    if (this.valueName === 'filament') {
                        if (value > 1000) return Math.round(value / 1000).toString() + ' m'
                        return value.toString() + ' mm'
                    }

                    if (this.valueName === 'time') {
                        return formatPrintTime(value, false)
                    }

                    return value.toString()
                },
            },
            series: [
                {
                    type: 'pie',
                    data: this.coloredData,
                    avoidLabelOverlap: false,
                    minAngle: 5,
                    radius: ['35%', '60%'],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                    label: {
                        color: this.fgColorHi,
                    },
                },
            ],
        }
    }

    get chart(): ECharts | null {
        return this.historyAllPrintStatus?.chart ?? null
    }

    beforeDestroy() {
        if (typeof window === 'undefined') return
        if (this.chart) this.chart.dispose()
    }

    @Watch('groupedPrintStatusArray')
    groupedPrintStatusArrayChanged() {
        this.chart?.setOption(
            {
                series: {
                    data: this.coloredData,
                },
            },
            false,
            true
        )
    }

    visibilityChanged(isVisible: boolean) {
        if (isVisible) this.chart?.resize()
    }
}
</script>