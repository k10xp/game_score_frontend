<template>
  <div class="flex flex-col gap-14 p-10">
    <div class="flex flex-col gap-6 w-max mx-auto items-center">
      <transition name="fade">
        <Toast v-if="toastMessage" :msg="toastMessage" />
      </transition>
      <Header />
    </div>
    <router-view />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';
import Header from '@/views/Header.vue';
import Toast from '@/views/Toast.vue';
import Footer from '@/views/Footer.vue';

// Refs
const toastMessage = ref('');

// Methods
const showToast = (msg: string) => {
  toastMessage.value = msg;
  setTimeout(() => (toastMessage.value = ''), 3000);
};

// Provide
provide('showToast', showToast);
</script>

<style scoped></style>
