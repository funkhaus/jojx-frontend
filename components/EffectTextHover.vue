<template lang="html">
    <wp-link
        :class="classes"
        :to="to"
    >
        <span
            :data-text="text"
            class="text"
            v-html="text"
        />
    </wp-link>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: ""
        },
        to: {
            type: String,
            default: ""
        }
    },
    computed: {
        classes() {
            return ["effect-text-hover"]
        }
    }
}
</script>

<style lang="scss" scoped>
.effect-text-hover {
    margin: 0;
    padding: 0;

    display: inline-block;
    vertical-align: top;

    overflow: hidden;
    transition: all 0.4s var(--easing-authentic-motion);

    .text {
        display: inline-block;
        position: relative;
        transition: transform 0.4s var(--easing-authentic-motion);

        &:after {
            content: attr(data-text);
            position: absolute;
            bottom: 0;
            left: 0;
            transform: translate(0, 100%);
        }
    }

    // Breakpoints
    @media #{$has-hover} {
        &:hover .text {
            transform: translate(0, -100%);
        }
    }
    // Breakpoints
    @media #{$lt-phone} {
    }
}
</style>
