<div class="spinner border-indigo-700 border-2 h-12 2-12 rounded-md">
    <div
        class="flex items-center justify-center spinner2 border-indigo-600 w-12 h-12 border-2 rounded-md"
    >
        <div
            class="flex items-center justify-center h-6 w-6 border-indigo-600 border-2 rounded-full"
        >
            <div class="h-2 w-2 bg-indigo-600 rounded-full" />
        </div>
    </div>
</div>

<style>
    /* Define the keyframe animation */
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes spin2 {
        from {
            transform: rotate(45deg);
        }
        to {
            transform: rotate(405deg);
        }
    }

    /* Apply the animation to the spinner element */
    .spinner {
        animation: spin 2s linear infinite;
        animation-timing-function: ease-in-out;
    }

    .spinner2 {
        animation: spin2 2s linear infinite;
        animation-timing-function: ease-in-out;
    }

    .spinner svg {
        animation: rotate 2s linear infinite;
        animation-timing-function: ease-in-out;
    }
</style>
