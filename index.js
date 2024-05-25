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

        class Extension {
            /** @type {{[x: string]: {top: string, category: string, allTops: {top: string, category: string}[]}[]}?} */
            #stats = {}
            #uidOrAccount = null
            constructor() {
                this.SSCDMGSpan = document.createElement(`span`)
                this.SSCRSpan = document.createElement(`span`)

                this.SSCDMGSpan.style.setProperty("font-size", "0.9em", "important")
                this.SSCRSpan.style.setProperty("font-size", "0.9em", "important")
            }

            get isProfile() {
                return /https\:\/\/enka.network\/u\/(\w+?)\/.+?\/\d+?\/\d+?/g.test(location.href)
            }

            get uidOrAccount() {
                if (this.#uidOrAccount !== null) {
                    return this.#uidOrAccount
                }
                if (this.isProfile) {
                    return this.#uidOrAccount = [...location.href.matchAll(/https\:\/\/enka.network\/u\/(\w+?)\/.+?\/\d+?\/\d+?/g)][0][1]
                }
                return this.#uidOrAccount = [...location.href.matchAll(/https:\/\/enka\.network\/u\/(\d+)/g)][0][1]
            }

            set uidOrAccount(uid) {
                this.#uidOrAccount = uid
            }

            /**
             * @returns {HTMLElement?}
             */
            get subStatsCritDMGEl() {
                if (this.isProfile) {
                    return
                }
                return document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL_HURT > span")
            }

            /**
             * @returns {HTMLElement?}
             */
            get subStatsCritRateEl() {
                if (this.isProfile) {
                    return
                }
                return document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL > span")
            }

            /**
             * @returns {HTMLElement?}
            */
            get critPiece() {
                if (this.isProfile) {
                    return
                }
                return document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.right.svelte-bzo9tf > div:nth-child(5) > div.mainstat.CRITICAL_HURT.svelte-14f9a6o > div:nth-child(2)") ?? document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.right.svelte-bzo9tf > div:nth-child(5) > div.mainstat.CRITICAL.svelte-14f9a6o > div:nth-child(2)")
            }

            /**
             * @returns {"CRIT_RATE" | "CRIT_DMG" | null}
             */
            get critPieceIs() {
                if (this.critPiece !== null) {
                    if (this.critPiece.parentElement.classList.contains("CRITICAL")) {
                        return "CRIT_RATE"
                    } else if (this.critPiece.parentElement.classList.contains("CRITICAL_HURT")) {
                        return "CRIT_DMG"
                    }
                }
                return null
            }

            /**
             * @returns {HTMLElement?}
             */
            get critValueElement() {
                return document.getElementById(`critValue`)
            }


            /**
             * @returns {HTMLElement?}
             */
            get subStatsPanel() {
                if (this.isProfile) {
                    return
                }
                return document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf")
            }

            /**
             * @returns {HTMLElement?}
            */
            get charCard() {
                if (this.isProfile) {
                    return
                }
                return document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div.Card")
            }

            /**
             * @returns {HTMLElement?}
             */
            get charNameEl() {
                if (this.isProfile) {
                    return
                }
                return document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.left.svelte-bzo9tf > div.name.svelte-bzo9tf")
            }

            /**
             * @returns {{[x: string]: {top: string, category: string, allTops: {top: string, category: string}[]}[]}}
             */
            get stats() {
                return this.#stats
            }

            /**
             * @param {{[x: string]: {top: string, category: string, allTops: {top: string, category: string}[]}[]}} v
             */
            set stats(v) {
                this.#stats = v
            }

            get subStatsCritDMG() {
                if (this.subStatsCritDMGEl != null) {
                    return parseFloat(this.subStatsCritDMGEl.textContent)
                }
                return 0
            }
            get subStatsCritRate() {
                if (this.subStatsCritRateEl != null) {
                    return parseFloat(this.subStatsCritRateEl.textContent)
                }
                return 0
            }

            /**
             * @param {{top: string, category: string, allTops: {top: string, category: string}[]}} obj
             */
            setTop(obj) {
                if (this.charNameEl != null) {
                    this.charNameEl.style.position = `relative`
                    let t = document.createElement(`div`)
                    t.id = `akashaTop`
                    t.textContent = `Top: ${obj.top}`
                    t.style.fontSize = `60%`
                    t.style.color = `#ddd`
                    t.style.zIndex = `9999999999`
                    t.style.pointerEvents = `all`
                    let tooltip = document.createElement(`div`)
                    tooltip.style.position = `absolute`
                    tooltip.style.top = `100%`
                    tooltip.style.padding = `7px`
                    tooltip.style.backgroundColor = `rgba(0,0,0,0.5)`
                    tooltip.style.opacity = `0`
                    tooltip.style.zIndex = `9999999999`
                    tooltip.style.borderRadius = "10px"
                    tooltip.style.backdropFilter = "blur(5px)"
                    tooltip.style.transition = `all 300ms ease`
                    tooltip.style.fontSize = "70%"
                    this.charNameEl.querySelector(`#akashaTop`)?.remove()
                    this.charNameEl.append(t)
                    this.charNameEl.append(tooltip)
                    t.addEventListener(`mouseenter`, () => {
                        tooltip.style.opacity = `1`
                    })
                    t.addEventListener(`mouseleave`, () => {
                        tooltip.style.opacity = `0`
                    })
                    tooltip.textContent = `Категория: ${obj.category}`
                    setAllTops(obj.allTops)
                }
            }

            /**
             *
             * @param {{top: string, category: string}[]} tops
             */
            setAllTops(tops) {
                let header = document.createElement(`header`)
                let categories = document.createElement(`div`)

                header.classList.add("svelte-u669bv")
                header.style.marginTop = "2em"
                header.id = "allTopsHeader"
                header.textContent = "Все категории"

                categories.classList.add("row", "svelte-u669bv")
                categories.id = "allTopsCategories"
                categories.style.display = "flex"
                categories.style.flexDirection = "column"
                categories.style.alignItems = "baseline"

                for (const top of tops) {
                    let topEl = document.createElement(`div`)
                    topEl.innerHTML = `<strong>${top.category}:</strong> <i>${top.top}</i>`
                    categories.append(topEl)
                }
                document.getElementById(`allTopsHeader`)?.remove()
                document.getElementById(`allTopsCategories`)?.remove()
                if (this.isProfile) {
                    return
                }
                if (tops.length > 0) {
                    document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.additions.svelte-u669bv").prepend(header, categories)
                }
            }
        }

        let extensionInitialized = false
        let uid = ""
        let waitStats = false
        let didYouKnowEl = document.querySelector("body > div > main aside.DidYouKnow > blockquote")
        let ext = new Extension()

        chrome.runtime.onMessage.addListener((request) => {
            if (!waitStats)
                return
            if (ext.charCard === null || ext.charNameEl === null)
                return
            ext.stats = JSON.parse(request)
            let charName = ext.charNameEl.childNodes[0].textContent
            if (ext.stats.hasOwnProperty(charName)) {
                ext.setTop(ext.stats[charName])
            } else {
                ext.charNameEl.querySelector(`#akashaTop`)?.remove()
                document.getElementById(`allTopsHeader`)?.remove()
                document.getElementById(`allTopsCategories`)?.remove()
            }
            waitStats = false
        })

        function makeCVElement() {
            let tmp = document.createElement(`div`)
            tmp.innerHTML = `<div class="svelte-bzo9tf" id="critValue">
                                <div style="margin-right: 5px;" tabindex="-1" class="Substat svelte-13t52ml">
                                    <div class="rolls svelte-13t52ml"></div>
                                    <span class="svelte-13t52ml"></span>
                                </div>
                            </div>`
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

            if (ext.charCard === null) {
                ext.stats = null
                if (newUid != ext.uid) {
                    ext.uid = newUid
                }
                return
            }

            didYouKnowEl = document.querySelector("body > div > main > content > aside.DidYouKnow > blockquote")

            if (ext.critPiece !== null) {
                if (ext.subStatsCritDMG != 0 && ext.critPieceIs === `CRIT_DMG`) {
                    ext.SSCDMGSpan.textContent = `${(ext.subStatsCritDMG + parseFloat(ext.critPiece.textContent)).toFixed(1)}%`
                    if (ext.subStatsCritDMGEl !== null) {
                        ext.subStatsCritDMGEl.style.fontSize = "0px"
                        ext.subStatsCritDMGEl.append(ext.SSCDMGSpan)
                    }
                }
                if (ext.subStatsCritRate != 0 && ext.critPieceIs === `CRIT_RATE`) {
                    ext.SSCRSpan.textContent = `${(ext.subStatsCritRate + parseFloat(ext.critPiece.textContent)).toFixed(1)}%`
                    if (ext.subStatsCritRateEl !== null) {
                        ext.subStatsCritRateEl.style.fontSize = "0px"
                        ext.subStatsCritRateEl.append(ext.SSCRSpan)
                    }
                }
            }


            if (document.querySelector("#critValue") === null && (subStatsCritDMGEl !== null || subStatsCritRateEl !== null)) {
                critValueElement = makeCVElement()
                ext.subStatsPanel.prepend(critValueElement)
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
                document.getElementById(`allTopsHeader`)?.remove()
                document.getElementById(`allTopsCategories`)?.remove()
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

                    // let t = document.createElement(`div`)
                    // t.id = `akashaTop`
                    // t.textContent = `Top: ${stats[charName].top}`
                    // t.style.fontSize = `60%`
                    // t.style.color = `#ddd`
                    // t.style.zIndex = `9999999999`
                    // t.style.pointerEvents = `all`
                    // t.title = `Категория: ${stats[charName].variant}`
                    // charNameEl.querySelector(`#akashaTop`)?.remove()
                    // charNameEl.append(t)
                    // critValueElement.querySelector("span").prepend(t)

                    setTop(stats[charName])
                }
            } else {
                charNameEl.querySelector(`#akashaTop`)?.remove()
                document.getElementById(`allTopsHeader`)?.remove()
                document.getElementById(`allTopsCategories`)?.remove()
            }
            if (didYouKnowEl !== null) {
                didYouKnowUpdate.observe(didYouKnowEl, { childList: true, subtree: true, characterData: true })
            }
        })




        function init() {
            console.log("Enka extension inited!")
            extensionInitialized = true

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
            if (/https:\/\/enka\.network\/u\/\d+/g.test(location.href) && !extensionInitialized && charCard !== null) {
                init()
            } else if (!(/https:\/\/enka\.network\/u\/\d+/g.test(location.href)) && extensionInitialized) {
                extensionInitialized = false
            }
        })
        MOChangedPage.observe(document.querySelector("body > div > main > header"), {
            childList: true,
            subtree: true,
            attributes: true
        })

        if (/https:\/\/enka\.network\/u\/\d+/g.test(location.href) && !extensionInitialized && charCard !== null) {
            init()
        }
    })
})();