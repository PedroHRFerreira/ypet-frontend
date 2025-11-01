<script lang="ts">
import { type ConcreteComponent, defineComponent } from "vue";

export default defineComponent({
	name: "TemplatesOccurrences",
	setup() {
		const adoptionVisitsComponent = resolveComponent(
			"OrganismsOccurrencesAdoptionVisits",
		);
		const lostPetComponent = resolveComponent("OrganismsOccurrencesLostPet");
		const abuseReportsComponent = resolveComponent(
			"OrganismsOccurrencesAbuseReports",
		);
		const samupetComponent = resolveComponent("OrganismsOccurrencesSamupet");
		const evaluationPetComponent = resolveComponent(
			"OrganismsOccurrencesEvaluationPet",
		);

		const componentsMap: Record<string, ConcreteComponent> = {
			adoptionVisits: adoptionVisitsComponent,
			lostPet: lostPetComponent,
			abuseReports: abuseReportsComponent,
			samupet: samupetComponent,
			evaluationPet: evaluationPetComponent,
		};
		const tabs = ref([
			{
				id: "adoptionVisits",
				name: "Visitas de adoção",
				active: true,
			},
			{
				id: "lostPet",
				name: "Perdi meu pet",
				active: false,
			},
			{
				id: "abuseReports",
				name: "Denúncias",
				active: false,
			},
			{
				id: "samupet",
				name: "Samupet",
				active: false,
			},
			{
				id: "evaluationPet",
				name: "Avaliação de adoção",
				active: false,
			},
		] as ITab[]);

		const activeTab = computed(() => {
			return tabs.value.find((tab) => tab.active);
		});

		const activeComponent = computed(() => {
			if (!activeTab.value) {
				return adoptionVisitsComponent;
			}

			const component = componentsMap[activeTab.value.id];

			if (component) {
				return component;
			}

			return adoptionVisitsComponent;
		});

		const header = computed(() => {
			return {
				title: "Ocorrências",
				subtitle:
					"Visualize e gerencie todas as ocorrências registradas no App Cidadão",
				buttons: [],
			};
		});

		return {
			tabs,
			header,
			activeTab,
			activeComponent,
		};
	},
	mounted(){
		const tabParam = useRoute().query.tab

		if (tabParam) {
			this.tabs.forEach(tab => {
				tab.active = tab.id === tabParam
			})
		}
	},
	methods: {
		setRouteDefault(tabId: string): void {
			const router = useRouter();
			router.replace({ name: "occurrences", query: { tab: tabId } });
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
	<div class="wrapper-template">
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
				<div class="header-actions">
					<MoleculesButtonsCommon
						v-for="button in header.buttons"
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
				<MoleculesTabs :tabs="tabs" @change-tab="setActiveTab($event)" />
				<component :is="activeComponent" />
			</main>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
