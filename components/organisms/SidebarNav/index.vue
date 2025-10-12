<script lang="ts">
export default defineComponent({
	name: "OrganismsSidebarNav",
	emits: ["onclick"],

	setup(_, { emit }) {
		const activeItem = ref(false);
		const menuItems = ref([
			{
				text: "Home",
				icon: "home",
				active: "index",
				route: "",
			},
			{
				text: "Cadastro de animais",
				icon: "paste",
				active: "animals",
				route: "animals",
			},
			{
				text: "Castramóvel",
				icon: "truck",
				active: "castra-mobile",
				route: "castra-mobile",
			},
			{
				text: "Ocorrências",
				icon: "urgent",
				active: "occurrences",
				route: "occurrences",
			},
			{
				text: "Samupet",
				icon: "health",
				active: "samupet",
				route: "samupet",
			},
			{
				text: "Vacina e vermifugação",
				icon: "vaccine",
				active: "vaccine",
				route: "vaccine",
			},
			{
				text: "Colaboradores",
				icon: "user-plus",
				active: "employees",
				route: "employees",
			},
			{
				text: "Cidadãos",
				icon: "smile",
				active: "citizens",
				route: "citizens",
			},
			{
				text: "Protetores",
				icon: "heart",
				active: "protectors",
				route: "protectors",
			},
			{
				text: "Produtos e insumos",
				icon: "box",
				active: "products",
				route: "products",
			},
			{
				text: "Locais",
				icon: "location",
				active: "locations",
				route: "locations",
			},
			{
				text: "Fornecedores",
				icon: "user-check",
				active: "suppliers",
				route: "suppliers",
			},
			{
				text: "Veterinários",
				icon: "calendar",
				active: "veterinarians",
				route: "veterinarians",
			},
			{
				text: "Configurações",
				icon: "settings",
				active: "settings",
				route: "settings",
			},
		]);

		const router = useRouter();

		const routerPage = (route: string, text: string) => {
			activeItem.value = !activeItem.value;
			router.push({ path: `/${route}` });
			emit("onclick", text);
		};

		const verifyActive = (active: string) => {
			return active === router.currentRoute.value.name;
		};

		return {
			activeItem,
			menuItems,
			verifyActive,
			routerPage,
		};
	},
});
</script>
<template>
	<div class="sidebar">
		<div class="sidebar__logo">
  <img src="/images/pet-dos-vales.svg" alt="Logo Pet dos Vales" width="100" height="50" />
</div>
		<div class="sidebar__options">
			<MoleculesSidebarIten
				v-for="(item, index) in menuItems.slice(0, -1)"
				:key="index"
				:icon="item.icon"
				:text="item.text"
				:active="verifyActive(item.active)"
				@onclick="routerPage(item.route, item.text)"
			/>
		</div>
		<div class="sidebar__config">
			<MoleculesSidebarIten
				:icon="menuItems[menuItems.length - 1].icon"
				:text="menuItems[menuItems.length - 1].text"
				:active="verifyActive(menuItems[menuItems.length - 1].active)"
				@onclick="
					routerPage(
						menuItems[menuItems.length - 1].route,
						menuItems[menuItems.length - 1].text,
					)
				"
			/>
		</div>
	</div>
</template>
<style scoped lang="scss">
@use "styles.module.scss";
</style>
