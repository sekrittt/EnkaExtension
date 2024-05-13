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
            `"CV очень важна для сравнения сборок)" - © Enka Extension`
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


        chrome.runtime.onMessage.addListener((request) => {
            if (!waitStats)
                return
            stats = JSON.parse(request)
            let charName = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.left.svelte-bzo9tf > div.name.svelte-bzo9tf").childNodes[0].textContent
            if (stats.hasOwnProperty(charName)) {
                if (critValueElement != null) {
                    let t = new Text()
                    t.textContent = `Top: ${stats[charName].top} `
                    critValueElement.querySelector("span").prepend(t)
                }
            }
            waitStats = false
        })

        let subStatsCritDMG = 1
        let subStatsCritRate = 1

        function makeCVElement() {
            let tmp = document.createElement(`div`)
            tmp.innerHTML = `<div class="svelte-bzo9tf" id="critValue"><div style="opacity: 0.7066666666666667" tabindex="-1" class="Substat svelte-13t52ml">
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

            if (subStatsCritDMGEl === null && subStatsCritRateEl === null) {
                isWasDisconnectedMO = true
                stats = null
                return
            }
            critDMG = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.right.svelte-bzo9tf > div:nth-child(5) > div.mainstat.CRITICAL_HURT.svelte-14f9a6o > div:nth-child(2)")
            critRate = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.right.svelte-bzo9tf > div:nth-child(5) > div.mainstat.CRITICAL.svelte-14f9a6o > div:nth-child(2)")

            subStatsCritDMG = parseFloat(subStatsCritDMGEl.textContent)
            subStatsCritRate = parseFloat(subStatsCritRateEl.textContent)
            didYouKnowEl = document.querySelector("body > div > main > content > aside.DidYouKnow > blockquote")

            SSCRSpan.style.fontSize = getComputedStyle(subStatsCritRateEl).fontSize
            SSCDMGSpan.style.fontSize = getComputedStyle(subStatsCritDMGEl).fontSize

            if (critDMG != null) {
                SSCDMGSpan.textContent = `${(subStatsCritDMG + parseFloat(critDMG.textContent)).toFixed(1)}%`
                subStatsCritDMGEl.style.fontSize = "0px"
                subStatsCritDMGEl.append(SSCDMGSpan)
            }
            if (critRate != null) {
                SSCRSpan.textContent = `${(subStatsCritRate + parseFloat(critRate.textContent)).toFixed(1)}%`
                subStatsCritRateEl.style.fontSize = "0px"
                subStatsCritRateEl.append(SSCRSpan)
            }

            if (document.querySelector("#critValue") === null) {
                subStatsPanel = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf")
                critValueElement = makeCVElement()
                subStatsPanel.prepend(critValueElement)
            }
            if (newUid != uid) {
                stats = null
                uid = newUid
                waitStats = true
                chrome.runtime.sendMessage(JSON.stringify({
                    action: "getInfo",
                    uid,
                    lang: document.querySelector("body > div > main > header > menu > div.Dropdown.svelte-1ao5jsp > div.Dropdown-selectedItem.svelte-1ao5jsp").textContent.toLowerCase()
                }))
            }
            critValueElement.querySelector(`span`).textContent = `cv: ${((critDMG != null ? parseFloat(critDMG.textContent) : 0) + subStatsCritDMG + (((critRate != null ? parseFloat(critRate.textContent) : 0) + subStatsCritRate) * 2)).toFixed(1)}`
            let charName = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.left.svelte-bzo9tf > div.name.svelte-bzo9tf").childNodes[0].textContent
            if (stats?.hasOwnProperty(charName)) {
                if (critValueElement != null) {
                    let t = new Text()
                    t.textContent = `Top: ${stats[charName].top} `
                    critValueElement.querySelector("span").prepend(t)
                }
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
            chrome.runtime.sendMessage(JSON.stringify({
                action: "getInfo",
                uid,
                lang: document.querySelector("body > div > main > header > menu > div.Dropdown.svelte-1ao5jsp > div.Dropdown-selectedItem.svelte-1ao5jsp").textContent.toLowerCase()
            }))

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
            subStatsCritDMG = parseFloat(subStatsCritDMGEl?.textContent ?? "0")
            subStatsCritRate = parseFloat(subStatsCritRateEl?.textContent ?? "0")

            SSCRSpan.style.fontSize = getComputedStyle(subStatsCritRateEl).fontSize
            SSCDMGSpan.style.fontSize = getComputedStyle(subStatsCritDMGEl).fontSize

            changedChar.observe(charPanel, { childList: true, subtree: true, attributes: true })
            didYouKnowUpdate.observe(didYouKnowEl, { childList: true, subtree: true, characterData: true })

            if (critDMG != null) {
                SSCDMGSpan.textContent = `${(subStatsCritDMG + parseFloat(critDMG.textContent)).toFixed(1)}%`
                subStatsCritDMGEl.style.fontSize = "0px"
                subStatsCritDMGEl.append(SSCDMGSpan)
            }
            if (critRate != null) {
                SSCRSpan.textContent = `${(subStatsCritRate + parseFloat(critRate.textContent)).toFixed(1)}%`
                subStatsCritRateEl.style.fontSize = "0px"
                subStatsCritRateEl.append(SSCRSpan)
            }

            critValueElement = makeCVElement()
            critValueElement.addEventListener("mouseover", () => {
                document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div").classList.add("CRITICAL", "CRITICAL_HURT", "statFade")
            })
            critValueElement.addEventListener("mouseleave", () => {
                document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div").classList.remove("CRITICAL", "CRITICAL_HURT", "statFade")
            })
            critValueElement.querySelector(`span`).textContent = `cv: ${((critDMG != null ? parseFloat(critDMG.textContent) : 0) + subStatsCritDMG + (((critRate != null ? parseFloat(critRate.textContent) : 0) + subStatsCritRate) * 2)).toFixed(1)}`
            subStatsPanel.prepend(critValueElement)
            if (didYouKnowEl.querySelector('p')?.textContent.toLowerCase() === textWaiting.toLowerCase()) {
                let t = new Text()
                t.textContent = texts[Math.floor(Math.random() * 3)]
                didYouKnowEl.querySelector('p')?.append(t)
            }
        }

        let MOChangedPage = new MutationObserver(() => {
            subStatsCritRateEl = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL > span")
            subStatsCritDMGEl = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL_HURT > span")
            if (/https:\/\/enka\.network\/u\/\d+/g.test(location.href) && !extensionInited && subStatsCritDMGEl !== null && subStatsCritRateEl !== null) {
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


        subStatsCritRateEl = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL > span")
        subStatsCritDMGEl = document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL_HURT > span")
        if (/https:\/\/enka\.network\/u\/\d+/g.test(location.href) && !extensionInited && subStatsCritDMGEl !== null && subStatsCritRateEl !== null) {
            init()
        }
    })
})();