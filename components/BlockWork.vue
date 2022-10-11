<template>
    <nuxt-link
        to="to"
        :class="classes"
    >
        <wp-image
            v-if="image"
            class="item"
            :image="image"
            object-fit="contain"
        />

        <wp-image
            v-if="imageSecondary"
            class="item"
            object-fit="contain"
        />

        <div class="panel-text">
            <h2
                v-if="title"
                class="title"
                v-html="title"
            />
            <h3
                v-if="talent"
                class="talent"
                v-html="talent"
            />
            <div
                v-if="text"
                class="text"
                v-html="text"
            />
        </div>
    </nuxt-link>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: ""
        },
        to: {
            type: String,
            default: ""
        },
        image: {
            type: Object,
            default: () => {}
        },
        title: {
            type: String,
            default: ""
        },
        text: {
            type: String,
            default: ""
        },
        talent: {
            type: String,
            default: ""
        },
        tags: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        classes() {
            return ["block-work"]
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.block-work {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 20px;

    .panel-text {
        max-width: 515px;
        transform: translate(0, -50%);
        position: relative;
        z-index: 30;
        color: var(--color-white);
        mix-blend-mode: difference;
    }

    .title,
    .talent,
    .text {
        font-weight: 300;
        line-height: 1;
        margin: 0;
    }

    .title {
        font-size: 54px;
    }
    .talent {
        font-size: 34px;
        font-style: italic;
        margin-bottom: 25px;
    }

    .text {
        font-size: 18px;
    }

    // Breakpoints
    @media #{$lt-phone} {
    }
}
</style>
