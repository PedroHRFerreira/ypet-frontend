<script lang="ts">
import { defineComponent } from "vue";
import { useLocationsStore } from "~/stores/locations/useListStore";

export default defineComponent({
	name: "TemplatesLocations",
	setup() {
		const locationsStore = useLocationsStore();
		const router = useRouter();
		const header = computed(() => ({
			title: "Locais cadastrados",
			subtitle: "Visualize e gerencie os cadastros de locais.",
			buttons: [
				{
					text: "Novo cadastro",
					type: "primary",
					icon: "plus",
					iconLeft: false,
					nameIconLeft: "",
					iconRight: true,
					nameIconRight: "plus",
					action: () => {
						router.push({ name: "locations-create" });
					},
				},
			],
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
				<div class="header-actions">
					<MoleculesButtonsCommon
						v-for="button in header.buttons"
						v-if="locationsStore.locations.length === 0"
						:key="button.text"
						:type="button.type"
						:text="button.text"
						:icon-left="button.iconLeft"
						:icon-right="button.iconRight"
						:name-icon-left="button.nameIconLeft"
						:name-icon-right="button.nameIconRight"
						@onclick="button.action"
					/>
				</div>
			</header>

			<main class="main">
				<div class="main-content">
					<OrganismsLocations />
				</div>
			</main>
		</div>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module";
</style>
