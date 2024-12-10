<script lang="ts">
  import * as monaco from "monaco-editor";
  import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
  import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
  import { debounce } from "./debounce";
  let ref = $state<HTMLDivElement>();
  let { value = $bindable("") } = $props();
  let editor = $state<monaco.editor.IStandaloneCodeEditor>();

  // @ts-ignore
  globalThis.MonacoEnvironment = {
    getWorker: (_, label) => {
      if (label === "json") return new JsonWorker();
      return new EditorWorker();
    },
  } satisfies monaco.Environment;

  $effect(() => {
    if (!ref) return;
    const e = monaco.editor.create(ref, {
      tabSize: 2,
      language: "json",
    });
    e.onDidChangeModelContent(() => {
      value = e.getValue();
    });
    editor = e;

    return () => e.dispose();
  });
  $effect(() => {
    if (!editor) return;
    if (value !== editor.getValue()) {
      editor.setValue(value);
    }
  });
</script>

<svelte:window onresize={debounce(() => editor?.layout(), 100)} />
<div bind:this={ref} class="size-full"></div>
