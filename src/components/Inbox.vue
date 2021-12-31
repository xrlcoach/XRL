<template>
  <div>
    <Splitter>
      <SplitterPanel>
        <h3>Inbox</h3>
        <DataTable :value="inbox" dataKey="datetime" responsiveLayout="scroll">
          <Column field="datetime" header="Received"></Column>
          <Column field="sender" header="From"></Column>
          <Column field="subject" header="Subject"></Column>
          <Column field="message" header="Message"></Column>
          <Column header="Action">
            <template #body="slotProps">
              <Button class="p-button-danger" @click="deleteMessage(slotProps.data.message)">Delete</Button>
            </template>
          </Column>
        </DataTable>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onBeforeMount, ref } from 'vue';
  import { UserMessage, XrlUser } from '../global';
  import { GetUserInfo } from '../services/users';
  import { UpdateUserInbox } from '../services/xrlApi';
import { useXrlStore } from '../store';
import { XrlStore } from '../store-types';

  export default defineComponent({
    setup() {
      const store = useXrlStore() as XrlStore;
      const user = computed(() => store.state.user);
      const inbox = computed(() => store.state.user?.inbox ?? []);
      const deleteMessage = async (messageBody: string) => {
        try {
          //Find index of message in user's inbox array
          let messageIndex = inbox.value.findIndex(
            m => m.message == messageBody
          );
          //Remove the message
          inbox.value.splice(messageIndex, 1);
          //Call function to persist changes to inbox
          UpdateUserInbox(user.value?.username ?? '', inbox.value);
        } catch (err) {
          console.log(err);
        }
      };
      return {
        inbox,
        deleteMessage
      };
    },
  });
</script>

<style scoped></style>
