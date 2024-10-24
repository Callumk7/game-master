import { useFetcher } from "@remix-run/react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useCustomUploadButton } from "./upload-hook";
import { Button } from "../ui/button";

interface ImageUploadProps {
  imageSrc: string | null;
  alt?: string;
}

export function ImageUpload({ imageSrc, alt }: ImageUploadProps) {
  const fetcher = useFetcher();
  const {
    fileName,
    fileInputRef,
    handleInputClick,
    handleFileChange,
    handleSubmitCleanup,
  } = useCustomUploadButton();

  if (imageSrc) {
    return (
      <div className="group rounded-2xl border relative border-grade-6 w-fit overflow-hidden">
        <img
          src={imageSrc}
          alt={alt ?? "User uploaded image"}
          className="object-fill object-center"
        />
        <Button
          size="icon"
          variant="destructive"
          className={"absolute opacity-0 top-2 right-2 group-hover:opacity-100"}
          onPress={() => fetcher.submit({}, { method: "DELETE", action: "uploads" })}
        >
          <Cross1Icon />
        </Button>
      </div>
    );
  }

  return (
    <fetcher.Form
      action="uploads"
      method="POST"
      encType="multipart/form-data"
      onSubmit={handleSubmitCleanup}
    >
      <input
        type="file"
        name="image"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      {fileName ? (
        <div className="flex items-center gap-2">
          <Button type="submit">Submit</Button>
          <span className="text-xs font-light text-grade-10">{fileName}</span>
        </div>
      ) : (
        <Button onPress={handleInputClick} variant="secondary">
          Upload File
        </Button>
      )}
    </fetcher.Form>
  );
}
