<template>
    <div>
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">隐私政策</p>
        </div>
        <div class="ccser-privacy">
            北京安盟公益发展中心是儿童失踪预警平台（以下简称CCSER或我们）的运营者，本《隐私政策》（以下简称本政策）阐述了CCSER将如何处理您的个人信息和隐私信息，并申明了CCSER对保护隐私的承诺，CCSER未来有可能根据信息处理情境不时更新或修改本政策。请您在向CCSER提交个人信息或隐私信息之前，阅读、了解并同意本政策和任何补充政策。

            <p class="ccser-privacy-title">我们收集以下信息</p>

            地理位置信息；<br>

            个人联系方式；<br>

            身份证信息；<br>

            其他根据具体的需要必要收集的信息。<br>

            作为用户，您可根据您的意愿决定是否提供上述信息，同时，您可以查看您提供给我们的个人信息及相关信息；您也可以根据实际状况的改变自行对您个人信息作出删除或更正。

            <p class="ccser-privacy-title">收集资料的方法</p>

            CCSER将会收集及储存您在平台上输入的资料，或通过其他渠道向我们提供的信息。我们亦会从其他独立第三方资料来源，获取与您有关并合法收集的个人或非个人资料；<br>

            您在相关站点及其他供应商所作的隐私设定，可限制或阻止我们对有关资料的查阅；<br>

            若您提供个人资料予我们，即表示您接受，CCSER将在所需期限内留存您的资料以履行有关用途，您的资料将在遵守适用相关法律及规定的情况下收集，并授权CCSER通过合法渠道了解、咨询、审查本人的真实情况，并据此判断本人身份的真实性等信息。

            <p class="ccser-privacy-title">收集个人资料可做以下用途</p>

            提供CCSER平台中所包含的相关信息；<br>

            CCSER网站及APP管理；<br>

            用户身份验证、安全防范、诈骗监测、存档和备份用途，确保我们向您提供的信息的安全性；如果我们监测到您使用我们的平台用于欺诈或非法目的，我们将会采取相应措施；<br>

            向您推送最新的相关信息；<br>

            协助执行法例、警方或其他政府或监管机构调查，以及遵守适用法律及规例所施行的规定，或其他向政府或监管机构承诺之义务。<br>

            CCSER不会对外出售、分享或出租用户的个人资料，而只会在按用户的要求提供某产品或服务的情况下，向我们的员工、可信的等三方或关联组织提供该些资料。为了让可信的第三方或关联组织向我们提供服务，我们也可能会向其分享用户的个人资料，但目的只为提供上述服务。

            <p class="ccser-privacy-title">信息安全及隐私保护措施</p>

            CCSER的数据保密拥有独立的服务器，服务器从软硬件两个层面进行了个人的信息安全防护。数据传输采用SSL协议进行加密。任何在CCSER注册的用户，CCSER已界定未经您同意应用程序无法访问的某些设备数据类型。并且CCSER有不同的权限系统可用于获得您的同意。<br>

            CCSER尊重并保护所有使用本平台的个人隐私权。为了给用户提供更准确、更有效的帮助，CCSER会按照法律规定的隐私权保护条款，以及用户的自愿性使用披露用户的相关信息。CCSER将以高度的审慎义务对待这些信息。在未征得您事先许可的情况下，CCSER不会将个人的隐私信息对外披露或向第三方提供。 请注意，任何安全系统都存在可能的及未知的风险。

            <p class="ccser-privacy-title">特别声明</p>

            关于CCSER所引用、摘录或转载的来自第三方的文字、图片、视频内容，仅基于传播公益精神之目的，并不表明这些内容代表CCSER的观点。

            <p class="ccser-privacy-title">协议变更</p>

            随着CCSER的进一步提升，法律声明的内容会随时更新。更新后的法律声明一旦在CCSER平台上公布即有效代替原来的声明。


        </div>
    </div>
</template>
<script>
export default {
    name:'CcserPrivacy',
    methods: {
        back(){
            this.$router.back();
        }
    },
}
</script>
<style scoped>
    .ccser-privacy {
        color: #333333;
        letter-spacing: 1px;
        padding: 59px 15px 0;
        font-size: 14px;
    }
    .ccser-privacy-title {
        font-weight: 600;
        margin: 15px 0;
    }
</style>