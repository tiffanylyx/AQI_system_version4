// set the dimensions and margins of the graph
const select_date = 193
const scaleFactor = 0.85
const container = d3.select('#bar_chart');

// Get the width of the container div
const containerWidth = container.node().getBoundingClientRect().width;
const containerHeight = container.node().getBoundingClientRect().height;
console.log(containerHeight)
const margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = containerWidth - margin.left - margin.right,
    height = containerHeight - margin.top - margin.bottom,
    innerRadius = 0,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border
// Create SVG canvas
const svg = d3.select('#bar_chart').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2})`);
const barHeight = outerRadius - innerRadius;
const buttun_line_padding = 80
// Sample data
const data = [
  { Type: 'NO2', Value: 78 },
  { Type: 'O3', Value: 94 },
  { Type: 'CO', Value: 117 },
  { Type: 'PM10', Value: 50 },
  { Type: 'PM2.5', Value: 117 },
  { Type: 'SO2', Value: 195 },
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

var barwidth = 120
var padding_bar = 80

let AQI_value = 0
let DP
const info_group = svg.append('g')
const bars_group = svg.append('g')

const csvFile1 = 'data_2023.csv';
const csvFile2 = 'info.csv';
var explain_text
var back = 0
// Load both files concurrently
Promise.all([
  d3.csv(csvFile1),
  d3.csv(csvFile2)
]).then(function([dataall, info]) {


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
  var bars
  var labels1, labels2
  var arrow
  var barGroups
  var AQI_line_0
  var AQI_text_0
  var AQI_y
  var circle_bar

  explain_text = svg.append('g').append('text').text("happy").attr('x',0)
  .attr('y',-height/4).attr("class",'semi-title').style("text-anchor","middle")

  initial(date, data_for_day, info)
  create_number(date, data_for_day, info)
  // Store the functions in an array
  const functionsArray = [
      { func: create_number, args: [date,data_for_day,info] },
      { func: color_code, args: [date,data_for_day,info] },
      { func: create_bar, args: [date,data_for_day,info] },
      { func: move_bar, args: [date, data_for_day, info,80] },
      { func: stack, args: [80] },
      { func: add_rosa, args: [date,data_for_day,info] },
  ];

  // Initialize the current index
  let currentIndex = 0;

  // Function to run the function at the current index
  function runFunctionAtIndex() {
      const functionObject = functionsArray[currentIndex];
      functionObject.func.apply(null, functionObject.args);
  }

  function updateProgressIndicator() {
      // Get all the dots
      const dots = document.querySelectorAll('.progress-dot');

      // Remove 'active' class from all dots
      dots.forEach(dot => {
          dot.classList.remove('active');
      });

      // Add 'active' class to the current dot
      dots[currentIndex].classList.add('active');
  }

  // Run the updateProgressIndicator function initially to set the first step active
  updateProgressIndicator();

  let timer; // Declare a variable to hold the reference to the timeout

  function resetTimer() {
    clearTimeout(timer); // Clear the existing timer
    timer = setTimeout(() => {
      document.getElementById('nextButton').click(); // Programmatically click the next button
    }, 10000); // Set a new timer for 45 seconds
  }
  // Initialize the timer when the page loads
  resetTimer();

  // Modified event listener for the next button
  document.getElementById('nextButton').addEventListener('click', () => {
    if (currentIndex < functionsArray.length - 1) { // Check if currentIndex is less than the last index
      currentIndex++; // Increment currentIndex
      runFunctionAtIndex();
      updateProgressIndicator(); // Call this function to update the visual progress indicator
    }
    resetTimer(); // Reset the timer each time the next button is clicked
  });

  // Modified event listener for the previous button
  document.getElementById('previousButton').addEventListener('click', () => {
    if (currentIndex > 0) { // Check if currentIndex is greater than 0
      currentIndex--; // Decrement currentIndex
      runFunctionAtIndex();
      updateProgressIndicator(); // Call this function to update the visual progress indicator
    }
    resetTimer(); // Reset the timer each time the previous button is clicked
  });

})

function initial(date, data, info){
  barGroups = bars_group
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr("transform", function(d,i) {
      return `translate(${(i-5/2)*(padding_bar+barwidth)-50},0)`;
    })

  // Append a rect to each group
  bars = barGroups.append('rect')
    .attr('x', 0)
    .attr('y', -40)
    .attr('rx', barwidth / 5) // Rounded corners
    .attr('ry', barwidth / 5) // Rounded corners
    .attr('width', barwidth)
    .attr('height', 0)
    .attr('fill','None')
    .attr('stroke','black')


  // Now append a text element to each group
  labels1 = barGroups.append('text')
    .attr("x", barwidth / 2) // Position the text in the center of the rect
    .attr("y", -8) // Adjust the position accordingly
    .attr("text-anchor", "middle") // Center the text
    .attr("dominant-baseline", "central") // Vertically center the text
    .text(function(d) {
      return d.Type; // Assuming each datum has a label property
    })
    .attr("fill", 'black')
    .attr('class','main_text')
    .style('opacity',0)

  // Now append a text element to each group
  labels2 = barGroups.append('text')
    .attr("x", barwidth / 2) // Position the text in the center of the rect
    .attr("y",20) // Adjust the position accordingly
    .attr("text-anchor", "middle") // Center the text
    .attr("dominant-baseline", "central") // Vertically center the text
    .text(function(d) {
      return d.Value; // Assuming each datum has a label property
    })
    .attr("fill", 'black')
    .attr('class','sub_title')
    .style('opacity',0)

  }
function create_number(date, data, info){

  // Append a rect to each group
  bars.attr('height', 80).attr('y',-40)
  labels1.style('opacity',1)
  labels2.style('opacity',1)


}
function color_code(date, data, info){
  explain_text.text('We color-code the number according to their value to represent how harmful the pollution situation is to our life.')

  // Append a rect to each group
  bars
  .transition()
  .duration(1000)
  .attr('height', 80).attr('y',-40)
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

    labels1.attr("fill", function(d){
      if((d.Value<101)&&(d.Value>50)){
        return 'black'
      }
      else{
        return 'white'
      }
    })
    labels2.attr("fill", function(d){
      if((d.Value<101)&&(d.Value>50)){
        return 'black'
      }
      else{
        return 'white'
      }
    })
}
function create_bar(date, data, info){
  explain_text.text('What if for each pollutant we create a bar, and use the AQI value as each bar’s height? ')
  console.log('create_bar')
  bars
  .transition()
  .duration(1000)
  .style('opacity',1)
  .attr('height',d => bar_height_bar(d.Value, outerRadius, innerRadius ))
  .attr('y',d => 50-bar_height_bar(d.Value, outerRadius, innerRadius ))
  labels1
  .transition()
  .delay(function(d,i) {
    return i * 100; // Delay each subsequent bar by an additional 100ms
  })
  .duration(800)
  .attr('y', -8)
labels2
.transition()
.delay(function(d,i) {
  return i * 100; // Delay each subsequent bar by an additional 100ms
})
.duration(800)
.attr('y',20)
info_group.selectAll("*").remove()
}
function move_bar(date, data, info,distance){
explain_text.text('And of AQI of Day would be the WORST case, which is 195!!! This is Unhealthy for general public!')

info_group.selectAll("*").remove()
  barwidth = 120
  padding_bar = 80
  barGroups
  .transition()
  .delay(function(d,i) {
    return i * 100; // Delay each subsequent bar by an additional 100ms
  })
  .duration(800)
  .attr("transform", function(d,i) {
    return `translate(${(i-5/2)*(padding_bar+barwidth)-50},0)`;
  });

  console.log('move_bar')
  bars
  .transition()
  .delay(function(d,i) {
    return i * 100; // Delay each subsequent bar by an additional 100ms
  })
  .duration(800)
  .attr('width',barwidth)
  .attr('y',d => distance+50-bar_height_bar(d.Value, outerRadius, innerRadius ))
  if(back==0){
  labels1
  .transition()
  .delay(function(d,i) {
    return i * 100; // Delay each subsequent bar by an additional 100ms
  })
  .duration(800)
  .attr('y', function() {
    // Get the current 'y' value and parse it to an integer, then add 50
    return parseInt(d3.select(this).attr('y')) + distance;})
  labels2
  .transition()
  .delay(function(d,i) {
    return i * 100; // Delay each subsequent bar by an additional 100ms
  })
  .duration(800)
  .attr('y', function() {
    // Get the current 'y' value and parse it to an integer, then add 50
    return parseInt(d3.select(this).attr('y')) + distance;})
    back = 1
  }
  else{
      labels1.attr("x", barwidth / 2).attr("y", distance-5).style('font-size',22)
      labels2.attr("x", barwidth / 2).attr("y", distance+20).style('font-size',28)
      back = 0

  }

arrow= d3.arrow1()
   .id("my-arrow-9")
info_group.call(arrow);
AQI_y = distance+50-bar_height_bar(AQI_value, outerRadius, innerRadius )
AQI_line_0 = info_group
.append("polyline")
      .attr("marker-end", `url(#${arrow.id()})`)
      .attr("points", [[(5/2)*(padding_bar+barwidth)-50+barwidth, AQI_y],
      [(-5/2)*(padding_bar+barwidth)-75, AQI_y]])
      .attr("stroke", color_fill(AQI_value)) // arrow.attr can also be used as a getter
      .attr("fill", color_fill(AQI_value))
      .attr("stroke-width", 5)
      .attr("opacity",1)

AQI_text_0 = info_group.append("text")
.attr("class","sub_title")
.attr("x",0)
.attr("y",AQI_y-20 )
.attr("text-anchor", "middle")
.text("AQI = "+AQI_value)
.attr('fill',color_fill(AQI_value))
.attr("opacity",1)
info_group
.attr('opacity',0)
.transition()
  .delay(1000)
  .duration(800)
  .attr('opacity',1)

}

