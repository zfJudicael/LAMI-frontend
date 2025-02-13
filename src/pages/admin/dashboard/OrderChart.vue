<template>
    <Card>
        <template #content>
            <h3 style="text-align: center;">Commandes reçues dans les 7 derniers jours</h3>
            <Chart type="line" :data="chart2Data" :options="chart2Options" class="h-[30rem]" />
    
            <h3 style="text-align: center;">Commandes reçues durant les 5 derniers mois</h3>
            <Chart type="line" :data="chart1Data" :options="chart1Options" class="h-[30rem]" />
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Chart from 'primevue/chart';
import { ref, onMounted } from "vue";
import { OrderService } from "@/modules/order/order.service";

onMounted(async () => {
    await refreshOrderCountPerMonth()
    await refreshOrderCountPerPay()
    chart1Data.value = setChart1Data();
    chart1Options.value = setChartOptions();

    chart2Data.value = setChart2Data();
    chart2Options.value = setChartOptions();
});

const orderOrderCountPerMonth = ref<{month: Date, count: number}[]>([])
const refreshOrderCountPerMonth = async ()=>{
    orderOrderCountPerMonth.value = []
    try {
        orderOrderCountPerMonth.value = await OrderService.getOrdersCountPerMonthInLastFiveMonths()
    } catch (error) {}
}

const orderCountPerDay = ref<{day: Date, count: number}[]>([])
const refreshOrderCountPerPay = async ()=>{
    orderCountPerDay.value = []
    try {
        orderCountPerDay.value = await OrderService.getOrdersCountForLastSevenDays()
    } catch (error) {}
}

const chart1Data = ref();
const chart1Options = ref();
        
const setChart1Data = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    let _chartData: {
        labels: Date[],
        datasets: [
            {
                label: string,
                data: number[],
                fill: boolean,
                borderColor: string,
                tension: 0.4
            }
        ]
    } = {
        labels: [],
        datasets: [
            {
                label: 'Commandes réçues',
                data: [],
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                tension: 0.4
            }
        ]
    };

    orderOrderCountPerMonth.value.map((value)=>{
        _chartData.labels.push(value.month)
        _chartData.datasets[0].data.push(value.count)
    })

    return _chartData;
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
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
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}

const chart2Data = ref();
const chart2Options = ref();

const setChart2Data = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    let _chartData: {
        labels: Date[],
        datasets: [
            {
                label: string,
                data: number[],
                fill: boolean,
                borderColor: string,
                tension: 0.4
            }
        ]
    } = {
        labels: [],
        datasets: [
            {
                label: 'Commandes réçues',
                data: [],
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                tension: 0.4
            }
        ]
    };

    orderCountPerDay.value.map((value)=>{
        _chartData.labels.push(value.day)
        _chartData.datasets[0].data.push(value.count)
    })

    return _chartData;
};
</script>