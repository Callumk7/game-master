import { RenderHtml } from "~/components/render-html";
import { useCharacterRouteData } from "../_app.characters.$characterId/route";

export default function CharacterIndex() {
	const { characterData } = useCharacterRouteData();
	return <>{characterData.bio && <RenderHtml content={characterData.bio} />}</>;
}
