<template>
    <div>
        <v-row class="py-3">
            <v-col class="pl-6">
                <strong class="text-subtitle-1 white--text">{{ name }}</strong>
                <br />
                <template v-if="type === 'git_repo' && commitsBehind.length">
                    <a class="info--text cursor--pointer" @click="boolShowCommitList = true">
                        <v-icon small color="info" class="mr-1">{{ mdiUpdate }}</v-icon>
                        <span class="text-caption font-weight-bold" style="color: #00E5FF !important; opacity: 0.9;">{{ versionOutput }}</span>
                    </a>
                </template>
                <template v-else-if="type === 'web' && semverUpdatable">
                    <a class="info--text text-decoration-none" :href="webLinkRelease" target="_blank">
                        <v-icon small color="info" class="mr-1">{{ mdiUpdate }}</v-icon>
                        <span class="text-caption font-weight-bold" style="color: #00E5FF !important; opacity: 0.9;">{{ versionOutput }}</span>
                    </a>
                </template>
                <span v-else class="text-caption grey--text text--lighten-1">{{ versionOutput }}</span>
            </v-col>
            <v-col class="col-auto pr-6 text-right" align-self="center">
                <v-chip
                    v-if="anomalies.length > 0"
                    small
                    label
                    :outlined="!toggleAnomalies"
                    color="grey"
                    class="minwidth-0 px-1 mr-2 custom-chip-transparent"
                    @click="toggleAnomalies = !toggleAnomalies">
                    <img :src="infoIcon" class="custom-icon-14px anomalies-filter">
                </v-chip>

                <template v-if="!isValid">
                    <v-menu :offset-y="true">
                        <template #activator="{ on, attrs }">
                            <v-chip
                                small
                                label
                                outlined
                                :style="{ color: btnColor, borderColor: btnColor }"
                                :disabled="btnDisabled"
                                class="minwidth-0 px-3 text-uppercase font-weight-bold custom-status-chip"
                                v-bind="attrs"
                                v-on="on">
                                <img :src="troubleShootingIcon" class="custom-icon-14px">
                                {{ btnText }}
                                <v-icon small :style="{ color: btnColor }">{{ mdiMenuDown }}</v-icon>
                            </v-chip>
                        </template>
                        <v-list dense class="py-0">
                            <v-list-item v-if="!isCorrupt" @click="doRecovery(false)">
                                <v-list-item-icon class="mr-0 pt-1"><v-icon small>{{ mdiReload }}</v-icon></v-list-item-icon>
                                <v-list-item-content><v-list-item-title>{{ $t('Machine.UpdatePanel.SoftRecovery') }}</v-list-item-title></v-list-item-content>
                            </v-list-item>
                            <v-list-item :disabled="!existsRecoveryUrl" @click="doRecovery(true)">
                                <v-list-item-icon class="mr-0 pt-1"><v-icon small>{{ mdiReload }}</v-icon></v-list-item-icon>
                                <v-list-item-content><v-list-item-title>{{ $t('Machine.UpdatePanel.HardRecovery') }}</v-list-item-title></v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>

                <v-chip
                    v-else
                    small
                    label
                    outlined
                    :style="{ color: btnColor, borderColor: btnColor }"
                    :disabled="btnDisabled"
                    class="minwidth-0 px-3 text-uppercase font-weight-bold custom-status-chip"
                    @click="clickUpdate">
                    <v-icon v-if="btnIcon !== mdiCheck" small class="mr-1" :style="{ color: btnColor }">{{ btnIcon }}</v-icon>
                    <v-icon v-else-if="btnIcon === mdiCheck" small class="mr-1" :style="{ color: btnColor }">{{ mdiCheck }}</v-icon>
                    {{ btnText }}
                </v-chip>
            </v-col>
        </v-row>
        
        <v-row v-if="warnings.length" class="mt-0">
            <v-col class="px-6 pt-0 pb-3">
                <v-alert
                    v-for="(message, index) in warnings"
                    :key="'warnings_' + index"
                    dense
                    class="mb-0 custom-status-alert"
                    border="left">
                    <template #prepend>
                        <img :src="troubleShootingIcon" class="custom-icon-14px mr-2">
                    </template>
                    <p class="mb-0 text-caption orange--text text--lighten-2">{{ message }}</p>
                </v-alert>
            </v-col>
        </v-row>

        <git-commits-list v-if="type === 'git_repo'" v-model="boolShowCommitList" :repo="repo" />
        <update-hint v-model="boolShowUpdateHint" :repo="repo" @open-commit-history="boolShowCommitList = true" @do-update="doUpdate" />
    </div>
</template>

<script lang="ts">
import InfoIconFile from "@/assets/styles/icons/infosvg.svg?url";
import TroubleShootingIconFile from "@/assets/styles/icons/troubleshoot_orangesvg.svg?url";
import { Component, Mixins, Prop } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import { ServerUpdateManagerStateGitRepo } from '@/store/server/updateManager/types'
import { mdiCloseCircle, mdiCheck, mdiHelpCircleOutline, mdiMenuDown, mdiProgressUpload, mdiReload, mdiUpdate } from '@mdi/js'
import semver from 'semver'
import GitCommitsList from '@/components/panels/Machine/UpdatePanel/GitCommitsList.vue'
import UpdateHint from '@/components/panels/Machine/UpdatePanel/UpdateHint.vue'

