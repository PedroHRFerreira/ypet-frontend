<script lang="ts">
import { definePageMeta } from "#imports";
import { defineComponent } from "vue";
import TemplatesAuthResetPassword from "~/components/templates/auth/ResetPassword/index.vue";

export default defineComponent({
  components: { TemplatesAuthResetPassword },
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
