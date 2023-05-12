import request from '@/utils/request'

// 查询UserRecord列表
export function listUserRecord(query) {
    return request({
        url: '/api/v1/user-record',
        method: 'get',
        params: query
    })
}

// 查询UserRecord详细
export function getUserRecord (id) {
    return request({
        url: '/api/v1/user-record/' + id,
        method: 'get'
    })
}


// 新增UserRecord
export function addUserRecord(data) {
    return request({
        url: '/api/v1/user-record',
        method: 'post',
        data: data
    })
}

// 修改UserRecord
export function updateUserRecord(data) {
    return request({
        url: '/api/v1/user-record/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除UserRecord
export function delUserRecord(data) {
    return request({
        url: '/api/v1/user-record',
        method: 'delete',
        data: data
    })
}

// 获取所有的UserRecord
export function allUserRecord() {
    return request({
        url: '/api/v1/user-record/allRecord',
        method: 'post'
    })
}