
const chartDom = document.getElementById('main')
const myChart = echarts.init(chartDom)


async function render(data, title) {

    const option = {
        title: {
            text: title || '上海',
            left: 'center',
            textStyle: {
                fontSize: 36,
                fontWeight: 'bold',
                color: '#fff',
                textBorderColor: '#000',
                textBorderWidth: 8,
            }
        },
        tooltip: {
            trigger: 'item'
        },
        bmap: {
            center: [121.48, 31.236],
            zoom: 11,
            roam: true,
            mapStyle: {
                styleJson: [
                    {
                        featureType: 'water',
                        elementType: 'all',
                        stylers: {
                            color: '#d1d1d1'
                        }
                    },
                    {
                        featureType: 'land',
                        elementType: 'all',
                        stylers: {
                            color: '#f3f3f3'
                        }
                    },
                    {
                        featureType: 'railway',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                    },
                    {
                        featureType: 'highway',
                        elementType: 'all',
                        stylers: {
                            color: '#fdfdfd'
                        }
                    },
                    {
                        featureType: 'highway',
                        elementType: 'labels',
                        stylers: {
                            visibility: 'off'
                        }
                    },
                    {
                        featureType: 'arterial',
                        elementType: 'geometry',
                        stylers: {
                            color: '#fefefe'
                        }
                    },
                    {
                        featureType: 'arterial',
                        elementType: 'geometry.fill',
                        stylers: {
                            color: '#fefefe'
                        }
                    },
                    {
                        featureType: 'poi',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                    },
                    {
                        featureType: 'green',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                    },
                    {
                        featureType: 'subway',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                    },
                    {
                        featureType: 'manmade',
                        elementType: 'all',
                        stylers: {
                            color: '#d1d1d1'
                        }
                    },
                    {
                        featureType: 'local',
                        elementType: 'all',
                        stylers: {
                            color: '#d1d1d1'
                        }
                    },
                    {
                        featureType: 'arterial',
                        elementType: 'labels',
                        stylers: {
                            visibility: 'off'
                        }
                    },
                    {
                        featureType: 'boundary',
                        elementType: 'all',
                        stylers: {
                            color: '#fefefe'
                        }
                    },
                    {
                        featureType: 'building',
                        elementType: 'all',
                        stylers: {
                            color: '#d1d1d1'
                        }
                    },
                    // {
                    //   featureType: 'label',
                    //   elementType: 'labels.text.fill',
                    //   stylers: {
                    //     color: '#999999'
                    //   }
                    // }
                ]
            }
        },
        series: [
            {
                name: 'cov',
                type: 'scatter',
                coordinateSystem: 'bmap',
                data,
                symbolSize: function (val) {
                    return val[2]
                },
                encode: {
                    value: 2
                },
                label: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                emphasis: {
                    label: {
                        show: true
                    }
                }
            },
        ]
    }

    myChart.setOption(option)

}

async function drawSingle(url, title) {
    const res = await fetch(url)
    const data = await res.json()
    await render(data, title)
}

async function main() {
    const m = document.URL.match(/map=([a-zA-Z\d]+)/)
    let url = 'map/20220407.json'
    if (m) {
        if (m[1] === 'accumulate') {
            console.log('mode accumulate')
            return await change(true)
        } else if (m[1] === 'single') {
            console.log('mode single')
            return await change(false)
        } else {
            url = `map/${m[1]}.json`
        }
    }
    console.log('mode normal')
    await drawSingle(url, '上海 单日 ' + url.substring(4, 12))
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function change(accumulate) {
    const dataList = [
        // '20220224.json',
        // '20220225.json',
        // '20220226.json',
        // '20220227.json',
        // '20220228.json',
        // '20220301.json',
        // '20220302.json',
        // '20220303.json',
        // '20220304.json',
        // '20220305.json',
        '20220306.json',
        '20220307.json',
        '20220308.json',
        '20220309.json',
        '20220310.json',
        '20220311.json',
        '20220312.json',
        '20220313.json',
        '20220314.json',
        '20220315.json',
        '20220316.json',
        '20220317.json',
        '20220318.json',
        '20220319.json',
        '20220320.json',
        '20220321.json',
        '20220322.json',
        '20220323.json',
        '20220324.json',
        '20220325.json',
        '20220326.json',
        '20220327.json',
        '20220328.json',
        '20220329.json',
        '20220330.json',
        '20220331.json',
        '20220401.json',
        '20220402.json',
        '20220403.json',
        '20220404.json',
        '20220405.json',
        '20220406.json',
        '20220407.json'
    ]
    if (accumulate) {
        let allData = {}
        for (const f of dataList) {
            const url = `map/${f}`
            console.log(url)
            const res = await fetch(url)
            const data = await res.json()
            data.forEach(elem => allData[elem.name] = elem)
            await render(Object.keys(allData).map(key => allData[key]), `上海 累计连续 ${f.substring(0, 8)}`)
            await sleep(2000)
        }
    } else {

        for (const f of dataList) {
            const url = `map/${f}`
            console.log(url)
            const res = await fetch(url)
            const data = await res.json()
            await render(data, `上海 单日连续 ${f.substring(0, 8)}`)
            await sleep(2000)
        }
    }
}

main()
// change()
