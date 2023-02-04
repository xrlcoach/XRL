<template>
  <section>
    <form @submit.prevent="login">
      <div>
        <TextInput v-model="username" placeholder="Username" />
      </div>
      <div>
        <Password
          v-model="password"
          placeholder="Password"
          :toogleMask="true"
          :feedback="false"
        />
      </div>
      <div>
        <Button
          type="submit"
          label="Login"
          iconPos="left"
          loadingIcon="pi pi-spin pi-spinner"
          :loading="loading"
        />
      </div>
      <div v-if="error">
        <Message severity="error">{{ error }}</Message>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
  import { defineComponent, ref } from "vue";
  import { useRouter } from "vue-router";
  import Password from "primevue/password";

  import { LoginUser } from "../services/auth";

  export default defineComponent({
    setup() {
      const loading = ref(false);
      const error = ref("");

      const router = useRouter();

      const username = ref("");
      const password = ref("");

      const login = async () => {
        loading.value = true;
        error.value = "";
        try {
          await LoginUser(username.value, password.value);
          router.push({
            path: "/",
          });
        } catch (err) {
          error.value = String(err);
        } finally {
          loading.value = false;
        }
      };
      return {
        loading,
        error,
        router,
        username,
        password,
        login,
      };
    },
    components: {
      Password,
    },
  });
</script>

<style scoped>
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
