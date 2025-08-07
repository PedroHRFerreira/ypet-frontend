<script lang="ts">
export default defineComponent({
	name: "OrganismsHeader",
	emits: ["notifications", "profile"],
});
</script>
<template>
	<header class="header">
		<div class="header__container">
			<MoleculesInputSearch label="O que você procura?" class="input-search" />
			<ul class="header__container--actions">
				<li class="header__container--item" @click="$emit('notifications')">
					<div class="header__container--notifications" />
					<AtomsIcon filled height="24px" width="24px" name="bell" />
				</li>
				<li class="header__container--item" @click="$emit('profile')">
					<div class="header__container--profile">
						<AtomsTypography
							class="text"
							type="text-p5"
							text="Davi Bruno"
							color="var(--brand-color-blue-900)"
						/>
						<MoleculesAvatarIcon name-user="Davi Bruno" />
					</div>
				</li>
			</ul>
		</div>
	</header>
</template>
<style scoped lang="scss">
@use "styles.module.scss";
</style>
