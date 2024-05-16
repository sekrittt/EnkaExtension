// fetch(`https://akasha.cv/api/user/748768761`, { method: "GET" }).then(async res => {
//     console.log(await res.text())
// })

/**
 *
 * @param {string} charId
 * @param {string} uid
 * @param {string?} variant
 */
async function getAllTops(charId, uid, variant = null) {
    let resCategories = await fetch(`https://akasha.cv/api/v2/leaderboards/categories?characterId=${charId}`)
    let categories = await resCategories.json()
    let result = []
    for (const category of categories.data) {
        for (const weapon of category.weapons) {
            let obj = {
                variant: ``,
                top: ``
            }
            let [resVar, resVar2] = await Promise.all([
                fetch(`https://akasha.cv/api/leaderboards?sort=calculation.result&order=-1&size=1&page=1&filter=[all]1&uids=[uid]${uid}&p=&fromId=&uid=${variant ? "&variant=" + variant : ""}&calculationId=${weapon.calculationId}`),
                fetch(`https://akasha.cv/api/leaderboards?sort=calculation.result&order=-1&size=1&page=1&filter=1&uids=&p=&fromId=&uid=${variant ? "&variant=" + variant : ""}&calculationId=${weapon.calculationId}`)
            ])
            let [v, v2] = await Promise.all([resVar.json(), resVar2.json()])
            let posInTop = v.data[0].index
            let resVar3 = await fetch(`https://akasha.cv/api/getCollectionSize/?variant=charactersLb&hash=${v2.totalRowsHash}`)
            let v3 = await resVar3.json()
            let outOf = v3.totalRows
            if ((posInTop / outOf) < 0.001) {
                obj.top = `${posInTop}/${outOf}`
            } else {
                obj.top = `${((posInTop / outOf) * 100).toFixed(2)}%`
            }
            obj.variant = `${category.name} - ${weapon.name} R${weapon.refinement}`
            result.push(obj)
        }
    }
    return result
}

async function getNameInLanguage(name, lang) {
    let res = await fetch(`https://akasha.cv/api/textmap/${lang}?words[]=${name.replaceAll(" ", "+")}`)
    let data = await res.json()
    return data?.translation[name.toLowerCase()] ?? name
}

async function getInfo(uid, tab, lang) {
    await fetch(`https://akasha.cv/api/user/refresh/${uid}`)
    let res = await fetch(`https://akasha.cv/api/getCalculationsForUser/${uid}`)
    let data = await res.json()
    let result = {}
    for (const char of data.data) {
        let allTops = await getAllTops(char.characterId, uid, char.calculations.fit.variant?.name)
        let top = ``
        if ((char.calculations.fit.ranking / char.calculations.fit.outOf) < 0.001) {
            top = `${char.calculations.fit.ranking}/${char.calculations.fit.outOf}`
        } else {
            top = `${((char.calculations.fit.ranking / char.calculations.fit.outOf) * 100).toFixed(2)}`
        }
        let obj = {
            top,
            variant: `${char.calculations.fit.name} - ${char.calculations.fit.weapon.name} R${char.calculations.fit.weapon.refinement}`,
            allTops
        }
        result[await getNameInLanguage(char.name, lang)] = obj
        console.log(result)
    }
    chrome.tabs.sendMessage(tab.id, JSON.stringify(result))
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let { action, uid, lang } = JSON.parse(request)
    console.log(sender)
    switch (action) {
        case "getInfo":
            getInfo(uid, sender.tab, lang)
            break;

        default:
            break;
    }
})