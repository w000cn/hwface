/*
		Auto Mask Name => 
		Copyright (C) 2011 hwface.com
		
		Includes jQuery
		Copyright 2011, John Resig
		Dual licensed under the MIT or GPL Version 2 licenses.
		http://jquery.org/license

		Includes automaskname.user.js
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
// @name         Auto Mask Name
// @author       w000.cn@gmail.com
// @namespace    http://www.hwface.com/
// @namespace    http://hwface.sinaapp.com/
// @namespace	 https://github.com/w000cn/hwface
// @description  A javascript snippet to help you auto change mask name
// @other        插件功能点：
//               1.自动更换马甲：如果发现本帖内有其他马甲A回复过该贴，并且当前马甲B和A非同一个马甲
//				   则自动切换马甲到A马甲
// @include      *://xinsheng.huawei.com/cn/index.php?app=forum&mod=Detail&act=index*
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
			//script.addEventListener('load', function() {
				document.body.appendChild(cb);
			//});
		}
		else {
			var dollar = undefined;
			if(typeof($) != "undefined") dollar = $;
			//script.addEventListener('load', function() {
				jQuery.noConflict();
				$ = dollar;
				callback(jQuery);
			//});
		}
		//document.head.appendChild(script);
	} else {
		callback(jQuery);
	}
}
withjQuery(function($)
{
	var match_flag = 0;
	var curr_check_count = 0;
	var max_check_count = 500;
	var curr_nick = $("div.nickname_b a").attr("title");
	var current_page = $("div.page.R span.current").first().text();
	var max_page = getMaxPageNum();
		
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
			//<a href=?"/?cn/?index.php?app=forum&mod=List&act=index&class=468&cate=64&p=5">?5?</a>?
			match = a_url && a_url.match(/.*&p=([0-9]*)/i);
			temp_page = match && match[1]*1;
			curr_max_page = (temp_page > curr_max_page)?temp_page : curr_max_page;
		}
		
		if (curr_max_page > 5)
		{
			return 5;
		}
		return curr_max_page;
	}
	function selectmaskname(maskId)
	{
		$.post("http://xinsheng.huawei.com/cn/index.php?app=space&mod=Info&act=doAddUsed",{maskid:maskId},function(txt){
			window.location.reload();
		});
	}
	
	function checkMaskName(str)
	{
		var i = 0;
		var maskId = 0;
		var all_nick = $("div.nickname_z a");
		
		if (str == curr_nick)
		{
			match_flag = 1;
			return ;
		}
		
		for (i = 0; i < all_nick.length && !match_flag; i++)
		{
			if (all_nick[i].title && str == all_nick[i].title)
			{
				//alert("mask name [ " + curr_nick + " ], change to [ " + all_nick[i].title + " ] !");
				all_nick[i].onclick;
				match_flag = 1;
				var match = all_nick[i].outerHTML && all_nick[i].outerHTML.match(/.*selectmaskname.([0-9]*)/i);
				maskId = match && match[1]*1;
				if (maskId > 0)
				{
					selectmaskname(maskId);
				}
				return;
			}
			if (curr_check_count > max_check_count){return ;}
		}
		curr_check_count++;
	}
	
	function magic_page_load(obj)
	{
		obj.each(function()
		{
			checkMaskName($(this).text());
			if (match_flag == 1)
			{
				return ;
			}
		});
	}
	
	function magic_page_check(cur_page, max_page)
	{
		var i = 0;
		var cur_url = document.location.href;
		var new_url = "";
		
		if (cur_page > max_page)
		{
			return;
		}
		
		for (i = 1; i <= max_page && !match_flag; i++)
		{
			if (i == cur_page){continue;}
			
			if (cur_url.indexOf("&p=") > 0)
			{
				new_url = cur_url.replace(/&p=[0-9]*/, '&p='+i);
			}
			else
			{
				new_url = cur_url + '&p='+i;
			}
			
			$.ajax({url:new_url, success: function(msg){magic_page_load($(msg).find("cite.font_cite a"));}});			
			
			if (curr_check_count > max_check_count){return ;}
		}
		
	}
	
	magic_page_load($("cite.font_cite a"));
	
	magic_page_check(current_page, max_page);

}, true);
