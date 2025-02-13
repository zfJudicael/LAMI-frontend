<template>
    <div class="dashboard">
        <AmountDashboard />
        <OrderChart />
        <ProductChart />
        <PaymentRefundChart />
    </div>
</template>

<script setup lang="ts">
import OrderChart from './OrderChart.vue';
import PaymentRefundChart from './Payment&RefundChart.vue';
import ProductChart from './ProductChart.vue';
import AmountDashboard from './AmountDashboard.vue';
</script>