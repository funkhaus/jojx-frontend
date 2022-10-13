<template>
    <section class="page-detail">
        <roster-item
            :text="parsedPage.talent"
            class="talent"
        />

        <div class="panel-top">
            <video-stage
                :src="parsedPage.videoUrl"
                class="video-stage"
                :sync-slot-width="true"
                :custom-player="true"
                color="ffb762"
            />
            <!-- mode="intrinsic-ratio" -->

            <div
                v-intersection-observer.stagger
                class="titles"
            >
                <h2
                    class="title"
                    v-text="parsedPage.title"
                />
                <h3
                    v-if="parsedPage.category"
                    class="category"
                    v-text="parsedPage.category"
                />
            </div>
        </div>
        <div class="panel-bottom">
            <wp-gutenberg
                id="content"
                :blocks="parsedPage.blocks"
            />
        </div>
    </section>
</template>

<script>
// Queries
import DETAIL from "~/gql/queries/Detail"
import RosterItem from "../components/RosterItem.vue"

export default {
    components: { RosterItem },
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
                ...this.page,
                videoUrl: this.page?.workMeta?.videoUrl || "",
                talent: this.page?.parent?.node?.title || "",
                category: "wildcard"
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page-detail {
    color: var(--color-white);
    margin: 0 auto;
    min-height: var(--unit-100vh);
    position: relative;

    .panel-top {
        position: relative;
        height: var(--unit-100vh);
    }

    .video-stage {
        min-height: 550px;

        height: calc(var(--unit-100vh) - 230px);
        width: calc(100% - 180px);
        margin: 0 auto;
        &.has-loaded {
            opacity: 1;
        }
    }
    .titles {
        position: absolute;
        width: 100%;
        bottom: 20px;
        right: 40px;

        display: flex;
        flex-direction: column;
        align-items: flex-end;
        pointer-events: none;
    }
    .title,
    .category {
        margin: 0;
        font-size: 20px;
        text-transform: capitalize;

        line-height: 1.4;
        transition: clip-path 0.6s var(--easing-authentic-motion);
    }
    .category {
        font-style: italic;
    }

    ::v-deep .talent {
        position: absolute;
        top: 30px;
        left: 40px;

        font-size: 36px;
    }
    .title ::v-deep .line-2 {
        font-weight: 300;
        font-size: 14px;
    }
    .category {
        font-size: 16px;
    }

    .panel-bottom {
        padding: var(--unit-gap);
        margin-top: var(--unit-gap);
    }

    // Hover states
    @media #{$has-hover} {
        // Hover styles would go here
    }

    /* Breakpoints */
    @media #{$lt-tablet} {
        .title {
        }
    }
    @media #{$lt-phone} {
        padding: 60px 0 100px 0;
        .video-stage {
            width: calc(100% - 40px);
            ::v-deep .titles {
                flex-direction: column;
            }
        }
        .title,
        .category {
            font-size: 14px;
        }
        .category {
            margin-top: 20px;
        }
    }
}
</style>
