<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="12">
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="总销售量" :total = "totalSales">
          <el-tooltip slot="action" class="item" effect="dark" content="总销售量用于展示本日商店商品的销售总量" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          <div>
            <trend :flag="weekTrend ? 'top' : 'bottom'" style="margin-right: 16px;" :rate="weekOnWeekRate">
              <span slot="term">周同比</span>
            </trend>
            <trend :flag="dayTrend ? 'top' : 'bottom'" :rate="dayOnDayRate">
              <span slot="term">日同比</span>
            </trend>
          </div>
          <template slot="footer">日均销售量<span>{{ dailySales }}</span></template>
        </chart-card>
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="总访问量" :total="totalViews">
          <el-tooltip slot="action" class="item" effect="dark" content="总访问量用于展示本日商店商品的访问总量" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          <div>
            <mini-area />
          </div>
          <template slot="footer">日访问量<span> {{ dailyViews }}</span></template>
        </chart-card>
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="总收藏数" :total="totalFavorites">
          <el-tooltip slot="action" class="item" effect="dark" content="用户在商店的收藏和加入购物车的总数" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          <div>
            <mini-bar />
          </div>
          <template slot="footer">日收藏数 <span>{{ dailyFavorites }}</span></template>
        </chart-card>
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="商店用户复购率" :total="repurchaseRateStr">
          <el-tooltip slot="action" class="item" effect="dark" content="用户在商店中重复购买的记录占比" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="repurchaseRate" :percentage="repurchaseRate" height="8px" />
          </div>
          <template slot="footer">重复购买数<span> {{ multiplePurchaseCount - singlePurchaseCount }}</span></template>
        </chart-card>
      </el-col>
    </el-row>

    <el-card :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <el-tabs>
          <el-tab-pane label="销售额">
            <el-row justify="center">
              <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                <bar :list="barData" title="销售额排行" />
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

  </div>
</template>

<script>
import ChartCard from '@/components/ChartCard'
import Trend from '@/components/Trend'
import MiniArea from '@/components/MiniArea'
import MiniBar from '@/components/MiniBar'
import MiniProgress from '@/components/MiniProgress'
import RankList from '@/components/RankList/index'
import Bar from '@/components/Bar.vue'

import { getShopAnalise } from '@/api/admin/shop'


export default {
  name: 'DashboardAdmin',
  components: {
    ChartCard,
    Trend,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar
  },
  data() {
    return {
      id: this.$route.params.id,
      dayOnDayRate: '',
      weekOnWeekRate: '',
      barData: [],
      totalSales: '',
      dayTrend: 0,
      weekTrend: 0,
      dailySales: '',
      totalViews: 0,
      dailyViews: 0,
      totalFavorites: 0,
      dailyFavorites: 0,
      repurchaseRateStr:'',
      repurchaseRate: 0,
      singlePurchaseCount: 0,
      multiplePurchaseCount: 0,
    }
  },
  created() {
    this.getAnalise(),
    console.log(barData)
  },
  methods: {
    getAnalise() {
      getShopAnalise(this.id).then(response =>{
        if (response.code === 200) {
                this.totalSales = response.data.totalSales
                this.dayOnDayRate = response.data.dayOnDayRate
                this.weekOnWeekRate = response.data.weekOnWeekRate
                this.dayTrend = response.data.dayTrend
                this.weekTrend = response.data.weekTrend
                this.dailySales = response.data.dailySales
                this.totalViews = response.data.totalViews
                this.totalFavorites = response.data.totalFavorites
                this.dailyFavorites = response.data.dailyFavorites
                this.repurchaseRate = response.data.repurchaseRate
                var tmp = this.repurchaseRate + ""
                this.repurchaseRateStr = tmp + "%"
                this.singlePurchaseCount = response.data.singlePurchaseCount
                this.multiplePurchaseCount = response.data.multiplePurchaseCount
                this.barData = response.data.barData
                console.log(response.data.barData)
            }else {
                this.msgError(response.msg)
            }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 12px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

::v-deep .el-tabs__item{
   padding-left: 16px!important;
   height: 50px;
   line-height: 50px;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
