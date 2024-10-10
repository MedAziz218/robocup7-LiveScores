<script>
	import { ModeWatcher } from 'mode-watcher';
	import { SvelteFlowProvider } from '@xyflow/svelte';

	import '../app.css';
</script>

<ModeWatcher defaultMode={'system'} />
<SvelteFlowProvider>
	<slot></slot>
</SvelteFlowProvider>
