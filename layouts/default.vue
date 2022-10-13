<template>
    <main :class="classes">
        <!-- This helps with SEO -->
        <wp-seo />

        <global-hamburger
            :is-open="$store.state.menuIsOpen"
            @interacted="toggleMenu"
        />

        <panel-menu
            :is-open="$store.state.menuIsOpen"
            @interacted="toggleMenu"
        />

        <global-logo v-if="showLogo" />

        <transition-group>
            <global-nav
                v-if="!showNav"
                key="back"
                class="nav back"
                to="../"
                text="back"
            />

            <global-nav
                v-if="showNav"
                key="directors"
                class="nav directors"
                :to="'/directors/'"
                text="directors"
            />

            <global-nav
                v-if="showNav"
                key="studio"
                class="nav studio"
                :to="'/studio/'"
                text="studio"
            />

            <global-nav
                v-if="showNav"
                key="info"
                class="nav info"
                :to="'/info/'"
                text="info"
            />
        </transition-group>

        <nuxt
            class="page"
            keep-alive
            :keep-alive-props="{ include: ['WpMenu', 'WpSeo'] }"
        />

        <global-footer v-if="showFooter" />
    </main>
</template>

<script>
// Helpers
import _get from "lodash/get"
import _kebabCase from "lodash/kebabCase"
import metaDefaults from "~/utils/metaDefaults"
import titleTemplate from "~/utils/titleTemplate"

export default {
    head() {
        return {
            htmlAttrs: {
                lang: "en"
            },
            bodyAttrs: {
                class: this.bodyClasses,
                style: this.bodyStyles
            },
            titleTemplate(titleChunk) {
                return titleTemplate(this, titleChunk)
            },
            meta: metaDefaults(this)
        }
    },
    computed: {
        bodyClasses() {
            const classes = ["body", `theme-${this.themeName}`]
            classes.push(`route-${_kebabCase(this.$route.name || "error")}`)

            // This is how you add a class conditionally
            // this.foo && classes.push("foo")

            return classes.join(" ")
        },
        bodyStyles() {
            // This fixes the 100vh iOS bug/feature.
            // If less than most tablets, set var to window height.
            const winWidth = this.$store.state.winWidth
            let value = "100vh"
            if (winWidth && winWidth <= 1024) {
                value = `${this.$store.state.winHeight}px`
            }
            return `--unit-100vh: ${value};`
        },
        classes() {
            return [
                "layout",
                "layout-default",
                "main",
                `breakpoint-${this.breakpoint}`,
                { "menu-opened": this.$store.state.menuOpened },
                { "is-scrolled": this.$store.state.sTop > 0 },
                `scrolling-${this.$store.state.scrollDirection}`
            ]
        },
        themeName() {
            let output = "white"
            switch (this.$route.name) {
                case "index":
                    // output = "white"
                    output = this.$store.state.theme || "white"
                    break
                case "directors":
                case "directors-director-detail":
                case "studio":
                case "studio-studio-detail":
                    output = "black"
                    break
            }
            return output
        },
        showLogo() {
            let show = true
            switch (this.$route.name) {
                case "directors":
                case "studio":
                    show = false
                    break
            }
            return show
        },
        showFooter() {
            let show = true
            switch (this.$route.name) {
                case "directors":
                case "studio":
                case "info":
                    show = false
                    break
            }
            return show
        },
        showNav() {
            let show = true
            switch (this.$route.name) {
                case "directors-director-detail":
                case "studio-studio-detail":
                    show = false
                    break
            }
            return show
        },
        breakpoint() {
            const winWidth = this.$store.state.winWidth
            let breakpoint = "desktop"

            switch (true) {
                case winWidth == 0:
                    breakpoint = "desktop"
                    break

                case winWidth <= 1024:
                    breakpoint = "mobile"
                    break

                default:
                    breakpoint = "desktop"
            }

            return breakpoint
        }
    },
    watch: {
        breakpoint: {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal != oldVal) {
                    this.$store.commit("SET_BREAKPOINT", newVal)
                }
            }
        }
    },
    methods: {
        toggleMenu(bool) {
            this.$store.commit("SET_MENU", bool)
        }
    }
}
</script>

<style lang="scss">
.layout-default {
    .nav.directors {
        top: 0;
        left: var(--unit-gap);
        transform: rotate(90deg) translate(20%, 0%);
    }
    .nav.studio,
    .nav.back {
        top: var(--unit-gap);
        right: var(--unit-gap);
        transform: rotate(90deg) translate(0%, -150%);
        transform-origin: center;
    }

    .nav.info {
        bottom: var(--unit-gap);
        right: var(--unit-gap);
        transform: rotate(90deg) translate(10%, -40%);
        transform-origin: right;
    }
}
</style>
