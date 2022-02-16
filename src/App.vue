<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <header>
    <Header />
    <TabMenu :model="tabs" v-if="!isMobile" />
    <Dropdown id="dropdown-menu" v-else :modelValue="activeRoute" :options="tabs" optionLabel="label" @change="onDropdownNavigate" />
  </header>
  <main>
    <div class="page-loader" v-if="loading">
      <ProgressSpinner />
    </div>
    <router-view v-else v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  <Sidebar v-model:visible="showSidebar" @hide="onSidebarHide" class="p-sidebar-lg">
    <PlayerProfile v-if="selectedPlayer" :player="selectedPlayer" />
  </Sidebar>
  </main>
  <footer>
    <Footer />
  </footer>
</template>

<script lang="ts">
  import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import Header from './components/Header.vue';
  import Footer from './components/Footer.vue';
  import PlayerProfile from './components/PlayerProfile.vue';

  import 'primevue/resources/themes/vela-green/theme.css';
  import 'primevue/resources/primevue.min.css';
  import 'primeicons/primeicons.css';

  import './assets/styles.css';
import { useXrlStore } from './store';
import { ActionTypes, MutationTypes } from './store-types';
import { useRoute } from 'vue-router';
import { GetIdToken } from './services/xrlApi';
import router from './router';

  export default defineComponent({
    name: 'App',
    setup() {
      const store = useXrlStore();
      const loggedIn = !!GetIdToken();
      if (loggedIn) {
        store.dispatch(ActionTypes.LoadAppData);
      }
      const loading = computed(() => loggedIn && (!store.state.user || !store.getters.currentRound || !store.state.allPlayers));
      const selectedPlayer = computed(() => store.state.selectedPlayer);
      const playerProfileVisible = computed(() => store.state.playerProfileVisible);
      const showSidebar = ref(false);
      const onSidebarHide = () => {
        store.commit(MutationTypes.HIDE_PLAYER_TAB);
      };
      watch(playerProfileVisible, (value) => {
        showSidebar.value = value;
      });
      const tabs = ref([
        {
          label: 'Dashboard',
          icon: 'pi pi-globe',
          to: '/',
        },
        {
          label: 'Lineup',
          icon: 'pi pi-list',
          to: '/lineup',
        },
        {
          label: 'Match Centre',
          icon: 'pi pi-ticket',
          to: '/matchcentre',
        },
        {
          label: 'Draw',
          icon: 'pi pi-calendar',
          to: '/draw',
        },
        {
          label: 'Ladder',
          icon: 'pi pi-sort',
          to: '/ladder',
        },
        {
          label: 'Squads',
          icon: 'pi pi-users',
          to: '/squads',
        },
        {
          label: 'Stats',
          icon: 'pi pi-chart-bar',
          to: '/stats',
        },
        {
          label: 'Transfer Centre',
          icon: 'pi pi-dollar',
          to: '/transfers',
        },
      ]);

      const isMobile = computed(() => store.state.isMobile);
      const checkIsMobile = () => {
        const isMobile = window.innerWidth < 960;
        store.commit(MutationTypes.SET_IS_MOBILE, isMobile);
      }
      const activeRoute = computed(() => {
        return tabs.value.find(item => item.to === router.currentRoute.value.path);
      });
      const onDropdownNavigate = (event: any) => {
        if (event.value) {
          router.push(event.value.to);
        }
      }

      onMounted(() => {
        window.addEventListener('resize', checkIsMobile);
      });

      onBeforeUnmount(() => {
        window.removeEventListener('resize', checkIsMobile);
      });

      return {
        loading,
        tabs,
        selectedPlayer,
        showSidebar,
        isMobile,
        activeRoute,
        onDropdownNavigate,
        onSidebarHide
      };
    },
    components: {
      Header,
      Footer,
      PlayerProfile
    },
  });
</script>

<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100%;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
  }

  main {
    padding: 50px 10px;
    background-color: var(--surface-b);
  }

  #dropdown-menu {
    width: 100%;
  }

  .page-loader {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media screen and (min-width: 928px) {
    main {
      padding: 50px 125px;
    }
  } 
</style>
