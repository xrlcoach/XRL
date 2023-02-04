<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 20px;
    "
  >
    <div style="height: 50px">
      <Spinner style="height: 100%" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      return {};
    },
  });
</script>

<style scoped></style>
