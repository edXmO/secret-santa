<script lang="ts">
    import { fly } from "svelte/transition";
    let shown = false;

    export function show() {
        shown = true;
    }

    export function hide() {
        shown = false;
    }
</script>

{#if shown}
    <div
        class="fixed flex items-center justify-center top-0 left-0 w-screen h-screen rounded-md bg-black/40"
    >
        <div
            in:fly={{ delay: 125, y: 20 }}
            out:fly={{ delay: 125, y: 20 }}
            class="bg-slate-800 rounded-xl w-4/5 md:w-1/3 h-[90%]"
        >
            <slot />
        </div>
    </div>
{/if}
