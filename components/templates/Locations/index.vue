<script lang="ts">
import { defineComponent } from "vue";
import { useLocationsStore } from "~/stores/locations/useListStore";

export default defineComponent({
	name: "TemplatesLocations",
	setup() {
		const locationsStore = useLocationsStore();
		const header = computed(() => ({
			title: "Locais cadastrados",
			subtitle: "Visualize e gerencie os cadastros de locais.",
		}));

		onMounted(() => {
			locationsStore.fetchLocations();
		});

		return { header, locationsStore };
	},
});
</script>

<template>
	<div class="wrapper-template">
		<div class="content">
			<header class="header">
				<div class="header-content">
					<AtomsTypography
						type="title-h7"
						:text="header.title"
						weight="medium"
						color="var(--brand-color-dark-blue-900)"
					/>
					<AtomsTypography
						type="text-p4"
						:text="header.subtitle"
						weight="medium"
						color="var(--brand-color-dark-blue-300)"
					/>
				</div>
			</header>

			<main class="main">
				<div v-if="locationsStore.locations.length > 0" class="main-content">
					<OrganismsLocations />
				</div>
				<div v-else class="main-empty">
					<MoleculesEmptyState
						:is-icon="true"
						title="Nenhum local cadastrado"
						description="Adicione um novo cadastro para começar."
					/>
				</div>
			</main>
		</div>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module";
</style>
