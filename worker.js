// fetch(`https://akasha.cv/api/user/748768761`, { method: "GET" }).then(async res => {
//     console.log(await res.text())
// })

/**
 *
 * @param {string} charMd5
 * @param {string} uid
 * @param {string?} variant
 * @returns {Promise<{variant: string, top: string}[]>}
 */
async function getAllTops(charMd5, uid, variant = null) {
    let resCategories = await fetch(`https://akasha.cv/api/leaderboards/${uid}/${charMd5}`)
    let categories = await resCategories.json()
    let result = []

    for (const calculationId in categories.data.calculations) {
        if (Object.hasOwnProperty.call(categories.data.calculations, calculationId)) {
            const calculation = categories.data.calculations[calculationId];
            let obj = {
                category: ``,
                ranking: 0,
                outOf: 0
            }
            if (typeof variant === `string` && typeof calculation.variant !== `undefined`) {
                if (variant != calculation.variant.name) {
                    console.log(variant, calculation.variant.name)
                    continue
                }
            }
            obj.ranking = calculation.ranking
            obj.outOf = calculation.outOf
            obj.category = `${calculation.name} - ${calculation.weapon.name} R${calculation.weapon.refinement}`
            if (typeof calculation.variant !== `undefined`) {
                obj.category = `${obj.category} (${calculation.variant.displayName})`
            }
            result.push(obj)
        }
    }

    return result.sort((a, b) => ((a.ranking / a.outOf) - (b.ranking / b.outOf))).map(el => {
        obj = {
            category: el.category,
            top: ``
        }
        if ((el.ranking / el.outOf) < 0.001) {
            obj.top = `${el.ranking}/${el.outOf}`
        } else {
            obj.top = `${((el.ranking / el.outOf) * 100).toFixed(2)}%`
        }
        return obj
    })
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
        let allTops = await getAllTops(char.md5, uid, char.calculations.fit.variant?.name)
        let top = ``
        if ((char.calculations.fit.ranking / char.calculations.fit.outOf) < 0.001) {
            top = `${char.calculations.fit.ranking}/${char.calculations.fit.outOf}`
        } else {
            top = `${((char.calculations.fit.ranking / char.calculations.fit.outOf) * 100).toFixed(2)}`
        }
        let obj = {
            top,
            category: `${char.calculations.fit.name} - ${char.calculations.fit.weapon.name} R${char.calculations.fit.weapon.refinement}`,
            allTops
        }
        if (typeof char.calculations.fit.variant !== `undefined`) {
            obj.category = `${obj.category} (${char.calculations.fit.variant.displayName})`
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