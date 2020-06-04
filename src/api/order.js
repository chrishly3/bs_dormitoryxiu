import request from '@/utils/request' //模板提供的组件，axios封装

//const apiurl = "/order/"

export default{

    //分页条件查询的方法
    //三个参数：当前页，每页记录数，条件封装对象
    getOrderPageList(page, pageSize, searchObj) {
        return request({
            //后端controller里面的路径
            url: '/order/moreCondtionPageList/' + page + '/' + pageSize,
            //提交方式
            method: 'post',
            //传递条件对象,如果传递json数据，使用data。如果不是json，使用params
            data: searchObj
        })
    },


     //删除
     deleteOrderId(id) {
        return request({
            //后端controller里面的路径
            url: '/order/' + id,
            //提交方式
            method: 'delete'
        })
    },
    //根据id查询
    getOrderId(id) {
        return request({
            //后端controller里面的路径
            url: '/order/getOrder/' + id,
            //提交方式
            method: 'get'
        })
    },

    //根据姓名查询
    getOrderNameList(page, pageSize,loginUserName) {
        return request({
             //后端controller里面的路径
             url: '/order/moreCondtionPageList2/' + page + '/' + pageSize + '/' + loginUserName,
             //提交方式
             method: 'post',
             //传递条件对象,如果传递json数据，使用data。如果不是json，使用params
             //data: loginUserName
        })
    },
    
    //添加
    saveOrder(order) {
        return request({
            //后端controller里面的路径
            url: '/order/addOrder',
            //提交方式
            method: 'post',
            data: order
        })
    },

    //添加评论
    addEvaluatedata(evaluatedata) {
        console.log(evaluatedata)
        return request({
            //后端controller里面的路径
            url: '/order/addEvaluatedata',
            //提交方式
            method: 'post',
            data: evaluatedata
        })
    },
    //获得评论
    getEvaluate(id){
        return request({
            //后端controller里面的路径
            url: '/order/getEvaluate/'+id,
            //提交方式
            method: 'get'
            
        })
    },

    //修改维修单状态
    updateOrderStatus(id, status) {
        return request({
            //后端controller里面的路径
            url: '/order/updateOrderStatus/' + id+ '/' + status,
            //提交方式
            method: 'get'
        })
    },

    //修改维修单
    updateOrderId(id, order) {
        return request({
            //后端controller里面的路径
            url: '/order/updateOrder/' + id,
            //提交方式
            method: 'post',
            data: order
        })
    }
}