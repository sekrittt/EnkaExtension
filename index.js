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

        let didYouKnowEl = document.querySelector("body > div > main aside.DidYouKnow > blockquote")
        let didYouKnowUpdate = new MutationObserver(() => {
            if (didYouKnowEl.querySelector('p')?.textContent.toLowerCase() === textWaiting.toLowerCase()) {
                let t = document.createElement("strong")
                let br = document.createElement("br")
                t.textContent = texts[Math.floor(Math.random() * 3)]
                didYouKnowEl.querySelector('p')?.append(br)
                didYouKnowEl.querySelector('p')?.append(t)
            }
        })

        let charVariantChanged = new MutationObserver(() => {
            ext.initUI()
        })

        class Extension {
            /** @type {{[x: string]: {top: string, category: string, allTops: {top: string, category: string}[]}[]}?} */
            #stats = {}
            #uidOrAccount = null
            #waitStats = false
            constructor() {
                this.SSCDMGSpan = document.createElement(`span`)
                this.SSCRSpan = document.createElement(`span`)

                this.SSCDMGSpan.classList.add("svelte-13t52ml")
                this.SSCRSpan.classList.add("svelte-13t52ml")

                chrome.runtime.onMessage.addListener((request) => {
                    if (!this.#waitStats)
                        return
                    if (this.charCard === null || this.charNameEl === null)
                        return
                    this.stats = JSON.parse(request)
                    let charName = this.charNameEl.childNodes[0].textContent
                    if (this.stats.hasOwnProperty(charName)) {
                        this.setTop(this.stats[charName])
                    } else {
                        this.charNameEl.querySelector(`#akashaTop`)?.remove()
                        document.getElementById(`allTopsHeader`)?.remove()
                        document.getElementById(`allTopsCategories`)?.remove()
                    }
                    this.#waitStats = false
                })
            }

            get isProfile() {
                return /https\:\/\/enka.network\/u\/(\w+?)\/.+?\/\d+?\/\d+?/g.test(location.href)
            }

            get supportsPage() {
                return /https\:\/\/enka.network\/u\/(\w+?)\/.+?\/\d+?\/\d+?/g.test(location.href) || /https:\/\/enka\.network\/u\/\d+/g.test(location.href)
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
                    return document.querySelector("body > div > main div.profile-hoyo-layout.UID.svelte-13xvdh > div.card-host.fix.svelte-1meghby > div > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div > div.CRITICAL_HURT > span")
                }
                return document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL_HURT > span")
            }

            /**
             * @returns {HTMLElement?}
             */
            get subStatsCritRateEl() {
                if (this.isProfile) {
                    return document.querySelector("body > div > main div.profile-hoyo-layout.UID.svelte-13xvdh > div.card-host.fix.svelte-1meghby > div > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div > div.CRITICAL > span")
                }
                return document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf > div.svelte-bzo9tf > div.CRITICAL > span")
            }

            /**
             * @returns {HTMLElement?}
            */
            get critPiece() {
                if (this.isProfile) {
                    return document.querySelector("body > div > main div.profile-hoyo-layout.UID.svelte-13xvdh > div.card-host.fix.svelte-1meghby > div > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.right.svelte-bzo9tf > div:nth-child(5) > div.mainstat.CRITICAL_HURT.svelte-14f9a6o > div:nth-child(2)") ?? document.querySelector("body > div > main div.profile-hoyo-layout.UID.svelte-13xvdh > div.card-host.fix.svelte-1meghby > div > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.right.svelte-bzo9tf > div:nth-child(5) > div.mainstat.CRITICAL.svelte-14f9a6o > div:nth-child(2)")
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
                    return document.querySelector("body > div > main div.profile-hoyo-layout.UID.svelte-13xvdh > div.card-host.fix.svelte-1meghby > div > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf")
                }
                return document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.subCount.svelte-bzo9tf")
            }

            /**
             * @returns {HTMLElement?}
            */
            get charCard() {
                return document.querySelector("body > div > main div.card-scroll.svelte-bzo9tf > div.Card")
            }

            /**
             * @returns {HTMLElement?}
             */
            get charNameEl() {
                if (this.isProfile) {
                    return document.querySelector("body > div > main div.profile-hoyo-layout.UID.svelte-13xvdh > div.card-host.fix.svelte-1meghby > div > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.left.svelte-bzo9tf > div.name.svelte-bzo9tf")
                }
                return document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.card-scroll.svelte-bzo9tf > div > div.card-host.svelte-bzo9tf > div.section.left.svelte-bzo9tf > div.name.svelte-bzo9tf")
            }

            /**
             * @returns {HTMLElement?}
             */
            get charVariantsPanel() {
                if (!this.isProfile)
                    return null
                return document.querySelector("body > div > main div.profile-hoyo-layout.UID.svelte-13xvdh > div.card-host.fix.svelte-1meghby > ul.Tabs.svelte-1szmghj.publicProfile")
            }

            /**
             * @returns {string?}
             */
            get charVariant() {
                if (!this.isProfile)
                    return null
                return document.querySelector("body > div > main div.profile-hoyo-layout.UID.svelte-13xvdh > div.card-host.fix.svelte-1meghby > ul.Tabs.svelte-1szmghj.publicProfile > li > div.Tab.saved.svelte-1szmghj.s > span")
            }

            /**
             * @returns {{[x: string]: {top: string, category: string, allTops: {top: string, category: string}[]}[]}}
             */
            get stats() {
                return this.#stats
            }

            /**
             * @param {{[x: string]: {top: string, category: string, allTops: {top: string, category: string}[]}[]}?} v
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
             * @returns {HTMLElement?}
             */
            get charPanel() {
                return document.querySelector("body > div > main div.CharacterList.fix.svelte-itv4a1")
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
                    this.setAllTops(obj.allTops)
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
                    document.querySelector("body > div > main div.profile-hoyo-layout.UID.svelte-13xvdh > div.card-host.fix.svelte-1meghby > div > div.additions.svelte-u669bv").prepend(header, categories)
                    return
                }
                if (tops.length > 0) {
                    document.querySelector("body > div > main > content > div.UID.fix.svelte-1bjby0 > div.additions.svelte-u669bv").prepend(header, categories)
                }
            }
            initUI() {
                if (this.subStatsCritDMG != 0 && this.critPieceIs === `CRIT_DMG`) {
                    this.SSCDMGSpan.textContent = `${(this.subStatsCritDMG + parseFloat(this.critPiece.textContent)).toFixed(1)}%`
                    if (this.subStatsCritDMGEl !== null) {
                        this.subStatsCritDMGEl.style.fontSize = "0px"
                        this.subStatsCritDMGEl.parentElement.append(this.SSCDMGSpan)
                    }
                }
                if (this.subStatsCritRate != 0 && this.critPieceIs === `CRIT_RATE`) {
                    this.SSCRSpan.textContent = `${(this.subStatsCritRate + parseFloat(this.critPiece.textContent)).toFixed(1)}%`
                    if (this.subStatsCritRateEl !== null) {
                        this.subStatsCritRateEl.style.fontSize = "0px"
                        this.subStatsCritRateEl.parentElement.append(this.SSCRSpan)
                    }
                }

                if (this.critValueElement === null && (this.subStatsCritDMGEl !== null || this.subStatsCritRateEl !== null)) {
                    let critValueElement = makeCVElement()

                    critValueElement.addEventListener("mouseover", () => {
                        if (this.critPiece === null && this.subStatsCritDMG === 0 && this.subStatsCritRate === 0)
                            return
                        this.charCard.classList.add("CRITICAL", "CRITICAL_HURT", "statFade")
                    })
                    critValueElement.addEventListener("mouseleave", () => {
                        if (this.critPiece === null && this.subStatsCritDMG === 0 && this.subStatsCritRate === 0)
                            return
                        this.charCard.classList.remove("CRITICAL", "CRITICAL_HURT", "statFade")
                    })
                    critValueElement.querySelector(`span`).textContent = `cv: ${((this.critPieceIs === "CRIT_DMG" ? parseFloat(this.critPiece.textContent) : 0) + this.subStatsCritDMG + (((this.critPieceIs === "CRIT_RATE" ? parseFloat(this.critPiece.textContent) : 0) + this.subStatsCritRate) * 2)).toFixed(1)}`
                    this.subStatsPanel.prepend(critValueElement)
                } else if (this.critValueElement !== null && this.subStatsCritDMGEl === null && this.subStatsCritRateEl === null) {
                    this.critValueElement.querySelector(`span`).textContent = ``
                } else if (this.critValueElement !== null && (this.subStatsCritDMGEl !== null || this.subStatsCritRateEl !== null)) {
                    this.critValueElement.querySelector(`span`).textContent = `cv: ${((this.critPieceIs === "CRIT_DMG" ? parseFloat(this.critPiece.textContent) : 0) + this.subStatsCritDMG + (((this.critPieceIs === "CRIT_RATE" ? parseFloat(this.critPiece.textContent) : 0) + this.subStatsCritRate) * 2)).toFixed(1)}`
                }

                // if (this.subStatsPanel !== null && this.charVariantsPanel !== null) {
                //     this.critValueElement.querySelector(`span`).textContent = `cv: ${((this.critPieceIs === "CRIT_DMG" ? parseFloat(this.critPiece.textContent) : 0) + this.subStatsCritDMG + (((this.critPieceIs === "CRIT_RATE" ? parseFloat(this.critPiece.textContent) : 0) + this.subStatsCritRate) * 2)).toFixed(1)}`
                //     this.subStatsPanel.prepend(critValueElement)
                // }



                if (didYouKnowEl.querySelector('p')?.textContent.toLowerCase() === textWaiting.toLowerCase()) {
                    let t = new Text()
                    t.textContent = texts[Math.floor(Math.random() * 3)]
                    didYouKnowEl.querySelector('p')?.append(t)
                }
            }
            requestStats() {
                this.#waitStats = true
                try {
                    chrome.runtime.sendMessage(JSON.stringify({
                        action: "getInfo",
                        uid: this.uidOrAccount,
                        lang: document.querySelector("body > div > main > header > menu > div.Dropdown.svelte-1ao5jsp > div.Dropdown-selectedItem.svelte-1ao5jsp").textContent.toLowerCase()
                    }))
                } catch (error) {
                    location.reload()
                }
            }
        }

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

        let extensionInitialized = false
        let ext = new Extension()

        let changedChar = new MutationObserver(() => {

            let newUid = ext.isProfile ? [...location.href.matchAll(/https\:\/\/enka.network\/u\/(\w+?)\/.+?\/\d+?\/\d+?/g)][0][1] : [...location.href.matchAll(/https:\/\/enka\.network\/u\/(\d+)/g)][0][1]
            if (ext.charCard === null) {
                ext.stats = null
                if (newUid != ext.uidOrAccount) {
                    ext.uidOrAccount = newUid
                }
                return
            }

            didYouKnowEl = document.querySelector("body > div > main aside.DidYouKnow > blockquote")

            ext.initUI()

            if (ext.isProfile) {
                charVariantChanged.observe(ext.charVariantsPanel, { childList: true, subtree: true, attributes: true }) // ???
            }

            let charName = ext.charNameEl.childNodes[0].textContent
            if (newUid != ext.uidOrAccount) {
                ext.charNameEl.querySelector(`#akashaTop`)?.remove()
                document.getElementById(`allTopsHeader`)?.remove()
                document.getElementById(`allTopsCategories`)?.remove()
                ext.stats = null
                ext.uidOrAccount = newUid
                ext.requestStats()
            }

            if (ext.stats?.hasOwnProperty(charName)) {
                if (ext.critValueElement != null && ext.charNameEl !== null) {
                    ext.setTop(ext.stats[charName])
                }
            } else {
                ext.charNameEl.querySelector(`#akashaTop`)?.remove()
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

            ext.requestStats()

            didYouKnowEl = document.querySelector("body > div > main aside.DidYouKnow > blockquote")

            changedChar.observe(ext.charPanel, { childList: true, subtree: true, attributes: true }) // ???
            if (ext.isProfile) {
                charVariantChanged.observe(ext.charVariantsPanel, { childList: true, subtree: true, attributes: true }) // ???
            }
            didYouKnowUpdate.observe(didYouKnowEl, { childList: true, subtree: true, characterData: true })

            ext.initUI()
        }

        let MOChangedPage = new MutationObserver(() => {
            if (ext.supportsPage && !extensionInitialized && ext.charCard !== null) {
                init()
            } else if (!ext.supportsPage && extensionInitialized) {
                extensionInitialized = false
            }
        })
        MOChangedPage.observe(document.querySelector("body > div > main > header"), {
            childList: true,
            subtree: true,
            attributes: true
        })

        if (ext.supportsPage && !extensionInitialized && ext.charCard !== null) {
            init()
        }
    })
})();