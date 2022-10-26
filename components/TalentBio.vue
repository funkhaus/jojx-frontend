<template>
    <div
        v-if="image.id && text"
        v-intersection-observer="{
            rootMargin: '-50px 0px -50px 0px'
        }"
        :class="classes"
        @has-intersected="onIntersected"
    >
        <div
            class="abstract mobile"
            v-html="abstract"
        />

        <div class="column social">
            <ul class="socials">
                <li
                    v-for="item in socials"
                    :key="item.to"
                    class="item"
                >
                    <span
                        class="platform"
                        v-text="item.platform"
                    />
                    <a
                        class="link"
                        :href="item.to"
                        v-html="item.title"
                    />
                </li>
            </ul>
        </div>

        <div class="column image-content">
            <div
                class="abstract desktop"
                v-html="abstract"
            />
            <!-- TODO: Make cover -->
            <wp-image
                v-prlx="{ speed: 0.1 }"
                class="image"
                :image="image"
                object-fit="cover"
            />
        </div>

        <div class="column text-content">
            <div
                v-prlx="{ reverse: true }"
                class="text"
                v-html="text"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: ""
        },
        abstract: {
            type: String,
            default: ""
        },
        image: {
            type: Object,
            default: () => {}
        },
        socials: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        classes() {
            return ["talent-bio"]
        }
    },
    methods: {
        onIntersected(event) {
            if (event.detail.isIntersecting) {
                this.$store.commit("SET_THEME", "gray")
            } else {
                this.$store.commit("SET_THEME", "white")
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.talent-bio {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    width: 100%;
    min-height: var(--unit-100vh);
    margin: 100px auto 0 auto;

    .column {
        position: relative;
        width: 33.33%;
    }

    .abstract {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 20;
        opacity: 0;
        transform: translate(-100%, -75%);
        width: 100%;
        min-width: 600px;
        max-width: 600px;

        // TODO: show dave
        // mix-blend-mode: difference;
        font-size: 34px;
        font-weight: 300;
        color: var(--color-black);
        transition: transform 0.6s var(--easing-authentic-motion),
            opacity 0.6s var(--easing-authentic-motion);
        ::v-deep * {
            font-size: 30px;
            &:first-of-type {
                margin-top: 0;
            }
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }

    .image {
        height: 100%;
        width: 100%;
        max-width: 350px;
        min-height: 350px; // TODO: Show design, for aspec ratio?
        margin: 0 auto;
    }

    .socials {
        max-width: 150px;
        margin-left: auto;
        padding: 0;
        list-style: none;
        font-size: 16px;
    }
    .item {
        margin-bottom: 25px;
    }
    .platform {
        font-style: italic;
    }
    .link {
        text-decoration: underline;
    }

    .text {
        padding: 0 var(--unit-gap);
        box-sizing: border-box;
        font-size: 18px;
        line-height: 1.3;
        max-width: 350px;
        margin-right: auto;
        ::v-deep * {
            font-size: 18px;
            &:first-of-type {
                margin-top: 0;
            }
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }

    .text,
    .image,
    .socials {
        opacity: 0;
        transform: translate(-100%, 0%);
        transition: transform 0.6s var(--easing-authentic-motion),
            opacity 0.6s var(--easing-authentic-motion);
    }
    .image {
        transform: translate(0, 100%);
    }
    .text {
        transform: translate(100%, 0);
    }

    &.has-intersected {
        .text,
        .image,
        .socials {
            opacity: 1;
            transform: translate(0%);
        }
        .abstract {
            opacity: 1;
            transform: translate(-50%, -75%);
        }
    }

    .mobile {
        display: none;
    }

    // Breakpoints
    @media #{$lt-tablet} {
        align-content: center;

        .column.social {
            width: 20%;
        }
        .column.image-content {
            width: 50%;
        }
        .column.text-content {
            width: 100%;
        }

        .image {
            margin: unset;
        }
        .text {
            max-width: 450px;
            margin: 0 auto;
        }

        .abstract {
            top: 0;
            left: 50%;
        }
        &.has-intersected .abstract {
            transform: translate(-75%, -75%);
        }
    }

    @media #{$lt-phone} {
        padding: 0 var(--unit-gap);
        box-sizing: border-box;
        margin: 40px auto 100px auto;

        .column {
            overflow: hidden;
        }
        .column.social,
        .column.image-content,
        .column.text-content {
            width: 100%;
        }

        .image {
            width: 100%;
            max-width: 100%;
            margin-top: 50px;
            margin-bottom: 50px;
        }
        .socials {
            margin-left: unset;
            margin-right: auto;
            margin-bottom: 0;
            .item:last-of-type {
                margin-bottom: 0;
            }
        }

        .abstract {
            position: static;
            opacity: 0;
            transform: translate(-100%, 0);
            width: 100%;
            min-width: 100%;
            padding: 40px 0;
        }

        &.has-intersected .abstract {
            opacity: 1;
            transform: translate(0);
        }

        .text {
            max-width: 100%;
            padding: 0;
            font-size: 16px;
            ::v-deep * {
                font-size: 16px;
            }
        }

        .mobile {
            display: block;
        }
        .desktop {
            display: none;
        }
    }
}
</style>
