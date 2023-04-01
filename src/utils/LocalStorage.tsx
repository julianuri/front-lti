export const getFromLocalStorage = (key: string, defaultValue: unknown): any => {
	if (!key || typeof window === 'undefined') {
		return defaultValue;
	}
	return localStorage.getItem(key);
};

export const saveInLocalStorage = (...arr: Array<{ key: string, value: any }>): void => {
	for (const e of arr) {
		localStorage.setItem(e.key, e.value);
	}
};
