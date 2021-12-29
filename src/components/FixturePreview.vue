<template>
  <article>
    <div>
      <p>
        <img
          :src="`src/assets/${fixture?.home}.png`"
          :height="100"
          :width="100"
        />
      </p>
      <p>{{ fixture?.home }}&nbsp;{{ fixture?.home_score }}</p>
    </div>
    <div>
      <p>vs</p>
    </div>
    <div>
      <p>
        <img
          :src="`src/assets/${fixture?.away}.png`"
          :height="100"
          :width="100"
        />
      </p>
      <p>{{ fixture?.away_score }}&nbsp;{{ fixture?.away }}</p>
    </div>
  </article>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      fixture: Object
    },
  });
</script>

<style scoped>
article {
    display: flex;
    flex-direction: row;
    height: 100%;
    align-items: center;
    justify-content: center;
    gap: 50px;
    font-size: 42px;
  }
  </style>
