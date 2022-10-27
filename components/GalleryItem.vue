<template>
    <client-only>
        <nuxt-link
            ref="item"
            v-intersection-observer
            :style="styles"
            :class="classes"
            :to="to"
        >
            <wp-image
                class="image"
                :image="image"
                object-fit="cover"
                background-color="transparent"
            />
        </nuxt-link>
    </client-only>
</template>

<script>
export default {
    props: {
        image: {
            type: Object,
            default: () => {}
        },
        to: {
            type: String,
            default: "false"
        },
        index: {
            type: Number,
            default: 0
        },
        pause: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            animationId: -1,
            transX: 100,
            transY: 0,
            scale: 1,
            opacity: 1
        }
    },
    computed: {
        classes() {
            return ["gallery-item"]
        },
        styles() {
            return {
                transform: `translate(${this.transX}%, ${this.transY}%) scale(${this.scale})`,
                opacity: this.opacity
            }
        }
    },
    watch: {
        pause(newVal, oldVal) {
            if (newVal) {
                this.stop()
            } else {
                this.start()
            }
        }
    },
    mounted() {
        this.setStyles()

        this.start()
    },
    destroyed() {
        // clearInterval(this.animationId)
        this.stop()
    },
    methods: {
        start() {
            let rate = this.getRandom(0.8, 1)
            this.animationId = setInterval(() => {
                this.setTransX()
            }, 1000 * rate)
        },
        stop() {
            clearInterval(this.animationId)
        },
        getRandom(min = 0, max = 100) {
            return Math.random() * (max - min) + min
        },
        setStyles() {
            let direction = this.index % 2 == 0 ? -1 : 1
            this.transY = this.getRandom() * direction
            this.scale = this.getRandom(0.75, 2)
        },
        setTransX() {
            console.log("transX", this.transX)
            // TODO: Imrpove loop
            if (this.transX <= -1000) {
                this.opacity = 0
            }

            if (this.transX <= -2500) {
                this.transX = 500
            }

            if (this.transX <= 400) {
                this.opacity = 1
            }

            this.transX = this.transX - 50
        }
    }
}
</script>

<style lang="scss" scoped>
.gallery-item {
    min-width: 500px; // DELETE
    padding: 20px;
    box-sizing: border-box;
    transition: transform 1s linear, opacity 0.1s var(--easing-authentic-motion);

    .image ::v-deep .media {
        opacity: 1;
    }
    // Breakpoints
    @media #{$lt-phone} {
        min-width: 250px; // DELETE

        .image ::v-deep .media {
            &.media-image {
                opacity: 1;
            }
            &.media-video {
                display: none !important;
            }
        }
    }
}
</style>
