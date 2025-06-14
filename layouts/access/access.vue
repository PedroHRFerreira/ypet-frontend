<script lang="ts">
export default defineComponent({
	name: "LayoutAccess",
});
</script>
<template>
	<section class="access">
		<div class="access__container">
			<div class="access__copy">
				<AtomsIcon name="logo-white" width="100px" height="124px" />
				<AtomsTypography
					type="title-h1"
					weight="regular"
					color="var(--white)"
					text="Login to enjoy the huge ton of exclusive features"
				/>
			</div>
			<div class="access__slot">
				<slot />
			</div>
		</div>
	</section>
</template>
<style scoped lang="scss">
@use "styles.module.scss";
</style>
