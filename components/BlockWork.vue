<template>
    <nuxt-link
        :key="prlxIsDisabled"
        v-intersection-observer="{ threshold: 0.25 }"
        v-prlx="{
            speed: speed,
            disabled: prlxIsDisabled,
            reverse: index % 2 == 0
        }"
        :to="linkTo"
        :class="classes"
        :style="styles"
    >
        <div class="background">
            <wp-image
                v-if="image"
                class="image primary"
                :image="image"
                object-fit="cover"
            >
                <h3
                    v-if="category"
                    class="category"
                    v-html="category"
                />
                <template #bottom>
                    <div
                        :class="[
                            'panel-title',
                            'desktop',
                            { 'has-talent': talent }
                        ]"
                    >
                        <h2
                            v-if="title"
                            class="title"
                            v-html="title"
                        />
                        <h3
                            v-if="talent"
                            class="talent"
                            v-html="`by ${talent}`"
                        />
                    </div>
                </template>
            </wp-image>

            <wp-image
                v-if="imageSecondary"
                v-prlx="{ fromBottom: true }"
                :image="imageSecondary"
                class="image secondary"
            />

            <div
                v-intersection-observer
                class="panel-text"
            >
                <div
                    v-if="title || talent"
                    class="panel-title mobile"
                >
                    <h2
                        v-if="title"
                        class="title"
                        v-html="title"
                    />
                    <h3
                        v-if="talent"
                        class="talent"
                        v-html="`by ${talent}`"
                    />
                </div>

                <div
                    v-if="text"
                    class="mask"
                >
                    <div
                        class="text"
                        v-html="text"
                    />
                </div>

                <div
                    v-if="publication"
                    class="mask"
                >
                    <div class="panel-publication">
                        <span
                            class="cta"
                            v-text="'Read @'"
                        />
                        <span
                            class="publication"
                            v-text="publication"
                        />

                        <svg-arrow-right class="svg" />
                    </div>
                </div>
            </div>
        </div>
    </nuxt-link>
</template>

<script>
// Svgs
import SvgArrowRight from "~/assets/svg/arrow-right"

