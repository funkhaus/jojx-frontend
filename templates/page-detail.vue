<template>
    <section class="page-detail">
        {{ page.title }}
    </section>
</template>

<script>
// Queries
import DETAIL from "~/gql/queries/Detail"

export default {
    async asyncData({ $graphql, route }) {
        const data = await $graphql.default.request(DETAIL, {
            uri: route.path
        })
        return {
            page: data?.nodeByUri || {}
        }
    },
    computed: {
        parsedPage() {
            // Shape data from WP-GQL to work with template
            return {
                ...this.page
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page-detail {
    color: var(--color-black);
    margin: 0 auto;
    min-height: var(--unit-100vh);

    .image {
        max-width: 50%;
        margin: 0 auto;
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
