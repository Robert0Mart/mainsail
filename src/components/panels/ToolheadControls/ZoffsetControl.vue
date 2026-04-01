<template>
    <div v-if="false"></div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import ZoffsetMixin from '@/components/mixins/zoffset'

@Component
export default class ZoffsetControl extends Mixins(BaseMixin, ZoffsetMixin) {
    // Mantemos a lógica se necessário para evitar erros de dependência, 
    // mas o template acima garante que nada será desenhado no ecrã.
}
</script>

<style scoped>
/* Estilos removidos pois o componente não renderiza nada */
</style>