//pulling process
1. git status
2. git add .  # 添加所有修改
    git add 文件名1 文件名2# 或指定文件
3. git commit -m "描述你的修改内容"
4. git push origin 分支名
5. [renew PythonAnyWhere]
    ssh:1. cd /home/你的PA用户名/项目路径
           2. git pull origin 分支名  # 如 git pull origin main
    自动重载[关联Github仓库]
6. additional case:requirements.txt已更改，在PA上：
    pip install -r requirements.txt
7. Already up to date：强制更新，注意查看影响
    git fetch --all
    git reset --hard origin/main
8. 若涉及敏感信息需用环境变量：
python
# 错误示例（直接暴露密钥）
SECRET_KEY = 'django-insecure-!abc123' 

# 正确做法（从环境变量读取）
import os
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
9. git push失败——冲突
git pull --rebase origin main
# 解决冲突后重新提交
git add .
git rebase --continue
git push origin main


10. 存在本地修改无法直接拉取
方案一：
# 1. 保存当前修改到临时区域
git stash

# 2. 拉取远程更新
git pull origin main

# 3. 恢复保存的修改
git stash pop
方案二：放弃本地修改强制更新
# 1. 放弃所有本地修改
git reset --hard HEAD

# 2. 强制拉取最新代码
git pull -f origin main

两种方案的后续操作：
# 重启 PythonAnywhere 服务
touch /var/www/你的用户名_pythonanywhere_com_wsgi.py


11. CONFLICT 处理
    1. [查找 <<<<<<< 标记]手动处理，解决后进行下一步
    2. git add mysite/settings.py
    3. git stash drop

    # 如果使用 rebase
    git rebase --continue

    # 如果未使用 rebase
    git commit -m "解决合并冲突"

14. 所有修改应在本地完成 → 测试 → 提交 → 部署
15. 用环境变量管理配置
    # 替换敏感配置
    SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'default-key')
    DEBUG = os.environ.get('DJANGO_DEBUG', 'False') == 'True'

    PA添加环境变量【Code】
    DJANGO_SECRET_KEY=你的真实密钥
    DJANGO_DEBUG=False

16. 不提交静态文件等设置
    方案一：
    # 创建 .gitignore 文件（如果不存在）
    echo "static/" >> .gitignore

    # 确认 .gitignore 内容
    cat .gitignore

    git add .gitignore
    git commit -m "添加static目录忽略规则"
    git push origin main

    # 清理PythonAnywhere的static目录（重要！）
    # 在PythonAnywhere终端执行：
    rm -rf static/

    # 重新生成静态文件（生产环境需要）
    python manage.py collectstatic

    touch /var/www/123wula_pythonanywhere_com_wsgi.py
    方案二：
    # 生产环境不收集静态文件到项目目录
    if 'PYTHONANYWHERE_DOMAIN' in os.environ:
        STATIC_ROOT = '/home/123wula/static'

    Web PA 配置：
    URL: /static/  
    Directory: /home/123wula/static

    不提交的文件：
    数据库文件 (*.sqlite3)|
                环境文件 (.env)|
                编译文件 (__pycache__/)|
                静态文件 (static/)

    检验：PA执行：
    git status  # 应该显示 "working tree clean"

    fail anyreason:执行：
    git rm -r --cached static/
    git commit -m "停止跟踪static目录"

17. 为项目配置Git
    Git 要求每次提交都记录作者身份
    PythonAnywhere 的 Git 环境是独立的，需要单独配置
    配置只对当前仓库有效（非全局）

    注：
        1. 邮箱问题：用户名@users.noreply.github.com【GitHub提供的私有邮箱】
        2. 密码问题：
        GitHub 要求使用访问令牌代替密码：

        创建令牌：GitHub → Settings → Developer settings → Personal access tokens

        权限选择：repo（全仓库权限）

        复制生成的令牌（40位字符），粘贴到密码提示处

18. 本地更新落后于远程
    # 1. 拉取远程更新（同时合并）
    git pull --rebase origin main

    # 2. 解决可能的冲突
    #    如果提示冲突，手动编辑冲突文件（查找 >>>>>> 标记）
    #    解决后标记为已解决：
    git add 冲突文件名

    # 3. 继续 rebase（如果使用了 --rebase）
    git rebase --continue

    # 4. 再次推送
    git push origin main

    注：# 强制覆盖远程（仅限个人分支）
    git push -f origin main

19. 最佳实践建议
        1. 先拉取再推送：
    bash
    git pull origin main && git push origin main
        2. 使用 rebase 保持整洁历史：

    bash
    git config --global pull.rebase true
        3. 创建特性分支：

    bash
    # 本地开发时
    git checkout -b feature/settings-update
    git add .
    git commit -m "修改配置"
    git push origin feature/settings-update

    # 在 GitHub 创建 PR 合并到 main
        4. 定期同步主分支：

    bash
    git checkout main
    git fetch origin
    git reset --hard origin/main
📚 冲突预防策略
小步频繁提交：避免大改动

沟通协作：多人合作时通知队友

使用 .editorconfig：统一编码风格

ini
# .editorconfig
root = true
[*]
indent_style = space
indent_size = 4
charset = utf-8

20.可视化工具
git mergetool  # 启动图形化冲突解决工具

21. <QuerySet [<User: djangobhy>]>

22. 本地如何拉取更新
23. Django对于本地部署的支持
24. pythonanywhere对于本项目的支持
25. admin以及post的本地文件编辑/查看入口
26. 激活虚拟环境：[enter root Directory first]
    [cmd]myvenv\Scripts\activate.bat
    [powershell].\myvenv\Scripts\Activate.ps1
    [bash]source myvenv/bin/activate
27. 运行开发服务器：python manage.py runserver

28. python manage.py makemigrations blog
    由manage.py检测blog应用中Model定义与当前数据库状态之间的差异
    每次模型变化都应该生成新的迁移文件
    迁移文件需要被提交到版本控制系统（如Git）

    python manage.py migrate blog
    根据django_migrations`表进行迁移的应用
    
29. server running的时候打开新的终端窗口，并运行激活命令

30. 






