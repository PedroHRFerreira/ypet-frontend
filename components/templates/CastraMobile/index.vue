<script lang="ts">
import { type ConcreteComponent, defineComponent } from "vue";

export default defineComponent({
	name: "TemplatesCastraMobile",
	setup() {
		const settingsComponent = resolveComponent(
			"OrganismsCastraMobileClinicEvent",
		);
		const dailyScheduleComponent = resolveComponent(
			"OrganismsCastraMobileDailySchedule",
		);
		const componentsMap: Record<string, ConcreteComponent> = {
			settings: settingsComponent,
			dailySchedule: dailyScheduleComponent,
		};

		const tabs = ref([
			{
				id: "settings",
				name: "Configurações",
				active: true,
			},
			{
				id: "dailySchedule",
				name: "Agenda do dia",
				active: false,
			},
		] as ITab[]);

		const activeTab = computed(() => {
			return tabs.value.find((tab) => tab.active);
		});

		const activeComponent = computed(() => {
			if (!activeTab.value) {
				return settingsComponent;
			}

			const component = componentsMap[activeTab.value.id];

			if (component) {
				return component;
			}

			return settingsComponent;
		});

		const header = computed(() => {
			return {
				title: "Castramóvel",
				subtitle:
					"Defina dia, locais e parâmetros de atendimento que serão exibidos no App Cidadão",
			};
		});

		return {
			tabs,
			header,
			activeTab,
			activeComponent,
		};
	},
	methods: {
		setActiveTab(tab: ITab): void {
			this.tabs = this.tabs.map((t) => {
				return {
					...t,
					active: t.id === tab.id,
				};
			});
		},
	},
});
</script>

<template>
	<div class="animal-list">
		<div class="content">
			<header class="header">
				<div class="header-content">
					<AtomsTypography
						type="title-h7"
						class="header-content__title"
						:text="header.title"
						weight="medium"
						color="var(--brand-color-dark-blue-900)"
					/>
					<AtomsTypography
						type="text-p4"
						class="header-content__subtitle"
						:text="header.subtitle"
						weight="medium"
						color="var(--brand-color-dark-blue-300)"
					/>
				</div>
			</header>
			<main class="main">
				<MoleculesTabs :tabs="tabs" @change-tab="setActiveTab($event)" />
				<component :is="activeComponent" />
			</main>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
