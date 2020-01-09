var PAGE_SIZE = 6;
var app = new Vue({
    el: "#projectList",
    data: {
        projects: JSON.parse(document.getElementById("projectJson").textContent),
        pageSize: PAGE_SIZE,
        activePage: 1,
        category: "all",
        region: "all",
        length: 0
    },
    computed: {
        items: function() {
            var category = this.category;
            var region = this.region;
            
            var filtered = this.projects.filter(function(p) {
                var retVal = (category === "all" || p.category === category);
                retVal = retVal && (region === "all" || p.region === "all" || p.region === region);
                return retVal;
            });
            this.length = filtered.length;
            return filtered.slice(0, this.pageSize);
        }
    },
    methods: {
        more: function() {
            this.pageSize += PAGE_SIZE;
        },
		truncate: function (html, length) {
			length = (typeof length == 'undefined' ? 75 : length);/*default value is 75*/
			var div = document.createElement("div");
			div.innerHTML = html;
			// add a space after each element in case we got adjacent elements, we don't want the text to run into each other
			div.querySelectorAll("*").forEach(function (e) {
				e.textContent += " ";
			});
			var retVal = div.textContent;
			retVal.replace(/\s{2}/g, " ");// remove double whitespace
			if (retVal.length > length) // truncate
				retVal = retVal.substr(0, retVal.lastIndexOf(" ", length)) + "…";
			return retVal;
		}
    }
});    

document.getElementById("filterButton").addEventListener("click", function() {
    app.pageSize = PAGE_SIZE;
    app.category = document.getElementById("categorySelect").value;
    app.region = document.getElementById("regionSelect").value;
    app.activePage = 1;
});
