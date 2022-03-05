<template>
  <div class="headerContainer">
    <div id="headerOffset" v-if="!isMobile">
      &nbsp;
    </div>
    <h1>XRL '22</h1>    
    <div id="headerActions">
      <Button label="Refresh Data" @click="refresh" class="p-button-text" icon="pi pi-refresh" loadingIcon="pi pi-spin pi-spinner" :loading="loading" />
      <Button label="Logout" @click="logout" class="p-button-text p-button-danger" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogoutUser } from '../services/auth'
import { RefreshSession } from '../services/utils';
import { useXrlStore } from '../store';

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useXrlStore();
    const isMobile = computed(() => store.state.isMobile);
    const loading = ref(false);
    const logout = () => {
      LogoutUser();
      router.replace({ name: 'Login' });
    };
    const refresh = async () => {
      loading.value = true;
      await RefreshSession();
      loading.value = false;
      window.location.reload();
    }
    return {
      logout,
      refresh,
      loading,
      isMobile
    }
  },
})
</script>

<style scoped>
  .headerContainer {
    display: flex;
    justify-content: space-between;
    position: relative;
    width: 100%;
    margin-bottom: 20px;
  }
  #headerOffset, #headerActions {
    flex: 0 1 250px;
  }
  h1 {
    color: var(--primary-color);
  }
</style>