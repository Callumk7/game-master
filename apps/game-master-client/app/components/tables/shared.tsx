import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import { Button } from "../ui/button";
import { Toolbar } from "../ui/toolbar";

interface EntityRowControlsProps {
  entityId: string;
  handleEdit: (id: string) => void;
}

export function EntityRowControls({ entityId, handleEdit }: EntityRowControlsProps) {
  const submit = useSubmit();
  return (
    <Toolbar aria-label="Row controls">
      <Button variant={"outline"} size={"icon"} onPress={() => handleEdit(entityId)}>
        <Pencil2Icon />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        onPress={() => submit({ entityId }, { method: "DELETE" })}
      >
        <TrashIcon />
      </Button>
    </Toolbar>
  );
}
