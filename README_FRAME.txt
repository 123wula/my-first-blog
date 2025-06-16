1. 执行过的代码|修改：
mkdir djangogirls
cd djangogirls
C:\Users\Name\djangogirls> python -m venv myvenv
C:\Users\Name\djangogirls> myvenv\Scripts\activate
(myvenv) ~$ python -m pip install --upgrade pip
创建requirements.txt
Django~=2.2.4
C:\Users\Name\djangogirls> python -m pip install -r requirements.txt

(myvenv) C:\Users\Name\djangogirls> django-admin.exe startproject mysite .
TIME_ZONE = 'Europe/Berlin'
LANGUAGE_CODE = 'de-ch'
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')、
ALLOWED_HOSTS = ['127.0.0.1', '.pythonanywhere.com']
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
(myvenv) ~/djangogirls$ python manage.py migrate
(myvenv) ~/djangogirls$ python manage.py runserver
本地网站创建
(myvenv) C:\Users\Name\djangogirls> python manage.py startapp blog
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog.apps.BlogConfig',
]

blog/models.py
from django.conf import settings
from django.db import models
from django.utils import timezone

class Post(models.Model):
    author=
    ...
python manage.py makemigrations blog
python manage.py migrate blog

#blog.admin.py
from django.contrib import admin
from .models import Post
admin.site.register(Post)

python manage.py createsuperuser

#mysite/urls.py
from django.contrib import admin
from django.urls import path, include
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('blog.urls')),
]#设置首页为admin|blog.urls导入blog的所有url通过include函数


#blog.urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.post_list, name='post_list'),
]#这里也有一个urlpatterns，这里实现了根URL配置views的post_list视图


#blog.views.py
from django.shortcuts import render
def post_list(request):
    return render(request, 'blog/post_list.html', {})

创建html
blog
└───templates
    └───blog

python manage.py shell
进入QuerySet 并使用python语法：
(InteractiveConsole)
>>>

#blog.views.py
from django.shortcuts import render
from django.utils import timezone
from .models import Post

def post_list(request):
    posts = Post.objects.filter(published_date__lte=timezone.now()).order_by('published_date')
    return render(request, 'blog/post_list.html', {'posts': posts})

{%... %}

h1 a, h2 a {
    color: #C25100;
    font-family: 'Lobster';//here may fail
}

{% load static %}

{% load static %}
<html>
    <head>
        <title>Django Girls blog</title>
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
        <link href="//fonts.googleapis.com/css?family=Lobster&subset=latin,latin-ext" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="{% static 'css/blog.css' %}">
    </head>
    <body>
        <div>
            <h1><a href="/">Django Girls Blog</a></h1>
        </div>

        {% for post in posts %}
            <div>
                <p>published: {{ post.published_date }}</p>
                <h2><a href="">{{ post.title }}</a></h2>
                <p>{{ post.text|linebreaksbr }}</p>
            </div>
        {% endfor %}
    </body>
</html>


#创建base.html

{% load static %}
<html>
    <head>
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">
        
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
        <link href="https://fonts.lug.ustc.edu.cn/css?family=Lobster&subset=latin,latin-ext" rel="stylesheet">

        <link rel="stylesheet" href="{% static 'css/blog.css' %}">
        <title>Django Girls blog</title>
        
    </head>

    <body>
        <div class="page-header">
            <h1><a href="/">Django Girls Blog</a></h1>
        </div>
        <div class="content container">
            <div class="row">
                <div class="col-md-8">
                {% block content %}
                {% endblock %}
                </div>
            </div>
        </div>
    </body>
    
</html>

#修改host_list.html
{% extends 'blog/base.html' %}

{% block content %}
    {% for post in posts %}
        <div class="post">
            <div class="date">
                {{ post.published_date }}
            </div>
            <h2><a href="">{{ post.title }}</a></h2>
            <p>{{ post.text|linebreaksbr }}</p>
        </div>
    {% endfor %}
{% endblock %}

<h2><a href="{% url 'post_detail' pk=post.pk %}">{{ post.title }}</a></h2>

from django.urls import path
from . import views

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('post/<int:pk>/', views.post_detail, name='post_detail'),
]

#blog/view.py
from django.shortcuts import render, get_object_or_404
...
def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/post_detail.html', {'post': post})

#blog\templates\blog\post_detail.html

{% extends 'blog/base.html' %}

