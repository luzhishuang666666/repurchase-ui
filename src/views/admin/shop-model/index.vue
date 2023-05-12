
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="商店名称" prop="shopId">
                        <el-select v-model="queryParams.shopId" placeholder="请选择" clearable size="small" >
                            <el-option  v-for="dict in shopIdOptions"
                                            :key="dict.key"
                                            :label="dict.value"
                                            :value="dict.key"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="模板名称" prop="templateId">
                        <el-select v-model="queryParams.templateId" placeholder="请选择" clearable size="small" >
                                <el-option
                                            v-for="dict in templateIdOptions"
                                            :key="dict.key"
                                            :label="dict.value"
                                            :value="dict.key"
                                    />
                        </el-select>
                    </el-form-item>
                        <el-form-item label="模型名称" prop="modelName"><el-input v-model="queryParams.modelName" placeholder="请输入模型名称" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        <el-form-item label="模型备注" prop="modelRemark"><el-input v-model="queryParams.modelRemark" placeholder="请输入模型备注" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:shopModel:add']"
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="handleAdd"
                        >新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:shopModel:edit']"
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
                                v-permisaction="['admin:shopModel:remove']"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :disabled="multiple"
                                @click="handleDelete"
                        >删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="shopModelList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/><el-table-column label="商店编码" align="center" prop="shopId" :formatter="shopIdFormat" >
                                <template slot-scope="scope">
                                    {{ shopIdFormat(scope.row) }}
                                </template>
                            </el-table-column><el-table-column label="模板编码" align="center" prop="templateId" :formatter="templateIdFormat" >
                                <template slot-scope="scope">
                                    {{ templateIdFormat(scope.row) }}
                                </template>
                            </el-table-column><el-table-column label="模型名称" align="center" prop="modelName"
                                                 :show-overflow-tooltip="true"/><el-table-column label="模型备注" align="center" prop="modelRemark"
                                                 :show-overflow-tooltip="true"/>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button slot="reference" v-permisaction="['admin:shopModel:edit']" size="small" type="success" icon="el-icon-edit" @click="handlePredict(scope.row)">复购预测</el-button>
                         <!-- <el-popconfirm
                           class="delete-popconfirm"
                           title="确认要修改吗?"
                           confirm-button-text="修改"
                           @onConfirm="handleUpdate(scope.row)"
                         >
                           <el-button
                             slot="reference"
                             v-permisaction="['admin:shopModel:edit']"
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
                              v-permisaction="['admin:shopModel:remove']"
                              size="mini"
                              type="text"
                              icon="el-icon-delete"
                            >删除
                            </el-button>
                         </el-popconfirm> -->
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
                        
                                    <el-form-item label="商店名称" prop="shopId">
                                        <!-- <el-input v-model="form.shopId" placeholder="商店编码"
                                                      /> -->
                                        <el-select v-model="form.shopId" placeholder="请选择" clearable size="small" >
                                            <el-option  v-for="dict in shopIdOptions"
                                                            :key="dict.key"
                                                            :label="dict.value"
                                                            :value="dict.key"/>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="模板名称" prop="templateId">
                                        <!-- <el-input v-model="form.templateId" placeholder="模板编码"
                                                      /> -->
                                        <el-select v-model="form.templateId" placeholder="请选择" clearable size="small" >
                                                <el-option v-for="dict in templateIdOptions"
                                                        :key="dict.key"
                                                        :label="dict.value"
                                                        :value="dict.key"/>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="模型名称" prop="modelName">
                                        <el-input v-model="form.modelName" placeholder="模型名称"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="模型备注" prop="modelRemark">
                                        <el-input v-model="form.modelRemark" placeholder="模型备注"
                                                      />
                                    </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </div>
                </el-dialog>

                <el-dialog :title="title" :visible.sync="open1" width="500px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                                    <el-form-item label="模型名称" prop="modelName">
                                        <el-input v-model="form1.modelName" :readonly="true" placeholder="模型名称"/>
                                    </el-form-item>
                                    <el-form-item label="用户记录" prop="Id">
                                        <el-select v-model="form1.userRecordId" placeholder="请选择" clearable size="small" >
                                            <el-option  v-for="(value, key) in userRecordDict"
                                                            :key="key"
                                                            :label="value"
                                                            :value="key"/>
                                        </el-select>
                                    </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitForm1">确 定</el-button>
                        <el-button @click="cancel1">取 消</el-button>
                    </div>
                </el-dialog>
            </el-card>
        </template>
    </BasicLayout>
</template>

