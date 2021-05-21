<template>
    <div id="nav" ref="nav">
        <div id="chart" ref="chartRef"></div>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
    </div>
    <router-view />
</template>
<script>
    import {
        defineComponent,
        ref,
        onMounted
    } from 'vue';
    import {
        createChart
    } from 'lightweight-charts';

    export default defineComponent({
        name: 'App',
        setup() {
            const chartRef = ref()

            onMounted(() => {
                console.log('mounted')
                const chart = createChart(chartRef.value, {
                    width: 400,
                    height: 300
                });
                const lineSeries = chart.addLineSeries();
                lineSeries.setData([{
                        time: "2018-04-18T19:16:00",
                        value: 80.01
                    },
                    {
                        time: '2019-04-12',
                        value: 96.63
                    },
                    {
                        time: '2019-04-13',
                        value: 76.64
                    },
                    {
                        time: '2019-04-14',
                        value: 81.89
                    },
                    {
                        time: '2019-04-15',
                        value: 74.43
                    },
                    {
                        time: '2019-04-16',
                        value: 80.01
                    },
                    {
                        time: '2019-04-17',
                        value: 96.63
                    },
                    {
                        time: '2019-04-18',
                        value: 76.64
                    },
                    {
                        time: '2019-04-19',
                        value: 81.89
                    },
                    {
                        time: '2019-04-20',
                        value: 74.43
                    },
                ]);
            })

            return {
                chartRef
            }
        },
        // methods: {
        //   readRefs: () => {
        //     console.log(aaBtn)
        //     // console.log(this.$refs)
        //   }
        // },
    })
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;
    }

    #nav a {
        font-weight: bold;
        color: #2c3e50;
    }

    #nav a.router-link-exact-active {
        color: #42b983;
    }
</style>