<template>
  <div class="app-settings">
    <!-- Icon -->
    <div class="btn-icon-open open-trigger" @click="toggleModal()" :class="{ active: isOpen }">
      <font-awesome-icon icon="cog"></font-awesome-icon>
    </div>

    <!-- Modale -->
    <div v-show="isOpen" class="settings-modal">
      <div class="toolbar">
        <h2>{{ $t('settings') }}</h2>
        <div class="close-icon close-trigger btn-settings" @click="closeModal()">
          <font-awesome-icon icon="times-circle"></font-awesome-icon>
        </div>
      </div>
      <div class="content">
        <!-- Lang -->
        <div class="row language last-row">
          <div class="label">Language</div>
          <div class="value">
            <ul>
              <li
                v-for="language in languages"
                :key="language.id"
                class="btn-settings"
                :class="{ active: currentLanguage === language.id }"
                @click="changeLang(language.id)"
              >
                {{ language.name }}
              </li>
            </ul>
          </div>
        </div>
        <!-- Other Setting -->
        <div class="row inactive">
          <div class="label">Label</div>
          <div class="value">
            Value
          </div>
        </div>

        <!-- Other Setting -->
        <div class="row inactive">
          <div class="label">Label</div>
          <div class="value">
            Value
          </div>
        </div>

        <!-- last Setting -->
        <div class="row inactive">
          <div class="label">Label</div>
          <div class="value">
            Value
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SettingsStore } from '@/store'

@Component({})
export default class AppSettings extends Vue {
  private isOpen = false

  public languages = [
    {
      id: 'en',
      name: 'English',
    },
    {
      id: 'de',
      name: 'Deutsch',
    },
  ]

  get currentLanguage() {
    return SettingsStore.language
  }

  closeModal() {
    this.isOpen = false
  }

  openModal() {
    this.isOpen = true
  }

  toggleModal() {
    this.isOpen = !this.isOpen
  }

  changeLang(id: string) {
    SettingsStore.changeLanguage(id)
    this.$i18n.locale = id
    console.log('change Language to', id)
  }
}
</script>

<style lang="scss">
@import 'AppSettings';
</style>
