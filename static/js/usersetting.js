Backbone.emulateHTTP = true;
Backbone.emulateJSON = true;

function open_in_new_tab(url) {
	var win = window.open(url, '_blank');
	win.focus();
}

var User = Backbone.Model.extend({
	initialize : function() {
		//alert('Hey, you create me!');
	},
	url : function() {
		return "../../api/user/index";
	},
	defaults : {
		'first_name' : "default",
		'last_name' : "defalt",
		'email' : "",
		'id' : 0,
	},
});

var user = new User();

var UserSettingView = Backbone.View.extend({
	className : "UserSetting",
	tagName : "div",
	events : {
		"click #logoutButton" : "logOut",
		"click #backupButton" : "backUp",
		"click #restoreButton" : "restore",
		"click #editUserButton" : "editUser",
	},
	initialize : function(options) {
		//var user=new User();

		this.model = user;
		that = this;
		console.log(user.url());
		user.fetch({
			success : function(data) {
				//console.log(data);
				that.render();
				console.log(that.model.get('id'));
			}
		});

	},

	render : function() {
		data = {
			"firstName" : this.model.get('first_name'),
			"lastName" : this.model.get('last_name'),
			"email" : this.model.get('email'),
			"id" : this.model.get('id'),
		};
		console.log(data);
		my = this;
		dust.render("usersetting", data, function(err, out) {
			if (!err) {
				//$("#content").html(out.toString());
				//$('#content').trigger('create');
				$(that.el).html(out.toString());
			} else {
				return console.log(err);
			}
		});

		this.afterrender();
		return $(this.el);

	},
	logOut : function() {
		console.log("logout");
		$.ajax({
			type : "GET",
			url : "http://note.creatzy.com/index.php?/auth/logout",
			success : function(res) {
				setTimeout(function() {
					appRouterInstance.navigate("", {
						trigger : true
					});
				}, 500);

			}
		});
	},
	backUp : function() {
		//$(".meter").css('display','block');
		// $(function() {
		// 	$(".meter > span").each(function() {
		// 		$(this)
		// 			.data("origWidth", $(this).width())
		// 			.width(0)
		// 			.animate({
		// 				width: $(this).data("origWidth")
		// 			}, 1200);
		// 	});
		// });
		// xmlhttp = new XMLHttpRequest();
		// 		xmlhttp.open("GET","http://note.creatzy.com/db/backup",true);
		// 		xmlhttp.send();
		// 		var handle=setInterval(function(){
		// 			$.ajax({
		// 			  type: "GET",
		// 			  url: "http://note.creatzy.com/db/prograss",
		// 			  success:function(data){
		// 			  	if(parseInt(data)!=100) {
		// 			  		console.log(data);
		// 			  		$("#p_bar").width(data+"%");
		// 			  	}
		// 			  	else {
		// 			  		console.log(data);
		// 			  		console.log("cool");
		// 			  		$("#p_bar").width(data+"%");
		// 			  		clearInterval(handle);
		// 			  	}

		// 			  }
		// 			});
		// 		},500);
		$.ajax({
			type : "GET",
			url : "http://note.creatzy.com/db/test_dropbox",
			success : function(res) {
				console.log(res);
				if (res == "access granted") {
					$("a").addClass("ui-disabled");
					$.ajax({
						type : "GET",
						url : "http://note.creatzy.com/db/backup",
						success : function(res) {
							console.log(res);

						},
						beforeSend : function() {
							$.mobile.loading('show', {
								text : 'Loading',
								textVisible : true,
								theme : 'a',
								html : ""
							});
							$("#progressbar").progressbar({
								value : 0
							});
							$("#progressbar").show(500);
							var handle = setInterval(function() {
								$.ajax({
									type : "GET",

									url : "http://note.creatzy.com/db/prograss",
									beforeSend : function() {
									},
									complete : function() {
									},
									success : function(data) {
										if (parseInt(data) < 100) {
											console.log(data);
											//$("#p_bar").width(data + "%");
											$("#progressbar").progressbar({
												value : parseInt(data)
											});
										} else {
											console.log(data);
											console.log("cool");
											$("#progressbar").progressbar({
												value : 100
											});
											$("a").removeClass("ui-disabled");
											clearInterval(handle);
											setTimeout(function() {
											      $("#progressbar").hide(1000);
											}, 1000);
											
										}

									}
								});
							}, 500);
						},
					});
				} else {
					open_in_new_tab("http://note.creatzy.com/db/request_dropbox");
					//window.location = "http://note.creatzy.com/db/request_dropbox";
				}
			}
		});

	},
	restore : function() {
		$.ajax({
			type : "GET",
			url : "http://note.creatzy.com/db/test_dropbox",
			success : function(res) {
				console.log(res);
				if (res == "access granted") {
					$("a").addClass("ui-disabled");
					$.ajax({
						type : "GET",
						url : "http://note.creatzy.com/db/restore",
						success : function(res) {
							console.log(res);
							//$("a").removeClass("ui-disabled");
						},
						beforeSend : function() {
							$.mobile.loading('show', {
								text : 'Loading',
								textVisible : true,
								theme : 'a',
								html : ""
							});
							$("#progressbar").progressbar({
								value : 0
							});
							$("#progressbar").show(500);
							var handle = setInterval(function() {
								$.ajax({
									type : "GET",

									url : "http://note.creatzy.com/db/prograss",
									beforeSend : function() {
									},
									complete : function() {
									},
									success : function(data) {
										if (parseInt(data) < 100) {
											console.log(data);
											//$("#p_bar").width(data + "%");
											$("#progressbar").progressbar({
												value : parseInt(data)
											});
										} else {
											console.log(data);
											console.log("cool");
											$("#progressbar").progressbar({
												value : 100
											});
											$("a").removeClass("ui-disabled");
											clearInterval(handle);
											setTimeout(function() {
											      $("#progressbar").hide(1000);
											}, 1000);
										}

									}
								});
							}, 500);
						},
					});
				} else {
					open_in_new_tab("http://note.creatzy.com/db/request_dropbox");
				}
			}
		});
	},
	editUser : function() {
		console.log("edit user");
		$('#editUserForm').submit(function() {
			console.log($(this).serialize());
			$.ajax({
				data : $(this).serialize(),
				type : 'POST',
				url : $(this).attr('action'),
				success : function(response) {
					console.log(response);
					// if(response == "true"){
					// 	appRouterInstance.navigate("", {
					// 		trigger : true
					// 	});
					// 	$(document).ready(function() {
					// 		$("#homeNavi").removeClass('ui-disabled');
					// 		$("#publicNavi").removeClass('ui-disabled');
					// 		$("#settingNavi").removeClass('ui-disabled');
					// 	});
					// }else{
					// 	return false;
					// }

				}
			});
			return false;
			// cancel original event to prevent form submitting
		});
		$('#editUserForm').submit();
	},
});



