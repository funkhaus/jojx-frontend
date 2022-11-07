<template lang="html">
    <div :class="classes">
        <effect-text-hover
            :text="text"
            :to="to"
        />
    </div>
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
        },
        hideUnderline: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classes() {
            return ["global-nav", { "hide-underline": this.hideUnderline }]
        }
    }
}
</script>

<style lang="scss" scoped>
.global-nav {
    position: fixed;
    margin: 0;
    z-index: 800;

    transform: rotate(90deg);
    transform-origin: left;

    color: var(--theme-color-nav);
    mix-blend-mode: difference;

    font-size: 24px;
    text-transform: capitalize;
    font-weight: 300;
    transition: all 0.4s var(--easing-authentic-motion);

    ::v-deep .effect-text-hover:after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0%;
        background-color: var(--theme-color-nav);
        width: 100%;
        height: 2px;
        opacity: 0;

        transition: opacity 0.4s var(--easing-authentic-motion);
        transform-origin: bottom center;
    }

    ::v-deep .effect-text-hover.active-link:after {
        opacity: 1;
    }

    &.hide-underline ::v-deep .effect-text-hover:after {
        display: none;
    }
    // Breakpoints
    @media #{$has-hover} {
    }
    // Breakpoints
    @media #{$lt-phone} {
        display: none;
    }
}
</style>
