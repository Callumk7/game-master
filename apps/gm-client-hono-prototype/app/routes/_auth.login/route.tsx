
export default function LoginRoute() {
	return (
		<div>
			<form method="post">
				<label htmlFor="email">email</label>
				<input name="email" id="email" />
				<br />
				<label htmlFor="password">Password</label>
				<input type="password" name="password" id="password" />
				<br />
				<button>Continue</button>
			</form>
		</div>
	);
}
