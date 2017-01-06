package main

import (
	"github.com/gin-gonic/gin"
	"github.com/smtc/glog"
	"strconv"
)

//实体
type Result struct {
	data  		[]*contentbilling //数据载体
	recordsFiltered	string   //
	recordsTotal 	string   //
	total 		string
}
type contentbilling struct {
	id 		string
	server_ip 	string
	mask 		string
	port    string
	sid_3gnet string
	sid_3gwap string
	sid_uninet string
	sid_uniwap string
	sid_net string
	createtime string
	isdelete string
}


/**
查询计费
创建人:魏超
创建时间:2016年10月9日15:11:02
输入参数: gin变量
输出参数: 无
数据反馈由gin进行
*/
func uniteGetContentbilling(c *gin.Context) {
	var list       []*contentbilling //json格式保存用户数据
	var number ="0"
	//数据库查询密码验证登录
	sql := "select *,(select count(0) from contentbilling ) as number from contentbilling limit 0,10;"
	row, err := sqlSelect(sql)
	if err != nil {
		glog.Error("uniteGetContentbilling select is error . sql: %s %s \n", sql)
		respSult := &Result{
			data:list,
			recordsFiltered:number,
			recordsTotal:number,
			total:number,
		}
		jsonPRequest(c, true, *respSult)
		return
	}
	var (
		id 		string
		server_ip 	string
		mask 		string
		port    string
		sid_3gnet string
		sid_3gwap string
		sid_uninet string
		sid_uniwap string
		sid_net string
		createtime string
		isdelete string

		z          = 0

	)
	defer row.Close()
	var model = &contentbilling{}
	for row.Next() {
		z++
		err := row.Scan(&id, &server_ip, &mask, &port, &sid_3gnet, &sid_3gwap, &sid_uninet, &sid_uniwap, &sid_net, &createtime, &isdelete,&number)
		if err != nil {
			glog.Error("selectAdminModel data read error. sql: %s %s err: %s \n", sql, err.Error())
			continue
		}
		glog.Info("server_ip:%s \n",server_ip)
		model = &contentbilling{
			id:id,
			server_ip:server_ip,
			mask:mask,
			port:port,
			sid_3gnet :sid_3gnet,
			sid_3gwap :sid_3gwap,
			sid_uninet :sid_uninet,
			sid_uniwap :sid_uniwap,
			sid_net :sid_net,
			createtime :createtime,
			isdelete :isdelete,
		}
		list = append(list,model)
	}
	glog.Info("uniteGetContentbilling is success z:%s list:%T \n",strconv.Itoa(z),list)
	if z == 0 {
		glog.Info("uniteGetContentbilling  number is Zero. sql is  %s \n", sql)
		respSult := &Result{
			data:list,
			recordsFiltered:number,
			recordsTotal:number,
			total:number,
		}
		jsonPRequest(c, true, *respSult)
		return
	}
	respSult := &Result{
		data:list,
		recordsFiltered:number,
		recordsTotal:number,
		total:number,
	}
	jsonPRequest(c, true, *respSult)
}

