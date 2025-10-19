<template>
  <div class="container py-5" style="max-width: 480px">
    <h1 class="mb-4 text-center">ログイン（脆弱デモ）</h1>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">ユーザID</label>
          <input
            v-model="userId"
            type="text"
            class="form-control"
            placeholder="demo-user"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">パスワード</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="password"
          />
        </div>
        <button @click="login" class="btn btn-primary w-100">ログイン</button>
      </div>
    </div>

    <p v-if="error" class="text-danger mt-3">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const userId = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const login = async () => {
  error.value = "";
  try {
    await $fetch("/api/login", {
      method: "POST",
      body: { userId: userId.value, password: password.value },
    });
    router.push("/board");
  } catch (e: any) {
    error.value = e?.data?.message || "ログインに失敗しました";
  }
};
</script>
