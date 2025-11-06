<script lang="ts">
import { defineComponent, computed, getCurrentInstance, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDetailStore } from "~/stores/animals/useDetailStore";

export default defineComponent({
	name: "OrganismsAnimalsHistory",
	setup() {
		const detailsStore = useDetailStore();
		const route = useRoute();
		const { proxy } = getCurrentInstance()!;

		const historyItems = computed(() => {
			const items = detailsStore.history || [];
			const categoryLabel: Record<string, string> = {
				vaccine: "Vacina",
				vermifuge: "Vermifugo",
				supplement: "Suplemento",
				medication: "Medicação",
				registration: "Cadastro",
				food: "Alimentação",
				consultation: "Consulta",
				exam: "Exame",
				surgery: "Cirurgia",
				castration: "Castração",
				triage: "Triagem",
			};

			return items.map((h: any) => {
				const category = h?.extra_data?.category || "";
				const title = category
					? categoryLabel[category] || h?.description || "Registro"
					: h?.description || "Registro";
				return {
					title,
					type: h?.reference_type || "history",
					date: proxy?.$formatDateOnly(h?.created_at) || "N/A",
					user: h?.user?.name || null,
					category,
					raw: h,
				};
			});
		});

		function shouldShowDetailsButton(_item: any): boolean {
			return false;
		}

		function getEventIcon(item: any): string {
			const type = (item?.type || "").toString();
			const map: Record<string, string> = {
				application: "vaccine",
				registration: "paste",
				medication: "health",
				supplement: "box",
				procedure: "procedures",
				for_adoption: "heart",
				lost: "urgent",
				with_owner: "userCheck",
				castration: "truck",
			};

			return map[type] || "procedures";
		}

		function onViewDetails(_item: any) {}

		onMounted(async () => {
			const id = route.params.id as string;
			await detailsStore.fetchAnimalHistory(id);
		});

		return {
			historyItems,
			shouldShowDetailsButton,
			getEventIcon,
			onViewDetails,
		};
	},
});
</script>

<template>
	<section class="organisms-animals-history">
		<div class="organisms-animals-history__header">
			<AtomsTypography
				type="text-p2"
				text="Histórico do Animal"
				weight="medium"
				color="var(--brand-color-dark-blue-900)"
			/>
		</div>

		<div class="organisms-animals-history__list">
			<AtomsCard
				v-for="(item, idx) in historyItems"
				:key="idx"
				class="organisms-animals-history__item"
			>
				<div class="organisms-animals-history__item-left">
					<AtomsIcon :name="getEventIcon(item)" width="20" height="20" />
					<AtomsTypography
						type="text-p5"
						:text="item.title"
						weight="medium"
						color="var(--brand-color-dark-blue-700)"
					/>
				</div>
				<div class="organisms-animals-history__item-middle">
					<AtomsIcon name="calendar" width="18" height="18" />
					<AtomsTypography
						type="text-p5"
						:text="item.date"
						weight="regular"
						color="var(--brand-color-dark-blue-900)"
					/>
				</div>
				<div v-if="item.user" class="organisms-animals-history__item-user">
					<AtomsIcon name="userCheck" width="18" height="18" />
					<AtomsTypography
						type="text-p5"
						:text="item.user"
						weight="regular"
						color="var(--brand-color-dark-blue-900)"
					/>
				</div>
				<div class="organisms-animals-history__item-actions">
					<AtomsButton
						v-if="shouldShowDetailsButton(item)"
						variant="primary"
						@click="onViewDetails(item)"
					>
						Ver detalhes
					</AtomsButton>
				</div>
			</AtomsCard>
			<div v-if="!historyItems.length" class="organisms-animals-history__empty">
				<AtomsTypography
					type="text-p5"
					text="Nenhum histórico disponível"
					weight="regular"
					color="var(--brand-color-dark-blue-300)"
				/>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
