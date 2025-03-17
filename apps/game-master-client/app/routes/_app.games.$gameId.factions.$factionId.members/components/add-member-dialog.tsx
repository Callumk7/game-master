import { useSubmit } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { DialogContent, DialogOverlay, DialogTrigger } from "~/components/ui/dialog";
import { useGameData } from "~/routes/_app.games.$gameId/route";

export function AddMemberDialog() {
  const { characters } = useGameData();
  const submit = useSubmit();
  return (
    <DialogTrigger>
      <Button>Link Character</Button>
      <DialogOverlay>
        <DialogContent>
          <div className="p-3">
            <h3 className="text-lg font-bold">Character List</h3>
            {characters.map((char) => (
              <div key={char.id}>
                <button
                  type="button"
                  onClick={() => submit({ characterId: char.id }, { method: "PATCH" })}
                >
                  {char.name}
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  );
}
