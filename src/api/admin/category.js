import request from '@/utils/request'

// 查询Category列表
export function listCategory(query) {
    return request({
        url: '/api/v1/category',
        method: 'get',
        params: query
    })
}

// 查询Category详细
export function getCategory (id) {
    return request({
        url: '/api/v1/category/' + id,
        method: 'get'
    })
}


// 新增Category
export function addCategory(data) {
    return request({
        url: '/api/v1/category',
        method: 'post',
        data: data
    })
}

// 修改Category
export function updateCategory(data) {
    return request({
        url: '/api/v1/category/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除Category
export function delCategory(data) {
    return request({
        url: '/api/v1/category',
        method: 'delete',
        data: data
    })
}

