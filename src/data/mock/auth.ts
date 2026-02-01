import { ref } from 'vue';
export const authenticated = ref(true);

export function login() {
  authenticated.value = true;
}

export function logout() {
  authenticated.value = false;
}
