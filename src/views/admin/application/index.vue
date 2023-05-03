
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="申请类型" prop="type"><el-select v-model="queryParams.type"
                                               placeholder="申请申请类型" clearable size="small">
                                        <el-option
                                                v-for="dict in typeOptions"
                                                :key="dict.value"
                                                :label="dict.label"
                                                :value="dict.value"
                                        />
                                    </el-select>
                            </el-form-item>
                        <el-form-item label="申请内容" prop="applicationContext"><el-input v-model="queryParams.applicationContext" placeholder="请输入申请内容" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        <el-form-item label="状态" prop="status"><el-select v-model="queryParams.status"
                                               placeholder="申请状态" clearable size="small">
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
                <el-table v-loading="loading" :data="applicationList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/><el-table-column label="申请类型" align="center" prop="type"
                                                 :formatter="typeFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ typeFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="申请内容" align="center" prop="applicationContext"
                                                 :show-overflow-tooltip="true"/><el-table-column label="状态" align="center" prop="status"
                                                 :formatter="statusFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ statusFormat(scope.row) }}
                                    </template>
                                </el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                         <el-popconfirm
                           class="delete-popconfirm"
                           title="确认要通过吗?"
                           confirm-button-text="通过"
                           @onConfirm="handleUpdate(scope.row)"
                         >
                           <el-button
                             slot="reference"
                             v-permisaction="['admin:application:edit']"
                             size="mini"
                             type="text"
                             icon="el-icon-edit"
                           >通过
                           </el-button>
                         </el-popconfirm>
                         <el-popconfirm
                            class="delete-popconfirm"
                            title="确认要拒绝吗?"
                            confirm-button-text="拒绝"
                            @onConfirm="handleDelete(scope.row)"
                         >
                            <el-button
                              slot="reference"
                              v-permisaction="['admin:application:remove']"
                              size="mini"
                              type="text"
                              icon="el-icon-delete"
                            >拒绝
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
                        
                                    <el-form-item label="申请类型" prop="type">
                                        <el-input v-model="form.type" placeholder="申请类型"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="申请内容" prop="applicationContext">
                                        <el-input v-model="form.applicationContext" placeholder="申请内容"
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
    import {addApplication, delApplication, getApplication, listApplication, updateApplication} from '@/api/admin/application'
    
    export default {
        name: 'Application',
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
                applicationList: [],
                typeOptions: [],statusOptions: [],
                // 关系表类型
                
                // 查询参数
                queryParams: {
                    pageIndex: 1,
                    pageSize: 10,
                    type:undefined,
                    applicationContext:undefined,
                    status:undefined,
                    
                },
                // 表单参数
                form: {
                },
                // 表单校验
                rules: {type:  [ {required: true, message: '申请类型不能为空', trigger: 'blur'} ],
                applicationContext:  [ {required: true, message: '申请内容不能为空', trigger: 'blur'} ],
                status:  [ {required: true, message: '状态不能为空', trigger: 'blur'} ],
                }
        }
        },
        created() {
            this.getList()
            this.getDicts('sys_application_type').then(response => {
                this.typeOptions = response.data
            })
            this.getDicts('sys_application_status').then(response => {
                this.statusOptions = response.data
            })
            },
        methods: {
            /** 查询参数列表 */
            getList() {
                this.loading = true
                listApplication(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.applicationList = response.data.list
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
                type: undefined,
                applicationContext: undefined,
            }
                this.resetForm('form')
            },
            getImgList: function() {
              this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
            },
            fileClose: function() {
              this.fileOpen = false
            },
            typeFormat(row) {
                return this.selectDictLabel(this.typeOptions, row.type)
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
                this.title = '添加申请'
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
                getApplication(id).then(response => {
                    this.form = response.data
                    this.open = true
                    this.title = '修改申请'
                    this.isEdit = true
                })
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.id !== undefined) {
                            updateApplication(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess(response.msg)
                                    this.open = false
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        } else {
                            addApplication(this.form).then(response => {
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
                      return delApplication( { 'ids': Ids })
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
            /**审批拒绝 */
            handleRefuse(row) {
                var id = row.id 
                var type = row.type
                var opinion = 0

                this.$confirm('是否确认拒绝编号为"' + id + '"的数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                      return approvalApplication( { 'id': id,'type':type,'opinion':opinion })
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
            /**审批通过 */
            handlePass(row) {
                var id = row.id 
                var type = row.type
                var opinion = 1

                this.$confirm('是否确认通过编号为"' + id + '"的数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                      return approvalApplication( { 'id': id,'type':type,'opinion':opinion })
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
