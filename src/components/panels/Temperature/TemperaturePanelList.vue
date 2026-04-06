<template>
    <responsive :breakpoints="{ mobile: (el) => el.width <= 395 }">
        <template #default="{ el }">
            <v-simple-table class="temperature-panel-table custom-glass-table">
                <thead>
                    <tr>
                        <th class="icon">&nbsp;</th>
                        <th class="name text-left">NAME</th>
                        <th v-if="!el.is.mobile" class="state text-right">STATE</th>
                        <th class="current text-right">CURRENT</th>
                        <th class="target text-right">TARGET</th>
                    </tr>
                </thead>
                <tbody>
                    <temperature-panel-list-item
                        v-for="objectName in heaterObjects"
                        :key="objectName"
                        :object-name="objectName"
                        :input-digits="inputDigits"
                        :is-responsive-mobile="el.is.mobile ?? false" />

                    <temperature-panel-list-item
                        v-for="objectName in sensorObjects"
                        :key="objectName"
                        :object-name="objectName"
                        :is-responsive-mobile="el.is.mobile ?? false" />
                </tbody>
            </v-simple-table>
        </template>
    </responsive>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import TemperaturePanelListItem from './TemperaturePanelListItem.vue'

@Component({
    components: { TemperaturePanelListItem }
})
export default class TemperaturePanelList extends Mixins(BaseMixin) {
    get available_heaters() { return this.$store.state.printer?.heaters?.available_heaters ?? [] }
    
    get heaterObjects() {
        const heaters = [...this.available_heaters]
        const printer = this.$store.state.printer
        Object.keys(printer).forEach(key => {
            if (key.startsWith('temperature_fan') && !heaters.includes(key)) heaters.push(key)
        })
        return this.filterNamesAndSort(heaters)
    }

    get sensorObjects() {
        const printer = this.$store.state.printer
        const heaters = this.heaterObjects
        const sensors = Object.keys(printer).filter(key => {
            const obj = printer[key]
            return obj && 
                   typeof obj === 'object' && 
                   'temperature' in obj && 
                   obj.temperature > 0 && // SÓ MOSTRA SE TIVER TEMPERATURA REAL
                   !heaters.includes(key) && 
                   !key.startsWith('_') &&
                   !key.toLowerCase().includes('stepper') &&
                   !key.toLowerCase().includes('extruder') // EVITA O EXTRUDER DUPLICADO
        })
        return this.filterNamesAndSort(sensors)
    }

    get inputDigits() { return 3 }
    filterNamesAndSort(fullNames: string[]) { return fullNames.filter(this.isVisibleName).sort(this.sortObjectName) }
    isVisibleName(fullName: string) { return !this.shortName(fullName).startsWith('_') }
    sortObjectName(a: string, b: string) { const nameA = this.shortName(a).toUpperCase(); const nameB = this.shortName(b).toUpperCase(); return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0) }
    shortName(fullName: string) { const splits = fullName.split(' '); return splits.length == 1 ? splits[0] : splits[1] }
}
</script>

<style scoped>
.custom-glass-table { background: transparent !important; }
.temperature-panel-table ::v-deep tr { border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important; }
.temperature-panel-table ::v-deep tr:last-child { border-bottom: none !important; }
.temperature-panel-table th { border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; color: rgba(255, 255, 255, 0.4) !important; text-transform: uppercase; font-size: 0.65rem; font-weight: 600; letter-spacing: 1px; }
</style>