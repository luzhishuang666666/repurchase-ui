import request from '@/utils/request'

// 查询RepurchaseInfo列表
export function listRepurchaseInfo(query) {
    return request({
        url: '/api/v1/repurchase-info',
        method: 'get',
        params: query
    })
}

// 查询RepurchaseInfo详细
export function getRepurchaseInfo (id) {
    return request({
        url: '/api/v1/repurchase-info/' + id,
        method: 'get'
    })
}


// 新增RepurchaseInfo
export function addRepurchaseInfo(data) {
    return request({
        url: '/api/v1/repurchase-info',
        method: 'post',
        data: data
    })
}

// 修改RepurchaseInfo
export function updateRepurchaseInfo(data) {
    return request({
        url: '/api/v1/repurchase-info/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除RepurchaseInfo
export function delRepurchaseInfo(data) {
    return request({
        url: '/api/v1/repurchase-info',
        method: 'delete',
        data: data
    })
}

