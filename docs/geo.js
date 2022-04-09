
function search(keywords, city) {
    return new Promise(solve => {
        (new BMap.Geocoder()).getPoint(keywords, point => {
            if (point) {
                solve(point)
            }
        }, city || "上海市")
    })
}

const ti = document.querySelector("#input")
const to = document.querySelector("#output")
const state = document.querySelector("#state")

document.querySelector("#run").addEventListener("click", async () => {
    state.textContent = '状态'
    const values = ti.value.split('\n')
    let i = 0
    for (let item of values) {
        item = item.trim()
        if (item) {
            const ret = await search(item)
            if (ret['Ze']) {
                delete ret['Ze']
            }
            ret['name'] = item
            to.value = to.value + JSON.stringify(ret) + '\n'
            i++
            state.textContent = `状态 ${i} / ${values.length}`
        }
    }
})

