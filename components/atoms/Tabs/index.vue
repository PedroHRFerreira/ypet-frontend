<script setup lang="ts">
defineComponent({ name: "AtomsTabs" });
</script>

<template>
	<div class="atoms-tabs">
		<div class="atoms-tabs__header">
			<slot name="header" />
		</div>
		<div class="atoms-tabs__content">
			<slot />
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
