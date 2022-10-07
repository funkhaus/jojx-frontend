<template>
    <main :class="classes">
        <!-- This helps with SEO -->
        <wp-seo />

        <global-hamburger />

        <global-logo />

        <nuxt
            class="page"
            keep-alive
            :keep-alive-props="{ include: ['WpMenu', 'WpSeo'] }"
        />
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
            let output = "default"
            switch (this.$route.name) {
                case "index":
                    output = "default"
                    break
            }
            return output
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
    }
}
</script>

<style lang="scss">
.layout-default {
}
</style>
