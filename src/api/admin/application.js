import request from '@/utils/request'

// 查询Application列表
export function listApplication(query) {
    return request({
        url: '/api/v1/application',
        method: 'get',
        params: query
    })
}

// 查询Application详细
export function getApplication (id) {
    return request({
        url: '/api/v1/application/' + id,
        method: 'get'
    })
}


// 新增Application
export function addApplication(data) {
    return request({
        url: '/api/v1/application',
        method: 'post',
        data: data
    })
}

// 修改Application
export function updateApplication(data) {
    return request({
        url: '/api/v1/application/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除Application
export function delApplication(data) {
    return request({
        url: '/api/v1/application',
        method: 'delete',
        data: data
    })
}

// 审批Application
export function approvalApplication(data) {
    return request({
        url: '/api/v1/application/approval',
        method: 'post',
        data: data
    })
}

