<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Table, Button, Tag, Popconfirm, message } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import type { ColumnType } from "ant-design-vue/es/table";
import * as echarts from "echarts";
import type { ECharts } from "echarts";

interface WorkOrder {
  id: string;
  project: string;
  overtime: boolean;
  hours: number;
  created_at: string;
}

const route = useRoute();
const router = useRouter();
const role = (route.query.role as string) || "user";
const isAdmin = computed(() => role === "admin");

const data = ref<WorkOrder[]>([
  { id: "001", project: "Road Project A", overtime: true, hours: 3.5, created_at: "2024-04-10 10:30" },
  { id: "002", project: "Bridge Maintenance B", overtime: false, hours: 2, created_at: "2024-04-09 13:00" },
  { id: "003", project: "Pipeline Fix C", overtime: true, hours: 4.5, created_at: "2024-04-08 08:00" },
  { id: "004", project: "Bridge Maintenance B", overtime: true, hours: 3, created_at: "2024-04-07 16:45" },
  { id: "005", project: "Tunnel Cleaning D", overtime: false, hours: 8.1, created_at: "2024-04-03 11:43" },
]);

const columns = computed<ColumnType<WorkOrder>[]>(() => {
  const cols: ColumnType<WorkOrder>[] = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Project", dataIndex: "project", key: "project", width: 160 },
    { title: "Overtime", dataIndex: "overtime", key: "overtime", width: 90 },
    { title: "Hours", dataIndex: "hours", key: "hours", width: 70, sorter: (a, b) => a.hours - b.hours },
    { title: "Created At", dataIndex: "created_at", key: "created_at", width: 150, sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime() },
  ];
  if (isAdmin.value) {
    cols.push({ title: "Action", key: "action", width: 80 });
  }
  return cols;
});

let chartInstance: ECharts | null = null;
const chartRef = ref<HTMLDivElement>();

function renderChart() {
  if (!chartRef.value) return;
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  }
  const map: Record<string, number> = {};
  for (const item of data.value) {
    map[item.project] = (map[item.project] || 0) + item.hours;
  }
  const entries = Object.entries(map);
  if (entries.length === 0) {
    chartInstance.setOption({
      grid: { top: 10, bottom: 40, left: 50, right: 20 },
      xAxis: { type: "category", data: [], axisLabel: { interval: 0 } },
      yAxis: { type: "value", min: 0, max: 10, splitLine: { lineStyle: { color: "#eee" } } },
      series: [],
      graphic: {
        type: "text",
        left: "center",
        top: "center",
        style: { text: "No Data", fontSize: 16, fill: "rgba(0,0,0,0.10)", fontWeight: 600 },
      },
    }, { notMerge: true });
    return;
  }
  chartInstance.setOption({
    animationDuration: 500,
    animationEasing: "cubicInOut",
    tooltip: {
      formatter: (params: { name: string; value: number }) => `${params.name}<br/>工时：${params.value}h`,
    },
    grid: { top: 10, bottom: 40, left: 50, right: 20 },
    xAxis: { type: "category", data: entries.map(([n]) => n), axisLabel: { interval: 0 } },
    yAxis: { type: "value" },
    series: [{
      type: "bar",
      barMaxWidth: 40,
      data: entries.map(([, h]) => h),
      itemStyle: {
        color: (params: { dataIndex: number }) => {
          const colors = ["#aa3bff", "#36cfc9", "#ff7a45", "#ffc53d", "#597ef7"];
          return colors[params.dataIndex % colors.length];
        },
      },
    }],
  });
  chartInstance.resize();
}

onMounted(() => {
  nextTick(() => renderChart());
});

function handleDelete(id: string) {
  const index = data.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    data.value.splice(index, 1);
    nextTick(() => renderChart());
  }
  message.success("删除成功");
}

function handleLogout() {
  router.push({ name: "Login" });
}
</script>

<template>
  <div class="home-wrapper">
    <div class="header-right">
      <span class="role-tag">
        <Tag v-if="isAdmin" color="purple">管理员</Tag>
        <Tag v-else color="blue">用户</Tag>
      </span>
      <Button class="logout-btn" size="small" @click="handleLogout">退出</Button>
    </div>

    <div class="content-area">
      <div class="table-section">
        <Table :dataSource="data" :columns="columns" :pagination="false" rowKey="id" bordered size="small" :scroll="{ y: 320 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'hours'">{{ record.hours }}h</template>
            <template v-else-if="column.key === 'overtime'">
              <Tag :color="record.overtime ? 'red' : 'green'">{{ record.overtime ? "Yes" : "No" }}</Tag>
            </template>
            <template v-if="column.key === 'action'">
              <Popconfirm title="确定删除该条工单？" okText="确定" cancelText="取消" @confirm="handleDelete(record.id)">
                <Button type="primary" danger size="small">Delete</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </div>

      <div class="chart-section">
        <h2>Project Hours Distribution</h2>
        <div ref="chartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.home-wrapper {
  padding: 24px 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  .logout-btn {
    background: #000;
    color: #fff;
    border-color: #000;
    padding: 0 7px;
    line-height: 22px;
    height: 24px;

    &:hover {
      background: #333;
      border-color: #333;
      color: #fff;
    }
  }
}

.role-tag {
  font-size: 14px;
  color: var(--text);
}

.content-area {
  display: flex;
  flex-direction: column;
  gap: 40px;
  flex: 1;
}

.table-section {
  flex: none;
}

.chart-section {
  max-width: 700px;

  h2 {
    margin: 0 0 12px;
    color: var(--text-h);
    text-align: left;
  }
}

.chart-container {
  width: 100%;
  height: 460px;
}
</style>










