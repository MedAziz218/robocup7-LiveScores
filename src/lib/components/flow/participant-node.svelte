<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	type $$Props = NodeProps;
	export let data: $$Props['data'];
</script>

<div class="svelte-flow__node svelte-flow__node-default vis">
	<div>{data.label}</div>
	<Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
</div>
