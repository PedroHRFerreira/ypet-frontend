<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "TemplatesCitizensCreate",
	setup() {
		const header = computed(() => {
			return {
				title: "Cadastro de cidadãos",
				subtitle: "Adicione um novo cidadão ao sistema",
				buttons: [
					{
						text: "Voltar",
						type: "outline",
						icon: "arrow-left",
						iconLeft: true,
						nameIconLeft: "arrow-left",
						iconRight: false,
						nameIconRight: "",
						size: "small",
						width: "auto",
						action: () => {
							const router = useRouter();
							router.back();
						},
					},
				],
			};
		});
      
		return {
			header,
		};
	},
	methods: {
		back() {
			const router = useRouter();
			router.push({ name: "citizens" });
		},
	},
});
</script>

<template>
	<div class="citizens-create">
		<div class="content">
			<div class="header">
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
						:size="button.size"
						:width="button.width"
						@onclick="button.action"
					/>
				</div>
			</div>
			<div class="main">
				<OrganismsCitizensCreate />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
