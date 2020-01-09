var app = new Vue({
	el: "#newslist",
	data: {
		news: initialNews,
		start: 0,
		pageSize: 6,
		category: "all",
		region: "all",
		year: "all",
		month: "-1",
		length: 0,
		activeButton: 1
	},
	computed: {
		items: function () {
			var category = this.category;
			var region = this.region;
			var year = this.year;
			var month = this.month;

			var filtered = this.news.filter(function (n) {
				var retVal = category === "all" || n.category === "all" || category === n.category;
				retVal = retVal && (region === "all" || n.region === "all" || region === n.region);
				if (year != "all") {
					retVal = retVal && (n.newsPublicationDate.getFullYear() == year);
					if (month != "-1")
						retVal = retVal && (n.newsPublicationDate.getMonth() == month);
				}
				return retVal;
			});
			this.length = filtered.length;
			return filtered.slice(this.start, this.start + this.pageSize);
		}
	},
	methods: {
		page: function (event) {
			var text = event.target.textContent;
			if (text == "Prev") {
				--this.activeButton;
				this.activeButton = Math.max(1, this.activeButton);
			}
			else if (text == "Next") {
				++this.activeButton;
				this.activeButton = Math.min(Math.ceil(this.length / this.pageSize), this.activeButton);
			}
			else {
				this.activeButton = parseInt(event.target.textContent);
			}

			this.start = (this.activeButton - 1) * this.pageSize;
			event.preventDefault();
		}
	}
});



window.addEventListener("load", function () {

	document.getElementById("applyButton").addEventListener("click", function () {
		app.start = 0;
		app.category = document.getElementById("categorySelect").value;
		app.region = document.getElementById("regionSelect").value;
		var dateRange = document.getElementById("monthSelect");
		if (dateRange.value == "all") {
			app.month = "all";
			app.year = "all";
		}
		else {
			var o = dateRange.options[dateRange.selectedIndex];
			app.month = o.dataset.month;
			app.year = o.dataset.year;
		}
		app.activeButton = 1;
	});

	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", function () {
		var news = JSON.parse(xhr.responseText);
		news.forEach(function (n) {
			n.newsPublicationDate = new Date(n.newsPublicationDate);
		});
		app.news = news;
	});
	xhr.open("GET", ajaxUrl);
	xhr.send();

	var options = document.querySelectorAll("select#monthSelect option");
	options.forEach(function (o) {
		o.dataset.month =
			["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
				.indexOf(o.textContent);
	})


});
