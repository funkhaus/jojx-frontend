<template>
    <nuxt-link
        to="/"
        :class="classes"
    >
        <svg-logo class="svg" />
    </nuxt-link>
</template>

<script>
// Svgs
import SvgLogo from "~/assets/svg/logo-jojx"

export default {
    components: {
        SvgLogo
    },
    props: {
        introActive: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classes() {
            return ["global-logo", { "intor-active": this.introActive }]
        }
    }
}
</script>

<style lang="scss" scoped>
.global-logo {
    position: fixed;
    z-index: 900;
    bottom: var(--unit-gap);
    left: var(--unit-gap);
    mix-blend-mode: difference;
    transform-origin: bottom left;

    transform: scale(0.2); // 145 / 716 = .2
    transition: all 0.6s var(--easing-authentic-motion);
    .route-index & {
        transform: translate(0, calc(-50vh + 100%));
    }
    .route-index .is-scrolled & {
        transform: scale(0.2); // 145 / 716 = .2
    }

    .svg path {
        fill: var(--color-white);
    }

    // Breakpoints
    @media #{$lt-phone} {
        transform: scale(0.15); // 112 / 716 = .2
    }
}
</style>
