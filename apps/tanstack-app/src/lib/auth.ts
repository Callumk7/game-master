export const login = async () => {
	const res = await fetch("http://localhost:3000/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: "user@example.com",
			password: "password",
		}),
	});

	const { token } = (await res.json()) as { token: string };
	localStorage.setItem("jwt_token", token);
};
