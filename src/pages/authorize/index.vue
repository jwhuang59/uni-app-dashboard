<template src="./index.html"></template>
<style lang="scss" src="./index.scss" scoped></style>
<script>
let that;
export default {
    data() {
        return {};
    },
    onLoad() {
        that = this;
    },
    methods: {
        // 判断是否开启授权设置
        bindUserInfo(e) {
            if (e.detail.userInfo) {
                this.authorization(e.detail);
            } else {
                uni.showModal({
                    title: '提示',
                    content: '请允许获取您的用户信息',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            uni.openSetting({
                                success: function (res) {
                                    if (res.authSetting['scope.userInfo']) {
                                        that.authorization(res);
                                    }
                                },
                                fail: function (res) {
                                    uni.showToast({
                                        title: '登录失败，请重新授权',
                                        icon: 'none',
                                        duration: 3000
                                    });
                                }
                            });
                        }
                    }
                });
            }
        },
        // 授权用户信息
        authorization(info) {
            uni.getUserInfo({
                success(res) {
                    that.$store.commit({
                        type: 'save_user_info',
                        playload: res.userInfo || ''
                    });

                    that.reLaunch('home');
                },
                fail() {
                    uni.showToast({
                        title: '登录失败，请重新授权',
                        icon: 'none',
                        duration: 3000
                    });
                }
            });
            // uni.login({
            //     success(res) {
            //         that.$request('login', {
            //             code: res.code,
            //             nickname: info.userInfo.nickName,
            //             avatar: info.userInfo.avatarUrl
            //         }).then(data => {

            //             // that.$request('getInfo', {
            //             //     token: data.data.loginToken,
            //             //     rawData: info.rawData,
            //             //     signature: info.signature,
            //             //     encryptedData: info.encryptedData,
            //             //     iv: info.iv,
            //             //     nickname: info.userInfo.nickName,
            //             //     avatar: info.userInfo.avatarUrl
            //             // }).then(res => {
            //             //     that.setData({
            //             //         isAuthorUser: true
            //             //     });
            //             // });

            //         });
            //     },
            //     fail() {
            //         uni.showToast({
            //             title: '登录失败，请重新授权',
            //             icon: 'none',
            //             duration: 3000
            //         });
            //     }
            // });
        }
    },
    onShow() {
        uni.hideHomeButton();
    }
};
</script>
