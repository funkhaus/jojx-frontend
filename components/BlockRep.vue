<template lang="html">
    <div class="block-rep">
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
    a {
        display: block;
    }
    .name {
        font-size: 22px;
    }
    .position,
    .telephone {
        margin-top: 10px;

        font-size: 14px;
    }

    // Breakpoints
    @media #{$lt-phone} {
        .name {
            font-size: 18px;
        }
    }
}
</style>
