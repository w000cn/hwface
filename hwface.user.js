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
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=409&cate=44*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=466&cate=52*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=467&cate=58*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=468&cate=64*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=469&cate=70*
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=470&cate=76
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=506&cate=82
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=507&cate=88
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=508&cate=94
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=509&cate=100
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=510&cate=112
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=511&cate=106

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
	
	function setCookie(c_name,value,expiredays)
	{
		var exdate=new Date()
		//exdate.setDate(exdate.getDate()+(expiredays==null)?3650:expiredays)
		//document.cookie=c_name+ "=" +escape(value)+ ";expires="+exdate.toGMTString();
		exdate.setDate(exdate.getDate()+expiredays);
		document.cookie=c_name+ "=" +escape(value)+	((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
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
	
	function getPicContent(obj, msg)
	{
		//<div class="floorBox_right_T">
		var content = $(msg).find("div.floorBox_right_T").html();
		obj.find("div#content").append(content);
	}
		
	function objToggle(obj)
	{
		var obja = obj.find("a[ajax]");
		if (obja.attr("ajax") == 0)
		{
			obja.attr("ajax", "1");
			var url = obj.find("div#url").text();
			//第一次点击的时候才会去请求数据，防止对服务器并发太多
			$.ajax({ url:url, async:false, success: function(msg){getPicContent(obj, msg)}});
		}
		obj.find("div#content").find("img[data-ks-lazyload]").each(function(){
			$(this).attr("src", $(this).attr("data-ks-lazyload"));
		});
		obj.find("div#content").slideToggle("slow");
	}
	
	function getPic(obj)
	{
		if (!obj || !obj.html() )
		{
			return;
		}
		var url = obj.attr("href");
		obj.attr("ajax", "0");
		var giveFive = "<span class=\"fires_icon\" cent=1 lock=0 title=\"一般一般\" style=\"opacity: 0.4; \">&nbsp;</span>" +
						"<span class=\"fires_icon\" cent=2 lock=0 title=\"可以可以\" style=\"opacity: 0.4; \">&nbsp;</span>" +
						"<span class=\"fires_icon\" cent=3 lock=0 title=\"不错不错\" style=\"opacity: 0.4; \">&nbsp;</span>" +
						"<span class=\"fires_icon\" cent=4 lock=0 title=\"来电咯\" style=\"opacity: 0.4; \">&nbsp;</span>" +
						"<span class=\"fires_icon\" cent=5 lock=0 title=\"女神下凡\" style=\"opacity: 0.4; \">&nbsp;</span>" +
						"<a id=\"votemsg\"></a>";
		obj.append(giveFive+"<div id='content'><div id='url'>"+url+"</div></div>");
		obj.parent("span.pr20").find("div#content").hide();
		//防止对服务器造成过大的并发，不一次性请求所有数据，在objToggle里面点一次，请求一个。
		//$.ajax({ url:url, success: function(msg){getPicContent(obj, msg)}});
		obj.removeAttr("href");

		//http://xinsheng.huawei.com/cn/index.php?app=forum&amp;mod=Detail&amp;act=index&amp;id=884633
		var match = url && url.match(/.*id=([0-9]*)/i);
		var uid = match && match[1];
		if (uid)
		{
			obj.attr("uid", uid);
			var cent = getCookie("vote"+uid);
			if (cent && cent.length > 0)
			{
				showLastResult(obj.find("span.fires_icon"), cent);
			}
		}
	}
	
	function vote_msg(obj, msg)
	{
		obj.parent("span.pr20 a").find("a#votemsg").html(msg);
		obj.parent("span.pr20 a").find("a#votemsg").fadeTo("fast",1);
		obj.parent("span.pr20 a").find("a#votemsg").fadeTo(3000,0);
	}
	
	function showLastResult(obj, cent)
	{
		var temp_obj;
		if (cent < 0 && cent > 5)
		{
			return ;
		}
		for (i = 1; i <= 5; i++)
		{
			temp_obj = obj.parent("span.pr20 a").find("span.fires_icon[cent="+i+"]");
			temp_obj.fadeTo("fast",(i <= cent)?1:0.4);
			temp_obj.attr("lock",1);
		}
	}
	
	function vote_to_server(obj)
	{
		var str = "cent=" + obj.attr("cent") + "&uid=";
		var url = obj.parent("span.pr20 a").find("div#url").text();
		
		var newToken = obj.parent("span.pr20 a").attr("uid");
		
		if (newToken)
		{
			str = str + newToken;
			
			var obja = obj.parent("span.pr20 a[ajax]");
			if (obja.attr("ajax") == 1)
			{
				obj.parent("span.pr20 a").find("div#content img[data-ks-lazyload]").each(function()
				{
					str = str + "&img[]=" + $(this).attr("data-ks-lazyload");
				});			
			}
			
			var temp_obj = obj.parent("span.pr20 a").find("span.fires_icon[cent=5]");
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
					vote_msg(temp_obj, "感谢投票,目前平均分:"+msg["new_cent"]+".");
					showLastResult(obj, msg["new_cent"]);
				},
				error: function(msg)
				{
					vote_msg(temp_obj, "暂时无法连接投票服务器");
				}
			});
		}
	}
	
	//flag 0, 临时暂时; flag 投票结果
	function giveFive(obj, flag)
	{
		var temp_obj;
		var vote = 0;
		for (i = 1; i <= 5; i++)
		{
			temp_obj = obj.parent("span.pr20 a").find("span.fires_icon[cent="+i+"]");
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
				if (obj.parent("span.pr20 a") && obj.parent("span.pr20 a").attr("uid"))
				{
					setCookie("vote"+obj.parent("span.pr20 a").attr("uid"), obj.attr("cent"));
				}
				vote_to_server(obj);
				//vote_msg(temp_obj, "感谢投票");
			}
			else
			{
				temp_obj = obj.parent("span.pr20 a").find("span.fires_icon[cent=5]");
				vote_msg(temp_obj, "不能重复投票");
				
			}
		}
	}
	
	function clearFiv(obj)
	{
		obj.find("span.fires_icon[lock=0]").fadeTo("fast",0.4);
	}
	
	$("span.pr20 a").each(function(){getPic($(this));});
	$("td.del").click(function(){objToggle($(this))});
	//$("span.pr20 a").onclick(function(){objToggle($("td.del"));});
	//$("span.fires_icon").css("opacity", 0.4);
	$("td.del").mouseout(function(){clearFiv($(this))});
	$("span.fires_icon").mouseover(function(){giveFive($(this), 0);});
	$("span.fires_icon").click(function(){giveFive($(this), 1);});
}, true);
