<template>
    <nuxt-link
        v-intersection-observer
        v-prlx="{ speed: speed }"
        :to="linkTo"
        :class="classes"
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
                    <div class="panel-title">
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

            <div class="panel-text">
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
                        <!-- TODO: get correct arrow from design -->
                        <svg-arrow-right class="svg" />
                        <!-- <span v-html="'&#8594'"/> -->
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
    computed: {
        classes() {
            return [
                "block-work",
                `type-${this.type}`,
                { "has-text": this.text }
            ]
        },
        linkTo() {
            return this.link || this.to
        },
        speed() {
            let speed = this.index % 2 == 0 ? 0.3 : 0.25

            switch (this.type) {
                case "featured":
                    speed = 0.2
                    break

                case "two-image":
                    speed = 0.4
                    break
            }

            return speed
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.block-work {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;

    position: relative;
    width: 50%;
    margin: 100px auto;
    .background {
        width: 100%;
        box-sizing: border-box;
        padding: 40px;
        background-color: var(--theme-color-background);
        transition: background-color 0.8s var(--easing-authentic-motion);
    }

    .image {
        &.secondary {
            display: none;
        }
    }

    .panel-text {
        position: relative;
        z-index: 100;
        max-width: 515px;
        padding: 40px 0;
        box-sizing: border-box;

        color: var(--theme-color-text);
    }

    .title,
    .talent,
    .category,
    .text {
        font-weight: 300;
        line-height: 1;
        margin: 0;

        opacity: 0;
        transition: transform 0.6s var(--easing-authentic-motion),
            opacity 0.6s var(--easing-authentic-motion);
    }

    .panel-title {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        transform: translate(0%, 30%);
        color: var(--theme-color-background);
        mix-blend-mode: difference;
    }
    .title {
        font-size: 64px;
        margin-bottom: 8px;
        transform: translate(0, 100%);
    }

    .talent {
        font-size: 34px;
        font-style: italic;
        margin-bottom: 25px;
        transform: translate(0, 150%);
    }

    .mask {
        overflow: hidden;
    }

    .text {
        font-size: 18px;
        opacity: 1;
        transform: translate(0%, 150%);

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
        left: 0;
        top: 50%;
        transform-origin: left;
        transform: rotate(-90deg) translate(-100%, 100%);
    }

    .panel-publication {
        display: flex;
        align-items: center;
        margin-top: 5px;
        font-size: 18px;
        font-weight: 300;

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
    }

    &:nth-of-type(odd) {
        .panel-title {
            text-align: right;
        }
        .category {
            left: unset;
            right: 0;
            top: 50%;
            // opacity: 1;
            transform-origin: right;
            transform: rotate(-90deg) translate(-100%, -100%);
        }
    }

    @media #{$has-hover} {
        &:hover {
            .category {
                opacity: 1;
                transform: rotate(-90deg) translate(-100%, -100%);
            }
            &:nth-of-type(odd) .category {
                transform: rotate(-90deg) translate(-100%, 100%);
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
    @media #{$lt-tablet} {
        margin-bottom: 60px;
        width: 100%;
        .background {
            padding: 0;
        }
        .title,
        .talent,
        .category,
        .text,
        .panel-text,
        .panel-publication {
            opacity: 1;
            transform: translate(0);
        }
        .title {
            font-size: 34px;
        }
        .talent {
            font-size: 22px;
        }
        .text {
            font-size: 16px;
            ::v-deep p {
                font-size: 16px;
            }
        }
        .panel-text {
            padding: var(--unit-gap);
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

        // Hovers
        @media #{$has-hover} {
            &:hover {
                .category {
                    opacity: 1;
                    transform: rotate(0) translate(0);
                }
            }
        }

        // Block variants
        &.has-text {
            .panel-text {
                max-width: 750px;
                margin: 0 auto;
            }
        }
        &.type-featured {
            width: 100%;
            .image {
                max-width: 100%;
                min-height: 500px;
            }
            .image.secondary {
                max-width: 40%;
                min-height: unset;
                transform: translate(0, 50%);
            }
        }
        &:nth-of-type(odd) {
            .panel-text {
                .panel-title {
                    text-align: left;
                    // margin-left: unset;
                }
            }
        }
    }

    @media #{$lt-phone} {
        margin-bottom: 20px;
    }
}
</style>
