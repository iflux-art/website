'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Settings, GitBranch, Container, Monitor, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function DevOpsToolkitPage() {
  const [activeTab, setActiveTab] = useState<'cicd' | 'docker' | 'k8s' | 'monitoring'>('cicd');
  const [copied, setCopied] = useState<string | null>(null);

  const copyContent = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // CI/CD配置生成器
  const CICDGenerator = () => {
    const [platform, setPlatform] = useState('github');
    const [projectType, setProjectType] = useState('node');

    const generateConfig = () => {
      let config = '';

      if (platform === 'github') {
        config = `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Build
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # 部署命令`;
      } else if (platform === 'gitlab') {
        config = `stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm test
  only:
    - main
    - develop

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
  only:
    - main

deploy:
  stage: deploy
  script:
    - echo "Deploying to production..."
    # 部署脚本
  only:
    - main`;
      }

      return config;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>CI/CD配置生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">平台</label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value="github">GitHub Actions</option>
                <option value="gitlab">GitLab CI</option>
                <option value="jenkins">Jenkins</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">项目类型</label>
              <select
                value={projectType}
                onChange={e => setProjectType(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value="node">Node.js</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{generateConfig()}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copyContent(generateConfig(), 'cicd')}
            >
              {copied === 'cicd' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Docker配置生成器
  const DockerGenerator = () => {
    const [baseImage, setBaseImage] = useState('node:18-alpine');
    const [port, setPort] = useState('3000');

    const generateDockerfile = () => {
      return `FROM ${baseImage}

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE ${port}

CMD ["npm", "start"]`;
    };

    const generateDockerCompose = () => {
      return `version: '3.8'

services:
  app:
    build: .
    ports:
      - "${port}:${port}"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:`;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Docker配置生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">基础镜像</label>
              <input
                value={baseImage}
                onChange={e => setBaseImage(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background"
                placeholder="node:18-alpine"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">端口</label>
              <input
                value={port}
                onChange={e => setPort(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background"
                placeholder="3000"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Dockerfile</h4>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{generateDockerfile()}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyContent(generateDockerfile(), 'dockerfile')}
                >
                  {copied === 'dockerfile' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">docker-compose.yml</h4>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{generateDockerCompose()}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyContent(generateDockerCompose(), 'compose')}
                >
                  {copied === 'compose' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Kubernetes配置生成器
  const K8sGenerator = () => {
    const [appName, setAppName] = useState('my-app');
    const [replicas, setReplicas] = useState('3');

    const generateK8sConfig = () => {
      return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
  labels:
    app: ${appName}
spec:
  replicas: ${replicas}
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
    spec:
      containers:
      - name: ${appName}
        image: ${appName}:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: ${appName}-service
spec:
  selector:
    app: ${appName}
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer`;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Kubernetes配置生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">应用名称</label>
              <input
                value={appName}
                onChange={e => setAppName(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background"
                placeholder="my-app"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">副本数</label>
              <input
                value={replicas}
                onChange={e => setReplicas(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background"
                placeholder="3"
              />
            </div>
          </div>

          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{generateK8sConfig()}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copyContent(generateK8sConfig(), 'k8s')}
            >
              {copied === 'k8s' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 监控配置生成器
  const MonitoringGenerator = () => {
    const [monitoringType, setMonitoringType] = useState('prometheus');
    const [namespace, setNamespace] = useState('monitoring');

    const generatePrometheusConfig = () => {
      return `global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'app'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
    scrape_interval: 30s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093`;
    };

    const generateGrafanaDashboard = () => {
      return `{
  "dashboard": {
    "id": null,
    "title": "应用监控面板",
    "tags": ["monitoring"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "CPU使用率",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(cpu_usage_total[5m])",
            "legendFormat": "CPU使用率"
          }
        ],
        "yAxes": [
          {
            "label": "百分比",
            "max": 100,
            "min": 0
          }
        ]
      },
      {
        "id": 2,
        "title": "内存使用率",
        "type": "graph",
        "targets": [
          {
            "expr": "memory_usage_bytes / memory_total_bytes * 100",
            "legendFormat": "内存使用率"
          }
        ]
      },
      {
        "id": 3,
        "title": "请求QPS",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "QPS"
          }
        ]
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "refresh": "5s"
  }
}`;
    };

    const generateAlertRules = () => {
      return `groups:
- name: app_alerts
  rules:
  - alert: HighCPUUsage
    expr: cpu_usage_percent > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "CPU使用率过高"
      description: "CPU使用率已超过80%，持续5分钟"

  - alert: HighMemoryUsage
    expr: memory_usage_percent > 85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "内存使用率过高"
      description: "内存使用率已超过85%，持续5分钟"

  - alert: ServiceDown
    expr: up == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "服务不可用"
      description: "服务已停止响应超过1分钟"

  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "错误率过高"
      description: "5xx错误率超过10%，持续2分钟"`;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>监控配置生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">监控类型</label>
              <select
                value={monitoringType}
                onChange={e => setMonitoringType(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value="prometheus">Prometheus</option>
                <option value="grafana">Grafana</option>
                <option value="alerts">告警规则</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">命名空间</label>
              <input
                value={namespace}
                onChange={e => setNamespace(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background"
                placeholder="monitoring"
              />
            </div>
          </div>

          <div className="space-y-4">
            {monitoringType === 'prometheus' && (
              <div>
                <h4 className="font-medium mb-2">Prometheus配置</h4>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{generatePrometheusConfig()}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyContent(generatePrometheusConfig(), 'prometheus')}
                  >
                    {copied === 'prometheus' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {monitoringType === 'grafana' && (
              <div>
                <h4 className="font-medium mb-2">Grafana仪表板</h4>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{generateGrafanaDashboard()}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyContent(generateGrafanaDashboard(), 'grafana')}
                  >
                    {copied === 'grafana' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {monitoringType === 'alerts' && (
              <div>
                <h4 className="font-medium mb-2">告警规则</h4>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{generateAlertRules()}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyContent(generateAlertRules(), 'alerts')}
                  >
                    {copied === 'alerts' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { key: 'cicd', name: 'CI/CD', icon: GitBranch },
    { key: 'docker', name: 'Docker', icon: Container },
    { key: 'k8s', name: 'Kubernetes', icon: Settings },
    { key: 'monitoring', name: '监控', icon: Monitor },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/tools">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回工具列表
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8" />
          DevOps工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          DevOps工具，包括CI/CD、容器部署、监控运维、自动化流程
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 p-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {activeTab === 'cicd' && <CICDGenerator />}
      {activeTab === 'docker' && <DockerGenerator />}
      {activeTab === 'k8s' && <K8sGenerator />}
      {activeTab === 'monitoring' && <MonitoringGenerator />}
    </div>
  );
}
