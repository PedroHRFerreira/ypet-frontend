<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useListStore } from "~/stores/animals/useListStore";
import MoleculesListCardItem from "~/components/molecules/ListCardItem/index.vue";
import { useDayjs } from "~/composables/useDayjs";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import AtomsBadges from "~/components/atoms/Badges/Index.vue";

export default defineComponent({
	name: "OrganismsAnimals",
	components: {
		AtomsBadges,
		AtomsTypography,
		MoleculesListCardItem,
	},
	setup() {
		const animalsList = useListStore();

		const header = computed(() => {
			return {
				title: "Todos os animais cadastrados",
				subtitle: "",
				buttons: [
					{
						text: "Novo cadastro",
						type: "primary",
						icon: "plus",
						iconLeft: true,
						nameIconLeft: "plus",
						iconRight: false,
						nameIconRight: "",
						size: "small",
						width: "auto",
						action: () => {
							const router = useRouter();
							router.push({ name: "animals-create" });
						},
					},
				],
			};
		});

		const list = computed((): IAnimal[] => {
			return animalsList.animals;
		});

		const columnsHeader = ref([
			{
				value: "checkbox",
				text: "",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
					gap: "16px",
					wordBreak: "break-all",
				},
			},
			{
				value: "registration_number",
				text: "INSCRIÇÃO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
					gap: "16px",
					wordBreak: "break-all",
				},
			},
			{
				value: "entryDate",
				text: "ENTRADA",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
				},
			},
			{
				value: "status",
				text: "STATUS",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "15%",
				},
			},
			{
				value: "name",
				text: "NOME",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "20%",
					justifyContent: "flex-end",
				},
			},
			{
				value: "typePet",
				text: "TIPO DE PET",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
					justifyContent: "flex-end",
				},
			},
			{
				value: "castrated",
				text: "CASTRADO",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
					justifyContent: "flex-end",
				},
			},
			{
				value: "actions",
				text: "AÇÕES",
				typeTypography: "text-p5",
				weightTypography: "bold",
				colorTypography: "var(--brand-color-dark-blue-300)",
				style: {
					width: "10%",
					justifyContent: "flex-end",
				},
			},
		]);

		const onSelectOptionAction = (event: string, item: IAnimal) => {
			const router = useRouter();

			if (event === "details") {
				router.push({ name: "animals-details", params: { id: item.id } });

				return;
			}

			if (event === "edit") {
				router.push({ name: "animals-edit", params: { id: item.id } });
			}
		};

		return {
			animalsList,
			columnsHeader,
			header,
			list,
			onSelectOptionAction,
		};
	},
	methods: {
		useDayjs,
	},
});
</script>

<template>
	<section class="wrapper-list-card">
		<div class="wrapper-list-card__header">
			<div class="wrapper-list-card__header-title">
				<AtomsTypography
					type="title-h7"
					:text="header.title"
					weight="medium"
					color="var(--brand-color-dark-blue-300)"
				/>
			</div>
			<div class="wrapper-list-card__header-actions">
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
		<div class="wrapper-list-card__search"></div>
		<div class="wrapper-list-card__body">
			<MoleculesListCardItem :data="columnsHeader" padding="16px 0">
				<template v-for="(item, key) in columnsHeader" #[item.value] :key="key">
					<AtomsTypography
						:type="item.typeTypography"
						:text="item.text"
						:weight="item.weightTypography"
						:color="item.colorTypography"
					/>
				</template>
			</MoleculesListCardItem>
			<MoleculesListCardItem
				v-for="(item, key) in list"
				:key="key"
				:data="columnsHeader"
				padding="0"
			>
				<template #checkbox>
					<input :key="item.id" type="checkbox" />
				</template>
				<template #registration_number>
					<AtomsTypography
						type="text-p5"
						:text="
							item.registration_number ? `#${item.registration_number}` : '---'
						"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #entryDate>
					<AtomsTypography
						type="text-p5"
						:text="$formatDate(item.created_at)"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #status>
					<AtomsBadges
						v-if="item.status?.status"
						type="text"
						:size="'small'"
						:color="item.status?.status.color"
						:text="item.status?.status.label || 'Sem status'"
					/>
				</template>
				<template #name>
					<AtomsTypography
						type="text-p5"
						:text="item.name"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #typePet>
					<AtomsTypography
						type="text-p5"
						:text="item.species.label"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #castrated>
					<AtomsTypography
						type="text-p5"
						:text="$booleanToSimNao(item.castrated)"
						weight="regular"
						color="var(--brand-color-dark-blue-300)"
					/>
				</template>
				<template #actions>
					<MoleculesActionDropdown
						:key="item.id"
						@change-action="onSelectOptionAction($event, item)"
					/>
				</template>
			</MoleculesListCardItem>
		</div>
		<div class="wrapper-list-card__footer">
			<MoleculesPaginationControls
				v-if="animalsList.pagination"
				:total-items="animalsList.pagination.total"
				:current-page="animalsList.pagination.current_page"
				:per-page="animalsList.pagination.per_page"
			/>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";

.header__container--item {
	position: relative;
	cursor: pointer;

	&__select {
		padding: 8px;
		border: 1px solid var(--brand-color-dark-blue-200);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background-color: var(--brand-color-white);
		color: var(--brand-color-dark-blue-300);
		font-size: 14px;
		font-weight: 500;
		transition:
			background-color 0.3s,
			color 0.3s;

		&:hover {
			background-color: var(--brand-color-dark-blue-100);
			color: var(--brand-color-dark-blue-900);
		}
	}

	&__dropdown {
		position: absolute;
		top: 110%;
		right: 0;
		background-color: var(--white);
		border: 1px solid var(--brand-color-dark-blue-200);
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		min-width: 150px;
	}
}
</style>
