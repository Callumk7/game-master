import { SDK, type CreateGameRequestBody, type CreateNoteRequestBody } from "@repo/api";

const gameData: CreateGameRequestBody[] = [
	{ name: "The Dark Journey", ownerId: "staging" },
	{ name: "Temple of Doom", ownerId: "staging" },
	{ name: "Ragnarok", ownerId: "staging" },
];

async function seedData() {
	const client = new SDK({ baseUrl: "http://localhost:3000", apiKey: "staging-key" });

	const newGameIds: string[] = [];

	for (const game of gameData) {
		const result = await client.games.createGame(game);

		if (result.success) {
			newGameIds.push(result.data.id);
			console.log(`${result.data.name} created for staging`);
		}
	}

	const newNoteIds: string[] = [];
	const newCharIds: string[] = [];
	for (const gameId of newGameIds) {
		// Create note data
		let n = 0;
		for (const note of ttrpgNotes) {
			const result = await client.notes.createNote({
				name: noteTitles[n],
				content: note.content,
				htmlContent: note.htmlContent,
				ownerId: "staging",
				gameId,
				type: "note",
			});

			if (result.success) {
				newNoteIds.push(result.data.id);
				console.log(`${result.data.name} created for game: ${gameId}`);
			}

			n++;
		}
		// create character data
		let c = 0;
		for (const charName of fantasyCharacterNames) {
			const result = await client.characters.createCharacter({
				name: charName,
				content: ttrpgNotes[c].content,
				htmlContent: ttrpgNotes[c].htmlContent,
				ownerId: "staging",
				gameId,
			});

			if (result.success) {
				newCharIds.push(result.data.id);
				console.log(`${result.data.name} created for game: ${gameId}`);
			}

			c++;
		}
	}
}

seedData();

const noteTitles = [
	"The Whispering Caverns",
	"Artifacts of the Fallen Empire",
	"Factions of Shadowport",
	"Legendary Beasts of the Misty Vale",
	"The Planar Convergence Event",
	"Arcane Colleges and Their Rivalries",
	"The Sunken City of Aqualis",
	"Thieves' Guild Hierarchy",
	"Prophecies of the Stargazer Monks",
	"Enchanted Forests and Their Guardians",
	"The Clockwork Colossus",
	"Elemental Ley Lines",
	"Cursed Artifacts and Their Origins",
	"The Astral Sea Trading Routes",
	"Underdark Power Struggles",
	"The Celestial Bureaucracy",
	"Airship Pirates of the Windswept Isles",
	"The Feywild Court Intrigues",
	"Necromantic Rituals and Countermeasures",
	"The Dragon Council's Secret Agenda",
	"Planar Portals and Their Keys",
	"The Void Incursion",
	"Alchemical Wonders of the Sage's Tower",
	"The Infernal Contract Loopholes",
	"Beastfolk Tribes of the Savage Lands",
	"The Mage-King's Labyrinth",
	"Otherworldly Patrons and Their Demands",
	"The Chronomancer's Paradox",
	"Golem Creation Techniques",
	"The Primordial Titans' Awakening",
];

