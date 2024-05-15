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
    for (const category of categories.data) {
        for (const weapon of category.weapons) {
            let resVar = await fetch(`https://akasha.cv/api/leaderboards?sort=calculation.result&order=-1&size=1&page=1&filter=[all]1&uids=[uid]${uid}&p=&fromId=&uid=${variant ? "&variant=" + variant : ""}&calculationId=${weapon.calculationId}`)
            let resVar2 = await fetch(`https://akasha.cv/api/leaderboards?sort=calculation.result&order=-1&size=1&page=1&filter=1&uids=&p=&fromId=&uid=${variant ? "&variant=" + variant : ""}&calculationId=${weapon.calculationId}`)
            let v = await resVar.json()

        }
    }
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
        let top = parseFloat(`${((char.calculations.fit.ranking / char.calculations.fit.outOf) * 100).toFixed(2)}`)
        if (top < 0.1) {
            top = `${char.calculations.fit.ranking}/${char.calculations.fit.outOf}`
        }
        let obj = {
            top,
            variant: `${char.calculations.fit.name} - ${char.calculations.fit.weapon.name} R${char.calculations.fit.weapon.refinement}`
        }
        result[await getNameInLanguage(char.name, lang)] = obj
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