
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="模型名称" prop="modelId"><el-select v-model="queryParams.modelId"
                                           placeholder="请选择" clearable size="small" >
                                    <el-option
                                            v-for="dict in modelIdOptions"
                                            :key="dict.key"
                                            :label="dict.value"
                                            :value="dict.key"
                                    />
                                </el-select>
                            </el-form-item>
                        <el-form-item label="用户记录" prop="recordId"><el-select v-model="queryParams.recordId"
                                           placeholder="请选择" clearable size="small" >
                                    <el-option
                                            v-for="dict in recordIdOptions"
                                            :key="dict.key"
                                            :label="dict.value"
                                            :value="dict.key"
                                    />
                                </el-select>
                            </el-form-item>
                        <el-form-item label="记录状态" prop="status"><el-select v-model="queryParams.status"
                                               placeholder="预测记录状态" clearable size="small">
                                        <el-option
                                                v-for="dict in statusOptions"
                                                :key="dict.value"
                                                :label="dict.label"
                                                :value="dict.value"
                                        />
                                    </el-select>
                            </el-form-item>
                        <el-form-item label="预测结果" prop="result"><el-select v-model="queryParams.result"
                                               placeholder="预测结果" clearable size="small">
                                        <el-option
                                                v-for="dict in resultOptions"
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

                <el-table v-loading="loading" :data="repurchaseInfoList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/>
                    <el-table-column label="模型名称" align="center" prop="modelId" :formatter="modelIdFormat">
                                <template slot-scope="scope">
                                    {{ modelIdFormat(scope.row) }}
                                </template>
                            </el-table-column><el-table-column label="用户记录" align="center" prop="recordId" :formatter="recordIdFormat">
                                <template slot-scope="scope">
                                    {{ recordIdFormat(scope.row) }}
                                </template>
                            </el-table-column><el-table-column label="记录状态" align="center" prop="status"
                                                 :formatter="statusFormat">
                                    <template slot-scope="scope">
                                        {{ statusFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="预测结果" align="center" prop="result"
                                                 :formatter="resultFormat">
                                    <template slot-scope="scope">
                                        {{ resultFormat(scope.row) }}
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
                        
                                    <el-form-item label="模型名称" prop="modelId">
                                        <el-input v-model="form.modelId" placeholder="模型名称"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="用户记录" prop="recordId">
                                        <el-input v-model="form.recordId" placeholder="用户记录"/>
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
    import {addRepurchaseInfo, delRepurchaseInfo, getRepurchaseInfo, listRepurchaseInfo, updateRepurchaseInfo} from '@/api/admin/repurchase-info'
    
    import {listShopModel } from '@/api/admin/shop-model'
    import {listUserRecord, allUserRecord} from '@/api/admin/user-record'
    import {listCommodity } from '@/api/admin/commodity'
    export default {
        name: 'RepurchaseInfo',
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
                repurchaseInfoList: [],
                statusOptions: [],resultOptions: [],
                // 关系表类型
                modelIdOptions :[],
                recordIdOptions :[],
                commodityIdOptions :[],
                actionTypeOptions: [],
                
                // 查询参数
                queryParams: {
                    pageIndex: 1,
                    pageSize: 10,
                    modelId:undefined,
                    recordId:undefined,
                    status:undefined,
                    result:undefined,
                    
                },
                // 表单参数
                form: {
                },
                // 表单校验
                rules: {modelId:  [ {required: true, message: '模型编码不能为空', trigger: 'blur'} ],
                recordId:  [ {required: true, message: '用户记录编码不能为空', trigger: 'blur'} ]
                },
                userRecordDict: []
        }
        },
        created() {
            this.getList()
            this.getShopModelItems()
            this.getUserRecordItems()
            this.getCommodityItems()
            this.getDicts('sys_action_type').then(response => {
                this.actionTypeOptions = response.data
            })
            this.getDicts('predictive_record_status').then(response => {
                this.statusOptions = response.data
            })
            this.getDicts('forecast_result').then(response => {
                this.resultOptions = response.data
            })
            this.getUserRecord()
            },
        methods: {
            /** 查询参数列表 */
            getList() {
                this.loading = true
                listRepurchaseInfo(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.repurchaseInfoList = response.data.list
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
                modelId: undefined,
                recordId: undefined,
                status: undefined,
                result: undefined,
            }
                this.resetForm('form')
            },
            getImgList: function() {
              this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
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
            fileClose: function() {
              this.fileOpen = false
            },
            modelIdFormat(row) {
                return this.selectItemsLabel(this.modelIdOptions, row.modelId)
            },
            recordIdFormat(row) {
                return this.userRecordDict[row.recordId]
                // return this.selectItemsLabel(this.recordIdOptions, row.recordId)
            },
            statusFormat(row) {
                return this.selectDictLabel(this.statusOptions, row.status)
            },
            resultFormat(row) {
                return this.selectDictLabel(this.resultOptions, row.result)
            },
            actionTypeFormat(actionType) {
                return this.selectDictLabel(this.actionTypeOptions, actionType)
            },
            commodityIdFormat(commodityId) {
                return this.selectItemsLabel(this.commodityIdOptions, commodityId)
            },
            getCommodityItems() {
               this.getItems(listCommodity, undefined).then(res => {
                   this.commodityIdOptions = this.setItems(res, 'id', 'commodityName')
               })
            },
            // 关系
            getShopModelItems() {
               this.getItems(listShopModel, undefined).then(res => {
                   this.modelIdOptions = this.setItems(res, 'id', 'modelName')
               })
            },
            getUserRecordItems() {
               this.getItems(listUserRecord, undefined).then(res => {
                   this.recordIdOptions = this.setItems(res, 'id', 'commodityId')
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
                this.title = '添加预测记录'
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
                getRepurchaseInfo(id).then(response => {
                    this.form = response.data
                    this.open = true
                    this.title = '修改预测记录'
                    this.isEdit = true
                })
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.id !== undefined) {
                            updateRepurchaseInfo(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess(response.msg)
                                    this.open = false
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        } else {
                            addRepurchaseInfo(this.form).then(response => {
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
                      return delRepurchaseInfo( { 'ids': Ids })
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
