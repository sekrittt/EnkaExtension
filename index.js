(() => {
    window.addEventListener("load", () => {
        console.log("Hello Enka.network!")

        let extendedText = document.createElement(`div`)
        /** @type {HTMLElement?} */
        let logoElement = document.querySelector("body > div > main > header > menu > a > span.logo-text")
        extendedText.textContent = "Extended"
        extendedText.style.setProperty("font-size", "0.75em", "important")

        logoElement.style.flexDirection = "column"
        logoElement.style.alignItems = "baseline"
        logoElement.style.justifyContent = "center"
        logoElement.style.paddingLeft = "5px"
        logoElement.style.fontSize = "1em"

        logoElement.append(extendedText)

        let texts = [
            `With Enka Extension CV is here)`,
            `Enka Extension will calculate the CV for you)`,
            `"CV is very important for comparing builds)" - © Enka Extension.`
        ]

        let textWaiting = "Cards generated on the site don't have CV on them. Reason: CV is not real. Never look at CV to increase your damage or team performance."

        let subStatsCritRateEl = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL > span")
        let subStatsCritDMGEl = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL_HURT > span")
        let charPanel = document.querySelector("body > div > main > content > div.CharacterList.fix.svelte-itv4a1")
        let critDMG = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.right.svelte-bzo9tf > div:nth-child(5) > div.mainstat.CRITICAL_HURT.svelte-14f9a6o > div:nth-child(2)")
        let critRate = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.right.svelte-bzo9tf > div:nth-child(5) > div.mainstat.CRITICAL.svelte-14f9a6o > div:nth-child(2)")
        let isWasDisconnectedMO = false
        let extensionInited = false
        let critValueElement = null
        let subStatsPanel = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf")
        let SSCRSpan = document.createElement(`span`)
        let SSCDMGSpan = document.createElement(`span`)
        let stats = null
        let uid = ""
        let waitStats = false
        let didYouKnowEl = document.querySelector("body > div > main > content > aside.DidYouKnow > blockquote")
        let charCard = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div.Card")


        chrome.runtime.onMessage.addListener((request) => {
            if (!waitStats)
                return
            let charCard = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div.Card")
            if (charCard === null)
                return
            stats = JSON.parse(request)
            let charNameEl = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.left.svelte-bzo9tf > div.name.svelte-bzo9tf")
            let charName = charNameEl.childNodes[0].textContent
            if (stats.hasOwnProperty(charName)) {
                if (critValueElement != null) {
                    // let t = new Text()
                    let t = document.createElement(`div`)
                    t.id = `akashaTop`
                    t.textContent = `Top: ${stats[charName].top}`
                    t.style.fontSize = `60%`
                    t.style.color = `#ddd`
                    t.style.zIndex = `9999999999`
                    t.style.pointerEvents = `all`
                    t.title = `Категория: ${stats[charName].variant}`
                    charNameEl.querySelector(`#akashaTop`)?.remove()
                    charNameEl.append(t)
                    // critValueElement.querySelector("span").prepend(t)
                }
            } else {
                charNameEl.querySelector(`#akashaTop`)?.remove()
            }
            waitStats = false
        })


        let subStatsCritDMG = 0
        let subStatsCritRate = 0

        function makeCVElement() {
            let tmp = document.createElement(`div`)
            tmp.innerHTML = `<div class="svelte-bzo9tf" id="critValue"><div style="margin-right: 5px;" tabindex="-1" class="Substat svelte-13t52ml">
        <div class="rolls svelte-13t52ml"></div>
        <span class="svelte-13t52ml"></span>
    </div></div>`
            return tmp.children[0];
        }

        let didYouKnowUpdate = new MutationObserver(() => {
            if (didYouKnowEl.querySelector('p')?.textContent.toLowerCase() === textWaiting.toLowerCase()) {
                let t = document.createElement("strong")
                let br = document.createElement("br")
                t.textContent = texts[Math.floor(Math.random() * 3)]
                didYouKnowEl.querySelector('p')?.append(br)
                didYouKnowEl.querySelector('p')?.append(t)
            }
        })

        let changedChar = new MutationObserver(() => {

            let newUid = [...location.href.matchAll(/https:\/\/enka\.network\/u\/(\d+)/g)][0][1]
            subStatsCritRateEl = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL > span")
            subStatsCritDMGEl = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL_HURT > span")
            charCard = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div.Card")

            if (charCard === null) {
                isWasDisconnectedMO = true
                stats = null
                if (newUid != uid) {
                    uid = newUid
                }
                return
            }
            critDMG = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.right.svelte-bzo9tf > div:nth-child(5) > div.mainstat.CRITICAL_HURT.svelte-14f9a6o > div:nth-child(2)")
            critRate = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.right.svelte-bzo9tf > div:nth-child(5) > div.mainstat.CRITICAL.svelte-14f9a6o > div:nth-child(2)")

            if (subStatsCritDMGEl !== null) {
                subStatsCritDMG = parseFloat(subStatsCritDMGEl.textContent)
                SSCDMGSpan.style.fontSize = getComputedStyle(subStatsCritDMGEl).fontSize
            } else {
                subStatsCritDMG = 0
            }
            if (subStatsCritRateEl !== null) {
                subStatsCritRate = parseFloat(subStatsCritRateEl.textContent)
                SSCRSpan.style.fontSize = getComputedStyle(subStatsCritRateEl).fontSize
            } else {
                subStatsCritRate = 0
            }
            didYouKnowEl = document.querySelector("body > div > main > content > aside.DidYouKnow > blockquote")

            if (critDMG != null) {
                SSCDMGSpan.textContent = `${(subStatsCritDMG + parseFloat(critDMG.textContent)).toFixed(1)}%`
                if (subStatsCritDMGEl !== null) {
                    subStatsCritDMGEl.style.fontSize = "0px"
                    subStatsCritDMGEl.append(SSCDMGSpan)
                }
            }
            if (critRate != null) {
                SSCRSpan.textContent = `${(subStatsCritRate + parseFloat(critRate.textContent)).toFixed(1)}%`
                if (subStatsCritRateEl !== null) {
                    subStatsCritRateEl.style.fontSize = "0px"
                    subStatsCritRateEl.append(SSCRSpan)
                }
            }

            if (document.querySelector("#critValue") === null && (subStatsCritDMGEl !== null || subStatsCritRateEl !== null)) {
                subStatsPanel = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf")
                critValueElement = makeCVElement()
                subStatsPanel.prepend(critValueElement)
                critValueElement.addEventListener("mouseover", () => {
                    if (critDMG === null && critRate === null && subStatsCritDMG === 0 && subStatsCritRate === 0)
                        return
                    document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div").classList.add("CRITICAL", "CRITICAL_HURT", "statFade")
                })
                critValueElement.addEventListener("mouseleave", () => {
                    if (critDMG === null && critRate === null && subStatsCritDMG === 0 && subStatsCritRate === 0)
                        return
                    document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div").classList.remove("CRITICAL", "CRITICAL_HURT", "statFade")
                })
            } else if (document.querySelector("#critValue") !== null && subStatsCritDMGEl === null && subStatsCritRateEl === null) {
                document.querySelector("#critValue").querySelector(`span`).textContent = ``
            }
            let charNameEl = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.left.svelte-bzo9tf > div.name.svelte-bzo9tf")
            let charName = charNameEl.childNodes[0].textContent
            if (newUid != uid) {
                charNameEl.querySelector(`#akashaTop`)?.remove()
                stats = null
                uid = newUid
                waitStats = true
                try {
                    chrome.runtime.sendMessage(JSON.stringify({
                        action: "getInfo",
                        uid,
                        lang: document.querySelector("body > div > main > header > menu > div.Dropdown.svelte-1ao5jsp > div.Dropdown-selectedItem.svelte-1ao5jsp").textContent.toLowerCase()
                    }))
                } catch (error) {
                    location.reload()
                }
            }
            if (critValueElement !== null && (subStatsCritDMGEl !== null || subStatsCritRateEl !== null)) {
                critValueElement.querySelector(`span`).textContent = `cv: ${((critDMG != null ? parseFloat(critDMG.textContent) : 0) + subStatsCritDMG + (((critRate != null ? parseFloat(critRate.textContent) : 0) + subStatsCritRate) * 2)).toFixed(1)}`
            } else if (critValueElement !== null && subStatsCritDMGEl !== null && subStatsCritRateEl !== null) {
                critValueElement.querySelector(`span`).textContent = ``
            }

            if (stats?.hasOwnProperty(charName)) {
                if (critValueElement != null && charNameEl !== null) {
                    // let t = new Text()
                    // t.textContent = `Top: ${stats[charName].top} `

                    let t = document.createElement(`div`)
                    t.id = `akashaTop`
                    t.textContent = `Top: ${stats[charName].top}`
                    t.style.fontSize = `60%`
                    t.style.color = `#ddd`
                    t.style.zIndex = `9999999999`
                    t.style.pointerEvents = `all`
                    t.title = `Категория: ${stats[charName].variant}`
                    charNameEl.querySelector(`#akashaTop`)?.remove()
                    charNameEl.append(t)
                    // critValueElement.querySelector("span").prepend(t)
                }
            } else {
                charNameEl.querySelector(`#akashaTop`)?.remove()
            }
            if (didYouKnowEl !== null) {
                didYouKnowUpdate.observe(didYouKnowEl, { childList: true, subtree: true, characterData: true })
            }
        })




        function init() {
            console.log("Enka extension inited!")
            extensionInited = true

            uid = [...location.href.matchAll(/https:\/\/enka\.network\/u\/(\d+)/g)][0][1]
            waitStats = true
            try {
                chrome.runtime.sendMessage(JSON.stringify({
                    action: "getInfo",
                    uid,
                    lang: document.querySelector("body > div > main > header > menu > div.Dropdown.svelte-1ao5jsp > div.Dropdown-selectedItem.svelte-1ao5jsp").textContent.toLowerCase()
                }))
            } catch (error) {
                location.reload()
            }

            subStatsCritRateEl = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL > span")
            subStatsCritDMGEl = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL_HURT > span")
            charPanel = document.querySelector("body > div > main > content > div.CharacterList.fix.svelte-itv4a1")
            critDMG = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.right.svelte-bzo9tf > div:nth-child(5) > div.mainstat.CRITICAL_HURT.svelte-14f9a6o > div:nth-child(2)")
            critRate = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.right.svelte-bzo9tf > div:nth-child(5) > div.mainstat.CRITICAL.svelte-14f9a6o > div:nth-child(2)")
            isWasDisconnectedMO = false
            critValueElement = null
            subStatsPanel = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf")

            didYouKnowEl = document.querySelector("body > div > main > content > aside.DidYouKnow > blockquote")
            if (subStatsCritDMGEl === null || subStatsCritRateEl === null) {
                // debugger
            }
            if (subStatsCritDMGEl !== null) {
                subStatsCritDMG = parseFloat(subStatsCritDMGEl.textContent)
                SSCDMGSpan.style.fontSize = getComputedStyle(subStatsCritDMGEl).fontSize
            }
            if (subStatsCritRateEl !== null) {
                subStatsCritRate = parseFloat(subStatsCritRateEl.textContent)
                SSCRSpan.style.fontSize = getComputedStyle(subStatsCritRateEl).fontSize
            }

            changedChar.observe(charPanel, { childList: true, subtree: true, attributes: true })
            didYouKnowUpdate.observe(didYouKnowEl, { childList: true, subtree: true, characterData: true })

            if (critDMG != null) {
                SSCDMGSpan.textContent = `${(subStatsCritDMG + parseFloat(critDMG.textContent)).toFixed(1)}%`
                if (subStatsCritDMGEl !== null) {
                    subStatsCritDMGEl.style.fontSize = "0px"
                    subStatsCritDMGEl.append(SSCDMGSpan)
                }
            }
            if (critRate != null) {
                SSCRSpan.textContent = `${(subStatsCritRate + parseFloat(critRate.textContent)).toFixed(1)}%`
                if (subStatsCritRateEl !== null) {
                    subStatsCritRateEl.style.fontSize = "0px"
                    subStatsCritRateEl.append(SSCRSpan)
                }
            }

            critValueElement = makeCVElement()
            critValueElement.addEventListener("mouseover", () => {
                if (critDMG === null && critRate === null && subStatsCritDMG === 0 && subStatsCritRate === 0)
                    return
                document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div").classList.add("CRITICAL", "CRITICAL_HURT", "statFade")
            })
            critValueElement.addEventListener("mouseleave", () => {
                if (critDMG === null && critRate === null && subStatsCritDMG === 0 && subStatsCritRate === 0)
                    return
                document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div").classList.remove("CRITICAL", "CRITICAL_HURT", "statFade")
            })
            if (subStatsCritDMGEl !== null || subStatsCritRateEl !== null) {
                critValueElement.querySelector(`span`).textContent = `cv: ${((critDMG != null ? parseFloat(critDMG.textContent) : 0) + subStatsCritDMG + (((critRate != null ? parseFloat(critRate.textContent) : 0) + subStatsCritRate) * 2)).toFixed(1)}`
                subStatsPanel.prepend(critValueElement)
            }
            if (didYouKnowEl.querySelector('p')?.textContent.toLowerCase() === textWaiting.toLowerCase()) {
                let t = new Text()
                t.textContent = texts[Math.floor(Math.random() * 3)]
                didYouKnowEl.querySelector('p')?.append(t)
            }
        }

        let MOChangedPage = new MutationObserver(() => {
            charCard = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div.Card")
            if (/https:\/\/enka\.network\/u\/\d+/g.test(location.href) && !extensionInited && charCard !== null) {
                init()
            } else if (!(/https:\/\/enka\.network\/u\/\d+/g.test(location.href)) && extensionInited) {
                extensionInited = false
            }
        })
        MOChangedPage.observe(document.querySelector("body > div > main > header"), {
            childList: true,
            subtree: true,
            attributes: true
        })

        if (/https:\/\/enka\.network\/u\/\d+/g.test(location.href) && !extensionInited && charCard !== null) {
            init()
        }
    })
})();