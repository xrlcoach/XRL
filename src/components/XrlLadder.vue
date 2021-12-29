<template>
  <div>
    <transition name="fade" mode="out-in">
      <Splitter v-if="loaded" layout="vertical">
        <SplitterPanel>
          <h3>XRL 2021</h3>
        </SplitterPanel>
        <SplitterPanel>
          <DataTable
            :value="ladder"
            dataKey="player_id"
            responsiveLayout="scroll"
          >
            <Column>
              <template #body="slotProps">
                <div style="text-align: center">
                  <img
                    :src="`src/assets/${slotProps.data.team_short}.png`"
                    :alt="slotProps.data.team_short"
                    :height="50"
                    :width="50"
                  />
                </div>
              </template>
            </Column>
            <Column header="Team" field="team_name"></Column>
            <Column header="Wins" field="stats.wins"></Column>
            <Column header="Draws" field="stats.draws"></Column>
            <Column header="Losses" field="stats.losses"></Column>
            <Column header="Powerplays" field="powerplays"></Column>
            <Column header="For" field="stats.for"></Column>
            <Column header="Against" field="stats.against"></Column>
            <Column header="Diff">
              <template #body="slotProps">
                {{ slotProps.data.stats.for - slotProps.data.stats.against }}
              </template>
            </Column>
            <Column header="Points" field="stats.points"></Column>
          </DataTable>
        </SplitterPanel>
      </Splitter>
    </transition>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { XrlUser } from '../global';
  import { GetAllUserInfoSorted } from '../services/users';

  export default defineComponent({
    setup() {
      const loaded = ref(false);
      const error = ref('');

      const ladder = ref([] as XrlUser[]);

      const selectedTeam = ref<XrlUser>();
      const onSelectTeam = () => {
        console.log(selectedTeam.value?.team_name);
      };

      onMounted(async () => {
        try {
          ladder.value = await GetAllUserInfoSorted();
        } catch (err) {
          error.value = err;
        } finally {
          loaded.value = true;
        }
      });

      return {
        loaded,
        error,
        ladder,
        selectedTeam,
        onSelectTeam,
      };
    },
  });
</script>

<style scoped></style>
