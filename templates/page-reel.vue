<template>
    <section :class="classes">
        <div class="panel-top">
            <roster-item
                ref="title"
                class="title"
                :text="page.title"
                element="h2"
                :style="titleStyles"
            />
        </div>

        <div class="panel-bottom">
            <grid-work
                :items="gridItems"
                class="grid"
            >
                <talent-bio
                    :text="bio.text"
                    :abstract="bio.abstract"
                    :image="bio.imageSecondary"
                    :socials="bio.socials"
                />
            </grid-work>
        </div>
    </section>
</template>

<script>
// Helpers
import _clamp from "lodash/clamp"

// Queries
import REEL from "~/gql/queries/Reel"

export default {
    async asyncData({ $graphql, route }) {
        const data = await $graphql.default.request(REEL, {
            uri: route.path
        })
        return {
            page: data?.nodeByUri || {},
            items: data?.nodeByUri?.children?.nodes || {}
        }
    },
    data() {
        return {
            scrollOpacity: 1,
            titleHeight: 0
        }
    },
    computed: {
        classes() {
            return ["page-reel"]
        },
        bio() {
            return {
                ...this.page,
                image: this.page?.featuredImage?.node || {},
                imageSecondary:
                    this.page?.secondaryFeaturedImage?.secondaryFeaturedImage ||
                    {},
                abstract: this.page?.talentMeta?.abstract || "",
                socials: this.page?.talentMeta?.contactInfo || []
            }
        },
        gridItems() {
            // let items = this.page?.children?.nodes?.[1].children?.nodes || []

            return this.items.map((obj) => {
                // Start by flatterning the "attributes"
                return {
                    ...obj,
                    image: obj?.featuredImage?.node || {},
                    imageSecondary:
                        obj?.secondaryFeaturedImage?.secondaryFeaturedImage ||
                        {},
                    tags: obj?.tags?.nodes || [],
                    type: obj?.workMeta?.type || "",
                    text: obj?.workMeta?.excerpt || "",
                    link: obj?.workMeta?.link || "",
                    publication: obj?.workMeta?.publication || "",
                    talent: obj?.workMeta?.talentName || ""
                }
            })
        },
        titleOpacity() {
            // Fade out title as user scrolls content over it
            const titleheight = this.titleHeight
            const scrollTop = this.$store.state.sTop
            console.log("")
            let opacity = _clamp(1 - scrollTop / titleheight, 0.2, 1)
            // Fade out fully when scrolled 25vh
            if (scrollTop >= this.$store.state.winHeight / 4) {
                opacity = 0
            }
            return opacity
        },
        titleStyles() {
            return {
                opacity: this.titleOpacity
            }
        }
    },
    watch: {
        "$store.state.winWidth"() {
            this.setTitleHeight()
        }
    },
    mounted() {
        this.setTitleHeight()
    },
    methods: {
        setTitleHeight() {
            this.titleHeight = this.$refs?.title?.$el?.offsetHeight || 0
        }
    }
}
</script>

<style lang="scss" scoped>
.page-reel {
    color: var(--color-black);
    margin: 0 auto;
    min-height: var(--unit-100vh);
    $bgColor: var(--theme-color-background);

    .panel-top {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(var(--unit-100vh) / 2);
        min-height: 300px;
        z-index: 100;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .title {
        display: block;
        // font-size: 175px;
        font-size: 150px; // updated w/ dave
        line-height: 1;

        text-align: center;
        white-space: break-spaces;
        display: flex;
        flex-direction: column;
        transition: opacity 0.6s var(--easing-authentic-motion);
        ::v-deep .word {
            line-height: 1;
            &:nth-of-type(n) {
                font-style: normal;
                text-transform: inherit;
            }

            &:last-of-type {
                padding-right: 0;
            }
        }
    }
    // TODO: Remove
    /*
    .spacer {
        height: 100px;
        width: 100%;
        background-image: linear-gradient(
            0deg,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        transition: background-color 0.8s var(--easing-authentic-motion);
    }
    .theme-gray & .spacer {
        background: linear-gradient(
            0deg,
            rgba(203, 203, 203, 1) 50%,
            rgba(203, 203, 203, 0) 100%
        );
    }
    */

    .panel-bottom {
        position: relative;
        z-index: 100;
        margin-top: calc(var(--unit-100vh) / 2);
    }

    // Hover states
    @media #{$has-hover} {
        // Hover styles would go here
    }

    /* Breakpoints */
    @media #{$lt-tablet} {
        .title {
            font-size: 125px;
        }
        .panel-top {
            min-height: 150px;
        }
    }
    @media #{$lt-phone} {
        .title {
            font-size: 65px;
        }
    }
}
</style>
