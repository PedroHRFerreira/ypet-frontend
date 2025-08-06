<script lang="ts">
import { defineComponent } from "vue";
import { useAnimalsList } from "~/stores/animals/useAnimalsList";

export default defineComponent({
	name: "OrganismsAnimals",
	setup() {
		const animalsList = useAnimalsList();

		return {
			animalsList,
		};
	},
});
</script>

<template></template>

<style scoped lang="scss"></style>
