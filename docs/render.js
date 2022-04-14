
const chartDom = document.getElementById('main')
const myChart = echarts.init(chartDom)

function hideSidebar () {
    document.querySelector('#sidebar').style.display = 'none'
}

function showSidebar () {
    document.querySelector('#sidebar').style.display = 'block'
}


async function render(data, title) {

    const option = {
        animation: false,
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
            // 市中心
            center: [121.48, 31.236],
            zoom: 11,
            roam: true,
            mapStyleV2: {
                styleJson: [
                    {
                        "featureType": "districtlabel",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "on"
                        }
                    }, {
                        "featureType": "water",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "on"
                        }
                    }, {
                        "featureType": "poilabel",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "on"
                        }
                    }, {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": {
                            "visibility": "on"
                        }
                    }, {
                        "featureType": "background",
                        "elementType": "geometry",
                        "stylers": {
                            "visibility": "on"
                        }
                    }, {
                        "featureType": "land",
                        "elementType": "geometry",
                        "stylers": {
                            "visibility": "on",
                        }
                    }, {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": {
                            "visibility": "on",
                        }
                    }
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
                    return val[2] * 5
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
                },
                itemStyle: {
                    color: 'rgba(255,0,0,0.3)',
                },
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

let data = null

/**
 * 获取一些数据，最新日期，所有日期列表
 */
async function getData() {
    const res = await fetch('map/latest.json')
    data = await res.json()
    console.log('data', data)
}

async function main() {
    await getData()

    const sidebar = document.querySelector("ul")
    Array.from(['累计动画', '单日动画']).forEach(async (t) => {
        const elem = document.createElement('li')
        const button = document.createElement('button')
        button.textContent = t
        button.addEventListener('click', async () => {
            await change(t === '累计动画')
        })
        elem.appendChild(button)
        sidebar.appendChild(elem)
    })
    Array.from([3, 7, 14]).forEach(async (t) => {
        const elem = document.createElement('li')
        const button = document.createElement('button')
        button.textContent = `最近${t}天`
        const url = `map/${t}days.json`
        button.addEventListener('click', async() => {
            await drawSingle(url, `上海最近${t}天`)
        })
        elem.appendChild(button)
        sidebar.appendChild(elem)
    })
    for (let i = data.dates.length - 1; i > 0; i--) {
        const date = data.dates[i]
        const elem = document.createElement('li')
        const button = document.createElement('button')
        button.textContent = date
        button.addEventListener('click', async () => {
            const url = `map/${date}.json`
            await drawSingle(url, '上海 单日 ' + date)
        })
        elem.appendChild(button)
        sidebar.appendChild(elem)
    }

    const m = document.URL.match(/map=([a-zA-Z\d]+)/)
    
    if (m) {
        if (m[1] === 'accumulate') {
            console.log('mode accumulate')
            return await change(true)
        } else if (m[1] === 'single') {
            console.log('mode single')
            return await change(false)
        } else if (m[1].match(/^20\d{6}$/)) {
            const url = `map/${m[1]}.json`
            return await drawSingle(url, '上海 单日 ' + m[1])
        }
    }

    // 最新时间
    const url = `map/${data.latest}.json`
    return await drawSingle(url, '上海 单日 ' + data.latest)
}

async function change(accumulate) {
    hideSidebar()
    const dataList = data.dates.filter(x => x >= data.start)
    let allData = {}
    for (const f of dataList) {
        const url = `map/${f}.json`
        console.log(url)
        const res = await fetch(url)
        const data = await res.json()
        if (accumulate) {
            data.forEach(elem => allData[elem.name] = elem)
            await render(Object.keys(allData).map(key => allData[key]), `上海 累计连续 ${f.substring(0, 8)}`)
        } else {
            await render(data, `上海 单日连续 ${f.substring(0, 8)}`)
        }
        await sleep(1000)
    }
    showSidebar()
}

main()