{% block content %}
    <div class="post">
        {% if post.published_date %}
            <div class="date">
                {{ post.published_date }}
            </div>
        {% endif %}
        <h2>{{ post.title }}</h2>
        <p>{{ post.text|linebreaksbr }}</p>
    </div>
{% endblock %}

#创建blog/forms.py
  blog
    └── forms.py
from django import forms

from .models import Post

class PostForm(forms.ModelForm):

    class Meta:
        model = Post
        fields = ('title', 'text',)

#base.html
<a href="{% url 'post_new' %}" class="top-menu"><span class="glyphicon glyphicon-plus"></span></a>

#blog/urls.py
path('post/new/', views.post_new, name='post_new'),

#blog/views.py
from .forms import PostForm

def post_new(request):
    form = PostForm()
    return render(request, 'blog/post_edit.html', {'form': form})

#post_edit.html
{% extends 'blog/base.html' %}

{% block content %}
    <h2>New post</h2>
    <form method="POST" class="post-form">{% csrf_token %}
        {{ form.as_p }}
        <button type="submit" class="save btn btn-default">Save</button>
    </form>
{% endblock %}

#views.py
from django.shortcuts import redirect

def post_new(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.published_date = timezone.now()
            post.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm()
    return render(request, 'blog/post_edit.html', {'form': form})

#post_detail.html
<a class="btn btn-default" href="{% url 'post_edit' pk=post.pk %}"><span class="glyphicon glyphicon-pencil"></span></a>

#urls.py
path('post/<int:pk>/edit/', views.post_edit, name='post_edit'),

def post_edit(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == "POST":
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.published_date = timezone.now()
            post.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm(instance=post)
    return render(request, 'blog/post_edit.html', {'form': form})


#base.html
{% if user.is_authenticated %}
    <a href="{% url 'post_new' %}" class="top-menu"><span class="glyphicon glyphicon-plus"></span></a>
{% endif %}

#post_detail.html
{% if user.is_authenticated %}
     <a class="btn btn-default" href="{% url 'post_edit' pk=post.pk %}"><span class="glyphicon glyphicon-pencil"></span></a>
{% endif %}


BHY&DeepSeek--Solution for Offline:
1.
<!-- templates/offline.html -->
<!DOCTYPE html>
<html>
<head>
  <title>服务维护中</title>
</head>
<body>
  <h1>服务暂时不可用</h1>
  <img src="{% static 'img/maintenance.png' %}" alt="维护中">
  <p>请稍后再访问</p>
</body>
</html>
2. 
// static/js/sw.js
const CACHE_NAME = 'offline-v1';
const OFFLINE_URL = '/offline/';  // 离线页面的URL

// 安装时缓存离线页面
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.add(OFFLINE_URL))
  );
});

// 拦截请求
self.addEventListener('fetch', (event) => {
  // 尝试网络请求，失败则返回离线页面
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(OFFLINE_URL);
    })
  );
});
3.
<!-- base.html -->
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('{% static "js/sw.js" %}');
  }
</script>
4.
# urls.py
from django.views.generic import TemplateView

