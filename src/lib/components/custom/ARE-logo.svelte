<script lang="ts">
    import ARE_Dark from '$lib/imgs/ARE-Logo-DarkMode.png?enhanced';
    import ARE_Light from '$lib/imgs/ARE-Logo-LightMode.png?enhanced';
    
    export let href: string | null = null; // Accepts an optional href prop
</script>

{#if href}
  <a href={href} {...$$restProps}>
    <enhanced:img src={ARE_Light} class="dark:hidden" alt="ARE Logo" />
    <enhanced:img src={ARE_Dark} class="hidden dark:flex" alt="ARE Logo" />
  </a>
{:else}
  <enhanced:img src={ARE_Light} class="flex  dark:hidden" alt="ARE Logo" {...$$restProps} />
  <enhanced:img src={ARE_Dark} class="hidden dark:flex" alt="ARE Logo" {...$$restProps} />
{/if}