var LoginView = Backbone.View.extend({
	className : "Login",
	tagName : "div",
	events : {
		"click #loginSubmit" : "loginSubmit",
		"click #createUser" : "createUser",
	},
	initialize : function(options) {
		this.model = new User();
		that = this;
		
		console.log(user.url());
		this.model.fetch({
			success : function(data) {
				
				console.log("fetch success");
				user = that.model;
				if (that.model.get('id') == '') {
					//that.render();
					that.render();
				} else {
					appRouterInstance.navigate("NoteBookList", {
						trigger : true
					});
					$(document).ready(function() {
						$("#homeNavi").removeClass('ui-disabled');
						$("#publicNavi").removeClass('ui-disabled');
						$("#settingNavi").removeClass('ui-disabled');
					});
				}

			}
		});

	},

	render : function() {
		console.log("render");
		var data = "";
		my = this;
		dust.render("login", data, function(err, out) {
			if (!err) {
				//$("#content").html(out.toString());
				//$('#content').trigger('create');
				$(that.el).html(out.toString());
				$(document).ready(function() {
					$(".ui-btn-active").removeClass('ui-btn-active');
					$("#homeNavi").addClass('ui-disabled');
					$("#publicNavi").addClass('ui-disabled');
					$("#settingNavi").addClass('ui-disabled');
				});
			} else {
				return console.log(err);
			}
		});

		this.afterrender();
		return $(this.el);
	},
	loginSubmit : function() {
		console.log("bind login");
		$('#loginForm').submit(function() {
			console.log($(this).serialize());
			$.ajax({
				data : $(this).serialize(),
				type : 'POST',
				url : $(this).attr('action'),
				success : function(response) {

					appRouterInstance.navigate("NoteBookList", {
						trigger : true
					});
					$(document).ready(function() {
						$("#homeNavi").removeClass('ui-disabled');
						$("#publicNavi").removeClass('ui-disabled');
						$("#settingNavi").removeClass('ui-disabled');
					});
				}
			});
			return false;
			// cancel original event to prevent form submitting
		});
		$('#loginForm').submit();
	},
	createUser : function() {
		appRouterInstance.navigate("NewUser", {
			trigger : true
		});
	},
});



var NewUserView = Backbone.View.extend({
	className : "NewUserView",
	tagName : "div",
	events : {
		"click #createUserButton" : "createUser",
	},
	initialize : function(options) {
	},

	render : function() {

		var data;
		my = this;
		dust.render("newuser", data, function(err, out) {
			if (!err) {
				//$("#content").html(out.toString());
				//$('#content').trigger('create');
				console.log("create user");
				$(my.el).html(out.toString());
			} else {
				return console.log(err);
			}
		});
		this.afterrender();
		return $(this.el);

	},
	createUser : function() {
		console.log("createnew");
		$('#newUserForm').submit(function() {
			$.ajax({
				data : $(this).serialize(),
				type : 'POST',
				url : $(this).attr('action'),
				success : function(response) {

					console.log(response +"dashabi");
					if (response == true) {
						console.log("dashabi");
						appRouterInstance.navigate("", {
							trigger : true
						});
						$(document).ready(function() {
							$("#homeNavi").removeClass('ui-disabled');
							$("#publicNavi").removeClass('ui-disabled');
							$("#settingNavi").removeClass('ui-disabled');
						});
					} else {
						return false;
					}

				}
			});
			return false;
			// cancel original event to prevent form submitting
		});
		$('#newUserForm').submit();
	},
});
