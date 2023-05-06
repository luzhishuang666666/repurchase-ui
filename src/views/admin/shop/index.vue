
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="商店编号" prop="shopNo"><el-input v-model="queryParams.shopNo" placeholder="请输入商店编号" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        <el-form-item label="商店名称" prop="shopName"><el-input v-model="queryParams.shopName" placeholder="请输入商店名称" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        <el-form-item label="商店备注" prop="shopRemark"><el-input v-model="queryParams.shopRemark" placeholder="请输入商店备注" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        <el-form-item label="状态" prop="status"><el-select v-model="queryParams.status"
                                               placeholder="商店状态" clearable size="small">
                                        <el-option
                                                v-for="dict in statusOptions"
                                                :key="dict.value"
                                                :label="dict.label"
                                                :value="dict.value"
                                        />
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
                                v-permisaction="['admin:shop:add']"
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="handleAdd"
                        >新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button 
                                v-permisaction="['admin:commodity:edit']" 
                                type="success" 
                                icon="el-icon-edit" size="mini"
                                :disabled="single" 
                                @click="handleUpdate">
                        修改
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="shopList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/><el-table-column label="商店编号" align="center" prop="shopNo"
                                                 :show-overflow-tooltip="true"/><el-table-column label="商店名称" align="center" prop="shopName"
                                                 :show-overflow-tooltip="true"/><el-table-column label="商店备注" align="center" prop="shopRemark"
                                                 :show-overflow-tooltip="true"/><el-table-column label="状态" align="center" prop="status"
                                                 :formatter="statusFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ statusFormat(scope.row) }}
                                    </template>
                                </el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                         <!-- <el-popconfirm
                           class="delete-popconfirm"
                           title="确认要修改吗?"
                           confirm-button-text="修改"
                           @onConfirm="handleUpdate(scope.row)"
                         >
                           <el-button
                             slot="reference"
                             v-permisaction="['admin:shop:edit']"
                             size="mini"
                             type="text"
                             icon="el-icon-edit"
                           >修改
                           </el-button>
                         </el-popconfirm> -->
                         <el-button slot="reference" v-permisaction="['admin:shop:edit']" size="small" type="info" icon="el-icon-edit" @click="handleDetail(scope.row.id)">详情</el-button>
                         <!-- <el-button
                            slot="reference"
                             v-permisaction="['admin:shop:edit']"
                             size="small"
                             type="info"
                             icon="el-icon-edit"
                             >详情
                        </el-button> -->
                         <el-popconfirm
                            class="delete-popconfirm"
                            :title="scope.row.status === '1' ? '确认要启用吗?' : '确认要停用吗?'"
                            confirm-button-text="确认"
                            @confirm="handleStatusChange(scope.row)"
                            >
                            <el-button
                                slot="reference"
                                :icon="scope.row.status === '1' ? 'el-icon-circle-check' : 'el-icon-circle-close'"
                                :type="scope.row.status === '1' ? 'success' : 'danger'"
                                size="small"
                                v-permisaction="['admin:shop:update']"
                            >
                                {{ scope.row.status === '1' ? '启用' : '停用' }}
                            </el-button>
                        </el-popconfirm>
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
                        
                                    <el-form-item label="商店名称" prop="shopName">
                                        <el-input v-model="form.shopName" placeholder="商店名称"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="商店备注" prop="shopRemark">
                                        <el-input v-model="form.shopRemark" placeholder="商店备注"
                                                      />
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
import {addShop, delShop, getShop, listShop, updateShop, changeShopStatus} from '@/api/admin/shop'
import router from '@/router'
    
    export default {
        name: 'Shop',
        components: {
    router
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
                shopList: [],
                statusOptions: [],
                // 关系表类型
                
                // 查询参数
                queryParams: {
                    pageIndex: 1,
                    pageSize: 10,
                    shopNo:undefined,
                    shopName:undefined,
                    shopRemark:undefined,
                    status:undefined,
                    
                },
                // 表单参数
                form: {
                },
                // 表单校验
                rules: {shopNo:  [ {required: true, message: '商店编号不能为空', trigger: 'blur'} ],
                shopName:  [ {required: true, message: '商店名称不能为空', trigger: 'blur'} ],
                shopRemark:  [ {required: true, message: '商店备注不能为空', trigger: 'blur'} ],
                status:  [ {required: true, message: '状态不能为空', trigger: 'blur'} ],
                }
        }
        },
        created() {
            this.getList()
            this.getDicts('sys_normal_disable').then(response => {
                this.statusOptions = response.data
            })
            },
        methods: {
            /** 查询参数列表 */
            getList() {
                this.loading = true
                listShop(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.shopList = response.data.list
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
                shopName: undefined,
                shopRemark: undefined,
            }
                this.resetForm('form')
            },
            getImgList: function() {
              this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
            },
            fileClose: function() {
              this.fileOpen = false
            },
            handleDetail(id) {
                this.$router.push({ path: `/shopdetail/${id}` })
            },
            statusFormat(row) {
                return this.selectDictLabel(this.statusOptions, row.status)
            },
            // 关系
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
                this.title = '添加商店'
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
                getShop(id).then(response => {
                    this.form = response.data
                    this.open = true
                    this.title = '修改商店'
                    this.isEdit = true
                })
            },
            /** 状态变更操作 */
            handleStatusChange(row) {
                const id = row.id || this.ids
                changeShopStatus(id).then(response => {
                    if (response.code === 200) {
                        this.msgSuccess(response.msg)
                        this.open = false
                        this.getList()
                    } 
                    else {
                        this.msgError(response.msg)
                    }
                })
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.id !== undefined) {
                            updateShop(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess(response.msg)
                                    this.open = false
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        } else {
                            addShop(this.form).then(response => {
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
                      return delShop( { 'ids': Ids })
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