@Component({ components: { GitCommitsList, UpdateHint } })
export default class UpdatePanelEntry extends Mixins(BaseMixin) {
    mdiMenuDown = mdiMenuDown
    mdiReload = mdiReload
    mdiCloseCircle = mdiCloseCircle
    mdiUpdate = mdiUpdate
    mdiCheck = mdiCheck
    infoIcon = InfoIconFile;
    troubleShootingIcon = TroubleShootingIconFile;
    boolShowCommitList = false
    boolShowUpdateHint = false
    toggleAnomalies = false

    @Prop({ required: true }) readonly repo!: ServerUpdateManagerStateGitRepo

    get name() {
        const info_tags = this.repo.info_tags ?? []
        const description = info_tags.find((tag) => tag.startsWith('desc='))
        return (description && description.trim() !== 'desc=') ? description.replace('desc=', '').trim() : (this.repo.name ?? 'UNKNOWN')
    }
    get type() { return this.repo.configured_type }
    get localVersion() { const v = this.repo.version ?? '?'; return semver.valid(v, { loose: true }) ? v : null }
    get remoteVersion() { const v = this.repo.remote_version ?? '?'; return semver.valid(v, { loose: true }) ? v : null }
    get commitsBehind() { return this.repo.commits_behind ?? [] }
    get versionOutput() {
        if (this.semverUpdatable) return `${this.localVersion} > ${this.remoteVersion}`
        if (this.commitsBehind.length) return `${this.localVersion} > ${this.commitsBehind.length} commits`
        return this.repo.full_version_string ?? this.repo.version ?? 'UNKNOWN'
    }
    get isValid() { return this.repo.is_valid ?? true }
    get isDirty() { return this.repo.is_dirty ?? false }
    get isCorrupt() { return this.repo.configured_type === 'git_repo' && (this.repo.corrupt ?? false) }
    get isDetached() { return this.repo.configured_type === 'git_repo' && !(this.repo.debug_enabled ?? false) && (this.repo.detached ?? false) }
    get btnDisabled() {
        if (['printing', 'paused'].includes(this.printer_state)) return true
        if (!this.isValid || this.isCorrupt || this.isDirty || this.commitsBehind.length) return false
        return !this.semverUpdatable
    }
    get btnIcon() {
        if (this.isDetached || !this.isValid || this.isCorrupt || this.isDirty) return mdiCloseCircle
        if (this.semverUpdatable || this.commitsBehind.length) return mdiProgressUpload
        return mdiCheck
    }
    get btnColor() {
        if (this.isCorrupt || this.isDetached || this.isDirty || !this.isValid) return '#FFB300'
        if (this.semverUpdatable || this.commitsBehind.length > 0) return '#00E5FF'
        return '#00E676'
    }
    get btnText() {
        if (this.isCorrupt) return this.$t('Machine.UpdatePanel.Corrupt')
        if (this.isDetached) return this.$t('Machine.UpdatePanel.Detached')
        if (this.isDirty) return this.$t('Machine.UpdatePanel.Dirty')
        if (!this.isValid) return this.$t('Machine.UpdatePanel.Invalid')
        if (this.semverUpdatable || this.commitsBehind.length) return this.$t('Machine.UpdatePanel.Update')
        return this.$t('Machine.UpdatePanel.UpToDate')
    }
    get warnings() { return this.repo.warnings ?? [] }
    get anomalies() { return this.repo.anomalies ?? [] }
    get semverUpdatable() { return this.localVersion && this.remoteVersion && semver.gt(this.remoteVersion, this.localVersion, { loose: true }) }
    get githubRepoUrl() { return `https://github.com/${this.repo.owner}/${this.repo.repo_name ?? this.repo.name}` }
    get webLinkRelease() { return `${this.githubRepoUrl}/releases/tag/${this.repo.remote_version}` }
    get pythonChangelog() { return this.repo.changelog_url ?? this.webLinkRelease }
    clickUpdate() { if (this.$store.state.gui.uiSettings.hideUpdateWarnings) this.doUpdate(); else this.boolShowUpdateHint = true }
    doUpdate() {
        const cmd = ['klipper', 'moonraker'].includes(this.repo.name) ? 'machine.update.' + this.repo.name : 'machine.update.client'
        this.$socket.emit(cmd, ['klipper', 'moonraker'].includes(this.repo.name) ? {} : { name: this.repo.name })
    }
}
</script>

<style scoped>
.custom-icon-14px { width: 14px; height: 14px; object-fit: contain; vertical-align: middle; }
.anomalies-filter { filter: brightness(0) invert(1); }
.custom-status-chip {
    background-color: rgba(255, 255, 255, 0.03) !important;
    border-width: 1.5px !important;
    letter-spacing: 0.5px;
    filter: brightness(1.15) saturate(1.1);
}
.custom-status-alert {
    background-color: rgba(255, 179, 0, 0.05) !important;
    border-color: #FFB300 !important;
    border-left-width: 3px !important;
}
.custom-chip-transparent {
    background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>