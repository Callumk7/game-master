export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "AI" with the variable name you defined.
	AI: Ai;
}

type Message = {
	role: "user" | "system" | "assistant";
	content: string;
};

type Messages = Message[];

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);
		const params = new URLSearchParams(url.search);
		const q = params.get("q");

		if (!q) {
			return new Response("No q found.");
		}

		const messages = JSON.parse(q) as Messages;
		console.log(messages);

		const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
			messages,
		});

		return Response.json(response);
	},
} satisfies ExportedHandler<Env>;
