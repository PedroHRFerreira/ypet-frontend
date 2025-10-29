import { useAuthToken } from "~/composables/useAuthToken";
import type { UserProfile } from "~/types/user-profile";

export const useUserProfile = () => {
	const getUserProfile = (): UserProfile | null => {
		const user = useAuthToken().getUserCookie();

		if (!user) {
			return null;
		}

		if (!user.roles || user.roles.length === 0) {
			return null;
		}

		const roleNames = user.roles.map((role) => role.name.toLowerCase());

		if (roleNames.includes("administrator") || roleNames.includes("admin")) {
			return "admin";
		}

		if (
			roleNames.includes("collaborator") ||
			roleNames.includes("colaborador")
		) {
			return "collaborator";
		}

		if (
			roleNames.includes("veterinarian") ||
			roleNames.includes("veterinário") ||
			roleNames.includes("veterinario")
		) {
			return "veterinarian";
		}

		return null;
	};

	const isAdministrator = (): boolean => {
		return getUserProfile() === "admin";
	};

	const isCollaborator = (): boolean => {
		return getUserProfile() === "collaborator";
	};

	const isVeterinarian = (): boolean => {
		return getUserProfile() === "veterinarian";
	};

	const hasRole = (roleName: string): boolean => {
		const user = useAuthToken().getUserCookie();

		if (!user || !user.roles || user.roles.length === 0) {
			return false;
		}

		const roleNames = user.roles.map((role) => role.name.toLowerCase());
		return roleNames.includes(roleName.toLowerCase());
	};

	const getUser = (): IUser | null => {
		return useAuthToken().getUserCookie();
	};

	return {
		getUserProfile,
		isAdministrator,
		isCollaborator,
		isVeterinarian,
		hasRole,
		getUser,
	};
};
