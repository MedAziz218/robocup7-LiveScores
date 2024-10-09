<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Home } from 'lucide-svelte';
</script>

<div
	id="bbbb"
	class="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8"
>
	<div class="mx-auto max-w-md text-center">
		<div class="fof">
			<h1>Error {$page.status}</h1>
			{$page.error?.message}
		</div>

		<div class="mt-6">
			<Button
				href="/"
				class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
			>
				<Home class="mr-2 h-4 w-4" />

				Go to Homepage
			</Button>
		</div>
	</div>
</div>

<style>
	.fof {
		font-family: 'Lato', sans-serif;
		color: #888;
		margin: 0;
		text-align: center;
	}

	.fof {
		display: table-cell;
		vertical-align: middle;
	}

	.fof h1 {
		font-size: 50px;
		display: inline-block;
		padding-right: 12px;
		animation: type 0.5s alternate infinite;
	}

	@keyframes type {
		from {
			box-shadow: inset -3px 0px 0px #888;
		}
		to {
			box-shadow: inset -3px 0px 0px transparent;
		}
	}
</style>
