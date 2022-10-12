<template lang="html">
    <div class="global-nav">
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
        }
    },
    computed: {
        classes() {
            return ["global-nav"]
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

    font-size: 18px;
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
        transform: translate(50%, 0);
        opacity: 0;

        transition: opacity 0.4s var(--easing-authentic-motion);
        transform-origin: bottom center;
    }

    ::v-deep .effect-text-hover.active-link:after {
        opacity: 1;
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
