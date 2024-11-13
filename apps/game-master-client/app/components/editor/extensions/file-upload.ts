import FileHandler from "@tiptap-pro/extension-file-handler";

export const CustomFileHandler = (fetcher?: (file: File) => Promise<string>) =>
	FileHandler.configure({
		allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
		onDrop: (currentEditor, files, pos) => {
			files.forEach((file) => {
				const fileReader = new FileReader();

				fileReader.readAsDataURL(file);

				fileReader.onload = async () => {
					if (fetcher) {
						const url = await fetcher(file);
						currentEditor
							.chain()
							.insertContentAt(pos, {
								type: "image",
								attrs: {
									src: url,
								},
							})
							.focus()
							.run();
					} else {
						currentEditor
							.chain()
							.insertContentAt(pos, {
								type: "image",
								attrs: {
									src: fileReader.result,
								},
							})
							.focus()
							.run();
					}
				};
			});
		},
	});
