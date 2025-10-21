<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "MoleculesModal",
	props: {
		showModal: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: "default",
			validator: (value: string) => {
				return ["default", "actions"].includes(value);
			},
		},
		iconLeft: {
			type: Boolean,
			default: false,
		},
		iconRight: {
			type: Boolean,
			default: false,
		},
		iconName: {
			type: String,
			default: "system/arrows/arrow-left",
		},
		title: {
			type: String,
			default: "",
		},
		typeTitle: {
			type: String,
			default: "text-p2",
		},
		confirmButtonText: {
			type: String,
			default: "Salvar",
		},
		cancelButtonText: {
			type: String,
			default: "Cancelar",
		},
		canScrollOutside: {
			type: Boolean,
			default: true,
		},
		isFilter: {
			type: Boolean,
			default: false,
		},
		stayOpenOnClick: {
			type: Boolean,
			default: false,
		},
		typeModal: {
			type: String,
			default: "aside",
			validator: (value: string) => {
				return ["aside", "center"].includes(value);
			},
		},
		modalAuto: {
			type: Boolean,
			default: false,
		},
		stateButton: {
			type: String,
			default: "default",
		},
		width: {
			type: String,
			default: "600px",
		},
		height: {
			type: String,
			default: "480px",
		},
	},
	emits: ["close", "back", "apply", "clear"],
	setup(props) {

		const cssVars = computed(() => ({
			"--width": props.width,
			"--height": props.height,
		}));

		return {cssVars};
	},
	data() {
		return {
			isShowEffect: this.showModal,
			isDisplay: this.showModal,
		};
	},
	watch: {
		showModal(newIsVisible) {
			if (newIsVisible) {
				this.isDisplay = newIsVisible;
				setTimeout(() => (this.isShowEffect = newIsVisible), 0);
				return;
			}
			this.isShowEffect = false;
			setTimeout(() => (this.isDisplay = false), 1000);
		},
	},
	methods: {
		clickCloseModal() {
			this.isShowEffect = false;
			setTimeout(() => (this.isDisplay = false), 1000);
			this.$emit("close");
		},
		clickConfirmed() {
			if (this.stateButton === "loading") {
				return;
			}
			this.$emit("apply");
		},
		clickOutsideModal(event: any) {
			if (this.stayOpenOnClick) {
				return;
			}

			const isClickedOutsideModal = event.target === this.$el;
			if (isClickedOutsideModal) {
				this.isShowEffect = false;
				setTimeout(() => (this.isDisplay = false), 1000);
				this.$emit("close");
			}
		},
		checkIsFilterModal() {
			if (this.isFilter) {
				this.$emit("clear");
				return;
			}
			this.clickCloseModal();
		},
	},
});
</script>
<template>
	<div
		v-if="isDisplay"
		class="modal"
		:class="{ 'show-effect': isShowEffect }"
		@click="clickOutsideModal"
	>
		<div
			class="content-modal"
			:class="[typeModal, { 'modal-auto': modalAuto }] "
			:style="cssVars"
		>
			<div class="container-modal">
				<div :class="['header-modal', { justify: iconRight }]">
					<div v-if="iconLeft" class="back-modal" @click="$emit('back')">
						<AtomsIcon
							filled
							class="icon-left"
							name="system/arrows/arrow-left"
							current-color="var(--neutral-color-dark-600)"
						/>
					</div>
					<AtomsTypography
						:type="typeTitle"
						color="var(--neutral-color-dark-0)"
						:text="title"
					/>
					<div v-if="iconRight" class="close-modal" @click="clickCloseModal">
						<AtomsIcon
							filled
							class="icon-right"
							name="system/other/close"
							current-color="var(--neutral-color-dark-600)"
						/>
					</div>
				</div>
				<div class="body-modal">
					<slot />
				</div>
				<div v-if="type === 'actions'" class="footer-modal">
					<MoleculesButtonsCommon
						class="cancel-button"
						:text="cancelButtonText"
						type="secondary"
						@click="checkIsFilterModal"
					/>
					<MoleculesButtonsCommon
						:state="stateButton"
						class="confirm-button"
						:text="confirmButtonText"
						type="primary"
						@click="clickConfirmed"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module.scss";
</style>
