<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <header>
    <Header />
    <TabMenu :model="tabs" />
  </header>
  <main>
    <div class="page-loader" v-if="loading">
      <ProgressSpinner />
    </div>
    <router-view v-else v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <footer>
    <Footer />
  </footer>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import Header from './components/Header.vue';
  import Footer from './components/Footer.vue';

  import 'primevue/resources/themes/vela-green/theme.css';
  import 'primevue/resources/primevue.min.css';
  import 'primeicons/primeicons.css';

  import './assets/styles.css';
import { useXrlStore } from './store';
import { ActionTypes } from './store-types';

  export default defineComponent({
    name: 'App',
    setup() {
      const store = useXrlStore();
      const loading = computed(() => !store.state.user || !store.getters.currentRound || !store.state.allPlayers);
      store.dispatch(ActionTypes.GetActiveUser);
      store.dispatch(ActionTypes.GetAllUsers);
      store.dispatch(ActionTypes.GetAllFixtures);
      store.dispatch(ActionTypes.GetAllPlayers);
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
      return {
        loading,
        tabs,
      };
    },
    components: {
      Header,
      Footer,
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