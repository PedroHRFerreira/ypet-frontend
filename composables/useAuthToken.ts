import type { CookieRef } from "#app";
type Token = {
	access_token: string;
	expires_in: number;
	token_type: string;
};
export const useAuthToken = () => {
	function setTokenCookie(token: IAccessToken): void {
		const cookie: CookieRef<any> = useCookie("auth._token.laravelSanctum", {
			path: "/",
			default: (): Token | false => false,
			maxAge: token.expires_in,
			watch: "shallow",
		});

		const cookieUser: CookieRef<any> = useCookie("auth.user", {
			path: "/",
			default: (): Token | false => false,
			maxAge: token.expires_in,
			watch: "shallow",
		});
		cookieUser.value = token.user;
		cookie.value = `${token.token_type} ${token.access_token}`;
	}

	function getTokenCookie(): string | null {
		const cookie: CookieRef<any> = useCookie("auth._token.laravelSanctum");
		if (cookie.value) {
			return cookie.value as string;
		}
		return null;
	}

	function getUserCookie(): IUser | null {
		const cookie: CookieRef<any> = useCookie("auth.user");
		if (!cookie.value) {
			return null;
		}

		if (typeof cookie.value === "object") {
			return cookie.value as IUser;
		}

		try {
			return JSON.parse(cookie.value) as IUser;
		} catch {
			return null;
		}
	}

	function removeTokenCookie(): void {
		const cookie: CookieRef<any> = useCookie("auth._token.laravelSanctum", {
			path: "/",
			default: (): Token | false => false,
			maxAge: 0,
			watch: "shallow",
		});

		const cookieUser: CookieRef<any> = useCookie("auth.user", {
			path: "/",
			default: (): Token | false => false,
			maxAge: 0,
			watch: "shallow",
		});

		cookieUser.value = null;
		cookie.value = null;
	}

	return { setTokenCookie, getTokenCookie, getUserCookie, removeTokenCookie };
};
