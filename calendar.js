var select_month = 5

const svg_calender = d3.select('#calender').append('svg')
const svg_header= svg_calender.append('g')
const svg_date = svg_calender.append('g')

// Set the dimensions for each day cell and the SVG canvas size
const dayWidth = 100;
const dayHeight = 98;
const margin_top = 0
svg_header.attr('transform', `translate(0, ${margin_top})`);
svg_date.attr('transform', `translate(0, ${margin_top+dayHeight / 2})`);
svg_calender.attr("width", dayWidth * 7) // 7 days for a week
  .attr("height", dayHeight*7); // 6 rows to accommodate all days

  // Create a group for each cell in the calendar
  const day_array = ['Sun','Mon','Tue','Wed','Thur','Fri', 'Sat']


  const cells_day = svg_header.selectAll("g")
    .data(day_array)
    .enter()
    .append("g")
    .attr("transform", (d, i) => {
      const x = (i % 7) * dayWidth; // Calculate x based on the day of the week
      const y = (Math.floor(i / 7)) * dayHeight*0.4; // Calculate y based on the week
      return `translate(${x}, ${y})`;
    });

  // Add rectangles for each day cell
  cells_day.append("rect")
    .attr("width", dayWidth - 1) // Subtract 1 for grid gap
    .attr("height", dayHeight/2 - 1)
    .style("fill", "none")
    .style("stroke", "none");

  // Add text labels for each day
  cells_day.append("text")
    .attr("x", dayWidth / 2)
    .attr("y", dayHeight/2 / 2)
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em") // Vertical alignment
    .text(d => d)
    .attr('class','semi-title')
d3.csv("Data2.csv").then( function(data) {
  data.forEach(function(d) {
    d.Date_org = d.Date
    d.Date = d3.timeParse("%m/%d/%y")(d.Date);
  });
  year = 2023
  d3.select('#calendar-title')
  .text(new Date(year, select_month)
  .toLocaleString('en-us', { month: 'long' }) + " " + year)

  create_calender(select_month,data)
  // Click event handler for the previous month button
  d3.select('#prev-month-btn').on('click', function() {
    // Decrement the month and update year if needed
    select_month--;
    if (select_month < 0) {
      select_month = 11;
      year--;
    }
    console.log(select_month)
    create_calender(select_month,data)
  });

  // Click event handler for the next month button
  d3.select('#next-month-btn').on('click', function() {
    // Increment the month and update year if needed
    select_month++;
    if (select_month > 11) {
      select_month = 0;
      year++;
    }
    create_calender(select_month,data)
  });

})
function create_calender(select_month,data){
  svg_date.selectAll('*').remove()
  d3.select('#calendar-title').text(new Date(year, select_month).toLocaleString('en-us', { month: 'long' }) + " " + year);

// Filter for the month of February
const monthData = data.filter(d => d.Date.getMonth() === select_month); // Month is zero-indexed, 1 = February

var data_for_day = []

// Define the start date of the month and the number of days in July 2023
const startDate = new Date(2023, select_month, 1); // Months are zero-indexed, 6 represents July
const daysInMonth = new Date(2023, select_month+1, 0).getDate(); // Get the last day of July

// Get the day of the week for July 1st, 2023
const startDay = startDate.getDay(); // For July 1st, 2023, this should be 6 (Saturday)

// Calculate the total number of calendar cells needed (including leading/trailing dates)
const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

// Generate an array for all the cells in the calendar
const calendarArray = Array.from({ length: totalCells }).map((_, i) => {
  let day = i - startDay + 1; // Calculate the day number
  return day > 0 && day <= daysInMonth ? day : ""; // Return day number or empty string
});

for(i in calendarArray){

  cell = svg_date.append("g")
  .attr("transform", function(){
    const x = (i % 7) * dayWidth; // Calculate x based on the day of the week
    const y = (Math.floor(i / 7)) * dayHeight; // Calculate y based on the week
    return `translate(${x}, ${y})`;
  });
  cell.append("rect")
    .attr('id','edge')
    .attr("width", dayWidth - 1) // Subtract 1 for grid gap
    .attr("height", dayHeight - 1)
    .style("fill", "none")
    .style("stroke", "none");
  cell.append("text")
    .attr("x", dayWidth / 2)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em") // Vertical alignment
    .text(calendarArray[i])
    .attr('class','note')

  var data_for_day = []

  if(calendarArray[i]>0){
    data_for_day = monthData.filter(d => d.Date.getDate() === calendarArray[i])
    create_rosa_small(data_for_day[0].Date_org,data_for_day,cell)
  }

}
}


function create_rosa_small(date,data,group){
  barwidth = 35
  AQI_value = 0
const circle_bar = group.append('g').attr("id",'circle_bar').attr("transform",`translate(${dayWidth/2}, ${dayHeight/2})`)
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
    if(AQI_value<parseInt(d.Value)){
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
      return 10
    }
    else{ return 0}
  })
  // First translate to the bottom center, then rotate
  .attr('transform', d => `rotate(${calculateRotation(d)})`);
  console.log(AQI_value)
const circle = layer3.append('circle')
.attr('cx', 0)
.attr('cy', 0)
.attr('r',barwidth/1.5)
.attr("fill","white")

const AQI_mark =  layer2.append('circle')
.attr('cx', 0)
.attr('cy', 0)
.attr('r',bar_height(AQI_value, outerRadius, innerRadius ))
.attr("fill","none")
.attr("stroke",color_fill(AQI_value))
.attr("stroke-width",10)


  var yAxis = layer3
      .attr("text-anchor", "middle");

  var yTick = yAxis
    .selectAll("g")
    .data(rank)
    .enter().append("g");
layer2.attr('transform', `scale(${0.24})`)
layer3.attr('transform', `scale(${0.24})`)
group.on("click", function(){
  create_rosa(date,data)
    svg_calender.selectAll('#edge').style('stroke-width',0)
  group.select('#edge').style('stroke','black').style('stroke-width',2)

})
}
