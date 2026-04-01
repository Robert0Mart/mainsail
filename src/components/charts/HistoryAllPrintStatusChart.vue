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
            
            // Cinza padrão para "Others" e estados desconhecidos
            let colorHex = '#4a4a4a' 

            if (name === 'completed') {
                colorHex = '#2ecc71' 
            } else if (name === 'cancelled') {
                colorHex = '#DC143C' // 
            } else if (name === 'interrupted') {
                colorHex = '#ff9500' 
            } else if (name === 'klippy_shutdown' || name === 'error') {
                colorHex = '#8B0000' 
            }

            return {
                ...item,
                itemStyle: { color: colorHex }
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
                backgroundColor: 'rgba(30, 30, 30, 0.9)', // Fundo do tooltip escuro e profissional
                textStyle: { color: '#fff' },
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
                    avoidLabelOverlap: true, // Garante que as etiquetas não se sobrepõem
                    minAngle: 5,
                    radius: ['45%', '70%'], // Aumentei o anel do donut para ficar mais elegante
                    itemStyle: {
                        borderColor: '#1e1e1e', // Adiciona uma borda fina entre as fatias
                        borderWidth: 2
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                    label: {
                        color: '#cccccc', // Etiquetas em cinza claro para ler bem no fundo preto
                        fontWeight: 500
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