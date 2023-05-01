import request from '@/utils/request'

// 查询Brand列表
export function listBrand(query) {
    return request({
        url: '/api/v1/brand',
        method: 'get',
        params: query
    })
}

// 查询Brand详细
export function getBrand (id) {
    return request({
        url: '/api/v1/brand/' + id,
        method: 'get'
    })
}


// 新增Brand
export function addBrand(data) {
    return request({
        url: '/api/v1/brand',
        method: 'post',
        data: data
    })
}

// 修改Brand
export function updateBrand(data) {
    return request({
        url: '/api/v1/brand/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除Brand
export function delBrand(data) {
    return request({
        url: '/api/v1/brand',
        method: 'delete',
        data: data
    })
}

