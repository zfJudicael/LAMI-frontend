<template>
    <Card style="margin-top: 5px;">
        <template #content>
            <h3 style="text-align: center; margin-bottom: 0;">Produits vedus</h3>
            <div style="display: flex; align-items: center; justify-content: right;">
                <DatePicker v-model="selectedDate" view="month" dateFormat="mm/yy" show-icon/>
                <Button icon="pi pi-search" severity="secondary" @click="refreshProductSoldInMonth"/>
            </div>
            <Chart type="bar" :data="chartData" :options="chartOptions" style="height: 60vh;"/>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { OrderService } from '@/modules/order/order.service';
import { onMounted, ref } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';

const selectedDate = ref<Date>()

onMounted(async ()=>{
    selectedDate.value = new Date()
    await refreshProductSoldInMonth()

    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
})


const productsSoldInMonth = ref<{
    productId: number,
    productName: string,
    totalSold: number
}[]>([]) 

const refreshProductSoldInMonth = async ()=>{
    productsSoldInMonth.value = []
    try {
        productsSoldInMonth.value = await OrderService.getProductsSoldInMonth(
            selectedDate.value?.getFullYear() as number, 
            selectedDate.value?.getMonth() as number + 1
        )
        chartData.value = setChartData();
    } catch (error) {}
}

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    let _chartData : {
        labels: string[],
        datasets: [
            {
                label: string,
                backgroundColor: string,
                borderColor: string,
                data: number[],
                // barThickness: number,
                // maxBarThickness: number
            }
        ]
    } = {
        labels: [],
        datasets: [
            {
                label: `Nombre de produits vendus pendant ${selectedDate.value?.getMonth() as number + 1}/${selectedDate.value?.getFullYear() as number}`,
                backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                data: [],
                // barThickness: 40,
                // maxBarThickness: 40
            }
        ]
    };

    productsSoldInMonth.value.map((values)=>{
        _chartData.labels.push(values.productName)
        _chartData.datasets[0].data.push(values.totalSold)
    })

    return _chartData
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        indexAxis: 'y',
        // responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                },
                // barThickness: 30, 
                // maxBarThickness: 30,
                // categoryPercentage: 0.8, // Contrôle l'espacement entre les catégories
                // barPercentage: 0.9, 
            }
        }
    };
}
</script>