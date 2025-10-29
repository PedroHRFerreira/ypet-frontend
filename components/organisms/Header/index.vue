<script lang="ts">
import { useAuthLoginStore } from "~/stores/auth/useAuthLoginStore";
import { useUserProfile } from "~/composables/useUserProfile";

export default defineComponent({
	name: "OrganismsHeader",
	emits: ["notifications", "menu"],
	setup() {
		const useAuthLogin = useAuthLoginStore();
		const userProfile = useUserProfile();
		const dropdownRef = ref<HTMLElement | null>(null);
		const isOpenDropdown = ref(false);

		const userName = computed(() => {
			const user = userProfile.getUser();
			return user?.name || "Usuário";
		});

		const optionsData = ref([
			{ id: "profile", text: "Perfil", state: "default" },
			{ id: "logout", text: "Sair", state: "default" },
		] as IOption[]);

		const openDropdown = () => {
			isOpenDropdown.value = !isOpenDropdown.value;
		};

		const router = useRouter();

		const actions: Record<string, () => Promise<void> | void> = {
			profile: () => {
				router.push({ path: "/settings" });
				isOpenDropdown.value = false;
			},
			logout: async () => {
				await useAuthLogin.logout();
			},
		};

		const handleOptionSelected = async (option: IOption) => {
			const action = actions[option.id];
			if (action) {
				await action();

				return;
			}

			isOpenDropdown.value = false;
		};

		const handleClickOutside = (event: MouseEvent) => {
			if (
				isOpenDropdown.value &&
				dropdownRef.value &&
				!dropdownRef.value.contains(event.target as Node)
			) {
				isOpenDropdown.value = false;
			}
		};

		onMounted(() => {
			document.addEventListener("click", handleClickOutside);
		});

		onBeforeUnmount(() => {
			document.removeEventListener("click", handleClickOutside);
		});

		return {
			optionsData,
			isOpenDropdown,
			dropdownRef,
			openDropdown,
			handleOptionSelected,
			userName,
		};
	},
});
</script>
<template>
	<header class="header">
		<div class="header__container">
			<button
				type="button"
				class="menu-trigger"
				aria-label="Abrir menu mobile"
				@click="$emit('menu')"
			>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
			</button>
			<div class="header__container--search"></div>
			<ul class="header__container--actions">
				<li class="header__container--item" @click="$emit('notifications')">
					<div class="header__container--notifications" />
					<AtomsIcon filled height="24px" width="24px" name="bell" />
				</li>
				<li
					ref="dropdownRef"
					class="header__container--item"
					@click="openDropdown"
				>
					<div class="header__container--profile">
						<AtomsTypography
							class="text"
							type="text-p5"
							:text="userName"
							color="var(--brand-color-blue-900)"
						/>
						<MoleculesAvatarIcon :name-user="userName" />
					</div>
					<div v-if="isOpenDropdown" class="header__container--item__dropdown">
						<AtomsDropdownItem
							v-for="(opt, index) in optionsData"
							:key="index"
							:text="opt?.text"
							:state="opt?.state"
							@on-click="handleOptionSelected(opt)"
						/>
					</div>
				</li>
			</ul>
		</div>
	</header>
</template>
<style scoped lang="scss">
@use "styles.module";
</style>
