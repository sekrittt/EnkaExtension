// fetch(`https://akasha.cv/api/user/748768761`, { method: "GET" }).then(async res => {
//     console.log(await res.text())
// })

let current_version = 0 // version * 10

/**
 *
 * @param {string} charMd5
 * @param {string} uid
 * @param {string?} variant
 * @returns {Promise<{topInTops: {top: string, category: string}, all: {variant: string, top: string}[]}>}
 */
async function getAllTops(charMd5, uid) {
    let resCategories = await fetch(`https://akasha.cv/api/leaderboards/${uid}/${charMd5}`)
    let categories = await resCategories.json()
    let result = []
    let topInTops = {
        top: ``,
        category: ``
    }
    // let maxPriority = Object.entries(temp1.data.calculations).sort((a,b) => b[1].priority - a[1].priority)[0][1].priority
    // Object.entries(temp1.data.calculations).sort((a,b) => b[1].priority - a[1].priority).filter(el => el[1].priority == maxPriority).sort((a,b) => (a[1].ranking/a[1].outOf) - (b[1].ranking/b[1].outOf))
    for (const calculationId in categories.data.calculations) {
        if (Object.hasOwnProperty.call(categories.data.calculations, calculationId)) {
            const calculation = categories.data.calculations[calculationId];
            /**
             * @type {{category: string, ranking: number, outOf: number, result: number}}
             */
            let obj = {
                category: ``,
                ranking: 0,
                outOf: 0,
                result: 0
            }
            if (typeof variant === `string` && typeof calculation.variant !== `undefined`) {
                if (variant != calculation.variant.name) {
                    continue
                }
            }
            obj.ranking = calculation.ranking
            obj.outOf = calculation.outOf
            obj.category = `${calculation.name} - ${calculation.weapon.name} R${calculation.weapon.refinement}`
            if (typeof calculation.variant !== `undefined`) {
                obj.category = `${obj.category} (${calculation.variant.displayName})`
                obj.variantName = calculation.variant.name
            }
            result.push(obj)
        }
    }
    result.sort((a, b) => ((a.ranking / a.outOf) - (b.ranking / b.outOf))).map(el => {
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



    return {
        topInTops,
        all: result
    }
}

async function getNameInLanguage(name, lang) {
    let res = await fetch(`https://akasha.cv/api/textmap/${lang}?words[]=${name.replaceAll(" ", "+")}`)
    let data = await res.json()
    return data?.translation[name.toLowerCase()] ?? name
}

async function getInfo(uid, tab, lang) {
    try {
        await fetch(`https://akasha.cv/api/user/refresh/${uid}`)
    } catch {
        console.warn(`Refresh skipped`)
    }
    let res = await fetch(`https://akasha.cv/api/getCalculationsForUser/${uid}`)
    let data = await res.json()
    let result = {}
    console.log(data)
    for (const char of data.data) {
        let allTops = await getAllTops(char.md5, uid, char.calculations.fit.variant?.name)
        // let top = ``
        // if ((char.calculations.fit.ranking / char.calculations.fit.outOf) < 0.001) {
        //     top = `${char.calculations.fit.ranking}/${char.calculations.fit.outOf}`
        // } else {
        //     top = `${((char.calculations.fit.ranking / char.calculations.fit.outOf) * 100).toFixed(2)}`
        // }
        let obj = {
            top: allTops.topInTops.top,
            category: allTops.topInTops.category,
            allTops: allTops.all
        }
        if (typeof char.calculations.fit.variant !== `undefined`) {
            obj.category = `${obj.category} (${char.calculations.fit.variant.displayName})`
        }
        result[await getNameInLanguage(char.name, lang)] = obj
    }
    chrome.tabs.sendMessage(tab.id, JSON.stringify({ from: `getInfo`, result }))
}

async function hasUpdate(tab = null) {
    const TOKEN = ""
    let res = await fetch("https://api.github.com/repos/sekrittt/EnkaExtension/git/refs/tags", {
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${TOKEN}`,
            "X-Github-Api-Version": "2022-11-28"
        }
    })
    let tags = await res.json()
    let lastTag = tags[tags.length - 1]
    let verCode = [...lastTag.ref.matchAll(/refs\/tags\/Release-(.+)$/g)]?.[0]?.[1] ?? "0"
    if (Math.floor(parseFloat(verCode) * 10) > current_version) {
        if (tab === null) {
            let tabs = await chrome.tabs.query({ url: `https://enka.network/*` })
            for (const tab of tabs) {
                chrome.tabs.sendMessage(tab.id, JSON.stringify({ from: `hasUpdate`, result: { url: `https://github.com/sekrittt/EnkaExtension/releases/tag/Release-${verCode}` } })).catch(console.warn)
            }
        } else {
            chrome.tabs.sendMessage(tab.id, JSON.stringify({ from: `hasUpdate`, result: { url: `https://github.com/sekrittt/EnkaExtension/releases/tag/Release-${verCode}` } })).catch(console.warn)
        }
    }
}

setTimeout(async () => {
    current_version = Math.floor(parseFloat((await chrome.management.getSelf()).version) * 10)
    hasUpdate()
    setInterval(hasUpdate, 5 * 60 * 1000);
}, 5000);


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let { action, uid, lang } = JSON.parse(request)
    console.log(sender)
    switch (action) {
        case "getInfo":
            getInfo(uid, sender.tab, lang)
            break;
        case "checkHasUpdate":
            hasUpdate(sender.tab)
            break;
        default:
            break;
    }
})