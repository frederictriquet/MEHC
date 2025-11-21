<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    const statuses = ["Pas commencé", "Vote en cours", "Vote terminé"];
    let selectedStatus = $state(data.status);
</script>

<form method="POST" action="?/resetVotes">
    <button>Reset Votes</button>
</form>
<ul
    class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4"
>
    {#each statuses as status, i}
        <li
            class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
        >
            <div class="flex items-center pl-3">
                <form id="statusForm" method="POST" action="?/updateStatus">
                    <input name="status" type="hidden" value={i} />
                    <button class={i === selectedStatus ? "on" : "off"}
                        >{status}</button
                    >
                </form>
            </div>
        </li>
    {/each}
</ul>

<div class="overflow-x-auto relative shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
            class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
            <tr>
                <th class="py-3 px-6">Nom</th>
                <th>Votes</th>
                <th></th>
                <th></th>
                <!-- <th></th> -->
            </tr>
            {#each data.suspects as suspect}
                <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                    <td
                        class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                        <span>{suspect.real_name}</span><form method="POST" action="?/updateSuspectName">
                            <input type="hidden" name="id" value={suspect.id} />
                            <input
                                type="text"
                                name="name"
                                value={suspect.name}
                            />
                            <button>Update</button>
                        </form>
                    </td>
                    <td>{suspect.votes}</td>
                    <td
                        ><a href="/admin/{suspect.id}"
                            ><img
                                alt=""
                                src={suspect.picture_data ?? "/avatar.jpg"}
                            /></a
                        ></td
                    >
                    <td>
                        <form method="POST" action="?/switchSuspectIsPlaying">
                            <input type="hidden" name="id" value={suspect.id} />
                            <button class={suspect.is_playing === 1 ? "on" : "off"}
                                >{suspect.is_playing === 1 ? "ON" : "OFF"}</button
                            >
                        </form>
                    </td>
                    <!-- <td
                        ><form method="POST" action="?/deleteSuspect">
                            <input
                                type="hidden"
                                name="id"
                                value={suspect.id}
                            /><button>delete</button>
                        </form></td
                    > -->
                </tr>
            {/each}
        </thead>
    </table>
</div>
<form method="POST" action="?/createSuspect">
    <div class="flex">
        <label>
            <input
                type="text"
                name="name"
                placeholder="Nom du suspect"
                required
            />
        </label>
        <button>Ajouter suspect</button>
    </div>
</form>

<style>
    button {
        @apply text-white;
        @apply mb-0;
        @apply mt-0;
        @apply bg-blue-700;
        @apply font-medium;
        @apply rounded-lg;
        @apply text-sm;
        @apply px-5;
        @apply py-2.5;
        @apply text-center;
    }
    button.on {
        @apply bg-green-700;
    }
    button.off {
        @apply bg-gray-700;
    }
    input {
        @apply bg-gray-50;
        @apply px-2;
        @apply h-full;
        @apply border;
        @apply border-gray-300;
        @apply text-gray-900;
        @apply text-sm;
        @apply rounded-lg;
        @apply block;
        @apply bg-gray-700;
        @apply border-gray-600;
        @apply placeholder-gray-400;
        @apply text-white;
    }
</style>
