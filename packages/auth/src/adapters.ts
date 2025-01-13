import type { TokenStorage } from "./types.js";

export class LocalStorageAdapter implements TokenStorage {
	getItem(key: string) {
		return localStorage.getItem(key);
	}

	setItem(key: string, value: string) {
		localStorage.setItem(key, value);
	}

	removeItem(key: string): void {
		localStorage.removeItem(key);
	}
}

export class InMemoryStorage implements TokenStorage {
	private storage: Map<string, string> = new Map();

	getItem(key: string): string | null {
		return this.storage.get(key) || null;
	}

	setItem(key: string, value: string): void {
		this.storage.set(key, value);
	}

	removeItem(key: string): void {
		this.storage.delete(key);
	}
}
