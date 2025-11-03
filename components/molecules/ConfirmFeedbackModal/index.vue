<script lang="ts">
import { defineComponent, onBeforeUnmount, ref, watch, computed } from "vue";

export default defineComponent({
	name: "MoleculesConfirmFeedbackModal",
	props: {
		open: { type: Boolean, default: false }, // v-model:open
		variant: {
			type: String as () => "confirm" | "success",
			default: "confirm",
		},
		title: { type: String, required: true },
		description: { type: String, default: "" },
		descriptionMaxLength: { type: Number, default: 200 },
		confirmText: { type: String, default: "Confirmar" },
		cancelText: { type: String, default: "Cancelar" },
		continueText: { type: String, default: "Continuar" },
		disableEsc: { type: Boolean, default: false },
		disableBackdrop: { type: Boolean, default: false },
		zIndex: { type: Number, default: 60 },
		id: { type: String, default: "confirm-feedback-modal" },
	},
	emits: ["update:open", "confirm", "cancel", "continue", "open", "close"],
	setup(props, { emit }) {
		const wasOpen = ref(false);
		const lastActiveEl = ref<HTMLElement | null>(null);
		const modalRef = ref<HTMLElement | null>(null);

		const truncatedDescription = computed(() => {
			const desc = props.description || "";
			const max = props.descriptionMaxLength || 0;
			if (!max || desc.length <= max) return desc;
			return desc.slice(0, max);
		});

		function lockScroll(lock: boolean) {
			const body = document.body;
			if (!body) return;
			if (lock) body.style.overflow = "hidden";
			else body.style.overflow = "";
		}

		function doOpenSideEffects() {
			lastActiveEl.value = (document.activeElement as HTMLElement) || null;
			lockScroll(true);
			requestAnimationFrame(() => {
				modalRef.value?.focus?.();
				emit("open");
			});
		}

		function doCloseSideEffects() {
			lockScroll(false);
			lastActiveEl.value?.focus?.();
			emit("close");
		}

		watch(
			() => props.open,
			(val) => {
				if (val && !wasOpen.value) {
					wasOpen.value = true;
					doOpenSideEffects();
				} else if (!val && wasOpen.value) {
					wasOpen.value = false;
					doCloseSideEffects();
				}
			},
			{ immediate: true },
		);

		function close() {
			emit("update:open", false);
		}

		function onEsc(e: KeyboardEvent) {
			if (props.disableEsc) return;
			if (e.key === "Escape" && props.open) {
				e.preventDefault();
				close();
			}
		}

		function onBackdropClick(e: MouseEvent) {
			if (props.disableBackdrop) return;
			if (e.target === e.currentTarget) close();
		}

		function onConfirm() {
			emit("confirm");
			close();
		}
		function onCancel() {
			emit("cancel");
			close();
		}
		function onContinue() {
			emit("continue");
			close();
		}
		onBeforeUnmount(() => {
			document.removeEventListener("keydown", onEsc);
			lockScroll(false);
		});

		return {
			modalRef,
			onBackdropClick,
			onConfirm,
			onCancel,
			onContinue,
			close,
			onEsc,
			truncatedDescription,
		};
	},
	mounted(): any {
		document.addEventListener("keydown", this.onEsc);
	},
});
</script>

<template>
	<Teleport to="body">
		<Transition name="modal-fade">
			<div
				v-show="open"
				class="cfm-modal__overlay"
				:style="{ zIndex: zIndex }"
				@click="onBackdropClick"
			>
				<Transition name="modal-scale">
					<section
						v-show="open"
						ref="modalRef"
						class="cfm-modal"
						role="dialog"
						:aria-modal="true"
						:aria-labelledby="`${id}-title`"
						:aria-describedby="`${id}-desc`"
						tabindex="-1"
					>
						<header class="cfm-modal__icon">
							<slot name="icon">
								<span class="cfm-modal__icon-circle" aria-hidden="true">
									<svg
										v-if="variant === 'confirm'"
										xmlns="http://www.w3.org/2000/svg"
										width="28"
										height="28"
										viewBox="0 0 24 24"
										fill="none"
									>
										<circle
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="1.5"
											opacity=".4"
										/>
										<path
											d="M12 7.5v6m0 3h.01"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
										/>
									</svg>
									<svg
										v-else
										width="28"
										height="28"
										viewBox="0 0 24 24"
										fill="none"
									>
										<circle
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="1.5"
											opacity=".4"
										/>
										<path
											d="M8 12.5l3 3 5-6"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</span>
							</slot>
						</header>

						<main class="cfm-modal__content">
							<div class="cfm-modal__header">
								<AtomsTypography
									type="text-p2"
									weight="bold"
									:text="title"
									color="var(--brand-color-dark-blue-300)"
								/>
								<AtomsTypography
									type="text-p5"
									weight="regular"
									:text="truncatedDescription"
									color="var(--brand-color-dark-blue-300)"
								/>
							</div>

							<footer class="cfm-modal__actions">
								<slot name="footer">
									<template v-if="variant === 'confirm'">
										<MoleculesButtonsCommon
											:text="confirmText"
											size="small"
											@onclick="onConfirm"
										/>

										<MoleculesButtonsCommon
											type="outline"
											:text="cancelText"
											size="small"
											@onclick="onCancel"
										/>
									</template>
									<template v-else>
										<MoleculesButtonsCommon
											size="small"
											:text="continueText"
											@onclick="onContinue"
										/>
									</template>
								</slot>
							</footer>
						</main>
					</section>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
