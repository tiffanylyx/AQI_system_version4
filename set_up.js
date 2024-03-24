// set the dimensions and margins of the graph
const select_date = 129
const scaleFactor = 1.1
const container = d3.select('#daily_chart');

// Get the width of the container div
const containerWidth = container.node().getBoundingClientRect().width;
const containerHeight = container.node().getBoundingClientRect().height;
console.log(containerHeight)
const margin = {top: 0, right: 20, bottom: 0, left: 20},
    width = containerWidth - margin.left - margin.right,
    height = containerHeight - margin.top - margin.bottom,
    innerRadius = 0,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border
// Create SVG canvas
const svg = d3.select('#daily_chart').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2})`);
const barHeight = outerRadius - innerRadius;
const buttun_line_padding = 80
// Sample data
const data = [
  { Type: 'CO', Value: 78 },
  { Type: 'PM2.5', Value: 94 },
  { Type: 'NO2', Value: 117 },
  { Type: 'SO2', Value: 50 },
  { Type: 'PM10', Value: 117 },
  { Type: 'O3', Value: 195 },
];
const rank = [0,50,100,150,200,300,500]
// Create a scale for the angles
const angleScale = d3.scaleBand()
  .range([0, 2 * Math.PI])
  .domain(data.map(d => d.Type))
  .padding(0);

// Create a radial scale for the radius
const radiusScale = d3.scaleLinear()
  .range([innerRadius, outerRadius])
  .domain([0, 500]);

// Function to calculate rotation for each bar
const calculateRotation = d => (angleScale(d.Type) * 180 / Math.PI-90)

const barwidth = 20

let AQI_value = 0
let DP
const circle_bar = svg.append('g')
var layer1 = circle_bar.append('g');
var layer2 = circle_bar.append('g');
var layer3 = circle_bar.append('g');
const csvFile1 = 'Data2.csv';
const csvFile2 = 'info.csv';

// Load both files concurrently
Promise.all([
  d3.csv(csvFile1),
  d3.csv(csvFile2)
]).then(function([dataall, info]) {
  console.log(info)



  // Custom parsing function for "M/D/Y" format
  function parseDate(dateString) {
    const [month, day,year] = dateString.split('/');
    const res  = new Date(year, month - 1, day)//.getDate()
    return res;
  }

  var parseDate1 = d3.timeParse("%m/%d/%Y");

  // Parse the date strings and replace them with Date objects
  dataall.forEach(d => {

    d.Date_org = d.Date;
    //d.Date = parseDate(d.Date).getDate();
    d.Date = parseDate1(d.Date);
    //d.Month = parseDate(d.Date).getDate();
  });

  var data = [];
  for(i in dataall){
    //if(dataall[i].Month == select_month){
      data.push(dataall[i]);
    //}
  }
  data = data.slice(0,-1)
  var allTime = [];
  for(i in data){
    if(!allTime.includes(data[i].Date_org)){allTime.push(data[i].Date_org);}
  }
  var date = allTime[select_date]

  var data_select = [];
  for(i in data){
    if(data[i].Date_org===date){
      data_select.push(data[i])
    }
  }
  var data_for_day = []
  for(i in data_select){
    data_for_day.push({'Type':data_select[i].Type,'Value': parseInt(data_select[i].Value,10)})
  }
  create_rosa(date,data_for_day,info)
  // The scaling factor, e.g., 2 would double size, 0.5 would halve it


  // Apply the scaling transform to a group element that contains all other elements
  svg.attr('transform', `translate(${width / 2}, ${height / 2}) scale(${scaleFactor})`)
})
const floatingDiv = d3.select('#daily_chart').append('div')
    .attr('class', 'floating-div');

const date_text = floatingDiv.append('div')
    .attr('class', 'date-text')


const AQI_text = floatingDiv.append('div')
    .attr('class', 'aqi-value')


const DP_text = floatingDiv.append('div')
    .attr('class', 'pollutant-text')

//create_rosa(data)
function create_rosa(date,data,info){
svg.selectAll("*").remove()

const circle_bar = svg.append('g').attr("id",'circle_bar')
var layer1 = circle_bar.append('g').attr("id",'layer1');
var layer2 = circle_bar.append('g').attr("id",'layer2');
var layer3 = circle_bar.append('g').attr("id",'layer3');
const bars = layer3
  .selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', -barwidth / 2)
  .attr('y', d => -bar_height(d.Value, outerRadius, innerRadius ))
  .attr('rx', barwidth / 5) // Rounded corners
  .attr('ry', barwidth / 5) // Rounded corners
  .attr('width', barwidth)
  .attr('height', d => bar_height(d.Value, outerRadius, innerRadius ))
  .attr('fill', function(d){
    if(AQI_value < parseInt(d.Value)){
      AQI_value = parseInt(d.Value)
      DP = d.Type
    }
    return color_fill(d.Value)
  })
  .attr("stroke", function(d){
    if(d.Type==DP){
      return 'Black'
    }
    else{ return 'None'}
  })
  .attr("stroke-width", function(d){
    if(d.Type==DP){
      return 6
    }
    else{ return 0}
  })
  // First translate to the bottom center, then rotate
  .attr('transform', d => `rotate(${calculateRotation(d)})`);
const circle = layer3.append('circle')
.attr('cx', 0)
.attr('cy', 0)
.attr('r',barwidth)
.attr("fill","white")

const AQI_mark =  layer2.append('circle')
.attr('cx', 0)
.attr('cy', 0)
.attr('r',bar_height(AQI_value, outerRadius, innerRadius ))
.attr("fill","none")
.attr("stroke",color_fill(AQI_value))
.attr("stroke-width",6)

const lines = layer1.append("g")
  .selectAll("line")
  .data(data)
  .join("g")
  .append("line")
  .attr('y1', 0)
  .attr('x1', 0)
  .attr('y2', -bar_height(AQI_value, outerRadius, innerRadius )-buttun_line_padding)
  .attr('x2', 0)
  .attr('transform', d => `rotate(${calculateRotation(d)})`)
  .attr('stroke', d => color_fill(d.Value))
  .attr("stroke-width",3)
  .style("stroke-dasharray", ("5, 5"))
  var yAxis = layer3
      .attr("text-anchor", "middle");

  var yTick = yAxis
    .selectAll("g")
    .data(rank)
    .enter().append("g");

  yTick.append("circle")
      .attr("fill", "none")
      .style("stroke-dasharray", ("1, 5"))
      .attr("stroke", "#555")
      .attr("r", d=>bar_height(d,outerRadius,innerRadius));
  yTick.append("text")
      .data(rank)
      .attr("y", function(d) { return -bar_height(d,outerRadius,innerRadius) })
      .attr("dy", "0.35em")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .text(d => d)
      .attr("class","pullution-axis")
      .style("font-size","14")



  yTick.append("text")
      .data(rank)
      .attr("y", function(d) {
        return -bar_height(d,outerRadius,innerRadius) })
      .attr("dy", "0.35em")
      .text(d => d)
      .attr("class","pullution-axis")
      .style("fill", "#999")
      .style("font-size","16")
      .style("font-weight","300")

// Draw the button background
const padding_h = 30;
const padding_v = 20;
// Add the text to the SVG first to measure it
for (i in data){
  console.log(data[i])
  text_group = layer3.append("g")
      .attr("text-anchor", "middle")
      .attr("transform",  function(){
        var indicate = 1
        if (Math.cos(Math.PI+angleScale(data[i].Type))>0){
          indicate = 1
        }
        else{indicate = -1}
      return `translate(${60*indicate+(bar_height(AQI_value, outerRadius, innerRadius)+buttun_line_padding)*Math.cos(Math.PI+angleScale(data[i].Type))},
      ${(bar_height(AQI_value, outerRadius, innerRadius)+buttun_line_padding)*Math.sin(Math.PI+angleScale(data[i].Type))})`
    })
  text = text_group.append("text")
        .text(function(){
          for(j in info){
            if(data[i].Type==info[j].Name){
              return info[j].Full+' '+data[i].Value + ' ⓘ'}
            }
          }
        )
        .style('fill',function(){
          if(data[i].Type==DP){
            if((AQI_value<101)&&(AQI_value>50)){
              return 'Black'
            }
            else{
              return 'White'
            }
          }
          else{
            return 'Black'
          }
        })

  // Calculate text dimensions
  const bbox = text.node().getBBox();
  const textWidth = bbox.width;
  const textHeight = bbox.height;

  // Create the filter with the id #drop-shadow
  // Set the height and width to 130% to allow for the blur
  var filter = svg.append("defs")
    .append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "120%")
      .attr("width", "120%");

  // SourceAlpha refers to the graphic that this filter will be applied to
  // convolve that with a Gaussian with a standard deviation of 3
  filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 5)
      .attr("result", "blur");

  // Translate the blur
  filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offsetBlur");

  // Add an feMerge node to merge the original source graphic and the
  // blur filter result
  var feMerge = filter.append("feMerge");

  feMerge.append("feMergeNode")
      .attr("in", "offsetBlur")
  feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");
  // Draw the button background behind the text
  text_group.insert('rect', 'text') // Insert rectangle before the text element
      .attr('x', bbox.x - padding_h / 2)
      .attr('y', bbox.y - padding_v / 2)
      .attr('rx', textHeight / 2) // Rounded corners
      .attr('ry', textHeight / 2) // Rounded corners
      .attr('width', textWidth + padding_h)
      .attr('height', textHeight + padding_v)
      .style('fill', function(){
        if(data[i].Type==DP){
          return color_fill(data[i].Value)
        }
        else{
          return 'white'
        }

      } )
      .style('stroke', function(){
        if(data[i].Type!=DP){
          return color_fill(data[i].Value)
        }
        else{
          return 'Black'
        }

      } )
      .style('stroke-width', '3')
  .style('filter', 'url(#drop-shadow)');
      text_group.on('click',function(){
        text = d3.select(this).select('text').text().split(' ')
        text.pop();
        text.pop();
        const newtext = text.join(' ');
        for(i in info){
          if(info[i].Full==newtext){
            console.log(newtext )
            openOverlay(newtext,info[i])
          }
        }

      })


  // Move text to the front if needed (for browsers that don't support 'insert')
  text.raise();


      const points = [
          [0,8*Math.sqrt(3)], // 顶点A
          [16,-8*Math.sqrt(3)], // 顶点B
          [-16,-8*Math.sqrt(3)] // 顶点C
      ]
  if(data[i].Type==DP){
  DP_group = text_group.append("g")
      .attr("text-anchor", "middle")
      .attr("transform",  function(){
      return `translate(${buttun_line_padding/2*Math.cos(Math.PI+angleScale(data[i].Type))},${buttun_line_padding/2*Math.sin(Math.PI+angleScale(data[i].Type))})`
    })
  DP_group.append("polygon")
            .attr("points", points.join(" "))
            .attr("fill", "black")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr('transform', `rotate(${calculateRotation(data[i])})`);}
}

date_text.text(text_to_display(date));

AQI_text.text('AQI: '+AQI_value);

DP_text.text('Driver Pollutant: '+DP);
}


function bar_height(d, max, min){
  return 9*Math.sqrt(d)+barwidth
}

function color_fill(d){
  if(d<51){
    return '#34B274';}
  else if (d<101){return '#FDD000';}
  else if (d<151){return '#F4681A';}
  else if (d<201){return '#D3112E';}
  else if (d<301){return '#8854D0';}
  else if (d<501){return '#731425';}
}

function text_to_display(dateString){
  // Function to parse the date in m/d/y format
const parseDate = d3.timeParse("%m/%d/%y");

// Function to format the date into "Month day, Year" format
// Note: D3 does not have built-in ordinal date formatters (%O),
// so you need to handle that separately
const formatDate = d3.timeFormat("%b %-d, %Y");

// Parse the date string into a date object
const date = parseDate(dateString);

// Create an ordinal suffix for the day
const day = date.getDate();
const suffix = ["th", "st", "nd", "rd"][((day % 100) - 20) % 10] || ["th", "st", "nd", "rd"][day % 100] || "th";

// Format the date into your desired string format, manually adding the ordinal suffix
const formattedDate = formatDate(date).replace(/(\d+),/, `$1${suffix},`);
return formattedDate
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
function openOverlay(buttonText,info) {
  var overlay = document.getElementById('overlay');
  var overlayContent = document.getElementById('overlay-content');
  console.log(info)

  // Set the content of the overlay based on the button's text
  document.querySelector('#overlay-content h2').textContent = info.Full + ' ('+info.Name + ')';
  document.getElementById('h3-left').textContent = 'What is '+info.Name+'?';
  document.getElementById('p-left').textContent = info.What;
  document.getElementById('h3-mid').textContent = 'What causes '+info.Name +'?';
  document.getElementById('p-mid').textContent = info.Where;
  document.getElementById('h3-right').textContent = 'How does '+info.Name +' harm?';
  document.getElementById('p-right').textContent = info.Harm;


  // Show the overlay
  overlay.style.display = 'block';
}
document.addEventListener('DOMContentLoaded', function() {
  // Function to close the overlay
  function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
  }

  // Set up the close icon event listener
  document.getElementById('close-icon').addEventListener('click', closeOverlay);
});
