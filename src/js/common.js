
// ------------ header_search.html ------------------
$(function () {
    var tabItem = $('#jsHeaderSearch li');
    var tabMain = $('#jsHeaderSearch ul');
    var searchInput = $('#jsHeaderSearch>.header-search-box>input');
    var searchSubmit = $('#jsHeaderSearch>.header-search-box>.pc-search');

    // 初始化tab默认选择的item
    if(tabMain.attr('data-type') === '') {
        tabItem.eq(0).addClass('active');
        tabMain.attr('data-type', tabItem.eq(0).attr('data-type'));
    }

    // 切换tab
    tabItem.on('click', function(){
        tabItem.removeClass('active');
        $(this).addClass('active');
        tabMain.attr('data-type', $(this).attr('data-type'));
    })

    // 搜索按钮
    searchSubmit.on('click', function(){
        if (searchInput.val().trim() !== '') {
            alert("搜索内容：" + searchInput.val()+"，类别："+tabMain.attr('data-type'));
        } else {
            alert("请输入搜索内容！");
        }
    })
}) 