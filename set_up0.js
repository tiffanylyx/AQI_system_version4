// set the dimensions and margins of the graph
const margin = {top: 100, right: 20, bottom: 50, left: 20},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    innerRadius = 60,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border
// Create SVG canvas
const svg = d3.select('#daily_chart').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2})`);
const barHeight = outerRadius - innerRadius;
// Sample data
const data = [
  { name: 'CO', value: 78 },
  { name: 'PM2.5', value: 94 },
  { name: 'NO2', value: 117 },
  { name: 'SO2', value: 50 },
  { name: 'PM10', value: 117 },
  { name: 'O3', value: 195 },
];

// Create a scale for the angles
const angleScale = d3.scaleBand()
  .range([0, 2 * Math.PI])
  .domain(data.map(d => d.name))
  .padding(0.1);

// Create a radial scale for the radius
const radiusScale = d3.scaleLinear()
  .range([innerRadius, outerRadius])
  .domain([0, d3.max(data, d => d.value)]);

// Create the arcs
const arcGenerator = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(d => radiusScale(d.value))
  .startAngle(d => angleScale(d.name))
  .endAngle(d => angleScale(d.name) + angleScale.bandwidth())
  .padAngle(0.1)
  .padRadius(innerRadius);

// Draw the bars
svg.append('g')
  .selectAll('path')
  .data(data)
  .enter()
  .append('path')
  .attr('d', arcGenerator)
  .attr('fill', (d, i) => d3.schemeCategory10[i % 10]);

function color_fill(d){
  if(d<51){
    return '#34B274';}
  else if (d<101){return '#FDD000';}
  else if (d<151){return '#F4681A';}
  else if (d<201){return '#D3112E';}
  else if (d<301){return '#8854D0';}
}

function color_text(d){
  if(d<51){
    return '#288a59';}
  else if (d<101){return '#cca700';}
  else if (d<151){return '#db530a';}
  else if (d<201){return '#a50d24';}
  else if (d<301){return '#6831b4';}
}

// color palette
color_bar = d3.scaleOrdinal()
  .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#731425'])



function cal_opacity(d){
  if(d<51){
    return d/50;}
  else if (d<101){return d/100;}
  else if (d<151){return d/150;}
  else if (d<201){return d/200;}
  else if (d<301){return d/300;}
}

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this);
        var words = text.text().split(/\s+/).reverse();
        var lineHeight = 1.1; // ems
        var y = text.attr("y");
        var x = text.attr("x");
        var dy = parseFloat(text.attr("dy") || 0);
        var tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        var word;
        var line = [];
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++dy + "em").text(word);
            }
        }
    });
}
const rank = [50,100,150,200,300,500]
