document.addEventListener("DOMContentLoaded", function() {

	var stories = JSON.parse(document.getElementById("storiesJson").textContent);


    var creators = [];
    stories.forEach(function(s) {
        s.updated = new Date(s.updated); // fix date type
        
				if (creators.indexOf(s.creator) == -1)
						creators.push(s.creator);
        
        // create a thumbnail from the first picture we find in the content
        var e = document.createElement("div");
        e.innerHTML = s.content;
        s.img = e.querySelector("img").outerHTML;
    });

    creators.sort();
    creators.unshift("all");
    var options = creators.map(function(c) {
        var key = c.charAt(0).toUpperCase() + c.slice(1);
        key = key.replace(/-/g, " ");
        return {text: key, value: c}
    });

    var app = new Vue({
        el: "#storyContent",
        data: {
            length: stories.length,
            pageSize: 6,
            pageNum: 1,
            creator: "all",
            options: options
        },
        computed: {
            items: function() { 
                var filtered = [];
                for (var i = 0; i < stories.length; ++i) {
                    if (this.creator == "all" || stories[i].creator == this.creator)
                        filtered.push(stories[i])
                }

                this.length = filtered.length;
                var startIndex = (this.pageNum - 1) * this.pageSize;
                var sliced = filtered.slice(startIndex, startIndex + this.pageSize);
                return sliced;
            }
        },
        methods: {
            page: function(event) {
                var text = event.target.textContent;
                if (text == "Prev") {
                    --this.pageNum;
                    this.pageNum = Math.max(1, this.pageNum);
                }
                else if (text == "Next") {
                    ++this.pageNum;
                    this.pageNum = Math.min(Math.ceil(this.length / this.pageSize), this.pageNum);
                }
                else {
                    this.pageNum = parseInt(text);
                }
                
                event.preventDefault();
            },
            
            filter: function(event) {
                this.creator = document.getElementById("categorySelect").value; // misnamed in document, should be creatorSelect
                this.pageNum = 1;
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
    		},
    		formatDate: function(d) {
    		    var a = d.substring(4).split(" ");
    		    a[1] = a[1].replace(/^0/, "");
    		    a[1] += ",";
    		    return a.join(" ");
    		}
        }
    });
});    
    