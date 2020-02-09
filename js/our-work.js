document.addEventListener("DOMContentLoaded", function () {
	var PAGE_SIZE = 12;

	var urlArgs = function () {
		var args = {};
		var query = location.search.substring(1);
		var pairs = query.split("&");
		pairs.forEach(function (pair) {
			var pos = pair.indexOf("=");
			if (pos == -1)
				return;
			var name = pair.substring(0, pos);
			var value = pair.substring(pos + 1);
			value = decodeURIComponent(value);
			args[name] = value;
		});
		return args;
	}

	var args = urlArgs();
	args.region = args.region || "all";
	args.category = args.category || "all";
	document.getElementById("categorySelect").value = args.category;
	document.getElementById("regionSelect").value = args.region;

	var projectsFeed = JSON.parse(document.getElementById("projectJson").textContent);


	var app = new Vue({
		el: "#projectList",
		data: {
			projects: projectsFeed,
			pageSize: PAGE_SIZE,
			activePage: 1,
			category: args.category,
			region: args.region,
			length: 0
		},
		computed: {
			items: function () {
				var category = this.category;
				var region = this.region;

				var filtered = this.projects.filter(function (p) {
					var retVal = (category === "all" || p.categories.indexOf(category) > -1);
					retVal = retVal && (region === "all" || p.regions.indexOf(region) > -1);
					return retVal;
				});
				this.length = filtered.length;
				return filtered.slice(0, this.pageSize);
			}
		},
		methods: {
			more: function () {
				this.pageSize += PAGE_SIZE;
			}
		}
	});

	document.getElementById("filterButton").addEventListener("click", function () {
		app.pageSize = PAGE_SIZE;
		app.category = document.getElementById("categorySelect").value;
		app.region = document.getElementById("regionSelect").value;
		app.activePage = 1;
	});

});