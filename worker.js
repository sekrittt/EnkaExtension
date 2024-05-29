// fetch(`https://akasha.cv/api/user/748768761`, { method: "GET" }).then(async res => {
//     console.log(await res.text())
// })

let current_version = 0 // version * 10
let prevLinks = {}

/**
 *
 * @param {string} charMd5
 * @param {string} uid
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

    for (const calculationId in categories.data.calculations) {
        if (Object.hasOwnProperty.call(categories.data.calculations, calculationId)) {
            const calculation = categories.data.calculations[calculationId];
            /**
             * @type {{category: string, ranking: number, outOf: number, result: number}}
             */
            let obj = {
                category: ``,
                ranking: 0,
                outOf: 0
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
            }
            result.push(obj)
        }
    }
    result = result.sort((a, b) => ((a.ranking / a.outOf) - (b.ranking / b.outOf))).map(el => {
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
    let maxPriority = Object.entries(categories.data.calculations).sort((a, b) => b[1].priority - a[1].priority)?.[0]?.[1].priority ?? 0
    let tmp = Object.entries(categories.data.calculations).sort((a, b) => b[1].priority - a[1].priority).filter(el => el[1].priority == maxPriority).sort((a, b) => (a[1].ranking / a[1].outOf) - (b[1].ranking / b[1].outOf))
    if (tmp.length > 0) {
        let el = tmp[0][1]
        topInTops = {
            category: `${el.name} - ${el.weapon.name} R${el.weapon.refinement}`,
            top: ``
        }
        if (typeof el.variant !== `undefined`) {
            topInTops.category = `${topInTops.category} (${el.variant.displayName})`
        }
        if ((el.ranking / el.outOf) < 0.001) {
            topInTops.top = `${el.ranking}/${el.outOf}`
        } else {
            topInTops.top = `${((el.ranking / el.outOf) * 100).toFixed(2)}%`
        }
    }

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
    let res1 = await fetch(`https://akasha.cv/api/builds/?uid=${uid}`)
    let data1 = await res1.json()
    let res2 = await fetch(`https://akasha.cv/api/getCalculationsForUser/${uid}`)
    let data2 = await res2.json()

    let charsId = data2.data.map(el => el.characterId)
    let charsMd5 = data2.data.map(el => el.md5) // ?
    let charsHaveTop = data1.data.filter(el => charsId.includes(el.characterId))
    let charsOnStand = charsHaveTop.filter(el => charsMd5.includes(el.md5))
    let charsOutOfStandAndHaveTop = charsHaveTop.filter(el => !charsMd5.includes(el.md5) && charsId.includes(el.characterId))

    let result = {}
    for (const char of charsOnStand) {
        let allTops = await getAllTops(char.md5, uid)

        let obj = {
            top: allTops.topInTops.top,
            category: allTops.topInTops.category,
            allTops: allTops.all
        }
        result[await getNameInLanguage(char.name, lang)] = obj
        if (char.type !== `current`) {
            result[char.type] = obj
        }
    }
    for (const char of charsOutOfStandAndHaveTop) {
        let allTops = await getAllTops(char.md5, uid)

        let obj = {
            top: allTops.topInTops.top,
            category: allTops.topInTops.category,
            allTops: allTops.all
        }
        // result[await getNameInLanguage(char.name, lang)] = obj
        if (char.type !== `current`) {
            result[char.type] = obj
        }
    }
    console.log(result)
    chrome.tabs.sendMessage(tab.id, JSON.stringify({ from: `getInfo`, result })).catch(console.warn)
}

async function hasUpdate(tabSender = null) {
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
        if (tabSender === null) {
            let tabs = await chrome.tabs.query({ url: `https://enka.network/*` })
            for (const tab of tabs) {
                prevLinks[tab.id] = tab.url.replace(`https://`, ``).replace(`http://`, ``).split(`/`).slice(0, 4).join(`/`)
                chrome.tabs.sendMessage(tab.id, JSON.stringify({ from: `hasUpdate`, result: { url: `https://github.com/sekrittt/EnkaExtension/releases/tag/Release-${verCode}` } })).catch(console.warn)
            }
        } else {
            chrome.tabs.sendMessage(tabSender.id, JSON.stringify({ from: `hasUpdate`, result: { url: `https://github.com/sekrittt/EnkaExtension/releases/tag/Release-${verCode}` } })).catch(console.warn)
        }
    }
}

setTimeout(async () => {
    current_version = Math.floor(parseFloat((await chrome.management.getSelf()).version) * 10)
    hasUpdate()
    setInterval(hasUpdate, 5 * 60 * 1000);
}, 5000);

chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {
    // read changeInfo data and do something with it (like read the url)
    if (changeInfo.url) {
        let changed = true
        if (/https\:\/\/enka.network\/u\/(\w+?)\/.+?\/\d+?\/\d+?/g.test(changeInfo.url) || /https:\/\/enka\.network\/u\/\d+/g.test(changeInfo.url)) {
            if (prevLinks.hasOwnProperty(tab.id)) {
                if (prevLinks[tab.id] === changeInfo.url.replace(`https://`, ``).replace(`http://`, ``).split(`/`).slice(0, 4).join(`/`)) {
                    changed = false
                } else {
                    prevLinks[tab.id] = changeInfo.url.replace(`https://`, ``).replace(`http://`, ``).split(`/`).slice(0, 4).join(`/`)
                }
            }
            if (changed) {
                chrome.tabs.sendMessage(tab.id, JSON.stringify({ from: `checkURLUpdate`, result: { action: `init` } })).catch(console.warn)
            }
        } else if (!(/https\:\/\/enka.network\/u\/(\w+?)\/.+?\/\d+?\/\d+?/g.test(changeInfo.url) || /https:\/\/enka\.network\/u\/\d+/g.test(changeInfo.url)) && changeInfo.url.startsWith(`https://enka.network`)) {
            // chrome.tabs.sendMessage(tab.id, JSON.stringify({ from: `checkURLUpdate`, result: { action: `uninit` } })) // ?
        }

    }
}
);

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