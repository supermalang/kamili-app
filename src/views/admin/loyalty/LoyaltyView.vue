<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Programme de Fidélité</h1>
      <p class="text-gray-600 mt-1">À venir prochainement</p>
    </div>

    <el-card>
      <el-empty description="Cette fonctionnalité sera bientôt disponible">
        <el-button type="primary" @click="$router.push({ name: 'admin-dashboard' })">
          Retour au tableau de bord
        </el-button>
      </el-empty>
    </el-card>
  </div>
</template>

<script setup>
// Implementation coming soon
</script>
