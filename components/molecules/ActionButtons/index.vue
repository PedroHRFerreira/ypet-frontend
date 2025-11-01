<script setup lang="ts">
const emit = defineEmits(["anamnese", "consulta"]);

defineComponent({ name: "MoleculesActionButtons" });
</script>

<template>
	<div class="molecules-action-buttons">
		<AtomsButton variant="outline" @click="emit('anamnese')">
			Preencher Anamnese
		</AtomsButton>
		<AtomsButton variant="primary" @click="emit('consulta')">
			Registrar Consulta
		</AtomsButton>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
