import request from '@/utils/request'

// 查询TemplateModel列表
export function listTemplateModel(query) {
    return request({
        url: '/api/v1/template-model',
        method: 'get',
        params: query
    })
}

// 查询TemplateModel详细
export function getTemplateModel (id) {
    return request({
        url: '/api/v1/template-model/' + id,
        method: 'get'
    })
}


// 新增TemplateModel
export function addTemplateModel(data) {
    return request({
        url: '/api/v1/template-model',
        method: 'post',
        data: data
    })
}

// 修改TemplateModel
export function updateTemplateModel(data) {
    return request({
        url: '/api/v1/template-model/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除TemplateModel
export function delTemplateModel(data) {
    return request({
        url: '/api/v1/template-model',
        method: 'delete',
        data: data
    })
}