function stack(distance){
  console.log('stack')

  d3.select('#bar_chart').select('svg').select('#circle_bar').remove()
  barwidth = 50
  padding_bar = 20
  move_x = 350


  barGroups
  .transition()
  .delay(function(d,i) {
    return i * 100; // Delay each subsequent bar by an additional 100ms
  })
  .duration(800)
  .attr('y', function() {
    // Get the current 'y' value and parse it to an integer, then add 50
    return parseInt(d3.select(this).attr('y')) + distance;})
  .attr("transform", function(d,i) {
      return `translate(${(i-5/2)*(padding_bar+barwidth)-move_x},0)`;
    })


  bars
  .transition()
  .delay(function(d,i) {
    return i * 100; // Delay each subsequent bar by an additional 100ms
  })
  .duration(800)
  .attr('width',barwidth)
  .attr('rx', barwidth / 5) // Rounded corners
  .attr('ry', barwidth / 5) // Rounded corners

  labels1.attr("x", barwidth / 2) .attr("y", distance).style('font-size',16)
  labels2.attr("x", barwidth / 2) .attr("y", distance+20).style('font-size',16)

  AQI_line_0
  .transition()
  .duration(800)
  .attr("points", [[(5/2)*(padding_bar+barwidth)-move_x+barwidth, AQI_y],
  [(-5/2)*(padding_bar+barwidth)-move_x, AQI_y]])

  AQI_text_0
  .transition()
  .duration(800)
  .attr("x",barwidth/2-move_x)
  // Define the blink function
}

