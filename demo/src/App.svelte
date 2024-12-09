<script lang="ts">
  import { createVerify } from "apple-app-site-association/sim";
  import Editor from "./Editor.svelte";
  import { getHash, parseHash } from "./hash";

  const uuid = () => window.crypto.randomUUID();

  const getHashOptions = (hash: string): { json: unknown; paths: string[] } => {
    const fallback = {
      json: {
        applinks: {
          details: [
            {
              appIDs: ["HOGE.com.example.app"],
              components: [
                { "#": "nondeeplinking", exclude: true },
                { "/": "/search/" },
              ],
            },
          ],
        },
      },
      paths: ["/search/", "/", "/search/#nondeeplinking"],
    } satisfies { json: unknown; paths: string[] };
    if (!hash) return fallback;
    try {
      return parseHash(hash);
    } catch {
      return fallback;
    }
  };
  const initial = getHashOptions(window.location.hash.slice(1));

  let json = $state(JSON.stringify(initial.json, null, 2));
  let paths = $state(initial.paths.map((p) => ({ id: uuid(), value: p })));
  let verify = $derived(createVerify(json));
</script>

<div class="grid grid-rows-[auto_1fr] h-full">
  <header class="flex justify-between p-4 border-b border-gray-400">
    <h1 class="font-bold">apple-app-site-association check</h1>
    <button
      type="button"
      onclick={() => {
        const hash = getHash(
          json,
          paths.map((p) => p.value)
        );
        const url = new URL(location.href);
        url.hash = hash;
        window.history.replaceState(null, "", url.href);
        navigator.clipboard.writeText(url.href).then(() => {
          alert("URL copied to clipboard");
        });
      }}
    >
      Share
    </button>
  </header>
  <main class="grid grid-cols-2">
    <Editor bind:value={json} />
    <div class="p-4">
      <h2 class="font-bold">Paths</h2>
      <ul class="grid grid-cols-[auto_1fr_auto] gap-1 font-mono">
        {#each paths as path (path.id)}
          <li class="contents">
            <button
              type="button"
              onclick={() => {
                paths = paths.filter((p) => p.id !== path.id);
              }}
              title="Remove"
            >
              -
            </button>
            <span
              class="grow focus-within:outline-2 outline-blue-400/50 rounded-sm"
            >
              <input
                bind:value={path.value}
                class="p-1 border-b border-gray-300 size-full focus:outline-none"
                type="text"
                autocomplete="off"
                data-1p-ignore
              />
            </span>
            {#await verify(path.value)}
              <span>...</span>
            {:then result}
              <output>{result}</output>
            {:catch error}
              <output>{error}</output>
            {/await}
          </li>
        {/each}
        <li class="contents">
          <span></span>
          <button
            type="button"
            onclick={() => paths.push({ id: uuid(), value: "/" })}
          >
            + Add more
          </button>
        </li>
      </ul>
    </div>
  </main>
</div>
