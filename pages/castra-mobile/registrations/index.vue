<script setup lang="ts">
import { definePageMeta } from "#imports";
import TemplatesCastraMobileRegistrationsCreate from "~/components/templates/CastraMobile/Registrations/Create/index.vue";

useHead({
	title: "Castramóvel - Criar Registro de Castração",
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | YPet` : "YPet";
	},
});

definePageMeta({
	layout: "default",
	middleware: ["auth"],
	name: "castra-mobile.registrations.create",
});

defineComponent({
	name: "PagesCastraMobileRegistrations",
});
</script>

<template>
	<TemplatesCastraMobileRegistrationsCreate />
</template>
