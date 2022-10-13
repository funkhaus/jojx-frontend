<template>
    <section class="page-reel">
        <roster-item
            class="title"
            :text="page.title"
            element="h2"
        />

        <grid-work :items="gridItems">
            <talent-bio
                :text="bio.text"
                :excerpt="bio.excerpt"
                :image="bio.image"
            />
        </grid-work>
    </section>
</template>

<script>
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
    computed: {
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
        }
    }
}
</script>

<style lang="scss" scoped>
.page-reel {
    color: var(--color-black);
    margin: 0 auto;
    min-height: var(--unit-100vh);

    .title {
        display: block;
        font-size: 175px;
        line-height: 1;

        margin: 230px auto 100px auto;
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

    // DELETE
    .items {
        padding: 0;
        margin: 0;
        list-style: none;
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
    }
    @media #{$lt-phone} {
        .title {
            font-size: 65px;
            margin: 210px auto 85px auto;
        }
    }
}
</style>
