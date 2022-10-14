<template>
    <section :class="classes">
        <roster-item
            ref="title"
            class="title"
            :text="page.title"
            element="h2"
            :style="titleStyles"
        />

        <div class="panel-bottom">
            <grid-work
                :items="gridItems"
                class="grid"
            >
                <talent-bio
                    :text="bio.text"
                    :excerpt="bio.excerpt"
                    :image="bio.image"
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
            titleHeight: 0,
            bottomInView: false
        }
    },
    computed: {
        classes() {
            return ["page-reel", { "bottom-in-view": this.bottomInView }]
        },
        bio() {
            return {
                ...this.page,
                image: this.page?.featuredImage?.node || {},
                imageSecondary:
                    this.page?.secondaryFeaturedImage?.secondaryFeaturedImage ||
                    {}
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
                    link: obj?.workMeta?.link || "",
                    publication: obj?.workMeta?.publication || "",
                    talent: obj?.workMeta?.talentRelationship?.title || ""
                }
            })
        },
        titleOpacity() {
            // Fade out title as user scrolls content over it
            const titleheight = this.titleHeight
            const scrollTop = this.$store.state.sTop
            console.log("")
            let opacity = _clamp(1 - scrollTop / titleheight, 0.2, 1)
            // Fade out fully if at bottom
            if (scrollTop >= this.$store.state.winHeight) {
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

    .title {
        display: block;
        font-size: 175px;
        line-height: 1;

        position: fixed;
        left: 50%;
        top: 100px;
        z-index: 10;
        transform: translate(-50%, 0);

        // margin: 230px auto 100px auto;
        text-align: center;
        white-space: break-spaces;
        display: flex;
        flex-direction: column;

        ::v-deep .word {
            &:nth-of-type(n) {
                font-style: normal;
                text-transform: inherit;
            }

            &:last-of-type {
                padding-right: 0;
            }
        }
    }
    // TODO: Remove and get
    // .spacer {
    //     height: 100px;
    //     width: 100%;
    //     background-image: linear-gradient(
    //         0deg,
    //         rgba(255, 255, 255, 1) 50%,
    //         rgba(255, 255, 255, 0) 100%
    //     );
    //     transition: background-color 0.8s var(--easing-authentic-motion);
    // }

    // .theme-gray & .spacer {
    //     background: linear-gradient(
    //         0deg,
    //         rgba(203, 203, 203, 1) 50%,
    //         rgba(203, 203, 203, 0) 100%
    //     );
    // }

    .panel-bottom {
        position: relative;
        z-index: 100;

        margin-top: 400px;
    }
    // .grid {
    //     background-color: var(--theme-color-background);
    //     transition: background-color 0.8s var(--easing-authentic-motion);
    // }

    // Hover states
    @media #{$has-hover} {
        // Hover styles would go here
    }

    /* Breakpoints */
    @media #{$lt-tablet} {
        .title {
            font-size: 125px;
        }
    }
    @media #{$lt-phone} {
        .title {
            font-size: 65px;
            margin: 210px auto 85px auto;
        }
    }
}
</style>
