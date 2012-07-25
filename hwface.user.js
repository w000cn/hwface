/*
		Huawei Face Mash => 
		Copyright (C) 2011 hwface.com
		
		Includes jQuery
		Copyright 2011, John Resig
		Dual licensed under the MIT or GPL Version 2 licenses.
		http://jquery.org/license

		Includes hwface.user.js
		http://hwface.sinaapp.com/
		Copyright (C) 2011 hwface.com
		Released GNU Licenses.

		This program is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

// ==UserScript==  
// @name         Huawei Face Mash
// @author       w000.cn@gmail.com
// @namespace    http://www.hwface.com/
// @namespace    http://hwface.sinaapp.com/
// @namespace	 https://github.com/w000cn/hwface
// @description  A javascript snippet to help you auto get huawei face mash
// @other        插件功能点：
//               1.浏览易用性，不用点击链接进入页面，能够在一个窗口中浏览所有
//                 内容，删除了超链接。
//               2.打分功能：可以针对所有内容进行打分操作。能够将打分结果上传
//                 到互联网服务器进行统计排行，输出平均分。
//               3.打分记忆功能，能够记录本机所有的打分操作记录。
//               4.互联网排行功能：针对打分结果，输出所有排行内容（内测中）
//               5.本地排行功能：针对本地的打分结果，输出所有排行内容（规划中）
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=409&cate=44*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=466&cate=52*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=467&cate=58*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=468&cate=64*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=469&cate=70*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=470&cate=76*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=506&cate=82*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=507&cate=88*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=508&cate=94*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=509&cate=100*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=510&cate=112*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=511&cate=106*

// ==/UserScript== 
function withjQuery(callback, safe){
	if(typeof(jQuery) == "undefined") {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js";
		script.src = "http://ajax.microsoft.com/ajax/jQuery/jquery-1.7.2.min.js";

		if(safe) {
			var cb = document.createElement("script");
			cb.type = "text/javascript";
			cb.textContent = "jQuery.noConflict();(" + callback.toString() + ")(jQuery);";
			script.addEventListener('load', function() {
				document.head.appendChild(cb);
			});
		}
		else {
			var dollar = undefined;
			if(typeof($) != "undefined") dollar = $;
			script.addEventListener('load', function() {
				jQuery.noConflict();
				$ = dollar;
				callback(jQuery);
			});
		}
		document.head.appendChild(script);
	} else {
		callback(jQuery);
	}
}
withjQuery(function($)
{
	var vote_url = "http://hwface.sinaapp.com/vote.php";	
	var sort_url = "http://hwface.sinaapp.com/sort.php";
	var giveFiveStr = "<span id='star' style='white-space: nowrap'><span class=\"fires_icon\" cent=1 lock=0 title=\"一般一般\" style=\"opacity: 0.4; \">&nbsp;</span>" +
					"<span class=\"fires_icon\" cent=2 lock=0 title=\"可以可以\" style=\"opacity: 0.4; \">&nbsp;</span>" +
					"<span class=\"fires_icon\" cent=3 lock=0 title=\"不错不错\" style=\"opacity: 0.4; \">&nbsp;</span>" +
					"<span class=\"fires_icon\" cent=4 lock=0 title=\"来电咯\" style=\"opacity: 0.4; \">&nbsp;</span>" +
					"<span class=\"fires_icon\" cent=5 lock=0 title=\"女神下凡\" style=\"opacity: 0.4; \">&nbsp;</span></span>" +
					"<a id=\"votemsg\"></a><div id='content' style='display: none;'><div id='url'><a href='#url#'>#url#</a></div></div>";
	var new_button_str = "&nbsp;<input id='local_sort' class='text_button mt5' type='button' value='本地排行'>&nbsp;" +
					"&nbsp;<input id='net_sort' class='text_button mt5' type='button' value='网络榜单'>&nbsp;" +
					"&nbsp;<input id='find_smby' class='text_button mt5' type='button' value='可爱女人'>&nbsp;" +
					"&nbsp;<input type='checkbox' id='auto_expand' name='conf'>自动展开&nbsp;"+
					"&nbsp;<input type='checkbox' id='only_attach' name='conf'>只显示附件&nbsp;" +
					"<div id='sort_msg' style='display: none;'></div>";
	var read_more_str = "<tr class='list_2_tit'><td align='center' id='#id#'></td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
					
	var pic_hot = "http://xinsheng-image.huawei.com/cn/forumimage/data/uploads/2010/1213/22/4d0627ac71298.gif";
	var pic_nor = "http://xinsheng-image.huawei.com/cn/forumimage/data/uploads/2010/1213/22/4d0627059851c.gif"
	var hwface = unSerialize(getCookie("hwface"));
	var sort_page = 0;
	var num_per_page = 20;
	var network_sort_flag = 0;
	var current_page = $("div.page.R span.current").first().text();
	var max_page = getMaxPageNum();
	var sort_obj = new Array();
	
	function setCookie(c_name,value,expiredays)
	{
		var exdate=new Date()
		//cookie 有效时间十年
		exdate.setDate(exdate.getDate()+(expiredays==null)?3650:expiredays)
		document.cookie=c_name+ "=" +escape(value)+ ";expires="+exdate.toGMTString();
		//cookie 有效时间：session
		//exdate.setDate(exdate.getDate()+expiredays);
		//document.cookie=c_name+ "=" +escape(value)+	((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
	}

	function getCookie(c_name)
	{
		if (document.cookie.length>0)
		{
			c_start=document.cookie.indexOf(c_name + "=")
			if (c_start!=-1)
			{ 
				c_start=c_start + c_name.length+1 
				c_end=document.cookie.indexOf(";",c_start)
				if (c_end==-1) c_end=document.cookie.length
				return unescape(document.cookie.substring(c_start,c_end))
			} 
		 }
		return ""
	}
	
	function unSerialize(str)
	{
		var cookie_str = decodeURIComponent(str);
		cookie_str = cookie_str.replace(/=/g,":");
		cookie_str = cookie_str.replace(/&/g,",");
		return eval("tempobj={"+cookie_str+"}");
	}
		
	function getMaxPageNum()
	{
		var i = 0; 
		var a_url ;
		var match;
		var temp_page = 0;
		var curr_max_page = 0;
		var objs = $("div.page.R a");
		for (i = 0; i < objs.length; i++)
		{
			a_url = $(objs[i]).attr("href");
			//<a href=​"/​cn/​index.php?app=forum&mod=List&act=index&class=468&cate=64&p=5">​5​</a>​
			match = a_url && a_url.match(/.*&p=([0-9]*)/i);
			temp_page = match && match[1]*1;
			curr_max_page = (temp_page > curr_max_page)?temp_page : curr_max_page;
		}
		return curr_max_page;
	}
	
	//入口 $("table.ta_list tr.list_bm") / $(tr_temp)
	function createHWfaceInfo(obj)
	{
		obj.find("span.pr20 a").each(function(){getPic($(this));});
		obj.find("td.del").click(function(){objToggle($(this))});
		obj.find("td.del").mouseout(function(){clearFiv($(this))});
		obj.find("span.fires_icon").mouseover(function(){give_five_click($(this), 0);});
		obj.find("span.fires_icon").click(function(){give_five_click($(this), 1);});
	}
	
	//入口$("td.del")
	function getPicContent(obj, msg)
	{
		//<div class="floorBox_right_T">
		var content = $(msg).find("div.floorBox_right_T").html();
		//<div class="img_resize restore_C gut_style" rel="content">
		obj.find("div#content").append(content);
		if ($("input#only_attach")[0].checked)
		{
			obj.find("div.img_resize.restore_C.gut_style").hide();
		}
		obj.find("div.img_resize.restore_C.gut_style div.cl").css("white-space","normal");
		obj.find("div#content img[data-ks-lazyload]").each(function(){
			$(this).attr("src", $(this).attr("data-ks-lazyload"));
		});
	}
	
	//入口$("td.del")
	function objToggle(obj)
	{
		var obja = obj.find("a[ajax]");
		var url = obj.find("div#url").text();
		if (obja.attr("ajax") == 0)
		{
			obja.attr("ajax", "1");
			//第一次点击的时候才会去请求数据，防止对服务器并发太多
			$.ajax({ url:url, async:false, success: function(msg){getPicContent(obj, msg)}});
		}
		obj.find("div#content").slideToggle("slow");
	}
	
	//入口$("span.pr20 a")
	function autoAjax(obj, url)
	{
		//防止对服务器造成过大的并发，不一次性请求所有数据，在objToggle里面点一次，请求一个。
		if ($("input#auto_expand")[0].checked )
		{
			obj.attr("ajax", "1");
			$.ajax({ url:url, success: function(msg){getPicContent(obj, msg)}});
			obj.parents("span.pr20").find("div#content").show();
		}
		else
		{
			obj.parents("span.pr20").find("div#content").hide();
		}
	}
	
	//入口$("span.pr20 a")
	function getPic(obj)
	{
		if (!obj || !obj.html() || !obj.parents("td.del").length || !obj.parents("td.del").find("img").length)
		{
			return;
		}
		var url = obj.attr("href");
		obj.attr("ajax", "0");
		temp_str = giveFiveStr.replace(/#url#/g, url);
		obj.append(temp_str);
		autoAjax(obj, url);
		obj.removeAttr("href");
		obj.css("white-space","normal");

		//http://xinsheng.huawei.com/cn/index.php?app=forum&amp;mod=Detail&amp;act=index&amp;id=884633
		var match = url && url.match(/.*id=([0-9]*)/i);
		var uid = match && match[1];
		obj.attr("uid", uid);
		showLastResult(obj.find("span.fires_icon"), hwface[uid]);
	}
	
	//入口$("span.fires_icon[cent=5]")
	function vote_msg(obj, msg)
	{
		obj.parents("span.pr20 a").find("a#votemsg").html(msg);
		obj.parents("span.pr20 a").find("a#votemsg").fadeTo("fast",1);
		obj.parents("span.pr20 a").find("a#votemsg").fadeTo(3000,0, function(){$(this).html("")});
	}
	
	//入口$("td.del a[ajax] span.fires_icon")
	function showLastResult(obj, cent)
	{
		var temp_obj;
		var i = 0;
		if (cent < 0 && cent > 5)
		{
			return ;
		}
		for (i = 1; i <= 5; i++)
		{
			temp_obj = obj.parents("span.pr20 a").find("span.fires_icon[cent="+i+"]");
			temp_obj.fadeTo("fast",(i <= cent)?1:0.4);
			temp_obj.attr("lock", cent?1:0);
		}
	}
	
	//入口$("td.del a[ajax] span.fires_icon")
	function vote_to_server(obj)
	{
		var str = "cent=" + obj.attr("cent") + "&uid=";
		var url = obj.parents("span.pr20 a").find("div#url").text();
		
		var newToken = obj.parents("span.pr20 a").attr("uid");
		
		if (newToken)
		{
			str = str + newToken;
			
			var obja = obj.parents("span.pr20 a[ajax]");
			if (obja.attr("ajax") == 1)
			{
				obj.parents("span.pr20 a").find("div#content img[data-ks-lazyload]").each(function()
				{
					str = str + "&img[]=" + $(this).attr("data-ks-lazyload");
				});			
			}
			
			var temp_obj = obj.parents("span.pr20 a").find("span.fires_icon[cent=5]");
			$.ajax({
				url: vote_url,
				//async: false,
				data: str,
				type: "POST",
				dataType:"jsonp",
				jsonp:"callback",
				jsonpCallback:"success_jsonpCallback",
				success: function(msg)
				{
					if (msg["new_cent"])
					{
						vote_msg(temp_obj, "感谢投票,目前平均分:"+msg["new_cent"]+".");
						showLastResult(obj, msg["new_cent"]);
					}
					else
					{
						vote_msg(temp_obj, msg["message"]);
					}
				},
				error: function(msg)
				{
					vote_msg(temp_obj, "暂时无法连接投票服务器");
				}
			});
		}
	}
	
	//入口$("span.fires_icon")
	//flag 0, 临时暂时; flag 投票结果
	function give_five_click(obj, flag)
	{
		var temp_obj;
		var vote = 0;
		var i = 0;

		//如果页面未展开/没有附件，则不允许投票
		if (flag == 1 && (obj.parents("span.pr20 a").attr("ajax") == 0
			|| obj.parents("span.pr20 a").find("div#content a[title='点击下载']").length == 0))
		{
			vote_msg(obj, "暂时不允许投票");
			return ;
		}
		for (i = 1; i <= 5; i++)
		{
			temp_obj = obj.parents("span.pr20 a").find("span.fires_icon[cent="+i+"]");
			if (i <= obj.attr("cent") && temp_obj.attr("lock") == 0)
			{
				temp_obj.fadeTo("fast",1);
				vote = 1;
			}
			if (flag == 1)
			{
				temp_obj.attr("lock",1);
			}
		}
		if (flag == 1)
		{
			if (vote == 1)
			{
				if (obj.parents("span.pr20 a") && obj.parents("span.pr20 a").attr("uid"))
				{
					var uid = obj.parents("span.pr20 a").attr("uid");
					hwface[uid] = obj.attr("cent");					
					setCookie("hwface", $.param(hwface, false));//
				}
				vote_to_server(obj);
				//vote_msg(temp_obj, "感谢投票");
			}
			else
			{
				temp_obj = obj.parents("span.pr20 a").find("span.fires_icon[cent=5]");
				vote_msg(temp_obj, "不能重复投票");
				
			}
		}
	}
	
	//入口$("td.del")
	function clearFiv(obj)
	{
		obj.find("span.fires_icon[lock=0]").fadeTo("fast",0.4);
	}
	
	function showSortPage(curr_page, total_len)
	{
		sort_page = curr_page;
		showSortTable((curr_page -1)*num_per_page, curr_page*num_per_page, total_len);
	}
	
	//入口 network_sort_flag?json对象:hwface
	function showSortTable(start_pos, end_pos, total_len)
	{
		if (start_pos == 0)
		{
			$("table.ta_list").find("tr[sort]").remove();
		}
		$("td#read_more").parent("tr").remove();
		
		var table_obj = $("table.ta_list").find("tr:not([sort])").first();
		var clone_obj = $("table.ta_list").find("tr:not([sort])").has("td.del img").first();
		var i = 0;
		for (i = start_pos; i < end_pos && sort_obj[i]; i++)
		{
			uid = sort_obj[i]["uid"];
			cent = sort_obj[i]["cent"];
			count = sort_obj[i]["count"];
			
			var tr_temp = clone_obj.clone();
			var temp_url = "http://xinsheng.huawei.com/cn/index.php?app=forum&mod=Detail&act=index&id=" + uid;

			//更换图片
			$(tr_temp).find("td.del img").attr("src", (i < 10)?pic_hot:pic_nor);
			$(tr_temp).attr("class", (i%2)?"list_bm":"list_bm no_bg");
			
			var tempa = $(tr_temp).find("td.del span.pr20 a[ajax]");
			tempa.attr("title", "心动女生: "+uid)
			tempa.html(tempa.attr("title"));			
			tempa.attr("href", temp_url);
			
			createHWfaceInfo($(tr_temp));
			//第二列/三四
			$(tr_temp).find("td.del_name").html("hwface");
			$(tr_temp).find("td[align='center'][style]").html("Top "+ (i+1));
			$(tr_temp).find("td[align='right'][style]").html("心动指数:"+cent);
			$(tr_temp).attr("sort", (network_sort_flag)?"net":"local");
			table_obj.before(tr_temp);
		}
		if (end_pos >= total_len)
		{
		
		}
		else
		{
			var temp_str = read_more_str;
			temp_str = temp_str.replace(/#id#/g,'read_more');
			$("table.ta_list").find("tr:not([sort])").first().before(temp_str);
			$("td#read_more").text("更多榜单内容");
			$("td#read_more").parent("tr").click(function(){
				showSortPage(sort_page + 1, total_len);
			});
		}
	}
	
	//入口 network_sort_flag?json对象:hwface
	function obj_sort_func(obj)
	{
		var i = 0;
		var j = 0;
		var cent = 0;
		var count = 1;
		sort_obj = new Array();
		for (i = 50, j = 0; i >= 1 && j < 100; i--)
		{
			for (uid in obj)
			{
				if (network_sort_flag)
				{
					cent = obj[uid]["avg"];
					count = obj[uid]["count"];
				}
				else
				{
					cent = obj[uid];
					if (i %10){continue;}
				}
				if (cent*10 != i || j >= 100){continue;}

				sort_obj[j] = new Array();
				sort_obj[j]['uid'] = uid;
				sort_obj[j]['cent'] = cent;
				sort_obj[j]['count'] = count;
				j++;
			}
		}
	}

	//string
	function sort_msg(msg)
	{
		$("div#sort_msg").html(msg);
		$("div#sort_msg").show();
		$("div#sort_msg").fadeOut(3000);
	}

	function local_sort(obj)
	{
		//sort_msg("本地排行功能暂时未开放");
		if ($("table.ta_list").find("tr[sort]") && $("table.ta_list").find("tr[sort]").attr("sort") == "local")
		{return;}
		network_sort_flag = 0;
		obj_sort_func(hwface);
		showSortPage(1, sort_obj.length);
	}
	
	function net_sort(obj)
	{
		//sort_msg("网络榜单功能暂时未开放");	
		if ($("table.ta_list").find("tr[sort]") && $("table.ta_list").find("tr[sort]").attr("sort") == "net")
		{return;}
		$.ajax({
			url: sort_url,
			type: "POST",
			dataType:"jsonp",
			jsonp:"callback",
			jsonpCallback:"success_jsonpCallback",
			success: function(msg)
			{
				network_sort_flag = 1;
				obj_sort_func(msg);
				showSortPage(1, sort_obj.length);
			},
			error: function(msg)
			{
				sort_msg("暂时无法连接投票服务器");
			}
		});
	}
	
	function find_smby(obj)
	{
		sort_msg("该功能暂时未开放");
	}
	
	//入口$("input[name='conf']")
	function save_conf(obj)
	{
		setCookie(obj.attr("id"), obj[0].checked?1:0);
		sort_msg("该配置将在下次刷新页面后完全生效");
	}
	
	//$("input#auto_expand")
	function auto_expand_click(obj)
	{
		if (obj[0].checked)
		{
			alert("“自动展开”配置启用后，将会降低加载速度，并会对服务器造成一定的压力。\n\n请慎重使用!!!");
		}
		save_conf(obj);
	}
	
	//$("input#only_attach")
	function only_attach_click(obj)
	{
		if ($("input#only_attach")[0].checked)
		{
			$("div.img_resize.restore_C.gut_style").hide();
		}
		else
		{
			$("div.img_resize.restore_C.gut_style").show();
		}
		save_conf(obj);
	}
	
	function magic_page_load(msg, new_page)
	{
		var i = 0;
		var magic_obj = $(msg).find("table.ta_list tr.list_bm");

		createHWfaceInfo($(magic_obj));
		$("td#magic_page").parent("tr").before($(magic_obj));
		
		current_page = new_page;
		if (new_page >= max_page)
		{
			current_page = max_page;
			$("td#magic_page").parent("tr").remove();
		}
	}
	
	function magic_page_click(new_page)
	{
		var cur_url = document.location.href;
		var new_url = "";
		
		if (new_page > max_page)
		{
			$("td#magic_page").parent("tr").remove();
			return;
		}
		
		if (cur_url.indexOf("&p=") > 0)
		{
			new_url = cur_url.replace(/&p=[0-9]*/, '&p='+new_page);
		}
		else
		{
			new_url = cur_url + '&p='+new_page;
		}
		
		$.ajax({ url:new_url, success: function(msg){magic_page_load(msg, new_page)}});
	}
	
	//score board
	$("input[value='发表新帖']").after(new_button_str);
	$("input#local_sort").click(function(){local_sort($(this));});
	$("input#net_sort").click(function(){net_sort($(this));});
	$("input#find_smby").click(function(){find_smby($(this));});
	$("input#auto_expand")[0].checked = getCookie("auto_expand")*1;
	$("input#only_attach")[0].checked = getCookie("only_attach")*1;
	$("input#auto_expand").change(function(){auto_expand_click($(this));});
	$("input#only_attach").change(function(){only_attach_click($(this));});
	//
	createHWfaceInfo($("table.ta_list tr.list_bm"));
	
	//magic page 
	if (current_page < max_page)
	{
		var temp_str = read_more_str;
		temp_str = temp_str.replace(/#id#/g,'magic_page');
		$("table.ta_list").find("tr:not([sort])").last().after(temp_str);
		$("td#magic_page").text("更多内容");
		$("td#magic_page").parent("tr").click(function(){magic_page_click(current_page*1 + 1);});
	}

}, true);
