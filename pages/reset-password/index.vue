<script lang="ts">
import { definePageMeta } from "#imports";
import { defineComponent } from "vue";
import { useAuthResetPasswordStore } from "~/stores/auth/useAuthResetPasswordStore";

export default defineComponent({
  setup() {
    const token = useRoute().query.token as string | undefined;
    const email = useRoute().query.email as string | undefined;
    const useAuthResetPassword = useAuthResetPasswordStore();

    if (token) {
      useAuthResetPassword.setToken(token);
    }

    if (email) {
      useAuthResetPassword.setEmail(email);
    }

    return {};
  },
});

useHead({
	title: "Reset Password",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "access",
	middleware: ["guest"],
});
</script>
<template>
	<TemplatesAuthResetPassword />
</template>
