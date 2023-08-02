<script lang="ts">
	import { createStore } from '$lib';

	const handleLogin = (event: Event): void => {
		const formData = new FormData(event.target as HTMLFormElement);
		const username = formData.get('username') as string;

		if (username !== '') {
			createStore(username);
			sessionStorage.setItem('username', username);
			window.location.href = 'watchlist';
		}
	};
</script>

<form on:submit|preventDefault={handleLogin}>
	<h1>Enter your username</h1>
	<input required name="username" />
	<button type="submit">Enter</button>
</form>

<style>
	form {
		display: grid;
		justify-content: center;
		align-content: center;
		height: 100vh;
	}
</style>
