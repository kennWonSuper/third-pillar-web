<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
       
      <el-form-item label="代理人机构名称" prop="deptName" >
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入机构名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"

        />
      </el-form-item>
       
      <el-form-item label="社会信用代码" prop="socialCreditCode">
        <el-input
          v-model="queryParams.socialCreditCode"
          placeholder="请输入社会信用代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['dlrorg:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['dlrorg:info:edit', 'dlrorg:check:query']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['dlrorg:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['dlrorg:info:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="20" />
     <!--  <el-table-column label="机构id" align="center" prop="deptId" />
      <el-table-column label="父机构id" align="center" prop="parentId" />
      <el-table-column label="祖级列表" align="center" prop="ancestors" /> -->
      <el-table-column label="机构名称" align="center" prop="deptName" />
      <!-- <el-table-column label="机构类型" align="center" prop="deptType" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="联系人姓名" align="center" prop="leader" />
      <el-table-column label="联系人电话" align="center" prop="phone" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="机构状态" align="center" prop="status" /> -->
      <el-table-column label="社会信用代码" align="center" prop="socialCreditCode" />
      <el-table-column label="法人代表" align="center" prop="corporate" />
      <el-table-column label="注册地址" align="center" prop="registerAddress" />
      <el-table-column label="注册资金(万元)" align="center" prop="registerAmount" />
      <!-- <el-table-column label="清分机构名称" align="center" prop="clearingDeptName" />
      <el-table-column label="开户行名称" align="center" prop="bankName" />
      <el-table-column label="账户名称" align="center" prop="accountName" />
      <el-table-column label="银行账号" align="center" prop="accountNo" />
      <el-table-column label="备注" align="center" prop="bake" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleWatch(scope.row)"
            v-hasPermi="['dlrorg:info:detail']"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['dlrorg:info:edit', 'dlrorg:check:query']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['dlrorg:info:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改代理人对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" >
      <el-form ref="form" :model="form" :rules="rules" label-width="150px" :disabled="openWatch">
        <el-form-item label="代理人机构id" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父机构id" />
        </el-form-item>
        <el-form-item label="代理人机构名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入机构名称" />
        </el-form-item>
       <!--  <el-form-item label="机构类型 01-代理人机构;02-清分机构;03-受托人机构;04-账管人机构;05-存管人机构;06-投管人机构">
          <el-select v-model="form.deptType" placeholder="请选择机构类型 01-代理人机构;02-清分机构;03-受托人机构;04-账管人机构;05-存管人机构;06-投管人机构">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>  
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="机构状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="社会信用代码" prop="socialCreditCode">
          <el-input v-model="form.socialCreditCode" placeholder="请输入社会信用代码" />
        </el-form-item>
        <el-form-item label="法人代表" prop="corporate">
          <el-input v-model="form.corporate" placeholder="请输入法人代表" />
        </el-form-item>
        <el-form-item label="注册地址" prop="registerAddress">
          <el-input v-model="form.registerAddress" placeholder="请输入注册地址" />
        </el-form-item>
        <el-form-item label="注册资本金(万元)" prop="registerAmount">
          <el-input v-model="form.registerAmount" placeholder="请输入注册资金(万元)" />
        </el-form-item>
        <el-form-item label="联系人姓名" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系人电话" />
        </el-form-item>
       
        <!-- <el-form-item label="开户行名称" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入开户行名称" />
        </el-form-item>
        <el-form-item label="账户名称" prop="accountName">
          <el-input v-model="form.accountName" placeholder="请输入账户名称" />
        </el-form-item>
        <el-form-item label="银行账号" prop="accountNo">
          <el-input v-model="form.accountNo" placeholder="请输入银行账号" />
        </el-form-item> -->
         <el-form-item label="清分机构名称" prop="clearingDeptName">
          <el-input v-model="form.clearingDeptName" placeholder="请输入清分机构名称" />
        </el-form-item>
        <el-form-item label="备注" prop="bake">
          <el-input v-model="form.bake" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      <!--   <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!openWatch">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <div v-else  slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo, addInfo, updateInfo, exportInfo } from "@/api/dlrorg/info";

export default {
  name: "Info",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 代理人表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentId: undefined,
        ancestors: undefined,
        deptName: undefined,
        deptType: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: undefined,
        socialCreditCode: undefined,
        corporate: undefined,
        registerAddress: undefined,
        registerAmount: undefined,
        clearingDeptName: undefined,
        bankName: undefined,
        accountName: undefined,
        accountNo: undefined,
        bake: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      openWatch:false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询代理人列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        ancestors: undefined,
        deptName: undefined,
        deptType: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0",
        socialCreditCode: undefined,
        corporate: undefined,
        registerAddress: undefined,
        registerAmount: undefined,
        clearingDeptName: undefined,
        bankName: undefined,
        accountName: undefined,
        accountNo: undefined,
        bake: undefined,
        delFlag: undefined,
        createBy: undefined,
        updateBy: undefined,
        updateTime: undefined,
        createTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.deptId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.openWatch = false;
      this.title = "添加代理人";
    },
    /** 查看按钮操作 */
    handleWatch(row){
      this.reset();
      const deptId = row.deptId || this.ids
      getInfo(deptId).then(response => {
        this.form = response.data;
        this.open = true;
        this.openWatch = true;
        this.title = "查看代理人";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const deptId = row.deptId || this.ids
      getInfo(deptId).then(response => {
        this.form = response.data;
        this.open = true;
        this.openWatch = false;
        this.title = "修改代理人";

      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.openWatch = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.openWatch = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const deptIds = row.deptId || this.ids;
      this.$confirm('是否确认删除代理人编号为"' + deptIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInfo(deptIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有代理人数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
