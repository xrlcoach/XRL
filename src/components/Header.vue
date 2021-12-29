<template>
  <div class="headerContainer">
    <h1>XRL</h1>    
    <div id="headerActions">
      <Button label="Refresh Data" @click="refresh" class="p-button-text" icon="pi pi-refresh" loadingIcon="pi pi-spin pi-spinner" :loading="loading" />
      <Button label="Logout" @click="logout" class="p-button-text p-button-danger" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogoutUser } from '../services/auth'
import { RefreshSession } from '../services/utils';

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
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
      loading
    }
  },
})
</script>

<style scoped>
  .headerContainer {
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
    margin-bottom: 20px;
  }
  #headerActions {
    position: absolute;
    right: 10px;
    top: 0px;
  }
  h1 {
    color: var(--primary-color);
  }
</style>