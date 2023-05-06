
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="120px">
                    <el-form-item label="购买者编号" prop="itemId"><el-input v-model="queryParams.itemId" placeholder="请输入购买者编号" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
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
                        <el-form-item label="购买者年龄范围" prop="ageRange">
                            <el-select v-model="queryParams.ageRange" placeholder="用户记录购买者年龄范围" clearable size="small">
                                <el-option
                                    v-for="dict in ageRangeOptions"
                                    :key="dict.value"
                                    :label="dict.label"
                                    :value="dict.value"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="购买者性别" prop="gender">
                            <el-select v-model="queryParams.gender" placeholder="用户记录购买者性别" clearable size="small">
                                <el-option
                                    v-for="dict in genderOptions"
                                    :key="dict.value"
                                    :label="dict.label"
                                    :value="dict.value"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品名称" prop="commodityId">
                            <el-select v-model="queryParams.commodityId" placeholder="请选择" clearable size="small" >
                                <el-option
                                    v-for="dict in commodityIdOptions"
                                    :key="dict.key"
                                    :label="dict.value"
                                    :value="dict.key"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="操作行为类别" prop="actionType">
                            <el-select v-model="queryParams.actionType" placeholder="用户记录操作行为类别" clearable size="small">
                                <el-option
                                    v-for="dict in actionTypeOptions"
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
                                v-permisaction="['admin:userRecord:add']"
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="handleAdd"
                        >新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:userRecord:edit']"
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
                                v-permisaction="['admin:userRecord:remove']"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :disabled="multiple"
                                @click="handleDelete"
                        >删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="userRecordList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/>
                        <el-table-column label="购买者编号" align="center" prop="itemId" :show-overflow-tooltip="true"/>
                        <el-table-column label="商店名称" align="center" prop="shopId" :formatter="shopIdFormat">
                                <template slot-scope="scope">
                                    {{ shopIdFormat(scope.row) }}
                                </template>
                            </el-table-column>
                        <el-table-column label="购买者年龄范围" align="center" prop="ageRange" :formatter="ageRangeFormat">
                                <template slot-scope="scope">
                                    {{ ageRangeFormat(scope.row) }}
                                </template>
                            </el-table-column><el-table-column label="购买者性别" align="center" prop="gender"
                                                 :formatter="genderFormat">
                                    <template slot-scope="scope">
                                        {{ genderFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="商品名称" align="center" prop="commodityId" :formatter="commodityIdFormat">
                                <template slot-scope="scope">
                                    {{ commodityIdFormat(scope.row) }}
                                </template>
                            </el-table-column><el-table-column label="操作行为类别" align="center" prop="actionType"
                                                 :formatter="actionTypeFormat">
                                    <template slot-scope="scope">
                                        {{ actionTypeFormat(scope.row) }}
                                    </template>
                                </el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                         <el-popconfirm
                           class="delete-popconfirm"
                           title="确认要修改吗?"
                           confirm-button-text="修改"
                           @onConfirm="handleUpdate(scope.row)"
                         >
                           <el-button
                             slot="reference"
                             v-permisaction="['admin:userRecord:edit']"
                             size="mini"
                             type="text"
                             icon="el-icon-edit"
                           >修改
                           </el-button>
                         </el-popconfirm>
                         <el-popconfirm
                            class="delete-popconfirm"
                            title="确认要删除吗?"
                            confirm-button-text="删除"
                            @onConfirm="handleDelete(scope.row)"
                         >
                            <el-button
                              slot="reference"
                              v-permisaction="['admin:userRecord:remove']"
                              size="mini"
                              type="text"
                              icon="el-icon-delete"
                            >删除
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
                        
                                    <el-form-item label="购买者编号" prop="itemId">
                                        <el-input v-model="form.itemId" placeholder="购买者编号"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="商店名称" prop="shopId">
                                        <!-- <el-input v-model="form.shopId" placeholder="商店编号"/> -->
                                        <el-select v-model="form.shopId" placeholder="请选择" clearable size="small" >
                                            <el-option
                                                v-for="dict in shopIdOptions"
                                                :key="dict.key"
                                                :label="dict.value"
                                                :value="dict.key"/>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="购买者年龄范围" prop="ageRange">
                                        <!-- <el-input v-model="form.ageRange" placeholder="购买者年龄范围"/> -->
                                        <el-select v-model="queryParams.ageRange" placeholder="用户记录购买者年龄范围" clearable size="small">
                                            <el-option
                                                v-for="dict in ageRangeOptions"
                                                :key="dict.value"
                                                :label="dict.label"
                                                :value="dict.value"/>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="购买者性别" prop="gender">
                                        <!-- <el-input v-model="form.gender" placeholder="购买者性别"/> -->
                                        <el-select v-model="queryParams.gender" placeholder="用户记录购买者性别" clearable size="small">
                                            <el-option
                                                v-for="dict in genderOptions"
                                                :key="dict.value"
                                                :label="dict.label"
                                                :value="dict.value"/>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="商品名称" prop="commodityId">
                                        <!-- <el-input v-model="form.commodityId" placeholder="商品编号"/> -->
                                        <el-select v-model="queryParams.commodityId" placeholder="请选择" clearable size="small" >
                                            <el-option
                                                v-for="dict in commodityIdOptions"
                                                :key="dict.key"
                                                :label="dict.value"
                                                :value="dict.key"/>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="操作行为类别" prop="actionType">
                                        <!-- <el-input v-model="form.actionType" placeholder="操作行为类别"/> -->
                                        <el-select v-model="queryParams.actionType" placeholder="用户记录操作行为类别" clearable size="small">
                                            <el-option
                                                v-for="dict in actionTypeOptions"
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
    import {addUserRecord, delUserRecord, getUserRecord, listUserRecord, updateUserRecord} from '@/api/admin/user-record'
    
    import {listShop } from '@/api/admin/shop'
    import {listCommodity } from '@/api/admin/commodity'
    export default {
        name: 'UserRecord',
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
                userRecordList: [],
                ageRangeOptions: [],genderOptions: [],actionTypeOptions: [],
                // 关系表类型
                shopIdOptions :[],
                commodityIdOptions :[],
                
                // 查询参数
                queryParams: {
                    pageIndex: 1,
                    pageSize: 10,
                    itemId:undefined,
                    shopId:undefined,
                    ageRange:undefined,
                    gender:undefined,
                    commodityId:undefined,
                    actionType:undefined,
                    
                },
                // 表单参数
                form: {
                },
                // 表单校验
                rules: {itemId:  [ {required: true, message: '购买者编号不能为空', trigger: 'blur'} ],
                shopId:  [ {required: true, message: '商店编号不能为空', trigger: 'blur'} ],
                ageRange:  [ {required: true, message: '购买者年龄范围不能为空', trigger: 'blur'} ],
                gender:  [ {required: true, message: '购买者性别不能为空', trigger: 'blur'} ],
                commodityId:  [ {required: true, message: '商品编号不能为空', trigger: 'blur'} ],
                actionType:  [ {required: true, message: '操作行为类别不能为空', trigger: 'blur'} ],
                }
        }
        },
        created() {
            this.getList()
            this.getShopItems()
            this.getDicts('sys_user_age_range').then(response => {
                this.ageRangeOptions = response.data
            })
            this.getDicts('sys_costomer_sex').then(response => {
                this.genderOptions = response.data
            })
            this.getCommodityItems()
            this.getDicts('sys_action_type').then(response => {
                this.actionTypeOptions = response.data
            })
            },
        methods: {
            /** 查询参数列表 */
            getList() {
                this.loading = true
                listUserRecord(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.userRecordList = response.data.list
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
                itemId: undefined,
                shopId: undefined,
                ageRange: undefined,
                gender: undefined,
                commodityId: undefined,
                actionType: undefined,
            }
                this.resetForm('form')
            },
            getImgList: function() {
              this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
            },
            fileClose: function() {
              this.fileOpen = false
            },
            shopIdFormat(row) {
                return this.selectItemsLabel(this.shopIdOptions, row.shopId)
            },
            ageRangeFormat(row) {
                return this.selectDictLabel(this.ageRangeOptions, row.ageRange)
            },
            genderFormat(row) {
                return this.selectDictLabel(this.genderOptions, row.gender)
            },
            commodityIdFormat(row) {
                return this.selectItemsLabel(this.commodityIdOptions, row.commodityId)
            },
            actionTypeFormat(row) {
                return this.selectDictLabel(this.actionTypeOptions, row.actionType)
            },
            // 关系
            getShopItems() {
               this.getItems(listShop, undefined).then(res => {
                   this.shopIdOptions = this.setItems(res, 'id', 'shopName')
               })
            },
            getCommodityItems() {
               this.getItems(listCommodity, undefined).then(res => {
                   this.commodityIdOptions = this.setItems(res, 'id', 'commodityName')
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
                this.title = '添加用户记录'
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
                getUserRecord(id).then(response => {
                    this.form = response.data
                    this.open = true
                    this.title = '修改用户记录'
                    this.isEdit = true
                })
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.id !== undefined) {
                            updateUserRecord(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess(response.msg)
                                    this.open = false
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        } else {
                            addUserRecord(this.form).then(response => {
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
                      return delUserRecord( { 'ids': Ids })
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
