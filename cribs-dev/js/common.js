var headerHidingButton = document.querySelector(".header-form__switch");
var headerForm = document.querySelector(".hidden-block");

headerHidingButton.onclick = function() {
	this.classList.toggle("clicked");
	headerForm.classList.toggle("hiding-part");
};


var contentHidingButtons = document.querySelectorAll(".content-elem__switch");
var contentOl = document.querySelectorAll(".content-elem__ol");


for(var i = 0; i < contentHidingButtons.length; i++) {
	contentHidingButtons[i].onclick = function() {
		this.classList.toggle("switch-on");
	}
};















