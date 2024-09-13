import { createContext, type PropsWithChildren, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

interface SelectionProps {
	gameSelectionId: string;
}

interface SelectionState extends SelectionProps {
	setGameSelection: (gameId: string) => void;
}

const createGameSelectionStore = (initProps?: Partial<SelectionProps>) => {
	const DEFAULT_PROPS: SelectionProps = {
		gameSelectionId: "",
	};
	return createStore<SelectionState>()((set) => ({
		...DEFAULT_PROPS,
		...initProps,
		setGameSelection: (gameId) => set({ gameSelectionId: gameId }),
	}));
};

type GameSelectionStore = ReturnType<typeof createGameSelectionStore>;

const GameSelectionContext = createContext<GameSelectionStore | null>(null);

type SelectionProviderProps = PropsWithChildren<SelectionProps>;

export function GameSelectionProvider({ children, ...props }: SelectionProviderProps) {
	const storeRef = useRef<GameSelectionStore>();
	if (!storeRef.current) {
		storeRef.current = createGameSelectionStore(props);
	}
	return (
		<GameSelectionContext.Provider value={storeRef.current}>
			{children}
		</GameSelectionContext.Provider>
	);
}

function useGameSelectionContext<T>(selector: (state: SelectionState) => T): T {
	const store = useContext(GameSelectionContext);
	if (!store) throw new Error("Missing GameSelection.Provider in this route tree");
	return useStore(store, selector);
}

export function useGameSelectionId() {
  return useGameSelectionContext((s) => s.gameSelectionId);
}

export function useSetGameSelection() {
  return useGameSelectionContext((s) => s.setGameSelection);
}
