<script setup lang="ts">
defineComponent({ name: "AtomsCard" });
</script>

<template>
	<div class="atoms-card">
		<slot />
	</div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