urlpatterns = [
    ...,
    path ('offline/', TemplateView.as_view(template_name='offline.html'), 
]
4. 效果
当服务器停止后，用户访问任何页面均会显示offline.html中的内容。



2. 框架搭建
    1. django-admin.exe生成框架
        djangogirls
        ├── manage.py
        ├── mysite
        │   ├── __init__.py
        │   ├── settings.py             //mysite设置更改【语言……|主机验证|数据库……】
        │   ├── urls.py
        │   └── wsgi.py
        ├── myvenv
        │   └── ...
        └── requirements.txt
    2. manage.py生成应用程序框架
        djangogirls
        ├── blog
        │   ├── admin.py
        │   ├── apps.py
        │   ├── __init__.py
        │   ├── migrations
        │   │   └── __init__.py
        │   ├── models.py
        │   ├── tests.py
        │   └── views.py
        ├── db.sqlite3
        ├── manage.py
        ├── mysite
        │   ├── __init__.py
        │   ├── settings.py
        │   ├── urls.py
        │   └── wsgi.py
        ├── myvenv
        │   └── ...
        └── requirements.txt
    3. Post(models.Model)引入models.Model的可开发的保存在数据库的对象|作为其他页面的引入对象【views.py|
    4. view 连接模型实例与模板，用于显示的传递
    5. 配置admin的页面渲染
    6. 配置blog的静态页面渲染
        djangogirls
            ├── blog
            |    └─── static
            |    |   └─── css
            |    |      └─── blog.css
            │    ├── migrations
            │    ├── static
            │    └── templates
            └── mysite

     
3. 技术把控【疑问】
    1. migrate技术:
        1. importlib|inspect|django.db.migrations..继承
        2. 依赖处理问题
        3. DAG处理迁移顺序
        4. 可能的处理：
            # 典型生产环境部署
            python manage.py makemigrations --check  # 检测未生成迁移
            python manage.py migrate --database=prod
    2. django.urls.path
        1. Django URL 路由系统中的一个基本构建块,定义URL 模式与视图之间的映射关系
        2. 将传入的 HTTP 请求的 URL 路径匹配到相应的视图函数或类视图上，并可以从URL中捕获参数并传递给视图
        3. 行为
            1. URL模式匹配：字符串匹配|converters捕获参数
            2. 参数传递args*
            3. kwargs 参数传递关键字参数|名称指定，模板或代码中反向解析
        4. 原理：
            1. 相关部件：include函数【路由模块】！:blush:|
            2. URL配置——urlpatterns[in urls.py]——各项`path`与请求匹配
            3. 字符匹配与转换器语法（`<converter:name>`）
            4. 转换器|正则|作为关键字参数，回传视图
            注：path函数返回值在内部是re表达式|转换器注册表等技术细节【值得分析:blush:
            5. 视图解析：`request`|URL解析的关键字参数|kwargs调用传递的关键字参数
            6. 调用试图
            7. 失败返回404
        5. re_path 使用正则匹配——高阶
        6. magic code：
            ```
            # django/core/handlers/base.py
            class BaseHandler:
                def get_response(self, request):
                    # 通过URLResolver匹配
                    resolver_match = resolver.resolve(request.path_info)
                    # 调用视图函数
                    return resolver_match.func(request, **resolver_match.kwargs)
            ```
            ```
            # django/urls/converters.py
            REGISTERED_CONVERTERS = {
                'int': IntConverter(),
                'str': StringConverter(),
                # ...
            }
            ```
        7. 相关技术：
            1. include机制
                path('blog/', include('blog.urls'))#高效概括构建
                新的URLResolver实例
                反向解析
            2. 重定向|自定义转换器等
        8. 关键细节
            1. 尾部斜杠处理
            2. 匹配优先级
            3. 正则兼容
        9. 性能优化
            1. 路由缓存
            2. include——视图加载？惰性加载
        10. 设计哲学
            1. 声明式编程：通过简洁语法描述 URL 模式
            2. 类型安全：转换器机制确保参数类型正确
            3。 可扩展架构：支持自定义转换器、嵌套路由
            4. 性能优先：编译时优化 + 运行时缓存
        11. 最佳实践
            1. 简单路由用 path()，复杂匹配用 re_path()

            2. 为每个路由命名（name 参数）方便反向解析

            3. 使用 path_converter() 替代正则表达式提高可读性

            4. 避免在 URL 配置中编写业务逻辑

    3. 导入模块:from .models...即依赖
    4. URLconf 匹配机制——匹配URL请求与视图
    5. `django.shortcuts`模块——最佳实践封装——【模板|请求|响应】
        1. 快捷函数|更底层操作
        2. `render`函数:将给定的模板与给定的上下文字典组合在一起,渲染之后生成一个`HttpResponse`对象
            1. 作用
                1. 加载模板|渲染模板[模板引擎的渲染机制]
                2. 自动上下文注入【request|CSRF_TOKEN|user】
                3. 响应的生成：创建并返回HttpResponse对象,内容为渲染后的字符串
            2. kit
                - `request`: HttpRequest对象，即当前的请求对象。

                - `template_name`: 要使用的模板的名称（字符串）或模板名称的列表。如果是列表，Django将使用第一个找到的模板。
                  [可能涉及多个模板加载器，如文件系统加载器、应用目录加载器等]

                - `context`: 一个字典，包含要传递给模板的上下文数据。默认是None（即空字典）。|可以是任何序列化的数据
                  [如果提供了`request`，那么模板上下文会自动包含一些与请求相关的变量（例如`user`，`request`等）]

                - `content_type`: 生成的文档的MIME类型，默认为`text/html`。

                - `status`: 响应的状态码，默认为200。

                - `using`: 用于加载模板的模板引擎的名称（如果配置了多个模板引擎）。
            3. 涉及的关键行为
                1. 获取模板
                    1. 模板引擎

                
                2. 上下文处理
                    1. # settings.py
                        TEMPLATES = [{...}]
                    
                3. 渲染
                    Template|整合request与context
                    
        3. 设计哲学
            约定优于配置
            自动应用最佳实践（如上下文处理器）

            关注点分离
            视图关注业务逻辑，渲染关注表现层

            渐进式复杂
            简单场景开箱即用，复杂场景可深度定制

        4. 最佳实践：

            始终使用 render() 替代手动模板处理

            通过上下文处理器管理全局模板变量

            对 API 响应使用 content_type='application/json'

            错误页面明确设置 status 参数（如 404, 500）

    6. 框架与自定义
        1. 示例：
        from django.template import loader
        template = loader.get_template('my_template.html')

        2. consistent:normalize
    7. 视图复用
        1. 类试图
        2. 模板继承
    
    8. class|div
        div:结构组织|容器|块级|语义化标签
        class:样式复用
    9. DTL——逻辑与表现分离
        1. 服务器端：模板>Django模板引擎--> 标准的HTML字符串
            1. 模板加载器
            2. 模板解析
            3. 模板编译【节点树|上下文渲染】
            4. 编译后的模板与context结合，标签逻辑，标准的HTML字符串输出

        2. 客户端：浏览器的正常解析
            1. DOM|CSS|Render Tree
            2. Layout的计算
            3. Paint
    10. Django的表单以及 ModelForm-- 参考HTML的表单
        1. 基础表单——通用数据

        2. 交互式 Web


4. Django的设计解构
    1. 用户认证（Authentication）
        1. django.contrib.auth包
        2. key in kit
           1. django.contrib.auth.models.User
           2. AuthenticationForm
           3. login(), logout()视图函数
           4. authenticate()函数
           5. 认证系统中间件`SessionMiddleware`和`AuthenticationMiddleware`
               django.contrib.auth.backends.ModelBackend 负责验证用户
               get_user() 

    2. 注册（Sign Up）| 可实现
    3. 登录login
        1. LoginView
            1. AuthenticationForm
            2.  表单验证，登录用户（创建会话），并重定向
    4. Logout
        1. LogoutView
        2. 销毁会话，然后重定向
    5. 站点管理
        1. Admin Site【django.contrib.admin.sites.AdminSite】
        2. ModelAdmin
        3. 流程
            1. 在`admin.py`中注册模型。

            2. 创建超级用户（`python manage.py createsuperuser`）来访问/admin。

            3. 定制`ModelAdmin`以改变列表显示、添加搜索、过滤等。

        4. Django的ORM、表单和模板系统|
           元编程~界面|
           权限系统（`django.contrib.auth`）控制用户访问
    6. HTML组件的 Django 模型重建
        1. 表单（Forms）
            1. Why/How Is Django.form:
                1. Python代码以高度可定制化、可维护的方式控制表单的各个方面|部件
                   属性字段|数据处理|渲染|安全
                2. use python as tool
                3. 表单逻辑是 a block of intensive and maybe independent logic, 集中在表单类中，符合高内聚原则-->字段级和表单级的验证逻辑。
                4. Django表单自动生成HTML+ 多种方式自定义渲染（例如，使用模板、自定义模板标签、覆盖字段的widget属性等）     
                   
            1. key kit
                - **Form类**：定义表单字段和验证逻辑。

                - **ModelForm**：基于模型自动生成表单。 

                - 字段和窗口小部件（widgets）验证|渲染

                - CSRF保护（需要中间件支持）

            2. 处理流程
                1. 定义表单（指定字段和验证器）。

                2. 在视图中实例化表单（GET请求时为空表单，POST请求时绑定数据）。

                3. 调用`is_valid()`验证，然后使用`cleaned_data`获取干净数据。

                4. 保存数据（如果是ModelForm，则调用`save()`）。
            
    7. 文件上传
        `FileField|
        enctype="multipart/form-data|
        request.FILES|
        保存操作|后端的`save()`
    8. 设计哲学：约定优于配置
        深度集成：认证、Admin、ORM、表单等组件共享同一内核，减少配置冲突。

        扩展点丰富：自定义后端（认证、存储）、中间件、信号等提供灵活性。

        生产就绪：从开发服务器到高并发部署（ASGI/WSGI），内置功能覆盖完整生命周期。

    9. 推荐实践：

        复杂认证场景使用 django-allauth（集成社交登录）

        大文件上传用 django-chunked-upload

        Admin 美化用 django-admin-interface
        






