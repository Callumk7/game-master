export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "AI" with the variable name you defined.
	AI: Ai;
}

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);
		const params = new URLSearchParams(url.search);
		const q = params.get("q");
		if (!q) {
			return new Response("No q found.");
		}
		console.log(q)
		const response = await env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
			prompt: "q",
		});

		return new Response(JSON.stringify(response));
	},
} satisfies ExportedHandler<Env>;
