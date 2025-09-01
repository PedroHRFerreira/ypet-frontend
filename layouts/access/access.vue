<script lang="ts">
export default defineComponent({
	name: "LayoutAccess",
	setup() {
		const itemCopy = [
			"Gerencie cadastros e permissões",
			"Monitore denúncias e solicitações",
			"Gere relatórios e estatísticas",
		];
		return {
			itemCopy,
		};
	},
});
</script>
<template>
	<section class="access">
		<AtomsIcon
			class="access__logo-top"
			name="logo-white"
			width="100px"
			height="124px"
		/>
		<div class="access__container">
			<div class="access__copy">
				<AtomsIcon name="logo-white" width="100px" height="124px" />
				<AtomsTypography
					type="title-h4"
					weight="regular"
					color="var(--white)"
					text="Acesse o Painel para usar todos os recursos exclusivos"
				/>
				<div class="access__copy--list">
					<div
						v-for="(item, key) in itemCopy"
						:key="key"
						class="access__copy--list__item"
					>
						<AtomsIcon
							name="check"
							width="24px"
							height="23px"
							color="var(--white)"
						/>
						<AtomsTypography
							type="text-p2"
							weight="regular"
							color="var(--white)"
							:text="item"
						/>
					</div>
				</div>
			</div>
			<div class="access__slot">
				<slot />
			</div>
		</div>
	</section>
</template>
<style scoped lang="scss">
@use "styles.module";
</style>
