<template lang="html">
    <div class="contact-region">
        <h2
            class="title"
            v-html="title"
        />
        <div class="meta">
            <div class="info-meta">
                <a
                    target="_blank"
                    class="address"
                    :href="mapUrl"
                    v-html="address"
                />
                <a
                    class="email"
                    :href="`mailto:${email}`"
                >
                    Email front desk
                </a>
                <a
                    class="phone"
                    :href="`tel:${phone}`"
                    v-html="phone"
                />
                <div class="social-links">
                    <a
                        v-for="link in socialLinks"
                        :key="link.title"
                        class="social-link"
                        :href="link.to"
                        target="_blank"
                        v-html="link.title"
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
export default {
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

    .title {
        margin: 0 0 30px;
        max-width: 620px;

        font-size: 50px;
        font-weight: 300;
        line-height: 1.2;
        color: var(--color-black);

        ::v-deep p {
            margin: 0;
        }
    }
    .meta {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }
    .info-meta {
        margin-right: 45px;

        max-width: 215px;

        display: flex;
        flex-direction: column;

        font-size: 18px;
        font-weight: 300;
    }
    .address {
        line-height: 1.3;
    }
    .email {
        margin: 35px 0 10px;
    }
    .phone {
        margin: 0 0 30px;
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

        .title {
            padding: 0 20px;
            font-size: 34px;
        }
        .meta {
            display: block;
        }
        .info-meta {
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
