<script lang="ts">
import { definePageMeta } from "#imports";
import { defineComponent } from "vue";
import { useAuthRegisterStore } from "~/stores/auth/useAuthRegisterStore";

useHead({
  title: "Register",
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | YPet` : "YPet";
  },
});

definePageMeta({
  layout: "access",
  middleware: ["guest"],
});

export default defineComponent({
  setup() {
    const email = useRoute().query.email as string | undefined;
    const name = useRoute().query.name as string | undefined;
    const useAuthLogin = useAuthRegisterStore();

    if (email) {
      useAuthLogin.setEmail(email);
    }

    if (name) {
      useAuthLogin.setName(name);
    }

    return {};
  },
});
</script>

<template>
  <TemplatesAuthRegister />
</template>