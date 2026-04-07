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
                        v-for="name in heaterObjects"
                        :key="'h-' + name"
                        :object-name="name"
                        :input-digits="3"
                        :is-responsive-mobile="el.is.mobile ?? false" />

                    <temperature-panel-list-item
                        v-for="name in sensorObjects"
                        :key="'s-' + name"
                        :object-name="name"
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
    get heaterObjects() {
        const printer = this.$store.state.printer
        const heaters = [...(printer?.heaters?.available_heaters ?? [])]
        Object.keys(printer).forEach(key => {
            if (key.startsWith('temperature_fan') && !heaters.includes(key)) heaters.push(key)
        })
        return heaters.sort()
    }

    get sensorObjects() {
        const printer = this.$store.state.printer
        const heaters = this.heaterObjects
        
        return Object.keys(printer).filter(key => {
            const obj = printer[key]
            const name = key.toLowerCase()
            const hasTemp = obj && typeof obj === 'object' && 'temperature' in obj
            
            return hasTemp && 
                   !heaters.includes(key) && 
                   !name.includes('stepper') &&
                   (name.includes('sensor') || name.includes('mcu') || name.includes('host') || name.includes('pi') || name.includes('chamber')) &&
                   !key.startsWith('_')
        }).sort()
    }
}
</script>

<style scoped>
.custom-glass-table { background: transparent !important; }
.temperature-panel-table ::v-deep tr { border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important; }
.temperature-panel-table th { border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; color: rgba(255, 255, 255, 0.4) !important; text-transform: uppercase; font-size: 0.65rem; font-weight: 600; letter-spacing: 1px; }
</style>