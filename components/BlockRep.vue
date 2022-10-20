<template lang="html">
    <div
        v-intersection-observer.stagger
        class="block-rep"
    >
        <effect-text-hover
            :to="`mailto:${email}`"
            class="name"
            :text="name"
        />
        <effect-text-hover
            v-if="telephone"
            class="telephone"
            :to="`tel:${telephone}`"
            :text="telephone"
        />
        <div
            v-if="position"
            class="position"
            v-html="position"
        />
    </div>
</template>
<script>
export default {
    props: {
        name: {
            type: String,
            default: ""
        },
        telephone: {
            type: String,
            default: ""
        },
        email: {
            type: String,
            default: ""
        },
        position: {
            type: String,
            default: ""
        }
    }
}
</script>
<style lang="scss" scoped>
.block-rep {
    width: 50%;
    overflow: hidden;

    a {
        display: block;
    }

    .name,
    .telephone,
    .position {
        transform: translate(0%, 100%);
        opacity: 0;
        transition: transform 0.6s var(--easing-authentic-motion),
            opacity 0.6s var(--easing-authentic-motion);
    }

    .name {
        font-size: 22px;
    }
    .position,
    .telephone {
        margin-top: 6px;
        font-size: 14px;
    }

    &.has-intersected {
        .name,
        .telephone,
        .position {
            opacity: 1;
            transform: translate(0);
        }
    }

    // Breakpoints
    @media #{$lt-phone} {
        .name {
            font-size: 18px;
        }
    }
}
</style>
