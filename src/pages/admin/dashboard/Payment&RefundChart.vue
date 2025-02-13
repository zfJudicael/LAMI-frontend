<template>
        <div class="payment&Refund" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; margin: 5px;">
            <Card>
                <template #content>
                    <h3 style="text-align: center;">Paiements cumulés</h3>
                    <Chart type="pie" class="chart1" :data="chart1Data" :options="chart1Options" style="height: 400px; width: 400px; margin-left: auto; margin-right: auto;"/>
                    <div>
                        <table style="width: 70%; margin-left: auto; margin-right: auto;">
                            <thead>
                                <tr style="font-weight: bold;">
                                    <td style="text-align: center;">Méthode</td>
                                    <td style="text-align: center;">Total</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="paymentMethodCount in paymentMethodCountList">
                                    <td>{{ paymentMethodCount.method }}</td>
                                    <td style="text-align: center;">{{ paymentMethodCount.count }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </Card>
            <Card>
                <template #content>
                    <h3 style="text-align: center;">Paiements et remboursements</h3>
                    <Chart type="pie" class="chart2" :data="chart2Data" :options="chart2Options" style="height: 400px; width: 400px; margin-left: auto; margin-right: auto;"/>
                    <table style="width: 80%; margin-left: auto; margin-right: auto;">
                        <tbody>
                            <tr>
                                <td>Paiements</td>
                                <td>{{ paymentCount }}</td>
                            </tr>
                            <tr>
                                <td>Remboursements</td>
                                <td>{{ refundCount }}</td>
                            </tr>
                        </tbody>
                    </table>
                </template>
            </Card>
        </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import { methodes, type IPaymentMethodCount } from '@/models/Payment';
import { PaymentService } from '@/modules/payment/payment.service';
import { RefundService } from '@/modules/refund/refund.service';
import { onMounted, ref } from 'vue';

const chart1Data = ref();
const chart1Options = ref();
const paymentMethodCountList = ref<IPaymentMethodCount[]>([])
const refundCount = ref<number>(0)
const paymentCount = ref<number>(0)

onMounted(async ()=>{
    await refreshPaymentMethodCountList()
    await refreshRefundCount()
    await refreshPaymentCount()
    configureChart1()
    configureChart2()
})

const refreshPaymentMethodCountList = async ()=>{
    paymentMethodCountList.value = []
    try {
        paymentMethodCountList.value = await PaymentService.getPaymentMethodCount()    
    } catch (error) {}
}

const refreshRefundCount = async ()=>{
    refundCount.value = 0
    try {
        refundCount.value = (await RefundService.getRefundCount()).refundCount
    } catch (error) {}
}

const refreshPaymentCount = async ()=>{
    paymentCount.value = 0
    try {
        paymentCount.value = (await PaymentService.getPaymentCount()).paymentCount
    } catch (error) {}
}

const setChart1Data = () => {
    let chartData : {
        labels: string[],
        datasets: [{
            data: number[],
            backgroundColor: string[],
            hoverBackgroundColor: string[]
        }],
    } = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: []
        }],
    } 
    paymentMethodCountList.value.map((values)=>{
        switch(values.method){
            case methodes[0].methodeName :
                chartData.labels.push(values.method)
                chartData.datasets[0].data.push(values.count)
                chartData.datasets[0].backgroundColor.push('green')
                chartData.datasets[0].hoverBackgroundColor.push('green')
                break;

            case methodes[1].methodeName :
                chartData.labels.push(values.method)
                chartData.datasets[0].data.push(values.count)
                chartData.datasets[0].backgroundColor.push('orange')
                chartData.datasets[0].hoverBackgroundColor.push('orange')
                break;

            case methodes[2].methodeName :
                chartData.labels.push(values.method)
                chartData.datasets[0].data.push(values.count)
                chartData.datasets[0].backgroundColor.push('red')
                chartData.datasets[0].hoverBackgroundColor.push('red')
                break;

            default :
                chartData.labels.push(values.method)
                chartData.datasets[0].data.push(values.count)
                chartData.datasets[0].backgroundColor.push('blue')
                chartData.datasets[0].hoverBackgroundColor.push('blue')
                break;
        }
            
    })

    return chartData
};

const setChart1Options = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
};

const configureChart1 = ()=>{
    chart1Data.value = setChart1Data();
    chart1Options.value = setChart1Options();
}


const chart2Data = ref()
const chart2Options = ref()

const setChart2Data = ()=>{
    let chartData : {
        labels: string[],
        datasets: [{
            data: number[],
            backgroundColor: string[],
            hoverBackgroundColor: string[]
        }],
    } = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: []
        }],
    }

    chartData.labels.push('Paiements'),
    chartData.datasets[0].data.push(paymentCount.value)
    chartData.datasets[0].backgroundColor.push('lightblue')
    chartData.datasets[0].hoverBackgroundColor.push('lightblue')

    chartData.labels.push('Remboursements'),
    chartData.datasets[0].data.push(refundCount.value)
    chartData.datasets[0].backgroundColor.push('gray')
    chartData.datasets[0].hoverBackgroundColor.push('gray')

    return chartData
}

const setChart2Options = ()=>{
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
}
const configureChart2 = ()=>{
    chart2Data.value = setChart2Data()
    chart2Options.value = setChart2Options()
}
</script>