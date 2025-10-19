<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="h3 m-0">掲示板（脆弱デモ）</h1>
      <div>
        <button class="btn btn-outline-secondary me-2" @click="goLogin">
          ログアウト
        </button>
      </div>
    </div>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">メッセージ</label>
          <input
            v-model="message"
            type="text"
            class="form-control"
            placeholder="<b>HTML</b> もOK（XSSデモ）"
          />
        </div>
        <button class="btn btn-primary" @click="postMessage">投稿</button>
      </div>
    </div>

    <div class="list-group">
      <div v-for="m in messages" :key="m.id" class="list-group-item">
        <div class="small text-muted">
          {{ m.userId }} / {{ new Date(m.createdAt).toLocaleString() }}
        </div>
        <!-- ⚠️ 脆弱: v-html によるXSSの温床 -->
        <div class="mt-1" v-html="m.content"></div>
      </div>
    </div>

    <p v-if="error" class="text-danger mt-3">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";

const router = useRouter();
const message = ref("");
const messages = ref<any[]>([]);
const error = ref("");

const fetchMessages = async () => {
  try {
    const data = await $fetch("/api/messages", { credentials: "include" });
    messages.value = data.items;
  } catch (e: any) {
    error.value = e?.data?.message || "一覧取得に失敗しました";
  }
};

const postMessage = async () => {
  error.value = "";
  try {
    await $fetch("/api/messages", {
      method: "POST",
      credentials: "include",
      body: { content: message.value },
    });
    message.value = "";
    await fetchMessages();
  } catch (e: any) {
    error.value = e?.data?.message || "投稿に失敗しました";
  }
};

const goLogin = () => {
  router.push("/login");
};

onMounted(() => {
  fetchMessages();
});
</script>
