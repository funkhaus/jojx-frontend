<template>
    <div :class="classes">
        <!-- TODO: animate blocks -->
        <div
            v-for="item in items"
            :key="item.id"
            class="item"
        >
            <wp-image
                :key="item.id"
                class="image"
                :image="item.image"
                object-fit="contain"
            />
        </div>

        <div class="anchor" />
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
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.gallery-home {
    width: 500vw; //DELETE
    background-color: var(--theme-color-background);
    overflow: auto;
    white-space: nowrap;

    position: absolute;
    top: 0;
    left: 0;

    height: 100%;
    transform: translate(100%, 0);
    z-index: 100;

    transition: background-color 0.8s var(--easing-authentic-motion),
        transform 1s var(--easing-authentic-motion);

    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;

    .item {
        max-width: 500px; // DELETE
        box-sizing: border-box;
        padding: 20px;
        width: 100%;
    }

    .anchor {
        position: absolute;
        right: 0;
        height: 100%;
        width: 100px;
        background-color: blue; // DELETE
    }

    &.intro-is-complete {
        transform: translate(0, 0);
    }

    // Breakpoints
    @media #{$lt-phone} {
    }
}
</style>
