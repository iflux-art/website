'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Book, Code, Clipboard, Copy, Check } from 'lucide-react';
import Link from 'next/link';

type TabKey = 'readme' | 'api' | 'changelog' | 'license';

export default function DocumentGeneratorPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('readme');
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

  // README生成器
  const ReadmeGenerator = () => {
    const [projectName, setProjectName] = useState('My Awesome Project');
    const [description, setDescription] = useState('A brief description of what this project does');
    const [author, setAuthor] = useState('Your Name');
    const [license, setLicense] = useState('MIT');
    const [tech, setTech] = useState('React, TypeScript, Node.js');

    const generateReadme = () => {
      return `# ${projectName}

${description}

## 🚀 Features

- Feature 1
- Feature 2
- Feature 3

## 🛠️ Tech Stack

${tech
  .split(',')
  .map(t => `- ${t.trim()}`)
  .join('\n')}

## 📦 Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/username/${projectName.toLowerCase().replace(/\s+/g, '-')}.git

# Navigate to the project directory
cd ${projectName.toLowerCase().replace(/\s+/g, '-')}

# Install dependencies
npm install

# Start the development server
npm start
\`\`\`

## 🎯 Usage

\`\`\`javascript
// Example usage
import { Component } from './${projectName.toLowerCase().replace(/\s+/g, '-')}';

const app = new Component();
app.run();
\`\`\`

## 📝 API Reference

### \`function()\`

Description of the function

**Parameters:**
- \`param1\` (string): Description
- \`param2\` (number): Description

**Returns:**
- \`result\` (object): Description

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ${license} License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**${author}**

- GitHub: [@username](https://github.com/username)
- Email: email@example.com

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspiration from similar projects
- Special thanks to the community`;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>README生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">项目名称</label>
              <input
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="My Awesome Project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">作者</label>
              <input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Your Name"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">项目描述</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2 border rounded-lg h-20"
                placeholder="A brief description of what this project does"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">技术栈 (逗号分隔)</label>
              <input
                value={tech}
                onChange={e => setTech(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="React, TypeScript, Node.js"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">许可证</label>
              <select
                value={license}
                onChange={e => setLicense(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="MIT">MIT</option>
                <option value="Apache-2.0">Apache 2.0</option>
                <option value="GPL-3.0">GPL 3.0</option>
                <option value="BSD-3-Clause">BSD 3-Clause</option>
                <option value="ISC">ISC</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto max-h-96">
              <code>{generateReadme()}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copyContent(generateReadme(), 'readme')}
            >
              {copied === 'readme' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // API文档生成器
  const ApiDocGenerator = () => {
    const [apiName, setApiName] = useState('User API');
    const [baseUrl, setBaseUrl] = useState('https://api.example.com/v1');
    const [endpoint, setEndpoint] = useState('/users');
    const [method, setMethod] = useState('GET');

    const generateApiDoc = () => {
      return `# ${apiName} Documentation

Base URL: \`${baseUrl}\`

## Authentication

All API requests require authentication. Include your API key in the header:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Endpoints

### ${method} ${endpoint}

${
  method === 'GET'
    ? 'Retrieve'
    : method === 'POST'
    ? 'Create'
    : method === 'PUT'
    ? 'Update'
    : 'Delete'
} user information.

**URL:** \`${baseUrl}${endpoint}\`

**Method:** \`${method}\`

**Headers:**
\`\`\`
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
\`\`\`

${
  method !== 'GET'
    ? `**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
\`\`\``
    : ''
}

**Response:**

**Success (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "created_at": "2023-01-01T00:00:00Z"
  }
}
\`\`\`

**Error (400 Bad Request):**
\`\`\`json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid input parameters"
  }
}
\`\`\`

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid API key |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Rate Limiting

- 1000 requests per hour per API key
- Rate limit headers included in response:
  - \`X-RateLimit-Limit\`
  - \`X-RateLimit-Remaining\`
  - \`X-RateLimit-Reset\`

## Examples

### cURL
\`\`\`bash
curl -X ${method} \\
  "${baseUrl}${endpoint}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"${
    method !== 'GET'
      ? ` \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'`
      : ''
  }
\`\`\`

### JavaScript
\`\`\`javascript
const response = await fetch('${baseUrl}${endpoint}', {
  method: '${method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }${
    method !== 'GET'
      ? `,
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  })`
      : ''
  }
});

const data = await response.json();
console.log(data);
\`\`\``;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>API文档生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">API名称</label>
              <input
                value={apiName}
                onChange={e => setApiName(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="User API"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">基础URL</label>
              <input
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="https://api.example.com/v1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">端点</label>
              <input
                value={endpoint}
                onChange={e => setEndpoint(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="/users"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">HTTP方法</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto max-h-96">
              <code>{generateApiDoc()}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copyContent(generateApiDoc(), 'api')}
            >
              {copied === 'api' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 更新日志生成器
  const ChangelogGenerator = () => {
    const [version, setVersion] = useState('1.0.0');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [changes, setChanges] = useState(
      'Added new feature\nFixed bug in user authentication\nImproved performance'
    );

    const generateChangelog = () => {
      const changeList = changes.split('\n').filter(c => c.trim());

      return `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [${version}] - ${date}

### Added
${
  changeList
    .filter(c => c.toLowerCase().includes('add'))
    .map(c => `- ${c}`)
    .join('\n') || '- New features and enhancements'
}

### Changed
${
  changeList
    .filter(
      c =>
        c.toLowerCase().includes('chang') ||
        c.toLowerCase().includes('improv') ||
        c.toLowerCase().includes('updat')
    )
    .map(c => `- ${c}`)
    .join('\n') || '- Updates and improvements'
}

### Fixed
${
  changeList
    .filter(c => c.toLowerCase().includes('fix') || c.toLowerCase().includes('bug'))
    .map(c => `- ${c}`)
    .join('\n') || '- Bug fixes and patches'
}

### Removed
- Deprecated features (if any)

## [0.9.0] - 2023-12-01

### Added
- Initial beta release
- Core functionality implementation
- Basic user interface

### Changed
- Improved error handling
- Enhanced performance

### Fixed
- Minor bug fixes

## [0.1.0] - 2023-11-01

### Added
- Initial project setup
- Basic project structure
- Development environment configuration`;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>更新日志生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">版本号</label>
              <input
                value={version}
                onChange={e => setVersion(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="1.0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">发布日期</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">更新内容 (每行一项)</label>
              <textarea
                value={changes}
                onChange={e => setChanges(e.target.value)}
                className="w-full p-2 border rounded-lg h-24"
                placeholder="Added new feature&#10;Fixed bug in user authentication&#10;Improved performance"
              />
            </div>
          </div>

          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto max-h-96">
              <code>{generateChangelog()}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copyContent(generateChangelog(), 'changelog')}
            >
              {copied === 'changelog' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 许可证生成器
  const LicenseGenerator = () => {
    const [licenseType, setLicenseType] = useState('MIT');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [author, setAuthor] = useState('Your Name');
    const [projectName, setProjectName] = useState('Your Project');

    const generateLicense = () => {
      const licenses = {
        MIT: `MIT License

Copyright (c) ${year} ${author}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,

        'Apache-2.0': `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

Copyright ${year} ${author}

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`,

        'GPL-3.0': `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) ${year} ${author}

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.`,

        'BSD-3-Clause': `BSD 3-Clause License

Copyright (c) ${year}, ${author}

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`,
      };

      return licenses[licenseType as keyof typeof licenses] || licenses.MIT;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>许可证生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">许可证类型</label>
              <select
                value={licenseType}
                onChange={e => setLicenseType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="MIT">MIT License</option>
                <option value="Apache-2.0">Apache License 2.0</option>
                <option value="GPL-3.0">GNU GPL v3.0</option>
                <option value="BSD-3-Clause">BSD 3-Clause</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">年份</label>
              <input
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">作者/组织</label>
              <input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">项目名称</label>
              <input
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Your Project"
              />
            </div>
          </div>

          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto max-h-96">
              <code>{generateLicense()}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copyContent(generateLicense(), 'license')}
            >
              {copied === 'license' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { key: 'readme', name: 'README', icon: FileText },
    { key: 'api', name: 'API文档', icon: Code },
    { key: 'changelog', name: '更新日志', icon: Clipboard },
    { key: 'license', name: '许可证', icon: Book },
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
          <FileText className="h-8 w-8" />
          文档生成工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          文档工具，包括README生成、API文档、项目文档、技术规范、更新日志
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
                  onClick={() => setActiveTab(tab.key)}
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

      {activeTab === 'readme' && <ReadmeGenerator />}
      {activeTab === 'api' && <ApiDocGenerator />}
      {activeTab === 'changelog' && <ChangelogGenerator />}
      {activeTab === 'license' && <LicenseGenerator />}
    </div>
  );
}