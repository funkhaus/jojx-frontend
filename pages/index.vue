<template>
    <section :class="classes">
        <div class="panel-top">
            <wp-image
                class="image intro"
                :image="introImage"
                mode="cover"
            />
            <gallery-home
                :items="galleryItems"
                :intro-is-complete="!$store.state.introIsActive"
            />
        </div>

        <div
            v-intersection-observer="{
                rootMargin: '100000% 0px -50% 0px'
            }"
            class="waypoint"
            @has-intersected="onIntersected"
        />

        <div class="panel-bottom">
            <grid-work :items="gridItems" />
        </div>
        <!-- <wp-gutenberg id="content" :blocks="parsedPage.blocks" /> -->
    </section>
</template>

<script>
// Queries
import HOME from "~/gql/queries/Home"

export default {
    transition: "fade",
    async asyncData({ $graphql, route }) {
        const data = await $graphql.default.request(HOME)
        return {
            page: data?.nodeByUri || {}
        }
    },
    computed: {
        classes() {
            return [
                "page-home",
                { "intro-is-complete": !this.$store.state.introIsActive }
            ]
        },
        introImage() {
            return this.page?.featuredImage?.node || {}
        },
        galleryItems() {
            // TODO: get by slug not index
            let items = this.page?.children?.nodes?.[0].children?.nodes || []

            return items.map((obj) => {
                // Start by flatterning the "attributes"
                return {
                    ...obj,
                    image: obj?.featuredImage?.node || {}
                }
            })
        },
        gridItems() {
            let items = this.page?.children?.nodes?.[1].children?.nodes || []

            return items.map((obj) => {
                // Start by flatterning the "attributes"
                return {
                    ...obj,
                    image: obj?.featuredImage?.node || {},
                    imageSecondary:
                        obj?.secondaryFeaturedImage?.secondaryFeaturedImage ||
                        {},
                    tags: obj?.tags?.nodes || [],
                    type: obj?.workMeta?.type || "",
                    link: obj?.workMeta?.link || "",
                    publication: obj?.workMeta?.publication || "",
                    talent: obj?.workMeta?.talentName || "",
                    category: obj?.workMeta?.workCategory || ""
                }
            })
        }
    },
    mounted() {
        if (!this.$store.state.referrer) {
            this.playIntro()
        } else {
            this.endIntro()
        }
    },
    methods: {
        playIntro() {
            this.$store.commit("SET_INTRO", true)

            // start at top
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })

            setTimeout(() => {
                this.endIntro()
            }, 2000)
        },
        endIntro() {
            this.$store.commit("SET_INTRO", false)
        },
        onIntersected(event) {
            if (event.detail.isIntersecting) {
                this.$store.commit("SET_THEME", "gray")
            } else {
                this.$store.commit("SET_THEME", "white")
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page-home {
    min-height: var(--unit-100vh);
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    .panel-top {
        position: relative;
        background-color: var(--color-black);
    }

    .image {
        height: var(--unit-100vh);
        width: auto;
    }

    .panel-bottom {
        height: 100%;
    }

    // Hover states
    @media #{$has-hover} {
        // Hover styles would go here
    }

    // Breakpoints
    @media #{$lt-phone} {
        // Phone styles would go here
    }
}
</style>