<script>
    import {addShopModel, delShopModel, getShopModel, listShopModel, updateShopModel, forecast} from '@/api/admin/shop-model'
    import { allUserRecord } from '@/api/admin/user-record'
    import {listShop } from '@/api/admin/shop'
    import {listTemplateModel } from '@/api/admin/template-model'
    import {listCommodity } from '@/api/admin/commodity'
    export default {
        name: 'ShopModel',
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
                open1: false,
                isEdit: false,
                // 类型数据字典
                typeOptions: [],
                shopModelList: [],
                actionTypeOptions: [],
                commodityIdOptions :[],
                
                // 关系表类型
                shopIdOptions :[],
                templateIdOptions :[],
                
                // 查询参数
                queryParams: {
                    pageIndex: 1,
                    pageSize: 10,
                    shopId:undefined,
                    templateId:undefined,
                    modelName:undefined,
                    modelRemark:undefined,
                    
                },
                // 表单参数
                form: {
                },
                // 表单校验
                rules: {shopId:  [ {required: true, message: '商店编码不能为空', trigger: 'blur'} ],
                templateId:  [ {required: true, message: '模板编码不能为空', trigger: 'blur'} ],
                modelName:  [ {required: true, message: '模型名称不能为空', trigger: 'blur'} ],
                modelRemark:  [ {required: true, message: '模型备注不能为空', trigger: 'blur'} ],
                },
                form1: {

                },
                userRecordDict: []
        }
        },
        created() {
            this.getList()
            this.getShopItems()
            this.getTemplateModelItems()
            this.getDicts('sys_action_type').then(response => {
                this.actionTypeOptions = response.data
            })
            this.getCommodityItems()
            this.getUserRecord()
        },
        methods: {
            /** 查询参数列表 */
            getList() {
                this.loading = true
                listShopModel(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.shopModelList = response.data.list
                        this.total = response.data.count
                        this.loading = false
                    }
                )
            },
            getUserRecord() {
                allUserRecord().then(response => {
                    if(response.code === 200) {
                        this.userRecordDict = response.data.map(item => {
                            const actionTypeString = this.actionTypeFormat(item.actionType);
                            const commodityNameString = this.commodityIdFormat(item.commodityId);
                            const { id, itemId } = item;
                            return { [id]: `${itemId}-${commodityNameString}-${actionTypeString}` };
                        }).reduce((acc, cur) => ({ ...acc, ...cur }), {});
                    }
                })
            },
            commodityIdFormat(commodityId) {
                return this.selectItemsLabel(this.commodityIdOptions, commodityId)
            },
            getCommodityItems() {
               this.getItems(listCommodity, undefined).then(res => {
                   this.commodityIdOptions = this.setItems(res, 'id', 'commodityName')
               })
            },
            // 取消按钮
            cancel() {
                this.open = false
                this.reset()
            },
            cancel1(row) {
                this.open1 = false
                this.reset1(row)
            },
            // 表单重置
            reset() {
                this.form = {
                
                id: undefined,
                shopId: undefined,
                templateId: undefined,
                modelName: undefined,
                modelRemark: undefined,
                modelParam: undefined,
            }
                this.resetForm('form')
            },
            reset1(row) {
                this.form1 = {
                id: row.id,
                modelName: row.modelName,
                userRecordId: undefined,
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
            templateIdFormat(row) {
                return this.selectItemsLabel(this.templateIdOptions, row.templateId)
            },
            // 关系
            getShopItems() {
               this.getItems(listShop, undefined).then(res => {
                   this.shopIdOptions = this.setItems(res, 'id', 'shopName')
               })
            },
            getTemplateModelItems() {
               this.getItems(listTemplateModel, undefined).then(res => {
                   this.templateIdOptions = this.setItems(res, 'id', 'templateName')
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
                this.title = '添加复购预测模型'
                this.isEdit = false
            },
            handlePredict(row) {
                this.reset1(row)
                this.open1 = true
                this.title = '复购预测'
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
                getShopModel(id).then(response => {
                    this.form = response.data
                    this.open = true
                    this.title = '修改复购预测模型'
                    this.isEdit = true
                })
            },
            actionTypeFormat(actionType) {
                return this.selectDictLabel(this.actionTypeOptions, actionType)
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.id !== undefined) {
                            updateShopModel(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess(response.msg)
                                    this.open = false
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        } else {
                            addShopModel(this.form).then(response => {
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
            submitForm1: function () {
                forecast(this.form1).then(response => {
                    if(response.code === 200) {
                        console.log(response)
                        this.msgSuccess(response.msg)
                        this.open = false
                        this.getList()
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
                      return delShopModel( { 'ids': Ids })
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
            },

        }
    }
</script>
