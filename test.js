// create svg element:
var svg = d3.select("#circle")
.append("svg")
    .attr("width", 600)
    .attr("height", 600)

    // Create a group element and add some shapes to it
    var group = svg.append("g")
        .attr("transform", "translate(100, 100)"); // Initial position of the group

    group.append("rect")
        .attr("width", 100)
        .attr("height", 50)
        .style("fill", "lightblue");

    group.append("circle")
        .attr("cx", 25)
        .attr("cy", 25)
        .attr("r", 20)
        .style("fill", "orange");

    // Define the drag behavior
    var drag = d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);

    // Apply drag behavior to the group
    group.call(drag);
    var currentP;

    // Drag start event handler
    function dragStarted() {
      currentP = parseTransform(d3.select(this).attr("transform"));
      console.log(currentP)
      var clonedElement = d3.select(this.cloneNode(true)).attr("class","clone");
       svg.node().appendChild(clonedElement.node());
        d3.select(this).raise().classed("active", true);
    }

    // Dragging event handler
    function dragged(event, d) {
        d3.select(this).attr("transform", "translate(" + event.x + "," + event.y + ")");
    }

    // Drag end event handler
    function dragEnded() {
        d3.select(this).attr("transform", "translate(" + currentP[0] + "," + currentP[1] + ")");
        d3.select(this).classed("active", false);
        svg.selectAll(".clone").remove()
    }

        // Function to parse the transform attribute and extract the position
    function parseTransform(transform) {
        var translate = transform.match(/translate\(([^)]+)\)/)[1].split(",");
        var x = parseFloat(translate[0]);
        var y = parseFloat(translate[1]);
        return [x, y];
    }
