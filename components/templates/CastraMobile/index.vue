<script lang="ts">
import { type ConcreteComponent, defineComponent } from "vue";

export default defineComponent({
	name: "TemplatesCastraMobile",
	setup() {
		const clinicEventComponent = resolveComponent(
			"OrganismsCastraMobileClinicEvent",
		);
		const dailyScheduleComponent = resolveComponent(
			"OrganismsCastraMobileRegistrations",
		);
		const castramovelRequestsComponent = resolveComponent(
			"OrganismsOccurrencesCastramovel",
		);

		const componentsMap: Record<string, ConcreteComponent> = {
			events: clinicEventComponent,
			schedule: dailyScheduleComponent,
			castrammobile: castramovelRequestsComponent,
		};

		const tabs = ref([
			{
				id: "events",
				name: "Eventos",
				active: true,
			},
			{
				id: "schedule",
				name: "Agenda do dia",
				active: false,
			},
			{
				id: "castrammobile",
				name: "Castramóvel App",
				active: false,
			},
		] as ITab[]);

		const activeTab = computed(() => {
			return tabs.value.find((tab) => tab.active);
		});

		const activeComponent = computed(() => {
			if (!activeTab.value) {
				return clinicEventComponent;
			}

			const component = componentsMap[activeTab.value.id];

			if (component) {
				return component;
			}

			return clinicEventComponent;
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
	mounted() {
		const tabParam = useRoute().query.tab;

		if (tabParam) {
			this.tabs.forEach((tab) => {
				tab.active = tab.id === tabParam;
			});
		}
	},
	methods: {
		setRouteDefault(tabId: string): void {
			const router = useRouter();
			router.replace({ name: "castra-mobile", query: { tab: tabId } });
		},
		setActiveTab(tab: ITab): void {
			this.tabs = this.tabs.map((t) => {
				if (t.id === tab.id) {
					this.setRouteDefault(t.id);
				}

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
