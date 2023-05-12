import request from '@/utils/request'

// 查询ShopModel列表
export function listShopModel(query) {
    return request({
        url: '/api/v1/shop-model',
        method: 'get',
        params: query
    })
}

// 查询ShopModel详细
export function getShopModel (id) {
    return request({
        url: '/api/v1/shop-model/' + id,
        method: 'get'
    })
}


// 新增ShopModel
export function addShopModel(data) {
    return request({
        url: '/api/v1/shop-model',
        method: 'post',
        data: data
    })
}

// 修改ShopModel
export function updateShopModel(data) {
    return request({
        url: '/api/v1/shop-model/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除ShopModel
export function delShopModel(data) {
    return request({
        url: '/api/v1/shop-model',
        method: 'delete',
        data: data
    })
}

// 复购预测
export function forecast(data) {
    return request({
        url: '/api/v1/shop-model/forecast',
        method: 'post',
        data: data
    })
}