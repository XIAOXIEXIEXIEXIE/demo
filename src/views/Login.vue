<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");
const showPassword = ref(false);
const usernameError = ref("");
const passwordError = ref("");

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function handleReset() {
  username.value = "";
  password.value = "";
  usernameError.value = "";
  passwordError.value = "";
}

function handleLogin() {
  usernameError.value = "";
  passwordError.value = "";
  let valid = true;

  if (!username.value.trim()) {
    usernameError.value = "请输入用户名";
    valid = false;
  }
  if (!password.value.trim()) {
    passwordError.value = "请输入密码";
    valid = false;
  }
  if (!valid) return;

  const isAdmin = username.value.trim() === "admin";
  const role = isAdmin ? "admin" : "user";
  router.push({ name: "Home", query: { role } });
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <h1>工单管理系统</h1>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group" :class="{ error: usernameError }">
          <div class="input-wrap">
            <span class="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input
              v-model="username"
              type="text"
              placeholder="请输入用户名"
              autocomplete="username"
              @input="usernameError = ''"
            />
          </div>
          <p class="field-error">{{ usernameError }}</p>
        </div>
        <div class="form-group" :class="{ error: passwordError }">
          <div class="input-wrap">
            <span class="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              autocomplete="current-password"
              @input="passwordError = ''"
            />
            <span class="eye-icon" @click="togglePassword">
              <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </span>
          </div>
          <p class="field-error">{{ passwordError }}</p>
        </div>
        <div class="login-hint">管理员：admin / 任意密码&nbsp;&nbsp;|&nbsp;&nbsp;普通用户：任意值</div>
        <div class="btn-group">
          <button type="submit" class="login-btn">登录</button>
          <button type="button" class="reset-btn" @click="handleReset">重置</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-container {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #667eea 0%, #a18cd1 50%, #f8f9fa 100%);
}

.login-card {
  width: 400px;
  padding: 48px 40px 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 14px;
  margin-bottom: 20px;

  svg {
    width: 28px;
    height: 28px;
    color: #fff;
  }
}

.login-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
}

.form-group {
  margin-bottom: 0;

  &.error input {
    border-color: #e74c3c;
    background: #fff;
  }
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;

  svg {
    width: 18px;
    height: 18px;
    color: #bbb;
  }
}

.eye-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
    color: #bbb;

    &:hover {
      color: #667eea;
    }
  }
}

.form-group input {
  width: 100%;
  padding: 12px 42px;
  font-size: 15px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  background: #fafafa;
  color: #333;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, background 0.2s;

  &:focus {
    border-color: #667eea;
    background: #fff;
  }

  &::placeholder {
    color: #bbb;
  }
}

.field-error {
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  height: 16px;
  color: #e74c3c;
  text-align: left;
}

.login-hint {
  text-align: center;
  font-size: 12px;
  color: #bbb;
  margin-bottom: 16px;
}

.btn-group {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.login-btn {
  padding: 6px 20px;
  font-size: 13px;
  color: #fff;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;

  &:hover {
    opacity: 0.9;
  }
}

.reset-btn {
  padding: 6px 20px;
  font-size: 13px;
  color: #667eea;
  background: #fff;
  border: 2px solid #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #667eea;
    color: #fff;
  }
}
</style>




