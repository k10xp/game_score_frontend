<template>
  <div>Logging out...</div>
</template>

<script setup lang="ts">
import { logout } from '@/data/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
logout();
router.replace('/login');
</script>
