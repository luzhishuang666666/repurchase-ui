<template>
    <BasicLayout>
      <template #wrapper>
        <el-row :gutter="10">
          <el-col :span="6" :xs="24">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>店铺信息</span>
              </div>
              <div>
                <div class="text-center">
                  <userAvatar :user="user" />
                </div>
                <ul class="list-group list-group-striped">
                  <li class="list-group-item">
                    <svg-icon icon-class="user" />用户名称
                    <div class="pull-right">{{ user.username }}</div>
                  </li>
                  <li class="list-group-item">
                    <svg-icon icon-class="phone" />手机号码
                    <div class="pull-right">{{ user.phone }}</div>
                  </li>
                  <li class="list-group-item">
                    <svg-icon icon-class="email" />用户邮箱
                    <div class="pull-right">{{ user.email }}</div>
                  </li>
                  <li class="list-group-item">
                    <svg-icon icon-class="tree" />商店名称
                    <div class="pull-right">{{ shop.shopName }}</div>
                  </li>
                  <li class="list-group-item">
                    <svg-icon icon-class="tree" />商店编号
                    <div class="pull-right">{{ shop.shopNo }}</div>
                  </li>
                  <li class="list-group-item">
                    <svg-icon icon-class="peoples" />商店备注
                    <div class="pull-right">{{ shop.shopRemark }}</div>
                  </li>
                  <li class="list-group-item">
                    <svg-icon icon-class="date" />创建日期
                    <div class="pull-right">{{ shop.createdAt }}</div>
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
    </BasicLayout>
  </template>

<script>
import userAvatar from './userAvatar'
import { getUserProfile } from '@/api/admin/sys-user'
import { addShop, delShop, getShop, listShop, updateShop, changeShopStatus } from '@/api/admin/shop'

export default {
  name: 'ShopDetail',
  components: { userAvatar },
  data() {
    return {
      id: this.$route.params.id,
      user: {},
      shop: {},
      roleGroup: {},
      roleIds: undefined,
      roleName: undefined,
      dept: {},
      deptName: undefined
    }
  },
  created() {
    this.getUser(),
    this.getShop()
  },
  methods: {
    /** 获取个人信息 */
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data.user
        this.roleIds = response.data.user.roleIds
        this.roleGroup = response.data.roles

        if (this.roleIds[0]) {
          for (const key in this.roleGroup) {
            if (this.roleIds[0] === this.roleGroup[key].roleId) {
              this.roleName = this.roleGroup[key].roleName
            }
          }
        } else {
          this.roleName = '暂无'
        }
        this.dept = response.data.user.dept
        this.deptName = this.dept.deptName
      })
    },
    /** 获取商店信息 */
    getShop() {
        getShop(this.id).then(response =>{
            if (response.code === 200) {
                this.shop = response.data
            }else {
                this.msgError(response.msg)
            }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-group-item{
    padding: 18px 0;
  }
  .svg-icon{
    margin-right: 5px;
  }
</style>
