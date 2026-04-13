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
                        v-for="name in filteredHeaterObjects"
                        :key="'h-' + name"
                        :object-name="name"
                        :input-digits="3"
                        :is-responsive-mobile="el.is.mobile ?? false" />

                    <temperature-panel-list-item
                        v-for="name in filteredSensorObjects"
                        :key="'s-' + name"
                        :object-name="name"
                        :is-responsive-mobile="el.is.mobile ?? false" />

                    <tr>
                        <td :colspan="el.is.mobile ? 4 : 5" class="text-center py-3 cursor-pointer" @click="toggleAdvancedMode">
                            <span class="white--text" style="opacity: 0.5; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">
                                {{ isAdvancedMode ? 'Show Less' : 'Show All' }}
                            </span>
                        </td>
                    </tr>
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
    isAdvancedMode = false

    toggleAdvancedMode() {
        this.isAdvancedMode = !this.isAdvancedMode
    }

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

    get filteredHeaterObjects() {
        if (this.isAdvancedMode) return this.heaterObjects
        return this.heaterObjects.slice(0, 3)
    }

    get filteredSensorObjects() {
        if (this.isAdvancedMode) return this.sensorObjects
        const remainingSlots = Math.max(0, 3 - this.heaterObjects.length)
        return this.sensorObjects.slice(0, remainingSlots)
    }
}
</script>

<style scoped>
.custom-glass-table { background: transparent !important; }
.temperature-panel-table ::v-deep tr { border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important; }
.temperature-panel-table th { border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; color: rgba(255, 255, 255, 0.4) !important; text-transform: uppercase; font-size: 0.65rem; font-weight: 600; letter-spacing: 1px; }
.cursor-pointer { cursor: pointer; transition: opacity 0.2s; }
.cursor-pointer:hover { opacity: 0.8; }
</style>