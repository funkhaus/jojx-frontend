<template>
    <div :class="classes">
        <gallery-item
            v-for="(item, i) in items"
            :key="item.id"
            :image="item.image"
            :to="item.to"
            :index="i"
        />
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => []
        },
        introIsComplete: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classes() {
            return [
                "gallery-home",
                { "intro-is-complete": this.introIsComplete }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.gallery-home {
    width: 100%;
    height: var(--unit-100vh);
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(100%, 0);
    z-index: 100;
    background-color: var(--theme-color-background);
    // overflow: scroll;

    overflow: hidden;
    white-space: nowrap;
    padding-left: 200px;
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    align-items: center;

    transition: background-color 0.8s var(--easing-authentic-motion),
        transform 1.25s var(--easing-authentic-motion);

    &.intro-is-complete {
        transform: translate(0, 0);
    }

    // Breakpoints
    @media #{$lt-phone} {
        height: 100vh;
    }
}
</style>
