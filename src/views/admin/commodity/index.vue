
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="商品名称" prop="commodityName"><el-input v-model="queryParams.commodityName"
                            placeholder="请输入商品名称" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="品牌名称" prop="commodityBrandId"><el-select v-model="queryParams.commodityBrandId"
                            placeholder="请选择" clearable size="small">
                            <el-option v-for="dict in commodityBrandIdOptions" :key="dict.key" :label="dict.value"
                                :value="dict.key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品类名称" prop="commodityCategoryId"><el-select
                            v-model="queryParams.commodityCategoryId" placeholder="请选择" clearable size="small">
                            <el-option v-for="dict in commodityCategoryIdOptions" :key="dict.key" :label="dict.value"
                                :value="dict.key" />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button v-permisaction="['admin:commodity:add']" type="primary" icon="el-icon-plus" size="mini"
                            @click="handleAdd">新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['admin:commodity:edit']" type="success" icon="el-icon-edit" size="mini"
                            :disabled="single" @click="handleUpdate">修改
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-permisaction="['admin:commodity:remove']" type="danger" icon="el-icon-delete"
                            size="mini" :disabled="multiple" @click="handleDelete">删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="commodityList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="商品名称" align="center" prop="commodityName" :show-overflow-tooltip="true" />
                    <el-table-column label="品牌名称" align="center" prop="commodityBrandId" :formatter="commodityBrandIdFormat">
                        <template slot-scope="scope">
                            {{ commodityBrandIdFormat(scope.row) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="品类名称" align="center" prop="commodityCategoryId" :formatter="commodityCategoryIdFormat">
                        <template slot-scope="scope">
                            {{ commodityCategoryIdFormat(scope.row) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="商品展示" align="center" prop="avatar" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <img :src="formatPic(scope.row.avatar)" width="55" height="55">
                        </template>
                    </el-table-column>
                    <el-table-column label="商品备注" align="center" prop="commodityRemark"
                        :show-overflow-tooltip="true" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-popconfirm class="delete-popconfirm" title="确认要修改吗?" confirm-button-text="修改"
                                @onConfirm="handleUpdate(scope.row)">
                                <el-button slot="reference" v-permisaction="['admin:commodity:edit']" size="mini"
                                    type="text" icon="el-icon-edit">修改
                                </el-button>
                            </el-popconfirm>
                            <el-popconfirm class="delete-popconfirm" title="确认要删除吗?" confirm-button-text="删除"
                                @onConfirm="handleDelete(scope.row)">
                                <el-button slot="reference" v-permisaction="['admin:commodity:remove']" size="mini"
                                    type="text" icon="el-icon-delete">删除
                                </el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageIndex"
                    :limit.sync="queryParams.pageSize" @pagination="getList" />

                <!-- 添加或修改对话框 -->
                <el-dialog :title="title" :visible.sync="open" width="500px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">

                        <el-form-item label="商品名称" prop="commodityName">
                            <el-input v-model="form.commodityName" placeholder="商品名称" />
                        </el-form-item>
                        <el-form-item label="品牌名称" prop="commodityBrandId">
                            <el-select v-model="form.commodityBrandId" placeholder="请选择" >
                            <el-option v-for="dict in commodityBrandIdOptions" :key="dict.key" :label="dict.value"
                                :value="dict.key" />
                        </el-select>
                        </el-form-item>
                        <el-form-item label="品类名称" prop="commodityCategoryId">
                            <el-select v-model="form.commodityCategoryId" placeholder="请选择">
                            <el-option v-for="dict in commodityCategoryIdOptions" :key="dict.key" :label="dict.value"
                                :value="dict.key" />
                        </el-select>
                        </el-form-item>
                        <el-form-item label="商品展示" prop="avatar">
                            <!-- <el-input v-model="form.avatar" placeholder="商品展示" /> -->
                            <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
                                <el-button size="small">
                                    上传
                                <i class="el-icon-upload el-icon--right" />
                                </el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="商品备注" prop="commodityRemark">
                            <el-input v-model="form.commodityRemark" placeholder="商品备注" />
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
import { addCommodity, delCommodity, getCommodity, listCommodity, updateCommodity } from '@/api/admin/commodity'

import { listBrand } from '@/api/admin/brand'
import { listCategory } from '@/api/admin/category'
export default {
    name: 'Commodity',
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
            commodityList: [],

            // 关系表类型
            commodityBrandIdOptions: [],
            commodityCategoryIdOptions: [],

            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,
                commodityName: undefined,
                commodityBrandId: undefined,
                commodityCategoryId: undefined,

            },
            // 表单参数
            form: {
            },
            // 表单校验
            rules: {
                commodityName: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
                commodityBrandId: [{ required: true, message: '商品品牌id不能为空', trigger: 'blur' }],
                commodityCategoryId: [{ required: true, message: '商品品类id不能为空', trigger: 'blur' }],
            }
        }
    },
    created() {
        this.getList()
        this.getBrandItems()
        this.getCategoryItems()
    },
    methods: {
        /** 查询参数列表 */
        getList() {
            this.loading = true
            listCommodity(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.commodityList = response.data.list
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
                commodityName: undefined,
                commodityBrandId: undefined,
                commodityCategoryId: undefined,
                avatar: undefined,
                commodityRemark: undefined,
                status: undefined,
            }
            this.resetForm('form')
        },
        requestUpload() {
        },
        beforeUpload(file) {
            if (file.type.indexOf('image/') === -1) {
                this.msgError('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
            } else {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    console.log(reader.result)
                }
            }
        },
        getImgList: function () {
            this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
        },
        fileClose: function () {
            this.fileOpen = false
        },
        commodityBrandIdFormat(row) {
            return this.selectItemsLabel(this.commodityBrandIdOptions, row.commodityBrandId)
        },
        commodityCategoryIdFormat(row) {
            return this.selectItemsLabel(this.commodityCategoryIdOptions, row.commodityCategoryId)
        },
        formatPic(avatar) {
            return "http://localhost:8000" + avatar
        },
        // 关系
        getBrandItems() {
            this.getItems(listBrand, undefined).then(res => {
                this.commodityBrandIdOptions = this.setItems(res, 'id', 'brandName')
            })
        },
        getCategoryItems() {
            this.getItems(listCategory, undefined).then(res => {
                this.commodityCategoryIdOptions = this.setItems(res, 'id', 'categoryName')
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
            this.title = '添加商品'
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
            getCommodity(id).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改商品'
                this.isEdit = true
            })
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id !== undefined) {
                        updateCommodity(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess(response.msg)
                                this.open = false
                                this.getList()
                            } else {
                                this.msgError(response.msg)
                            }
                        })
                    } else {
                        addCommodity(this.form).then(response => {
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
                return delCommodity({ 'ids': Ids })
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
