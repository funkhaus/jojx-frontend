<template lang="html">
    <div
        v-intersection-observer
        class="contact-region"
    >
        <h2
            class="title"
            v-html="title"
        />
        <div class="panel-content">
            <div class="panel-info">
                <effect-text-hover
                    target="_blank"
                    class="address"
                    :to="mapUrl"
                    :text="address"
                />
                <effect-text-hover
                    class="email"
                    :to="`mailto:${email}`"
                    text="Email front desk"
                />

                <effect-text-hover
                    class="phone"
                    :to="`tel:${phone}`"
                    :text="phone"
                />
                <div class="social-links">
                    <effect-text-hover
                        v-for="link in socialLinks"
                        :key="link.title"
                        class="social-link"
                        :to="link.to"
                        target="_blank"
                        :text="link.title"
                    />
                </div>
            </div>
            <wp-image
                :image="image"
                class="image"
            />
        </div>
    </div>
</template>
<script>
import EffectTextHover from "./EffectTextHover.vue"
export default {
    components: { EffectTextHover },
    props: {
        title: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        },
        mapUrl: {
            type: String,
            default: ""
        },
        email: {
            type: String,
            default: ""
        },
        phone: {
            type: String,
            default: ""
        },
        socialLinks: {
            type: Array,
            default: () => []
        },
        image: {
            type: Object,
            default: () => ({})
        }
    }
}
</script>
<style lang="scss" scoped>
.contact-region {
    padding: 0 120px 0 125px;
    margin: 100px 0 90px;

    box-sizing: border-box;
    color: var(--color-black);

    .title,
    .address,
    .email,
    .phone,
    .image,
    .social-links {
        transform: translate(-100%, 0);
        opacity: 0;
        transition: transform 0.6s var(--easing-authentic-motion),
            opacity 0.6s var(--easing-authentic-motion);
    }
    .image {
        transform: translate(100%, 0);
    }

    .title {
        margin: 0 0 30px;
        max-width: 620px;

        font-size: 50px;
        font-weight: 300;
        line-height: 1.2;
        color: var(--color-black);

        ::v-deep p {
            margin: 0;
            font-size: 50px;
            font-weight: 300;
        }
    }
    .panel-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }
    .panel-info {
        margin-right: 45px;

        max-width: 215px;

        display: flex;
        flex-direction: column;

        font-size: 18px;
        font-weight: 300;
    }
    .address {
        line-height: 1.3;
        transition-delay: 0.25s;
    }
    .email {
        margin: 25px 0 10px;
        transition-delay: 0.3s;
    }
    .phone {
        margin: 0 0 25px;
        transition-delay: 0.35s;
    }
    .social-links {
        transition-delay: 0.4s;
    }
    .social-link {
        margin: 5px 0;

        display: block;

        &:first-child {
            margin-top: 0;
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
    .image {
        max-width: 780px;
        width: 100%;
        height: 100%;
    }

    &.has-intersected {
        .title,
        .address,
        .email,
        .phone,
        .image,
        .social-links {
            opacity: 1;
            transform: translate(0);
        }
    }

    // Breakpoints
    @media #{$gt-cinema} {
        padding: 0 190px;

        .image {
            max-width: 1150px;
        }
    }
    @media #{$lt-tablet} {
        padding: 0 80px 0 70px;
        margin: 100px 0 55px;
    }
    @media #{$lt-phone} {
        padding: 0 20px;
        margin: 110px 0 35px;

        .address,
        .email,
        .phone,
        .social-links {
            transform: translate(100%, 0);
        }

        .title {
            padding: 0 20px;
            font-size: 34px;
        }
        .panel-content {
            display: block;
        }
        .panel-info {
            max-width: 180px;

            margin-right: 0;
            margin-left: auto;

            align-items: flex-start;
            justify-content: flex-end;

            text-align: left;
            font-size: 16px;
        }
        .social-links {
            margin-bottom: 35px;
        }
        .image {
            max-width: 100%;
        }
    }
}
</style>
