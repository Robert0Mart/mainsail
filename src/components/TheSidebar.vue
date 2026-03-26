<template>
    <v-navigation-drawer
        v-model="naviDrawer"
        app
        permanent
        clipped
        mini-variant
        mini-variant-width="0"
        style="overflow: hidden; border: none; display: none !important;"
    >
    </v-navigation-drawer>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import NavigationMixin from '@/components/mixins/navigation'
import ThemeMixin from '@/components/mixins/theme'

@Component
export default class TheSidebar extends Mixins(NavigationMixin, BaseMixin, ThemeMixin) {
    // Mantém o estado lógico aberto para carregar os dados das páginas
    get naviDrawer(): boolean { return true }
    set naviDrawer(newVal) { }
}
</script>