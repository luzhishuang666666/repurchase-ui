
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="品牌名称" prop="brandName"><el-input v-model="queryParams.brandName"
                            placeholder="请输入品牌名称" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="品牌备注" prop="brandRemark"><el-input v-model="queryParams.brandRemark"
                            placeholder="请输入品牌备注" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button v-permisaction="['admin:brand:add']" type="primary" icon="el-icon-plus" size="mini"
                            @click="handleAdd">新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['admin:brand:edit']" type="success" icon="el-icon-edit" size="mini"
                            :disabled="single" @click="handleUpdate">修改
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['admin:brand:remove']" type="danger" icon="el-icon-delete" size="mini"
                            :disabled="multiple" @click="handleDelete">删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="brandList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" /><el-table-column label="品牌名称"
                        align="center" prop="brandName" :show-overflow-tooltip="true" /><el-table-column label="品牌备注"
                        align="center" prop="brandRemark" :show-overflow-tooltip="true" />
                </el-table>

                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageIndex"
                    :limit.sync="queryParams.pageSize" @pagination="getList" />

                <!-- 添加或修改对话框 -->
                <el-dialog :title="title" :visible.sync="open" width="500px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">

                        <el-form-item label="品牌名称" prop="brandName">
                            <el-input v-model="form.brandName" placeholder="品牌名称" />
                        </el-form-item>
                        <el-form-item label="品牌备注" prop="brandRemark">
                            <el-input v-model="form.brandRemark" placeholder="品牌备注" />
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-input v-model="form.status" placeholder="状态" />
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
import { addBrand, delBrand, getBrand, listBrand, updateBrand } from '@/api/admin/brand'

export default {
    name: 'Brand',
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
            brandList: [],

            // 关系表类型

            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                brandName: undefined,
                brandRemark: undefined,

            },
            // 表单参数
            form: {
            },
            // 表单校验
            rules: {
                brandName: [{ required: true, message: '品牌名称不能为空', trigger: 'blur' }],
                brandRemark: [{ required: true, message: '品牌备注不能为空', trigger: 'blur' }],
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        /** 查询参数列表 */
        getList() {
            this.loading = true
            listBrand(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.brandList = response.data.list
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
                brandName: undefined,
                brandRemark: undefined,
                status: undefined,
            }
            this.resetForm('form')
        },
        getImgList: function () {
            this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
        },
        fileClose: function () {
            this.fileOpen = false
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
            this.title = '添加品牌'
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
            getBrand(id).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改品牌'
                this.isEdit = true
            })
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id !== undefined) {
                        updateBrand(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess(response.msg)
                                this.open = false
                                this.getList()
                            } else {
                                this.msgError(response.msg)
                            }
                        })
                    } else {
                        addBrand(this.form).then(response => {
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
                return delBrand({ 'ids': Ids })
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
