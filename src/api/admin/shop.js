import request from '@/utils/request'

// 查询Shop列表
export function listShop(query) {
    return request({
        url: '/api/v1/shop',
        method: 'get',
        params: query
    })
}

// 查询Shop详细
export function getShop(id) {
    return request({
        url: '/api/v1/shop/' + id,
        method: 'get'
    })
}

// 修改Shop状态
export function changeShopStatus(id) {
    return request({
        url: '/api/v1/shop/changeStatus/' + id,
        method: 'get'
    })
}


// 新增Shop
export function addShop(data) {
    return request({
        url: '/api/v1/shop',
        method: 'post',
        data: data
    })
}

// 修改Shop
export function updateShop(data) {
    return request({
        url: '/api/v1/shop/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除Shop
export function delShop(data) {
    return request({
        url: '/api/v1/shop',
        method: 'delete',
        data: data
    })
}