export default {
    components: {
        SvgArrowRight
    },
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
        imageSecondary: {
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
        category: {
            type: String,
            default: ""
        },
        publication: {
            type: String,
            default: ""
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            prlxIsDisabled: false
        }
    },
    computed: {
        classes() {
            return ["block-work", `type-${this.type}`]
        },
        styles() {
            return { "z-index": 999 - this.index }
        },
        linkTo() {
            return this.link || this.to
        },
        speed() {
            let speed = this.index % 2 == 0 ? 0.35 : 0.25

            switch (this.type) {
                case "featured":
                    speed = 0.2
                    break

                case "two-image":
                    speed = 0.4
                    break
            }

            return speed
        },
        // TODO: remove?
        disablePrlx() {
            if (this.type !== "half-width") {
                this.prlxIsDisabled = true
            }

            return this.prlxIsDisabled
        }
    },
    watch: {
        "$store.state.breakpoint": {
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal == "desktop") {
                    this.prlxIsDisabled = false
                } else {
                    console.log("disable Prlx")
                    this.prlxIsDisabled = true
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.block-work {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;

    position: relative;
    width: 50%;
    margin: 150px auto;
    box-sizing: border-box;

    .background {
        width: 100%;
        box-sizing: border-box;
        padding: 150px 90px 50px 90px;
        // background: transparent;
        // transition: background 0.8s var(--easing-authentic-motion);
    }

    .image {
        position: relative;
        &.secondary {
            display: none;
        }
    }

    .panel-text {
        position: relative;
        z-index: 100;
        max-width: 515px;
        color: var(--theme-color-text);
        padding: 0 20px;
        box-sizing: border-box;
    }

    .title,
    .talent,
    .category,
    .text {
        font-weight: 300;
        line-height: 1;
        margin: 0;

        opacity: 0;
        transition: transform 0.8s var(--easing-authentic-motion),
            opacity 0.8s var(--easing-authentic-motion);
    }

    .panel-title {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        margin-right: auto;
        color: var(--theme-color-background);
        mix-blend-mode: difference;
        overflow: hidden;
        /*
        TODO: Remove transformed styles and bg styles when client approves
        max-width: 650px;
        transform: translate(-25px, 40px);
        &.has-talent {
            transform: translate(-25px, 20px);
        }
        */
    }
    .title {
        font-size: 64px;
        font-weight: 300;
        transform: translate(0, 100%);
    }

    .talent {
        margin: 8px 0 0 0;
        font-size: 34px;
        font-style: italic;
        transform: translate(0, 200%);
    }

    .mask {
        overflow: hidden;
    }

    .text {
        font-size: 18px;
        opacity: 1;
        transform: translate(0%, 150%);

        margin: 20px 0 5px 0;

        transition: transform 0.7s var(--easing-authentic-motion),
            opacity 0.7s var(--easing-authentic-motion);

        ::v-deep p {
            font-size: 18px;
            line-height: 1.25;
            &:first-of-type {
                margin-top: 0;
            }
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }

    .category {
        position: absolute;
        right: 0;
        top: 50%;
        transform-origin: right;
        transform: rotate(90deg) translate(50%, 100%);
        font-style: italic;
    }

    .panel-publication {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 300;
        font-style: italic;

        opacity: 0;
        transform: translate(0, 100%);
        transition: transform 0.6s var(--easing-authentic-motion),
            opacity 0.6s var(--easing-authentic-motion);
        .cta {
            text-transform: uppercase;
        }
        .svg {
            margin-left: 5px;
            transition: transform 0.6s var(--easing-authentic-motion);
            * {
                fill: var(--theme-color-text);
            }
        }
    }

    &.has-intersected {
        // .background {
        //     background: var(--theme-color-background);
        // }
    }
    // Block variants
    &.type-featured {
        width: 100%;

        .image {
            max-width: 70%;
        }
        .image.secondary {
            display: block;
            position: absolute;
            top: 0;
            right: var(--unit-gap);
            z-index: 20;
            max-width: 40%;
            transform: translate(0, 25%);
        }
    }

    &.type-full-width {
        width: 100%;
        .background {
            // padding: 150px 90px;
            // margin-bottom: 200px;
            padding: 50px 90px;
            margin: 50px 0 150px 0;
        }
    }

    &.type-half-width {
        &:nth-of-type(even) {
            .background {
                padding: 100px 80px 175px 100px;
            }
            .panel-title {
                text-align: right;

                margin-right: unset;
                margin-left: auto;
                /*
                transform: translate(25px, 40px);
                &.has-talent {
                    transform: translate(25px, 20px);
                }
                */
            }

            .category {
                right: unset;
                left: 0;
                top: 50%;
                transform-origin: left;
                transform: rotate(-90deg) translate(-50%, 100%);
            }
        }
    }

    .mobile {
        display: none;
    }

    @media #{$has-hover} {
        &:hover {
            .category {
                opacity: 1;
                transform: rotate(90deg) translate(50%, -100%);
            }
            &.type-half-width:nth-of-type(even) .category {
                transform: rotate(-90deg) translate(-50%, -100%);
            }
            .title,
            .talent,
            .text,
            .panel-publication {
                transform: translate(0);
                opacity: 1;
            }
        }
        .panel-publication:hover .svg {
            transform: translate(10px, 0%);
        }
    }
    // Breakpoints
    @media #{$gt-cinema} {
        &.type-full-width {
            width: 100%;
            // .background {
            //     padding: 250px 100px;
            // }
        }
        &.type-half-width {
            .background {
                padding: 425px 120px 350px 190px;
            }
            &:nth-of-type(even) .background {
                padding: 400px 90px 475px 150px;
            }
        }
        .panel-title {
            max-width: 750px;
        }
    }

    @media #{$lt-tablet} {
        margin: 20px auto;
        width: 100%;
        .background {
            padding: 0;
            background: transparent;
        }
        .title,
        .talent,
        .category,
        .text,
        .panel-text {
            opacity: 1;
            transform: translate(0);
        }

        .title,
        .talent,
        .text {
            opacity: 0;
            transform: translate(0, 100%);
        }

        .panel-text.has-intersected {
            .title,
            .talent,
            .text,
            .panel-publication {
                opacity: 1;
                transform: translate(0);
            }
        }

        .title {
            font-size: 34px;
        }
        .talent {
            font-size: 22px;
        }
        .category {
            font-size: 16px;
            left: 0;
            top: 0;
            z-index: 100;
            padding: var(--unit-gap);
            color: var(--color-white);
            transform: rotate(0) translate(0);
        }

        .panel-title {
            position: static;
            color: var(--color-black);
            max-width: 100%;
            margin-right: unset;
            transform: translate(0);
            padding: 0;
            mix-blend-mode: unset;
        }
        .panel-text {
            padding: 0;
            padding: var(--unit-gap);
        }

        .text {
            font-size: 16px;
            margin: 20px 0 0;
            padding: 0;
            ::v-deep p {
                font-size: 16px;
            }
        }

        .panel-publication {
            margin-top: 5px;
        }

        // Hovers
        @media #{$has-hover} {
            &.type-half-width:nth-of-type(even):hover .category,
            &:hover .category {
                opacity: 1;
                transform: rotate(0) translate(0);
            }
        }

        // Block variants
        .panel-text {
            max-width: 750px;
            margin: 0 auto;
        }

        &.type-featured {
            .image {
                max-width: 100%;
                min-height: 500px;
            }
            .image.secondary {
                display: none;
            }
        }
        &.type-full-width {
            .background {
                padding: 0;
                margin-bottom: 0px;
            }
        }
        &.type-half-width:nth-of-type(n) {
            .panel-title {
                text-align: left;
                transform: translate(0);
                &.has-talent {
                    transform: translate(0);
                }
            }
            .category {
                top: 0;
                transform: rotate(0) translate(0);
            }

            .background {
                padding: 0px;
            }
        }

        .mobile {
            display: block;
        }
        .desktop {
            display: none;
        }
    }

    @media #{$lt-phone} {
        margin: 0px auto 30px auto;
    }
}
</style>
