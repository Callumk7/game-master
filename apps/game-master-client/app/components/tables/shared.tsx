import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { useSubmit } from "@remix-run/react";
import { Button } from "../ui/button";
import { Toolbar } from "../ui/toolbar";
import { toast } from "sonner";

interface EntityRowControlsProps {
  entityId: string;
  handleEdit: (id: string) => void;
}

export function EntityRowControls({ entityId, handleEdit }: EntityRowControlsProps) {
  const submit = useSubmit();
  const handlePress = () => {
    submit({ entityId }, { method: "DELETE" });
    toast("Deleting note");
  };
  return (
    <Toolbar aria-label="Row controls">
      <Button variant={"outline"} size={"icon"} onPress={() => handleEdit(entityId)}>
        <Pencil2Icon />
      </Button>
      <Button variant={"outline"} size={"icon"} onPress={handlePress}>
        <TrashIcon />
      </Button>
    </Toolbar>
  );
}
