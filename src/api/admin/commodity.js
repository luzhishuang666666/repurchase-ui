import request from '@/utils/request'

// 查询Commodity列表
export function listCommodity(query) {
    return request({
        url: '/api/v1/commodity',
        method: 'get',
        params: query
    })
}

// 查询Commodity详细
export function getCommodity (id) {
    return request({
        url: '/api/v1/commodity/' + id,
        method: 'get'
    })
}


// 新增Commodity
export function addCommodity(data) {
    return request({
        url: '/api/v1/commodity',
        method: 'post',
        data: data
    })
}

// 修改Commodity
export function updateCommodity(data) {
    return request({
        url: '/api/v1/commodity/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除Commodity
export function delCommodity(data) {
    return request({
        url: '/api/v1/commodity',
        method: 'delete',
        data: data
    })
}