const ttrpgNotes = [
	{
		content:
			"Dungeon of the Forgotten King\n\nLocation: Deep within the Misty Mountains\nDifficulty: Hard (recommended for levels 8-10)\nTheme: Ancient ruins, forgotten magic\n\nBackground: Centuries ago, a powerful king ruled these lands with an iron fist. His cruelty knew no bounds, and eventually, his own court wizards conspired against him. They sealed him away in a magical prison deep within his own dungeon. Now, the magic is weakening, and the Forgotten King stirs.\n\nObjectives:\n1. Navigate the treacherous dungeon\n2. Solve ancient puzzles to reach the inner sanctum\n3. Decide whether to reinforce the king's prison or set him free (with consequences)",
		htmlContent:
			"<h2>Dungeon of the Forgotten King</h2>\n\n<p><strong>Location:</strong> Deep within the Misty Mountains<br>\n<strong>Difficulty:</strong> Hard (recommended for levels 8-10)<br>\n<strong>Theme:</strong> Ancient ruins, forgotten magic</p>\n\n<p>Background: Centuries ago, a powerful king ruled these lands with an iron fist. His cruelty knew no bounds, and eventually, his own court wizards conspired against him. They sealed him away in a magical prison deep within his own dungeon. Now, the magic is weakening, and the Forgotten King stirs.</p>\n\n<p>Objectives:</p>\n<ol>\n<li>Navigate the treacherous dungeon</li>\n<li>Solve ancient puzzles to reach the inner sanctum</li>\n<li>Decide whether to reinforce the king's prison or set him free (with consequences)</li>\n</ol>",
	},
	{
		content:
			"The Whispering Woods\n\nA mystical forest that seems to have a mind of its own. The trees shift and move when no one is looking, creating an ever-changing maze. Adventurers report hearing whispers and seeing fleeting shadows between the trees.\n\nEncounters:\n1. Treant guardians protecting sacred groves\n2. Mischievous pixies leading travelers astray\n3. A hidden druid circle performing ancient rituals\n\nHidden throughout the woods are ancient stone markers. If activated in the correct order, they reveal the path to the heart of the forest, where a powerful artifact is said to be hidden.",
		htmlContent:
			"<h2>The Whispering Woods</h2>\n\n<p>A mystical forest that seems to have a mind of its own. The trees shift and move when no one is looking, creating an ever-changing maze. Adventurers report hearing whispers and seeing fleeting shadows between the trees.</p>\n\n<p>Encounters:</p>\n<ol>\n<li>Treant guardians protecting sacred groves</li>\n<li>Mischievous pixies leading travelers astray</li>\n<li>A hidden druid circle performing ancient rituals</li>\n</ol>\n\n<p>Hidden throughout the woods are ancient stone markers. If activated in the correct order, they reveal the path to the heart of the forest, where a powerful artifact is said to be hidden.</p>",
	},
	{
		content:
			"The Clockwork Citadel\n\nA massive structure of gears, pistons, and steam, the Clockwork Citadel is a marvel of engineering and magic. Created by a long-lost civilization, it continues to function autonomously, its purpose unknown.\n\nChallenges:\n- Navigate the constantly shifting rooms and corridors\n- Avoid or deactivate deadly traps and security measures\n- Decipher the ancient language to control the citadel's systems\n\nAt the heart of the citadel lies a central control room. Accessing it may allow the party to uncover the true purpose of this mechanical wonder and potentially control its immense power.\n\nPossible plot hooks:\n1. A rival faction is also seeking to claim the citadel\n2. The citadel's systems are malfunctioning, threatening nearby settlements\n3. An ancient AI controls the citadel and must be reasoned with",
		htmlContent:
			"<h2>The Clockwork Citadel</h2>\n\n<p>A massive structure of gears, pistons, and steam, the Clockwork Citadel is a marvel of engineering and magic. Created by a long-lost civilization, it continues to function autonomously, its purpose unknown.</p>\n\n<p>Challenges:</p>\n<ul>\n<li>Navigate the constantly shifting rooms and corridors</li>\n<li>Avoid or deactivate deadly traps and security measures</li>\n<li>Decipher the ancient language to control the citadel's systems</li>\n</ul>\n\n<p>At the heart of the citadel lies a central control room. Accessing it may allow the party to uncover the true purpose of this mechanical wonder and potentially control its immense power.</p>\n\n<p>Possible plot hooks:</p>\n<ol>\n<li>A rival faction is also seeking to claim the citadel</li>\n<li>The citadel's systems are malfunctioning, threatening nearby settlements</li>\n<li>An ancient AI controls the citadel and must be reasoned with</li>\n</ol>",
	},
	{
		content:
			"The Sunken Temple of Zor-Magna\n\nBeneath the waves of the Sapphire Sea lies an ancient temple dedicated to Zor-Magna, a forgotten god of the depths. Once a place of great power, it now rests in ruins, guarded by creatures of the deep and treacherous currents.\n\nAdventuring parties will need to find a way to breathe underwater or face the challenge of limited air supply. The temple is filled with puzzles and traps designed to test the faithful, now made even more dangerous by the aquatic environment.\n\nRumors speak of a powerful artifact hidden within the temple's inner sanctum - the Trident of Tides. This legendary weapon is said to grant its wielder control over the seas themselves.\n\nPotential encounters:\n1. A tribe of hostile merfolk who worship a corrupted version of Zor-Magna\n2. Giant squid guardian of the outer temple\n3. Animated coral constructs\n4. Puzzle rooms filling with water as a time pressure mechanic",
		htmlContent:
			"<h2>The Sunken Temple of Zor-Magna</h2>\n\n<p>Beneath the waves of the Sapphire Sea lies an ancient temple dedicated to Zor-Magna, a forgotten god of the depths. Once a place of great power, it now rests in ruins, guarded by creatures of the deep and treacherous currents.</p>\n\n<p>Adventuring parties will need to find a way to breathe underwater or face the challenge of limited air supply. The temple is filled with puzzles and traps designed to test the faithful, now made even more dangerous by the aquatic environment.</p>\n\n<p>Rumors speak of a powerful artifact hidden within the temple's inner sanctum - the Trident of Tides. This legendary weapon is said to grant its wielder control over the seas themselves.</p>\n\n<p>Potential encounters:</p>\n<ol>\n<li>A tribe of hostile merfolk who worship a corrupted version of Zor-Magna</li>\n<li>Giant squid guardian of the outer temple</li>\n<li>Animated coral constructs</li>\n<li>Puzzle rooms filling with water as a time pressure mechanic</li>\n</ol>",
	},
	{
		content:
			"The Feywild Market\n\nA magical marketplace that appears in different locations throughout the material plane on nights of the full moon. The market is run by various fey creatures and offers exotic goods, mystical services, and dangerous bargains.\n\nKey features:\n- Stalls selling bottled emotions, memories in crystal vials, and dreams woven into cloth\n- A fortune teller who can glimpse possible futures... for a price\n- A gambling den where years of one's life are wagered instead of gold\n\nThe players should be warned that deals in the Feywild Market are binding and often have hidden clauses or unexpected consequences. Encourage creative problem-solving and roleplaying as they navigate this whimsical but treacherous environment.\n\nPossible adventure hooks:\n1. A missing person was last seen entering the market\n2. An important item needs to be acquired from a specific merchant\n3. The players must win a fey competition to gain an audience with a powerful archfey",
		htmlContent:
			"<h2>The Feywild Market</h2>\n\n<p>A magical marketplace that appears in different locations throughout the material plane on nights of the full moon. The market is run by various fey creatures and offers exotic goods, mystical services, and dangerous bargains.</p>\n\n<p>Key features:</p>\n<ul>\n<li>Stalls selling bottled emotions, memories in crystal vials, and dreams woven into cloth</li>\n<li>A fortune teller who can glimpse possible futures... for a price</li>\n<li>A gambling den where years of one's life are wagered instead of gold</li>\n</ul>\n\n<p>The players should be warned that deals in the Feywild Market are binding and often have hidden clauses or unexpected consequences. Encourage creative problem-solving and roleplaying as they navigate this whimsical but treacherous environment.</p>\n\n<p>Possible adventure hooks:</p>\n<ol>\n<li>A missing person was last seen entering the market</li>\n<li>An important item needs to be acquired from a specific merchant</li>\n<li>The players must win a fey competition to gain an audience with a powerful archfey</li>\n</ol>",
	},
	{
		content:
			"The Nexus of Fallen Stars\n\nA mysterious location where the boundaries between planes are thin. Shards of fallen stars have punctured the fabric of reality, creating a surreal landscape of floating islands, reversed gravity, and unpredictable magic.\n\nEnvironmental effects:\n- Random spurts of wild magic\n- Gravity shifts that change direction unexpectedly\n- Temporal anomalies where time flows differently\n\nThe Nexus is home to a diverse ecosystem of extra-planar creatures drawn to its unique energies. Some seek to harness the power of the fallen stars, while others simply adapt to the chaotic environment.\n\nCentral to the Nexus is the Astral Forge, an ancient device that can reshape reality itself. However, using it requires gathering starshards scattered throughout the area and risking exposure to raw cosmic energies.\n\nPotential quests:\n1. Stabilize the Nexus to prevent its chaos from spilling into nearby realms\n2. Retrieve a specific fallen star for a powerful client\n3. Stop a cult from using the Astral Forge to remake the world in their image",
		htmlContent:
			"<h2>The Nexus of Fallen Stars</h2>\n\n<p>A mysterious location where the boundaries between planes are thin. Shards of fallen stars have punctured the fabric of reality, creating a surreal landscape of floating islands, reversed gravity, and unpredictable magic.</p>\n\n<p>Environmental effects:</p>\n<ul>\n<li>Random spurts of wild magic</li>\n<li>Gravity shifts that change direction unexpectedly</li>\n<li>Temporal anomalies where time flows differently</li>\n</ul>\n\n<p>The Nexus is home to a diverse ecosystem of extra-planar creatures drawn to its unique energies. Some seek to harness the power of the fallen stars, while others simply adapt to the chaotic environment.</p>\n\n<p>Central to the Nexus is the Astral Forge, an ancient device that can reshape reality itself. However, using it requires gathering starshards scattered throughout the area and risking exposure to raw cosmic energies.</p>\n\n<p>Potential quests:</p>\n<ol>\n<li>Stabilize the Nexus to prevent its chaos from spilling into nearby realms</li>\n<li>Retrieve a specific fallen star for a powerful client</li>\n<li>Stop a cult from using the Astral Forge to remake the world in their image</li>\n</ol>",
	},
	{
		content:
			"The Echoing Caves of Whispers\n\nA vast network of underground caverns where sound behaves in strange and unpredictable ways. Whispers from miles away can be heard clearly, while shouts may vanish without a trace. The caves are home to creatures that have adapted to this unusual acoustic environment.\n\nChallenges:\n- Navigate using sound cues and echolocation\n- Avoid alerting dangerous predators that hunt by sound\n- Solve puzzles that require manipulating sound waves\n\nLegend speaks of the Song of Creation hidden deep within the caves. This primordial melody is said to hold immense power, capable of shaping reality itself. However, simply hearing the song can drive mortals to madness.\n\nKey locations:\n1. The Hall of Echoes - A massive cavern where sounds from different time periods can be heard\n2. The Silent Grotto - A zone of absolute silence, dangerous to those unprepared\n3. The Resonance Spire - A natural formation that amplifies and focuses sound energy\n\nPossible plot hooks:\n- A valuable mineral that can only be found by its unique resonance\n- A lost expedition that communicated their last location through the cave system\n- An ancient evil awakening in response to specific sound frequencies",
		htmlContent:
			"<h2>The Echoing Caves of Whispers</h2>\n\n<p>A vast network of underground caverns where sound behaves in strange and unpredictable ways. Whispers from miles away can be heard clearly, while shouts may vanish without a trace. The caves are home to creatures that have adapted to this unusual acoustic environment.</p>\n\n<p>Challenges:</p>\n<ul>\n<li>Navigate using sound cues and echolocation</li>\n<li>Avoid alerting dangerous predators that hunt by sound</li>\n<li>Solve puzzles that require manipulating sound waves</li>\n</ul>\n\n<p>Legend speaks of the Song of Creation hidden deep within the caves. This primordial melody is said to hold immense power, capable of shaping reality itself. However, simply hearing the song can drive mortals to madness.</p>\n\n<p>Key locations:</p>\n<ol>\n<li>The Hall of Echoes - A massive cavern where sounds from different time periods can be heard</li>\n<li>The Silent Grotto - A zone of absolute silence, dangerous to those unprepared</li>\n<li>The Resonance Spire - A natural formation that amplifies and focuses sound energy</li>\n</ol>\n\n<p>Possible plot hooks:</p>\n<ul>\n<li>A valuable mineral that can only be found by its unique resonance</li>\n<li>A lost expedition that communicated their last location through the cave system</li>\n<li>An ancient evil awakening in response to specific sound frequencies</li>\n</ul>",
	},
	{
		content:
			"The Prismatic Desert\n\nA vast expanse of multicolored sands, each hue imbued with different magical properties. The landscape shifts and changes as winds blow the sands into new formations, creating a ever-changing tapestry of color and magic.\n\nEnvironmental hazards:\n- Red sands that burn with intense heat\n- Blue sands that slow movement and induce drowsiness\n- Green sands that cause rapid plant growth\n- Purple sands that distort perception and cause hallucinations\n\nAt the heart of the desert lies the Chromatic Oasis, a lush paradise where all colors of sand swirl together in harmony. It is said that drinking from the oasis grants temporary mastery over the desert's magic.\n\nDesert inhabitants:\n1. Nomadic tribes that have learned to harness the power of the sands\n2. Color-shifting predators that blend seamlessly with their surroundings\n3. Sand elementals of various hues, each with unique abilities\n\nPotential quests:\n- Retrieve a rare flower that only grows in a specific sand color combination\n- Stop a mad wizard attempting to separate all the sand colors permanently\n- Navigate the desert to deliver a crucial message to the isolated Chromatic Oasis",
		htmlContent:
			"<h2>The Prismatic Desert</h2>\n\n<p>A vast expanse of multicolored sands, each hue imbued with different magical properties. The landscape shifts and changes as winds blow the sands into new formations, creating a ever-changing tapestry of color and magic.</p>\n\n<p>Environmental hazards:</p>\n<ul>\n<li>Red sands that burn with intense heat</li>\n<li>Blue sands that slow movement and induce drowsiness</li>\n<li>Green sands that cause rapid plant growth</li>\n<li>Purple sands that distort perception and cause hallucinations</li>\n</ul>\n\n<p>At the heart of the desert lies the Chromatic Oasis, a lush paradise where all colors of sand swirl together in harmony. It is said that drinking from the oasis grants temporary mastery over the desert's magic.</p>\n\n<p>Desert inhabitants:</p>\n<ol>\n<li>Nomadic tribes that have learned to harness the power of the sands</li>\n<li>Color-shifting predators that blend seamlessly with their surroundings</li>\n<li>Sand elementals of various hues, each with unique abilities</li>\n</ol>\n\n<p>Potential quests:</p>\n<ul>\n<li>Retrieve a rare flower that only grows in a specific sand color combination</li>\n<li>Stop a mad wizard attempting to separate all the sand colors permanently</li>\n<li>Navigate the desert to deliver a crucial message to the isolated Chromatic Oasis</li>\n</ul>",
	},
	{
		content:
			"The Labyrinth of Memories\n\nA mystical maze that exists within the collective unconscious of all sentient beings. Those who enter find themselves navigating through physical manifestations of memories, both their own and those of others.\n\nKey features:\n- Shifting walls that reconstruct based on the thoughts of those nearby\n- Rooms that replay significant events from history or personal lives\n- Shadowy creatures formed from forgotten memories and repressed thoughts\n\nAt the center of the Labyrinth lies the Well of Recollection, a powerful artifact said to grant perfect recall of any memory or lost knowledge. However, reaching it requires confronting one's deepest fears and regrets.\n\nChallenges:\n1. Distinguish between real memories and false ones planted as traps\n2. Overcome emotional obstacles manifested from past traumas\n3. Resist the temptation to become lost in idealized versions of the past\n\nPotential plot hooks:\n- Retrieve a crucial piece of information someone has forgotten\n- Pursue a villain who is hiding within the labyrinth\n- Heal a powerful being whose fractured memories are causing chaos in the real world",
		htmlContent:
			"<h2>The Labyrinth of Memories</h2>\n\n<p>A mystical maze that exists within the collective unconscious of all sentient beings. Those who enter find themselves navigating through physical manifestations of memories, both their own and those of others.</p>\n\n<p>Key features:</p>\n<ul>\n<li>Shifting walls that reconstruct based on the thoughts of those nearby</li>\n<li>Rooms that replay significant events from history or personal lives</li>\n<li>Shadowy creatures formed from forgotten memories and repressed thoughts</li>\n</ul>\n\n<p>At the center of the Labyrinth lies the Well of Recollection, a powerful artifact said to grant perfect recall of any memory or lost knowledge. However, reaching it requires confronting one's deepest fears and regrets.</p>\n\n<p>Challenges:</p>\n<ol>\n<li>Distinguish between real memories and false ones planted as traps</li>\n<li>Overcome emotional obstacles manifested from past traumas</li>\n<li>Resist the temptation to become lost in idealized versions of the past</li>\n</ol>\n\n<p>Potential plot hooks:</p>\n<ul>\n<li>Retrieve a crucial piece of information someone has forgotten</li>\n<li>Pursue a villain who is hiding within the labyrinth</li>\n<li>Heal a powerful being whose fractured memories are causing chaos in the real world</li>\n</ul>",
	},
	{
		content:
			"The Clockwork Forest\n\nA bizarre woodland where nature and machine have fused into a single ecosystem. Trees with gears for leaves, animals with mechanical components, and streams of flowing oil create a unique and dangerous environment.\n\nKey aspects:\n- Flora and fauna that require both biological and mechanical maintenance\n- Unpredictable malfunctions causing environmental hazards\n- Ancient robotic guardians protecting the heart of the forest\n\nAt the center of the Clockwork Forest stands the Grand Calibrator, a massive tree-like structure that regulates the delicate balance between nature and machine. Legends say it was created by a long-lost civilization to harmonize technology with the natural world.\n\nPotential encounters:\n1. Malfunctioning predators with enhanced mechanical abilities\n2. A tribe of druids who have adapted to maintain the forest's machinery\n3. Puzzle-like clearings where players must correct the flow of energy to proceed\n\nAdventure hooks:\n- Investigate why the forest's systems are beginning to break down\n- Retrieve a rare component needed to repair a critical mechanism\n- Stop a group of extremists trying to shift the balance entirely to machine or nature",
		htmlContent:
			"<h2>The Clockwork Forest</h2>\n\n<p>A bizarre woodland where nature and machine have fused into a single ecosystem. Trees with gears for leaves, animals with mechanical components, and streams of flowing oil create a unique and dangerous environment.</p>\n\n<p>Key aspects:</p>\n<ul>\n<li>Flora and fauna that require both biological and mechanical maintenance</li>\n<li>Unpredictable malfunctions causing environmental hazards</li>\n<li>Ancient robotic guardians protecting the heart of the forest</li>\n</ul>\n\n<p>At the center of the Clockwork Forest stands the Grand Calibrator, a massive tree-like structure that regulates the delicate balance between nature and machine. Legends say it was created by a long-lost civilization to harmonize technology with the natural world.</p>\n\n<p>Potential encounters:</p>\n<ol>\n<li>Malfunctioning predators with enhanced mechanical abilities</li>\n<li>A tribe of druids who have adapted to maintain the forest's machinery</li>\n<li>Puzzle-like clearings where players must correct the flow of energy to proceed</li>\n</ol>\n\n<p>Adventure hooks:</p>\n<ul>\n<li>Investigate why the forest's systems are beginning to break down</li>\n<li>Retrieve a rare component needed to repair a critical mechanism</li>\n<li>Stop a group of extremists trying to shift the balance entirely to machine or nature</li>\n</ul>",
	},
	{
		content:
			"The Astral Lighthouse\n\nA colossal structure that stands at the crossroads of multiple planes of existence. Its ever-burning beacon guides travelers through the chaotic seas of the Astral Plane and helps maintain the boundaries between realms.\n\nKey features:\n- Each level of the lighthouse corresponds to a different plane of existence\n- Gravity and physics behave differently as you ascend or descend\n- Windows that offer glimpses into other worlds and times\n\nThe current keepers of the lighthouse are an ancient order of monks who have dedicated their lives to maintaining the cosmic balance. However, recent disturbances suggest that something is interfering with the lighthouse's function.\n\nChallenges:\n1. Navigate the non-Euclidean architecture of the lighthouse\n2. Overcome trials designed to test worthiness to ascend\n3. Resist the lure of other planes visible through the windows\n\nPotential quests:\n- Investigate the source of the disturbances affecting the lighthouse\n- Retrieve a critical component from a dangerous plane to repair the beacon\n- Protect the lighthouse from an invading force that seeks to destabilize reality",
		htmlContent:
			"<h2>The Astral Lighthouse</h2>\n\n<p>A colossal structure that stands at the crossroads of multiple planes of existence. Its ever-burning beacon guides travelers through the chaotic seas of the Astral Plane and helps maintain the boundaries between realms.</p>\n\n<p>Key features:</p>\n<ul>\n<li>Each level of the lighthouse corresponds to a different plane of existence</li>\n<li>Gravity and physics behave differently as you ascend or descend</li>\n<li>Windows that offer glimpses into other worlds and times</li>\n</ul>\n\n<p>The current keepers of the lighthouse are an ancient order of monks who have dedicated their lives to maintaining the cosmic balance. However, recent disturbances suggest that something is interfering with the lighthouse's function.</p>\n\n<p>Challenges:</p>\n<ol>\n<li>Navigate the non-Euclidean architecture of the lighthouse</li>\n<li>Overcome trials designed to test worthiness to ascend</li>\n<li>Resist the lure of other planes visible through the windows</li>\n</ol>\n\n<p>Potential quests:</p>\n<ul>\n<li>Investigate the source of the disturbances affecting the lighthouse</li>\n<li>Retrieve a critical component from a dangerous plane to repair the beacon</li>\n<li>Protect the lighthouse from an invading force that seeks to destabilize reality</li>\n</ul>",
	},
	{
		content:
			"The Carnival of Souls\n\nA mystical traveling carnival that appears in different locations across the multiverse. It offers thrills, entertainment, and the fulfillment of desires... but at a price. The carnival is run by enigmatic beings who collect memories, emotions, and fragments of souls as payment.\n\nAttractions:\n1. The Hall of Mirrors - Reflects possible futures and alternate realities\n2. The Wheel of Fate - A game of chance with life-altering consequences\n3. The Dream-Eater's Tent - Where one can experience their deepest desires\n\nBehind the scenes, the Ringmaster and their crew of supernatural carnies maintain the delicate balance between granting wishes and collecting their due. The true purpose of the Carnival remains a mystery - is it merely entertainment for cosmic entities, or does it serve a greater function in the multiverse?\n\nPotential adventures:\n- Rescue someone who has become trapped in the carnival\n- Investigate the disappearances that follow in the carnival's wake\n- Uncover the Ringmaster's true identity and motivations\n\nWarning: The Carnival of Souls can be an excellent tool for character development, allowing players to explore their characters' desires and fears. However, be sure to establish boundaries and ensure all players are comfortable with the potentially dark themes.",
		htmlContent:
			"<h2>The Carnival of Souls</h2>\n\n<p>A mystical traveling carnival that appears in different locations across the multiverse. It offers thrills, entertainment, and the fulfillment of desires... but at a price. The carnival is run by enigmatic beings who collect memories, emotions, and fragments of souls as payment.</p>\n\n<p>Attractions:</p>\n<ol>\n<li>The Hall of Mirrors - Reflects possible futures and alternate realities</li>\n<li>The Wheel of Fate - A game of chance with life-altering consequences</li>\n<li>The Dream-Eater's Tent - Where one can experience their deepest desires</li>\n</ol>\n\n<p>Behind the scenes, the Ringmaster and their crew of supernatural carnies maintain the delicate balance between granting wishes and collecting their due. The true purpose of the Carnival remains a mystery - is it merely entertainment for cosmic entities, or does it serve a greater function in the multiverse?</p>\n\n<p>Potential adventures:</p>\n<ul>\n<li>Rescue someone who has become trapped in the carnival</li>\n<li>Investigate the disappearances that follow in the carnival's wake</li>\n<li>Uncover the Ringmaster's true identity and motivations</li>\n</ul>\n\n<p><strong>Warning:</strong> The Carnival of Souls can be an excellent tool for character development, allowing players to explore their characters' desires and fears. However, be sure to establish boundaries and ensure all players are comfortable with the potentially dark themes.</p>",
	},
	{
		content:
			"The Fractal Citadel\n\nAn impossibly complex fortress that exists simultaneously on multiple scales. From a distance, it appears as a single massive structure, but as one approaches, infinite smaller copies of itself become visible, each one a perfect replica containing even smaller versions within.\n\nKey features:\n- Rooms and corridors that seamlessly transition between different scales\n- Puzzles and challenges that require manipulating objects at various sizes\n- Inhabitants that exist at different scales, some too small to see, others impossibly large\n\nThe Fractal Citadel is said to house the Lens of Infinity, an artifact that allows the user to perceive and interact with all levels of reality simultaneously. However, the mind-bending nature of the citadel makes reaching the Lens a formidable challenge.\n\nPotential hazards:\n1. Vertigo and disorientation from rapid scale changes\n2. Traps that activate at one scale but have consequences at another\n3. The risk of becoming lost in infinitely recursive spaces\n\nAdventure hooks:\n- Retrieve a specific item hidden somewhere in the citadel's infinite fractal structure\n- Negotiate with the various factions that inhabit different scales of the citadel\n- Prevent a villain from using the Lens of Infinity to unravel the fabric of reality\n\nGM Note: The Fractal Citadel can be an excellent setting for mind-bending puzzles and exploration. Consider using visual aids or props to help players grasp the shifting scales and spatial relationships within the citadel.",
		htmlContent:
			"<h2>The Fractal Citadel</h2>\n\n<p>An impossibly complex fortress that exists simultaneously on multiple scales. From a distance, it appears as a single massive structure, but as one approaches, infinite smaller copies of itself become visible, each one a perfect replica containing even smaller versions within.</p>\n\n<p>Key features:</p>\n<ul>\n<li>Rooms and corridors that seamlessly transition between different scales</li>\n<li>Puzzles and challenges that require manipulating objects at various sizes</li>\n<li>Inhabitants that exist at different scales, some too small to see, others impossibly large</li>\n</ul>\n\n<p>The Fractal Citadel is said to house the Lens of Infinity, an artifact that allows the user to perceive and interact with all levels of reality simultaneously. However, the mind-bending nature of the citadel makes reaching the Lens a formidable challenge.</p>\n\n<p>Potential hazards:</p>\n<ol>\n<li>Vertigo and disorientation from rapid scale changes</li>\n<li>Traps that activate at one scale but have consequences at another</li>\n<li>The risk of becoming lost in infinitely recursive spaces</li>\n</ol>\n\n<p>Adventure hooks:</p>\n<ul>\n<li>Retrieve a specific item hidden somewhere in the citadel's infinite fractal structure</li>\n<li>Negotiate with the various factions that inhabit different scales of the citadel</li>\n<li>Prevent a villain from using the Lens of Infinity to unravel the fabric of reality</li>\n</ul>\n\n<p><strong>GM Note:</strong> The Fractal Citadel can be an excellent setting for mind-bending puzzles and exploration. Consider using visual aids or props to help players grasp the shifting scales and spatial relationships within the citadel.</p>",
	},
];

const fantasyCharacterNames = [
	"Aelindra Moonwhisper",
	"Thorgar Ironheart",
	"Zephyra Stormborn",
	"Caelum Shadowbane",
	"Lyra Dawnbringer",
	"Garrick Flameforge",
	"Elowen Nightshade",
	"Thorne Blackthorn",
	"Isolde Frostweaver",
	"Ragnar Stormcaller",
	"Seraphina Starweaver",
	"Drogon Emberheart",
	"Nymeria Swiftshadow",
	"Alaric Stormbringer",
	"Eilara Moonshadow",
	"Fenris Wolfborn",
	"Celeste Dreamwalker",
	"Azrael Duskblade",
	"Elowen Thornheart",
	"Thaddeus Grimstone",
	"Lilith Shadowdancer",
	"Bjorn Frostbeard",
	"Aria Windsong",
	"Cyrus Blackwater",
	"Freya Silverbranch",
	"Zephyr Cloudrunner",
	"Elara Sunfire",
	"Kael Stormshadow",
	"Ysera Mistwalker",
	"Gareth Ironshield",
];
