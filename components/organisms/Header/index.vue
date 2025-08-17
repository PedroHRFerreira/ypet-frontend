<script lang="ts">
import { useAuthLoginStore } from "~/stores/auth/useAuthLoginStore";

export default defineComponent({
	name: "OrganismsHeader",
	emits: ["notifications", "profile"],
  setup(props, { emit }) {
    const useAuthLogin = useAuthLoginStore();
    const dropdownRef = ref<HTMLElement | null>(null);
    const isOpenDropdown = ref(false);

    const optionsData = ref([
      { id: 'profile', text: "Perfil", state: "default" },
      { id: 'logout', text: "Sair", state: "default" },
    ] as IOption[]);

    const openDropdown = () => {
      isOpenDropdown.value = !isOpenDropdown.value;
    };

    const actions: Record<string, () => Promise<void> | void> = {
      profile: () => emit("profile"),
      logout: async () => {
        await useAuthLogin.logout()
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
      openDropdown,
      handleOptionSelected,
    }
  }
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
				<li ref="dropdownRef" class="header__container--item" @click="openDropdown">
					<div class="header__container--profile">
						<AtomsTypography
							class="text"
							type="text-p5"
							text="Davi Bruno"
							color="var(--brand-color-blue-900)"
              @click="$emit('profile')"
						/>
						<MoleculesAvatarIcon name-user="Davi Bruno" @click="" />
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
