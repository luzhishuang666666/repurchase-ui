
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="商品名称" prop="commodityId">
                        <el-select v-model="queryParams.commodityId" placeholder="请选择" clearable size="small" >
                            <el-option
                                v-for="dict in commodityIdOptions"
                                :key="dict.key"
                                :label="dict.value"
                                :value="dict.key"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商店名称" prop="shopId">
                        <el-select v-model="queryParams.shopId" placeholder="请选择" clearable size="small" >
                            <el-option
                                v-for="dict in shopIdOptions"
                                :key="dict.key"
                                :label="dict.value"
                                :value="dict.key"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="商店商品汇总状态" clearable size="small">
                            <el-option
                                v-for="dict in statusOptions"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"/>
                        </el-select>
                    </el-form-item>
                        
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:shopCommodity:add']"
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="handleAdd"
                        >新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:shopCommodity:edit']"
                                type="success"
                                icon="el-icon-edit"
                                size="mini"
                                :disabled="single"
                                @click="handleUpdate"
                        >修改
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:shopCommodity:remove']"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :disabled="multiple"
                                @click="handleDelete"
                        >删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="shopCommodityList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/><el-table-column label="商品名称" align="center" prop="commodityId" :formatter="commodityIdFormat">
                                <template slot-scope="scope">
                                    {{ commodityIdFormat(scope.row) }}
                                </template>
                            </el-table-column><el-table-column label="商店名称" align="center" prop="shopId" :formatter="shopIdFormat">
                                <template slot-scope="scope">
                                    {{ shopIdFormat(scope.row) }}
                                </template>
                            </el-table-column><el-table-column label="状态" align="center" prop="status"
                                                 :formatter="statusFormat">
                                    <template slot-scope="scope">
                                        {{ statusFormat(scope.row) }}
                                    </template>
                                </el-table-column>
                </el-table>

                <pagination
                        v-show="total>0"
                        :total="total"
                        :page.sync="queryParams.pageIndex"
                        :limit.sync="queryParams.pageSize"
                        @pagination="getList"
                />

                <!-- 添加或修改对话框 -->
                <el-dialog :title="title" :visible.sync="open" width="500px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                        
                                    <el-form-item label="商品编号" prop="commodityId">
                                        <!-- <el-input v-model="form.commodityId" placeholder="商品编号"/> -->
                                        <el-select v-model="form.commodityId" placeholder="请选择" clearable size="small" >
                                            <el-option
                                                v-for="dict in commodityIdOptions"
                                                :key="dict.key"
                                                :label="dict.value"
                                                :value="dict.key"/>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="商店编号" prop="shopId">
                                        <!-- <el-input v-model="form.shopId" placeholder="商店编号"/> -->
                                        <el-select v-model="form.shopId" placeholder="请选择" clearable size="small" >
                                            <el-option
                                                v-for="dict in shopIdOptions"
                                                :key="dict.key"
                                                :label="dict.value"
                                                :value="dict.key"/>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="状态" prop="status">
                                        <!-- <el-input v-model="form.status" placeholder="状态"/> -->
                                        <el-select v-model="form.status" placeholder="商店商品汇总状态" clearable size="small">
                                            <el-option
                                                v-for="dict in statusOptions"
                                                :key="dict.value"
                                                :label="dict.label"
                                                :value="dict.value"/>
                                        </el-select>
                                    </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </div>
                </el-dialog>
            </el-card>
        </template>
    </BasicLayout>
</template>

<script>
    import {addShopCommodity, delShopCommodity, getShopCommodity, listShopCommodity, updateShopCommodity} from '@/api/admin/shop-commodity'
    
    import {listCommodity } from '@/api/admin/commodity'
    import {listShop } from '@/api/admin/shop'
    export default {
        name: 'ShopCommodity',
        components: {
        },
        data() {
            return {
                // 遮罩层
                loading: true,
                // 选中数组
                ids: [],
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                // 总条数
                total: 0,
                // 弹出层标题
                title: '',
                // 是否显示弹出层
                open: false,
                isEdit: false,
                // 类型数据字典
                typeOptions: [],
                shopCommodityList: [],
                statusOptions: [],
                // 关系表类型
                commodityIdOptions :[],
                shopIdOptions :[],
                
                // 查询参数
                queryParams: {
                    pageIndex: 1,
                    pageSize: 10,
                    commodityId:undefined,
                    shopId:undefined,
                    status:undefined,
                    
                },
                // 表单参数
                form: {
                },
                // 表单校验
                rules: {commodityId:  [ {required: true, message: '商品编号不能为空', trigger: 'blur'} ],
                shopId:  [ {required: true, message: '商店编号不能为空', trigger: 'blur'} ],
                status:  [ {required: true, message: '状态不能为空', trigger: 'blur'} ],
                }
        }
        },
        created() {
            this.getList()
            this.getCommodityItems()
            this.getShopItems()
            this.getDicts('sys_shop_commodity_status').then(response => {
                this.statusOptions = response.data
            })
            },
        methods: {
            /** 查询参数列表 */
            getList() {
                this.loading = true
                listShopCommodity(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.shopCommodityList = response.data.list
                        this.total = response.data.count
                        this.loading = false
                    }
                )
            },
            // 取消按钮
            cancel() {
                this.open = false
                this.reset()
            },
            // 表单重置
            reset() {
                this.form = {
                
                id: undefined,
                commodityId: undefined,
                shopId: undefined,
                status: undefined,
            }
                this.resetForm('form')
            },
            getImgList: function() {
              this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
            },
            fileClose: function() {
              this.fileOpen = false
            },
            commodityIdFormat(row) {
                return this.selectItemsLabel(this.commodityIdOptions, row.commodityId)
            },
            shopIdFormat(row) {
                return this.selectItemsLabel(this.shopIdOptions, row.shopId)
            },
            statusFormat(row) {
                return this.selectDictLabel(this.statusOptions, row.status)
            },
            // 关系
            getCommodityItems() {
               this.getItems(listCommodity, undefined).then(res => {
                   this.commodityIdOptions = this.setItems(res, 'id', 'commodityName')
               })
            },
            getShopItems() {
               this.getItems(listShop, undefined).then(res => {
                   this.shopIdOptions = this.setItems(res, 'id', 'shopName')
               })
            },
            // 文件
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageIndex = 1
                this.getList()
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.dateRange = []
                this.resetForm('queryForm')
                this.handleQuery()
            },
            /** 新增按钮操作 */
            handleAdd() {
                this.reset()
                this.open = true
                this.title = '添加商店商品汇总'
                this.isEdit = false
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset()
                const id =
                row.id || this.ids
                getShopCommodity(id).then(response => {
                    this.form = response.data
                    this.open = true
                    this.title = '修改商店商品汇总'
                    this.isEdit = true
                })
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.id !== undefined) {
                            updateShopCommodity(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess(response.msg)
                                    this.open = false
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        } else {
                            addShopCommodity(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess(response.msg)
                                    this.open = false
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        }
                    }
                })
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                var Ids = (row.id && [row.id]) || this.ids

                this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                      return delShopCommodity( { 'ids': Ids })
                }).then((response) => {
                   if (response.code === 200) {
                     this.msgSuccess(response.msg)
                     this.open = false
                     this.getList()
                   } else {
                     this.msgError(response.msg)
                   }
                }).catch(function () {
                })
            }
        }
    }
</script>
