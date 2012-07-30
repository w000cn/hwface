
var vote_url = "http://hwface.sinaapp.com/vote_img.php",
	sort_url = "http://hwface.sinaapp.com/sort.php",
	rand_url = "http://hwface.sinaapp.com/rand.php",
	img_template = "<img src='#url#' id='#id#'>",
	rand_flag = 0,
	rand_pic = [];

function get_pic_from_rand_data() {
	if (rand_pic && rand_pic.length) {
		var img_str = img_template.replace(/#url#/g, rand_pic[0].img);
		img_str = img_str.replace(/#id#/g, rand_pic[0].id);
		rand_pic.splice(0, 1);
		return img_str;
	}
}

function refresh_rand_data(msg) {
	var id = 0, i = 0;
	for (id in msg) {
		i = rand_pic.length;
		rand_pic[i] = [];
		rand_pic[i].id = id;
		rand_pic[i].img = msg[id];
		i++;
	}
}

function get_rand_pic_from_server() {
	var d, time_tick, obj_len = rand_pic.length;
	if (obj_len > 6 || rand_flag) {
		return;
	}
	d = new Date();
	time_tick = d.getTime();
	rand_flag = 1;
	$.ajax({url: rand_url, dataType: "jsonp", jsonp: "callback", jsonpCallback: "rand_pic_" + time_tick,
		success: function (msg) {
			rand_flag = 0;
			refresh_rand_data(msg);
			if (obj_len == 0 && rand_pic.length > 0) {
				get_pic_for_lovely_girl();
			}
		},
		error: function (msg) {
			rand_flag = 0;
			//alert(msg);
		}
	});
}

function lovely_girl_click(obj) {
	var i = 0, curr_id, other_id, other_str, data_str, d, time_tick, img0, img1;
	//投票
	curr_id = obj.attr("id");
	i = ($("div.lovely_girl img:eq(0)").attr("id") * 1 == curr_id * 1) ? 0 : 1;
	other_str = "div.lovely_girl img:eq(" + ((i + 1) % 2) + ")";
	other_id = $(other_str).attr("id");
	img0 = $("div.lovely_girl img[id=" + curr_id + "]");
	img1 = $("div.lovely_girl img[id=" + other_id + "]");
	if (img0.attr("vote") * 1 || img1.attr("vote") * 1) {
		return ;
	}
	img0.attr("vote", 1);
	img1.attr("vote", 1);

	d = new Date();
	time_tick = d.getTime();
	data_str = "id[]=" + curr_id + "&id[]=" + other_id;
	$.ajax({
		url: vote_url,
		data: data_str,
		type: "POST",
		dataType: "jsonp",
		jsonp: "callback",
		jsonpCallback: "vote_pk_" + time_tick,
		success: function (msg) {
		},
		error: function (msg) {
		}
	});

	//投票完毕，更新数据
	get_pic_for_lovely_girl();
}


function get_pic_for_lovely_girl() {
	get_rand_pic_from_server();
	if (rand_pic.length == 0) {
		return ;
	}
	var	img_str1 = get_pic_from_rand_data(),
		img_str2 = get_pic_from_rand_data();
	$("div.lovely_girl:eq(0)").html(img_str1);
	$("div.lovely_girl:eq(1)").html(img_str2);

	$("div.lovely_girl img").each(function () {
		$(this).width($("div.lovely_girl:eq(0)").width());
		$(this).css("cursor", "pointer");
		$(this).click(function () {lovely_girl_click($(this)); });
	});
}

function createLovelyGirl() {
	get_pic_for_lovely_girl();

	$('body').keyup(function (e) {
		if (e.which == 87 || e.which == 83) {//ww / ss
			get_pic_for_lovely_girl();
		} else if (e.which == 65 || e.which == 68) {//aa / dd
			var num_value = (e.which == 65) ? 0 : 1,
				other_str = "div.lovely_girl img:eq(" + num_value + ")";

			lovely_girl_click($(other_str));
		}
	});
}

createLovelyGirl();

