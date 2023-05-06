import request from '@/utils/request'

// 查询ShopCommodity列表
export function listShopCommodity(query) {
    return request({
        url: '/api/v1/shop-commodity',
        method: 'get',
        params: query
    })
}

// 查询ShopCommodity详细
export function getShopCommodity (id) {
    return request({
        url: '/api/v1/shop-commodity/' + id,
        method: 'get'
    })
}


// 新增ShopCommodity
export function addShopCommodity(data) {
    return request({
        url: '/api/v1/shop-commodity',
        method: 'post',
        data: data
    })
}

// 修改ShopCommodity
export function updateShopCommodity(data) {
    return request({
        url: '/api/v1/shop-commodity/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除ShopCommodity
export function delShopCommodity(data) {
    return request({
        url: '/api/v1/shop-commodity',
        method: 'delete',
        data: data
    })
}

