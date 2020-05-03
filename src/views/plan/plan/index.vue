<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="养老计划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入养老计划名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="养老计划编号" prop="planNumber">
        <el-input
          v-model="queryParams.planNumber"
          placeholder="请输入养老计划编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划开始时间" prop="startTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择计划开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="代理人id" prop="agentId">
        <el-input
          v-model="queryParams.agentId"
          placeholder="请输入代理人id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="清分机构id" prop="clearId">
        <el-input
          v-model="queryParams.clearId"
          placeholder="请输入清分机构id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="受托人id" prop="trusteeId">
        <el-input
          v-model="queryParams.trusteeId"
          placeholder="请输入受托人id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="存管人id" prop="custodianId">
        <el-input
          v-model="queryParams.custodianId"
          placeholder="请输入存管人id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="费用计算周期" prop="feePeriod">
        <el-input
          v-model="queryParams.feePeriod"
          placeholder="请输入费用计算周期"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="受托人管理费率" prop="trusteeRate">
        <el-input
          v-model="queryParams.trusteeRate"
          placeholder="请输入受托人管理费率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="存管人管理费率" prop="custodianRate">
        <el-input
          v-model="queryParams.custodianRate"
          placeholder="请输入存管人管理费率"
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
          v-hasPermi="['plan:plan:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['plan:plan:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['plan:plan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['plan:plan:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="养老计划id" align="center" prop="planId" />
      <el-table-column label="养老计划名称" align="center" prop="planName" />
      <el-table-column label="养老计划编号" align="center" prop="planNumber" />
      <el-table-column label="计划开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理人id" align="center" prop="agentId" />
      <el-table-column label="清分机构id" align="center" prop="clearId" />
      <el-table-column label="受托人id" align="center" prop="trusteeId" />
      <el-table-column label="存管人id" align="center" prop="custodianId" />
      <el-table-column label="费用计算周期" align="center" prop="feePeriod" />
      <el-table-column label="受托人管理费率" align="center" prop="trusteeRate" />
      <el-table-column label="存管人管理费率" align="center" prop="custodianRate" />
      <el-table-column label="备注" align="center" prop="bake" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['plan:plan:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:plan:remove']"
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

    <!-- 添加或修改养老计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="养老计划名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入养老计划名称" />
        </el-form-item>
        <el-form-item label="养老计划编号" prop="planNumber">
          <el-input v-model="form.planNumber" placeholder="请输入养老计划编号" />
        </el-form-item>
        <el-form-item label="计划开始时间" prop="startTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择计划开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="代理人id" prop="agentId">
          <el-input v-model="form.agentId" placeholder="请输入代理人id" />
        </el-form-item>
        <el-form-item label="清分机构id" prop="clearId">
          <el-input v-model="form.clearId" placeholder="请输入清分机构id" />
        </el-form-item>
        <el-form-item label="受托人id" prop="trusteeId">
          <el-input v-model="form.trusteeId" placeholder="请输入受托人id" />
        </el-form-item>
        <el-form-item label="存管人id" prop="custodianId">
          <el-input v-model="form.custodianId" placeholder="请输入存管人id" />
        </el-form-item>
        <el-form-item label="费用计算周期" prop="feePeriod">
          <el-input v-model="form.feePeriod" placeholder="请输入费用计算周期" />
        </el-form-item>
        <el-form-item label="受托人管理费率" prop="trusteeRate">
          <el-input v-model="form.trusteeRate" placeholder="请输入受托人管理费率" />
        </el-form-item>
        <el-form-item label="存管人管理费率" prop="custodianRate">
          <el-input v-model="form.custodianRate" placeholder="请输入存管人管理费率" />
        </el-form-item>
        <el-form-item label="备注" prop="bake">
          <el-input v-model="form.bake" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPlan, getPlan, delPlan, addPlan, updatePlan, exportPlan } from "@/api/plan/plan";

export default {
  name: "Plan",
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
      // 养老计划表格数据
      planList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planName: undefined,
        planNumber: undefined,
        startTime: undefined,
        agentId: undefined,
        clearId: undefined,
        trusteeId: undefined,
        custodianId: undefined,
        feePeriod: undefined,
        trusteeRate: undefined,
        custodianRate: undefined,
        bake: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        agentId: [
          { required: true, message: "代理人id不能为空", trigger: "blur" }
        ],
        clearId: [
          { required: true, message: "清分机构id不能为空", trigger: "blur" }
        ],
        trusteeId: [
          { required: true, message: "受托人id不能为空", trigger: "blur" }
        ],
        custodianId: [
          { required: true, message: "存管人id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询养老计划列表 */
    getList() {
      this.loading = true;
      listPlan(this.queryParams).then(response => {
        this.planList = response.rows;
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
        planId: undefined,
        planName: undefined,
        planNumber: undefined,
        startTime: undefined,
        agentId: undefined,
        clearId: undefined,
        trusteeId: undefined,
        custodianId: undefined,
        feePeriod: undefined,
        trusteeRate: undefined,
        custodianRate: undefined,
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
      this.ids = selection.map(item => item.planId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加养老计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const planId = row.planId || this.ids
      getPlan(planId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改养老计划";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.planId != undefined) {
            updatePlan(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPlan(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
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
      const planIds = row.planId || this.ids;
      this.$confirm('是否确认删除养老计划编号为"' + planIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPlan(planIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有养老计划数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPlan(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
