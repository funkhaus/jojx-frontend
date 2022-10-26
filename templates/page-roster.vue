<template>
    <section class="page-roster">
        <list-roster :items="parsedItems" />
    </section>
</template>

<script>
// Queries
import ROSTER from "~/gql/queries/Roster"

export default {
    transition: "fade",
    async asyncData({ $graphql, route }) {
        const data = await $graphql.default.request(ROSTER, {
            uri: route.path
        })
        return {
            page: data?.nodeByUri || {},
            items: data?.nodeByUri?.children?.nodes || {}
        }
    },
    computed: {
        parsedItems() {
            return this.items.map((obj) => {
                // Flatten the "attributes"
                return {
                    ...obj,
                    image: obj?.featuredImage?.node || {}
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page-roster {
    color: var(--color-black);
    margin: 0 auto;
    min-height: var(--unit-100vh);
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    // Hover states
    @media #{$has-hover} {
        // Hover styles would go here
    }

    /* Breakpoints */
    @media #{$lt-phone} {
    }
}
</style>
