<script lang="ts">
import { definePageMeta } from "#imports";
import { useAuthLoginStore } from "~/stores/auth/useAuthLoginStore";

useHead({
	title: "Login",
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
		const useAuthLogin = useAuthLoginStore();

		if (email) {
			useAuthLogin.setLogin(email);
		}

		return {};
	},
});
</script>
<template>
	<TemplatesAuthLogin />
</template>