function add_rosa(date,data,info){
  explain_text
  .text('We can further arrange the bars in to a circle by rounding the x-axis. Now the daily AQI is represented in the flower-like shape.')
  .transition()
  .duration(800)
  .attr('y',-height*0.4)

  console.log('add_rosa')
  function blinkBar(index,blinkCount) {
    blinkDuration = 500
    const numberOfBlinks = 1;
    // Check if the current index exceeds the number of bars
    if (index >= bars.size()) {
      return; // Stop the recursion if we've blinked all bars
    }
    // Select the current bar using the index
    const currentBar = bars.filter((d, i) => i === index);
    const currentlabel1 = labels1.filter((d, i) => i === index);
    const currentlabel2 = labels2.filter((d, i) => i === index);

    // Perform a single blink cycle (fade out and in)
    currentBar.transition()
      .duration(blinkDuration)
      .attr('opacity', 0) // Fade to transparent
      .transition()
      .duration(blinkDuration)
      .attr('opacity', 1) // Fade back to original color
      .on('end', () => {
        if (blinkCount < numberOfBlinks - 1) {
          // If we haven't reached the desired number of blinks, blink again
          blinkBar(index, blinkCount + 1);
        } else {
          // Move to the next bar once we've reached the desired number of blinks
          blinkBar(index + 1, 0);
        }
      });
    // Perform a single blink cycle (fade out and in)
    currentlabel1.transition()
      .duration(blinkDuration)
      .attr('opacity', 0) // Fade to transparent
      .transition()
      .duration(blinkDuration)
      .attr('opacity', 1) // Fade back to original color
      .on('end', () => {
        if (blinkCount < numberOfBlinks - 1) {
          // If we haven't reached the desired number of blinks, blink again
          blinkBar(index, blinkCount + 1);
        } else {
          // Move to the next bar once we've reached the desired number of blinks
          blinkBar(index + 1, 0);
        }
      });
  // Perform a single blink cycle (fade out and in)
  currentlabel2.transition()
    .duration(blinkDuration)
    .attr('opacity', 0) // Fade to transparent
    .transition()
    .duration(blinkDuration)
    .attr('opacity', 1) // Fade back to original color
    .on('end', () => {
      if (blinkCount < numberOfBlinks - 1) {
        // If we haven't reached the desired number of blinks, blink again
        blinkBar(index, blinkCount + 1);
      } else {
        // Move to the next bar once we've reached the desired number of blinks
        blinkBar(index + 1, 0);
      }
    });
  }

  // Start the blinking effect with the first bar and initial blink count of 0
  blinkBar(0, 0);
  AQI_line_0.transition()
    .delay(6*2000) // Initial delay of 6000ms
    .duration(500) // Duration of the color change
    .style('opacity', 0) // Change color to blinkColor
    .transition() // Chain another transition to return to the original color
    .duration(500) // Duration of the return transition
    .style('opacity', 1) // Change the color back to originalColor
    .transition() // Chain another transition to return to the original color
    .duration(500) // Duration of the return transition
    .style('opacity', 0) // Change the color back to originalColor
    .transition() // Chain another transition to return to the original color
    .duration(500) // Duration of the return transition
    .style('opacity', 1) // Change the color back to originalColor
  create_rosa(date,data,info)


}
//create_rosa(data)
function create_rosa(date,data,info){

circle_bar = d3.select('#bar_chart').select('svg').append('g').attr("id",'circle_bar').attr("transform",`translate(${width*0.6}, ${height / 2})`)
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
  .attr('transform', d => `rotate(${calculateRotation(d)})`)
  .style('opacity',0)
  .transition()
  .delay(function(d, i) {
    return i * 1000; // Delay each subsequent bar by an additional 100ms
  })
  .duration(800)
  .style('opacity',1)

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
.style('opacity',0)
.transition()
.delay(function() {
  return 6 * 1000; // Delay each subsequent bar by an additional 100ms
})
.duration(800)
.style('opacity',1)
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
  .style('opacity',0)
  .transition()
  .delay(function(d,i) {
    return i * 1000; // Delay each subsequent bar by an additional 100ms
  })
  .duration(800)
  .style('opacity',1)
  var yAxis = layer3
      .attr("text-anchor", "middle");

  var yTick = yAxis
    .selectAll("g")
    .data(rank)
    .enter().append("g");

  yTick.append("circle")
      .attr("fill", "none")
      .style("stroke-dasharray", ("2, 6"))
      .attr("stroke", "#003E93")
      .attr("opacity",0.5)
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
      .style("fill", "#002A62")
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
      return `translate(${20*indicate+(bar_height(AQI_value, outerRadius, innerRadius)+buttun_line_padding)*Math.cos(Math.PI+angleScale(data[i].Type))},
      ${(bar_height(AQI_value, outerRadius, innerRadius)+buttun_line_padding)*Math.sin(Math.PI+angleScale(data[i].Type))})`
    })

    text = text_group.append("text").attr("x", 0) // Set the x position of the text element
    .attr("y", 0) .style("dominant-baseline", "middle")

    text.append("tspan")
      .text(function() {
        var textContent = '';
        for (var j in info) {
          if (data[i].Type === info[j].Name) {
            textContent = info[j].Full + ' (' + info[j].Name + ') ';
            break; // Exit the loop once the match is found
          }
        }
        return textContent;
      })
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
      .style("font-size",'16px')
      .style('opacity',0)
      .transition()
      .delay(function() {
        return i * 1000; // Delay each subsequent bar by an additional 100ms
      })
      .duration(800)
      .style('opacity',1)
    text.append("tspan")
    .text(data[i].Value)
    .style("font-size", "30px") // Smaller font size for the AQI range
      .attr("dx", "0.3em").style('fill',function(){
        if(data[i].Type==DP){
          if((AQI_value<101)&&(AQI_value>50)){
            return 'Black'
          }
          else{
            return 'White'
          }
        }
        else{
          return color_fill(data[i].Value)
        }
      })
      .style("font-weight", "bold")
      .style('opacity',0)
      .transition()
      .delay(function() {
        return i * 1000; // Delay each subsequent bar by an additional 100ms
      })
      .duration(800)
      .style('opacity',1)


  // Calculate text dimensions
  const bbox = text.node().getBBox();
  const textWidth = bbox.width;
  const textHeight = bbox.height;

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
      .style('opacity',0)
      .transition()
      .delay(function() {
        return i * 1000; // Delay each subsequent bar by an additional 100ms
      })
      .duration(800)
      .style('opacity',1)

  text_group = layer3.append("g")
      .attr("transform",  function(){
        var indicate = 1
        if (Math.cos(Math.PI+angleScale(data[i].Type))>0){
          indicate = 1}
        else{indicate = -1}
      return `translate(${(textWidth+padding_h)*indicate+(bar_height(AQI_value, outerRadius, innerRadius)+buttun_line_padding)*Math.cos(Math.PI+angleScale(data[i].Type))},
      ${(bar_height(AQI_value, outerRadius, innerRadius)+buttun_line_padding)*Math.sin(Math.PI+angleScale(data[i].Type))})`
    })


    if(data[i].Type==DP){
    DP_group = text_group.append("g")
    .attr("text-anchor", "middle").attr("transform", function(){
      var indicate = 1
      if (Math.cos(Math.PI+angleScale(data[i].Type))>0){
        indicate = 1}
      else{indicate = -1}
    return `translate(${-indicate*70},${indicate*50})`})

    DP_info = DP_group.append("text").attr("x",80).attr("y",10);
      DP_group.append("path")
      .attr("d", "M 0,-12.5 L -14,12.5 H 14 Z") // Triangle path with the tip centered at (0,0)
      .attr("fill", color_fill(AQI_value))
      .style("opacity",0)
      .transition()
      .delay(function() {
        return i * 1000; // Delay each subsequent bar by an additional 100ms
      })
      .duration(800)
      .style("opacity",1)
    // Draw the exclamation mark using rectangles for simplicity
    DP_group.append("rect")
      .attr("x", -1.5) // X position (centered at 0,0)
      .attr("y", -7) // Y position (above the bottom)
      .attr("width", 3) // Width of the exclamation mark
      .attr("height", 12) // Height of the exclamation mark's stick
      .attr("fill", "#fff") // Fill with white color
      .style("opacity",0)
      .transition()
      .delay(function() {
        return i * 1000; // Delay each subsequent bar by an additional 100ms
      })
      .duration(800)
      .style("opacity",1)

    DP_group.append("rect")
      .attr("x", -1.5) // X position (centered at 0,0)
      .attr("y", 7) // Y position (above the bottom)
      .attr("width", 3) // Width of the exclamation mark's dot
      .attr("height", 3) // Height of the exclamation mark's dot
      .attr("fill", "#fff")
      .style("opacity",0)
      .transition()
      .delay(function() {
        return i * 1000; // Delay each subsequent bar by an additional 100ms
      })
      .duration(800)
      .style("opacity",1)

      DP_info.append("tspan")
      .text(" Driver Pollutant")
      .style("font-weight", "bold")
      .style("fill", color_fill(AQI_value))

      const bbox = DP_group.node().getBBox();
      const textWidth = bbox.width;
      const textHeight = bbox.height;
      DP_group.attr("text-anchor", "middle").attr("transform", function(){
            var indicate = 1
            if (Math.cos(Math.PI+angleScale(data[i].Type))>0){
              indicate = 1}
            else{indicate = -1}
            return `translate(${-textWidth*2.3},${indicate*(textHeight+15)})`})
            .style("opacity",0)
                .transition()
                .delay(function() {
                  return i * 1000; // Delay each subsequent bar by an additional 100ms
                })
                .duration(800)
                .style("opacity",1)

        }
}


circle_bar.attr('transform', `translate(${width*0.65}, ${height / 2}) scale(${0.85})`)
}

function bar_height_bar(d, max, min){
  return 4.5*Math.pow(d,0.65)+barwidth/2
}
function bar_height(d, max, min){
  return 4.5*Math.pow(d,0.65)+barwidth
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
