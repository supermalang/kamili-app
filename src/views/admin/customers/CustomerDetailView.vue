<template>
  <div>
    <el-page-header @back="$router.back()" class="mb-6">
      <template #content>
        <h1 class="text-2xl font-bold">Détails du client</h1>
      </template>
    </el-page-header>

    <el-card>
      <el-empty description="Vue à implémenter">
        <el-button type="primary" @click="$router.back()">
          Retour
        </el-button>
      </el-empty>
    </el-card>
  </div>
</template>

<script setup>
// Implementation coming soon
</script>
