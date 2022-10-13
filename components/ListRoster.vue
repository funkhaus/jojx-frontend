<template>
    <div :class="classes">
        <ul class="list">
            <li
                v-for="(item, i) in items"
                :key="item.title"
                class="list-item"
            >
                <nuxt-link
                    class="link"
                    :to="item.to"
                >
                    <roster-item :text="item.title" />
                </nuxt-link>

                <transition name="fade">
                    <wp-image
                        :image="item.image"
                        class="image"
                    >
                        <div class="scrim" />
                    </wp-image>
                </transition>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        classes() {
            return ["list-roster"]
        }
    }
}
</script>

<style lang="scss" scoped>
.list-roster {
    padding: 0 40px;
    height: 100%;
    width: 100%;

    .list {
        margin: 0;
        padding: 0;

        list-style: none;

        transition: opacity 0.6s var(--easing-authentic-motion),
            transform 0.6s var(--easing-authentic-motion);
    }

    .list-item {
        padding: 0;

        transition: opacity 0.4s var(--easing-authentic-motion),
            color 0.4s var(--easing-authentic-motion);
    }

    .link {
        z-index: 50;
        display: block;
        cursor: pointer;

        color: var(--color-white);
        font-size: 26px;
        padding: 0 25px;
        text-align: right;
        transform: translate(-50%, 0);
    }

    ::v-deep .image {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: -1;
        pointer-events: none;
        width: 655px;

        opacity: 0;
        transform: translate(-100%, -50%);
        transition: opacity 0.4s var(--easing-authentic-motion),
            transform 0.4s var(--easing-authentic-motion);
    }

    .list-item:nth-of-type(even) {
        .link {
            text-align: left;
            transform: translate(50%, 0);
        }
        ::v-deep .image {
            transform: translate(100%, -50%);
        }
    }

    /* Hover State */
    @media #{$has-hover} {
        ::v-deep .list-item:hover {
            z-index: 400;
            opacity: 1;
            color: var(--color-white);

            .image {
                opacity: 1;
                transform: translate(-25%, -50%);
            }
        }
    }

    /* Breakpoints */
    @media #{$gt-cinema} {
        ::v-deep .image {
            width: 930px;
            height: 530px;
        }
    }

    @media #{$lt-tablet} {
        .list {
            width: 100%;
        }

        .list-item:nth-of-type(n) .link {
            text-align: left;
            transform: translate(0);
            padding: 12px 0;
        }

        ::v-deep .image {
            // transform: translate(0%, -50%);
            // width: 100%;
            display: none;
        }
    }
}
</style>
