<template>
    <client-only>
        <nuxt-link
            ref="item"
            :style="styles"
            :class="classes"
            :to="to"
        >
            <wp-image
                class="image"
                :video-url="videoUrl"
                :image="image"
                object-fit="cover"
                background-color="transparent"
            />
        </nuxt-link>
    </client-only>
</template>

<script>
function getRandom(min = 0, max = 100) {
    return Math.random() * (max - min) + min
}

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
        },
        skew: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            animationId: -1,
            posY: 0,
            transY: 0,
            transX: 100,
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
        },
        videoUrl() {
            let url = this.image?.imageMeta?.videoUrl || ""
            if (this.$store.state.breakpoint == "mobile") {
                url = "auto:blank"
            }
            return url
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
        this.stop()
    },
    methods: {
        start() {
            let rate = getRandom(0.8, 1)
            this.animationId = setInterval(() => {
                this.setTransform()
            }, 1000 * rate)
        },
        stop() {
            clearInterval(this.animationId)
        },
        setTransform() {
            // TODO: Imrpove loop?
            // transformX
            const posX = this.$refs.item.$el.getBoundingClientRect().x
            // fade out
            if (posX <= -1000) {
                this.opacity = 0
            }
            // reset
            if (posX <= -2500) {
                this.transX = 500
                setTimeout(() => {
                    this.opacity = 1
                }, 1100)
            }
            // slide left
            this.transX = this.transX - 40

            //  transformY
            if (this.skew !== 0 && this.skew !== 1) {
                let intensity = 0.05
                this.transY = this.posY + this.skew * intensity
            } else {
                this.transY = this.posY
            }
        },
        setStyles() {
            let direction = this.index % 2 == 0 ? -1 : 1
            this.posY = getRandom(0, 150) * direction
            this.scale = getRandom(0.75, 2)
        }
    }
}
</script>

<style lang="scss" scoped>
.gallery-item {
    min-width: 350px; // DELETE ?
    padding: 20px;
    box-sizing: border-box;
    transition: transform 1s linear, opacity 0.1s var(--easing-authentic-motion);

    .image ::v-deep .media {
        opacity: 1;
    }
    // Breakpoints
    @media #{$lt-phone} {
        min-width: 250px; // DELETE ?

        .image ::v-deep .media {
            &.media-image {
                opacity: 1;
            }
        }
    }
}
</style>
