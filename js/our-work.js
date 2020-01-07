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
        }
    }
});    

document.getElementById("filterButton").addEventListener("click", function() {
    app.pageSize = PAGE_SIZE;
    app.category = document.getElementById("categorySelect").value;
    app.region = document.getElementById("regionSelect").value;
    app.activePage = 1;
});
