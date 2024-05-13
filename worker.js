// fetch(`https://akasha.cv/api/user/748768761`, { method: "GET" }).then(async res => {
//     console.log(await res.text())
// })

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
        let obj = {
            top: `${((char.calculations.fit.ranking / char.calculations.fit.outOf) * 100).toFixed(2)}%`,
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