<script lang="ts">
  import { createVerify, validateAASA } from "universal-links-test/sim";
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
  let appIds = $derived.by(() => {
    try {
      const aasa = JSON.parse(json);
      if (!validateAASA(aasa)) throw new Error("Invalid AASA");
      return (
        aasa.applinks?.details?.flatMap((d) => [
          ...(d.appIDs ?? []),
          ...(d.appID ? [d.appID] : []),
        ]) ?? []
      );
    } catch {
      return [];
    }
  });
  let verify = $derived(createVerify(json));
</script>

<div class="grid grid-rows-[auto_1fr] h-screen divide-y">
  <header class="flex justify-between p-4">
    <h1 class="font-bold">universal-links-test demo</h1>
    <div class="flex gap-2 items-center">
      <a
        href="http://github.com/st-tech/apple-app-site-association"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
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
    </div>
  </header>
  <main class="grid md:grid-cols-[1fr_3fr]">
    <div class="p-4 size-full bg-slate-100 md:order-last">
      <h2 class="font-bold">Test Paths</h2>
      <table class="w-full font-mono border-spacing-10">
        <thead>
          <tr>
            <th class="p-1"></th>
            <th class="p-1">path</th>
            {#each appIds as appId (appId)}
              <th class="truncate max-w-6" title={appId}>{appId}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each paths as path (path.id)}
            <tr>
              <td class="w-3">
                <button
                  type="button"
                  onclick={() => {
                    paths = paths.filter((p) => p.id !== path.id);
                  }}
                  title="Remove"
                >
                  -
                </button>
              </td>
              <td class="p-1">
                <span
                  class="focus-within:outline-2 outline-blue-400/50 rounded-sm"
                >
                  <input
                    bind:value={path.value}
                    id={path.id}
                    class="p-1 bg-white border-b border-gray-300 size-full focus:outline-none"
                    type="text"
                    autocomplete="off"
                    data-1p-ignore
                  />
                </span>
              </td>
              {#await verify(path.value) then result}
                {#each appIds as appId (appId)}
                  {@const res = result.get(appId)}
                  <td
                    class={res === "match"
                      ? "text-emerald-700"
                      : res === "block"
                        ? "text-orange-600"
                        : "text-gray-500"}
                  >
                    {res ?? "unset"}
                  </td>
                {/each}
              {/await}
            </tr>
          {/each}
          <tr>
            <td class="p-1"></td>
            <td class="p-1">
              <button
                type="button"
                onclick={() => paths.push({ id: uuid(), value: "/" })}
              >
                + Add more
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <ul class="grid grid-cols-[auto_1fr_auto] gap-1 font-mono">
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
              class="grow bg-white focus-within:outline-2 outline-blue-400/50 rounded-sm"
            >
              <input
                bind:value={path.value}
                id={path.id}
                class="p-1 border-b border-gray-300 size-full focus:outline-none"
                type="text"
                autocomplete="off"
                data-1p-ignore
              />
            </span>
            {#await verify(path.value)}
              <span>...</span>
            {:then result}
              <output
                for={path.id}
                class={result === "match"
                  ? "text-emerald-700"
                  : result === "block"
                    ? "text-orange-600"
                    : "text-gray-500"}
              >
                {result}
              </output>
            {:catch}
              <output class="text-red-700">error</output>
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
      </ul> -->
    </div>
    <Editor bind:value={json} />
  </main>
</div>
