<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { getAuthToken } from '@/data/auth';

interface User {
  id: number;
  username: string;
  role: string;
  entry_created: string;
}

const users = ref<User[]>([]);
const selectedUserId = ref<number | null>(null);
const error = ref<string | null>(null);
const loading = ref(false);

const token = getAuthToken();
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

// Selected user
const selectedUser = computed(() =>
  users.value.find((u) => u.id === selectedUserId.value)
);

// Fetch all users
async function fetchUsers() {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`${API_ENDPOINT}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to load users');
    }

    users.value = await response.json();
  } catch (err: any) {
    error.value = err.message || 'Error loading users';
  } finally {
    loading.value = false;
  }
}

// Toggle role
async function toggleRole() {
  if (!selectedUser.value) return;

  error.value = null;

  const newRole = selectedUser.value.role === 'admin' ? 'user' : 'admin';

  try {
    const response = await fetch(
      `${API_ENDPOINT}/admin/users/${selectedUser.value.id}/role`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update role');
    }

    await fetchUsers();
    selectedUserId.value = null;
  } catch (err: any) {
    error.value = err.message;
  }
}

// Delete user
async function deleteUser() {
  if (!selectedUser.value) return;

  if (!confirm('Are you sure you want to delete this user?')) return;

  error.value = null;

  try {
    const response = await fetch(
      `${API_ENDPOINT}/admin/users/${selectedUser.value.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete user');
    }

    await fetchUsers();
    selectedUserId.value = null;
  } catch (err: any) {
    error.value = err.message;
  }
}

//Capitalize first letter in user role
function capitalize(value: string) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

//Next role (toggle between user and admin)
const nextRole = computed(() => {
  if (!selectedUser.value) return '';
  return selectedUser.value.role === 'admin' ? 'user' : 'admin';
});

onMounted(fetchUsers);
</script>

<template>
  <div class="wrapper p-6 max-w-6xl mx-auto">
    <h1 class="mb-6">User Panel</h1>

    <!-- Error -->
    <div
      v-if="error"
      class="mb-4 p-3 rounded main-border"
      style="border-color: var(--color-error); color: var(--color-error)"
    >
      {{ error }}
    </div>

    <!-- Top Controls -->
    <div class="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div class="flex gap-3">
        <button
          class="button secondary"
          :disabled="!selectedUser"
          @click="toggleRole"
        >
          {{
            selectedUser ? `Make ${capitalize(nextRole)}` : 'Select user'
          }}
        </button>

        <button
          class="button primary"
          :disabled="!selectedUser"
          @click="deleteUser"
        >
          Delete User
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="opacity-70 mb-4">Loading users...</div>

    <!-- Table -->
    <div class="outer-scroll overflow-x-auto main-border p-4">
      <table class="w-full the-table">
        <thead>
          <tr>
            <th></th>
            <th>Username</th>
            <th>Role</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            :class="{ active: selectedUserId === user.id }"
            class="transition-opacity"
            :style="{
              opacity: selectedUserId && selectedUserId !== user.id ? 0.6 : 1,
            }"
          >
            <td>
              <input
                type="radio"
                :value="user.id"
                v-model="selectedUserId"
                class="check"
              />
            </td>

            <td>{{ user.username }}</td>

            <td
              :style="{
                color:
                  user.role === 'admin'
                    ? 'var(--color-success)'
                    : 'var(--color-light)',
              }"
            >
              {{ user.role }}
            </td>

            <td>
              {{ new Date(user.entry_created).toLocaleDateString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
