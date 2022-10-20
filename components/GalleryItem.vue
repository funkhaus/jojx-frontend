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
                object-fit="contain"
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
    mounted() {
        this.setStyles()

        let rate = this.getRandom(0.8, 1)
        this.animationId = setInterval(() => {
            this.setTransX()
        }, 1000 * rate)
    },
    destroyed() {
        clearInterval(this.animationId)
    },
    methods: {
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
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    transition: transform 1s linear, opacity 0.1s var(--easing-authentic-motion);

    // Breakpoints
    @media #{$lt-phone} {
    }
}
</style>
