import { createContext, type PropsWithChildren, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

interface GlobalStateProps {
	gameSelectionId: string;
}

interface GlobalState extends GlobalStateProps {
	setGameSelection: (gameId: string) => void;
}

const createGlobalStateStore = (initProps?: Partial<GlobalStateProps>) => {
	const DEFAULT_PROPS: GlobalStateProps = {
		gameSelectionId: "",
	};
	return createStore<GlobalState>()((set) => ({
		...DEFAULT_PROPS,
		...initProps,
		setGameSelection: (gameId) => set({ gameSelectionId: gameId }),
	}));
};

type GlobalStateStore = ReturnType<typeof createGlobalStateStore>;

const GlobalStateContext = createContext<GlobalStateStore | null>(null);

type GlobalStateProviderProps = PropsWithChildren<GlobalStateProps>;

export function GlobalStateProvider({ children, ...props }: GlobalStateProviderProps) {
	const storeRef = useRef<GlobalStateStore>();
	if (!storeRef.current) {
		storeRef.current = createGlobalStateStore(props);
	}
	return (
		<GlobalStateContext.Provider value={storeRef.current}>
			{children}
		</GlobalStateContext.Provider>
	);
}

function useGlobalStateContext<T>(selector: (state: GlobalState) => T): T {
	const store = useContext(GlobalStateContext);
	if (!store) throw new Error("Missing GlobalState.Provider in this route tree");
	return useStore(store, selector);
}

export function useGameSelectionId() {
  return useGlobalStateContext((s) => s.gameSelectionId);
}

export function useSetGameSelection() {
  return useGlobalStateContext((s) => s.setGameSelection);
}
