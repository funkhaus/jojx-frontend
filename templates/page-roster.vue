<template>
    <section class="page-roster">
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
import ROSTER from "~/gql/queries/Roster"

export default {
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

    display: flex;
    align-items: center;
    justify-content: center;

    .items {
        padding: 0;
        margin: 0;
        list-style: none;
        text-align: center;
    }

    .item {
        color: var(--color-white);
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
