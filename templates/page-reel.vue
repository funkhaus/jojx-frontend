<template>
    <section class="page-reel">
        {{ page.title }}

        <ul class="items">
            <li
                v-for="item in items"
                :key="item.title"
                class="item"
            >
                <a
                    :href="item.to"
                    v-html="item.title"
                />
            </li>
        </ul>
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
        parsedItems() {
            return this.items.map((obj) => {
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
.page-reel {
    color: var(--color-black);
    margin: 0 auto;
    min-height: var(--unit-100vh);

    .image {
        max-width: 50%;
        margin: 0 auto;
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
    @media #{$lt-phone} {
    }
}
</style>
