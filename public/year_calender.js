
const today = new Date();
const dayOfMonth = today.getDate();
d3.select("#right-div").style("width","70%")
d3.select("#left-div").style("width","30%")
const svg_calender = d3.select('#calendar').append('svg')
container = d3.select('#calendar');

// Get the width of the container div
containerWidth = container.node().getBoundingClientRect().width;
containerHeight = container.node().getBoundingClientRect().height;

const months = d3.range(0, 12); // Array [0, 1, ..., 11] for months
const gridWidth = (containerWidth)/3;
const gridHeight = containerHeight/1.7;

svg_calender.attr("width", containerWidth ) // 7 days for a week
  .attr("height", gridHeight*4+40); // 6 rows to accommodate all days



const dayWidth = (gridWidth-40)/7;
const dayHeight = gridHeight/7.5;
const day_array = ['S','M','T','W','T','F', 'S']

var svg_date;
Promise.all([
  d3.csv(csvFile1),
  d3.csv(csvFile2)
]).then(function([data, info]) {
  data.forEach(function(d) {
    d.Date_org = d.Date
    d.Date = d3.timeParse("%m/%d/%Y")(d.Date);
  });
  

});
function create_year(data, info){
  d3.select("#daily_chart").style("display","none")
  d3.select("#explain_text").style("display","block")
  d3.select("#right-div").style("width","70%")
  d3.select("#left-div").style("width","30%")
  container = d3.select('#calendar');

  // Get the width of the container div
  containerWidth = container.node().getBoundingClientRect().width;
  containerHeight = container.node().getBoundingClientRect().height;

  const gridWidth = (containerWidth)/3;
  const gridHeight = containerHeight/1.7;
  const day_array = ['S','M','T','W','T','F', 'S']
  d3.select("#calendar-header").style("display","none")
  d3.select("#calendar").style("overflow-y","auto")

  const dayWidth = (gridWidth-40)/7;
  const dayHeight = gridHeight/7.5;
  svg_calender.selectAll("*").remove()
  svg_calender.attr("width", containerWidth) // 7 days for a week
    .attr("height", gridHeight*4+80); // 6 rows to accommodate all days

  months.forEach(function(month, index) {

      monthGroup = svg_calender.append('g')
          .attr('transform', 'translate(' + ((index % 3) * gridWidth+10) + ',' + (Math.floor(index / 3) * gridHeight +10)+ ')');

      svg_header= monthGroup.append('g')
      svg_date = monthGroup.append('g').attr("class",month)
      svg_header.attr('transform', `translate(0, ${10})`);
      svg_date.attr('transform', `translate(0, ${40+dayHeight / 2})`);



      const cells_day = svg_header.selectAll("g")
        .data(day_array)
        .enter()
        .append("g")
        .attr("transform", (d, i) => {
          const x = (i % 7) * dayWidth; // Calculate x based on the day of the week
          const y = dayHeight*0.5; // Calculate y based on the week
          return `translate(${x}, ${y})`;
        });

      // Add rectangles for each day cell
      cells_day.append("rect")
        .attr("width", dayWidth - 1) // Subtract 1 for grid gap
        .attr("height", dayHeight/2 - 10)
        .style("fill", "none")
        .style("stroke", "none");

      // Add text labels for each day
      cells_day.append("text")
        .attr("x", dayWidth / 2)
        .attr("y", (dayHeight/2-10) / 2)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em") // Vertical alignment
        .text(d => d)
        .attr('class','note')
        .style("font-size","16px")

      svg_header.append("text")
        .attr("x", (gridWidth-30) / 2)
        .attr("y", 5)
        .attr("text-anchor", "middle")
        .text(new Date(select_year, month).toLocaleString('en-us', { month: 'long' }) + " " + select_year)
        .attr('class','semi-title')


      create_calender(svg_date,month,data,info)
      monthGroup.append("rect")
      .attr("fill","white")
      .style("opacity",0)
      .attr("width",gridWidth)
      .attr("height",gridHeight)
      .on('click', function() {
          create_select_month(svg_calender,month,data,info)
          console.log('Month ' + (month + 1) + ' clicked');
          // Logic to display the detailed view for the month
      });




})
}
function create_calender(svg_date,select_month,data,info){

  const monthData = data.filter(d => {
      const selectedDate = new Date(select_year, select_month, 1); // Creating a Date object for the selected year and month
      const dataDate = new Date(d.Date); // Creating a Date object for the data's date

      // Checking if the year and month of the data's date match the selected year and month
      return dataDate.getFullYear() === selectedDate.getFullYear() &&
             dataDate.getMonth() === selectedDate.getMonth();
  });
var data_for_day = []

// Define the start date of the month and the number of days in July 2023
const startDate = new Date(select_year, select_month, 1); // Months are zero-indexed, 6 represents July
const daysInMonth = new Date(select_year, select_month+1, 0).getDate(); // Get the last day of July

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
    const y = (Math.floor(i / 7)) * dayHeight+10; // Calculate y based on the week
    return `translate(${x}, ${y})`;
  });
  cell.append("rect")
    .attr('id','edge')
    .attr("width", dayWidth - 1) // Subtract 1 for grid gap
    .attr("height", dayHeight - 1)
    .style("fill", "#ffffff")
    .style("opacity",0)
    .style("stroke", "black")
    .style("stroke-width", 0)
    cell.append("text")
      .attr("x", dayWidth / 2)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em") // Vertical alignment
      .text(calendarArray[i])
      .attr('class','note')
      .attr("opacity",0.6)
      .style("font-size",8)
  var data_for_day = []
  if(calendarArray[i]>0){
    data_for_day = monthData.filter(d => d.Date.getDate() === calendarArray[i])
    create_rosa_small(data_for_day[0].Date_org,data_for_day,cell,info,screen.width/(65*bar_height(300)),dayWidth,dayHeight,'False')
  }

}
}
function create_select_month(svg_calender,select_month,data,info){
  d3.select("#right-div").style("width","50vw")
  d3.select("#left-div").style("width","40vw")
  d3.select("#daily_chart").style("display","block")
  const day_array = ['Sun','Mon','Tue','Wed','Thu','Fri', 'Sat']
  d3.select("#calendar-header").style("display","block")
  d3.select("#calendar").style("overflow-y","hidden")
  d3.select('#calendar-title')
  .text(new Date(select_year, select_month)
  .toLocaleString('en-us', { month: 'long' }) + " " + select_year)
  d3.select("#daily_chart").style("display","block")
  d3.select("#explain_text").style("display","none")
  container = d3.select('#calendar');
  // Get the width of the container div
containerWidth = container.node().getBoundingClientRect().width;
containerHeight = container.node().getBoundingClientRect().height;

  const gridWidth = (containerWidth)/3;
  const gridHeight = containerHeight/1.7;

  svg_calender.attr("width", containerWidth ) // 7 days for a week
    .attr("height", gridHeight*4+40); // 6 rows to accommodate all days

  size = screen.width/(28*bar_height(300))
  const dayWidth = containerWidth/7;
  const dayHeight = containerHeight/7;
  svg_calender.attr("width", containerWidth) // 7 days for a week
    .attr("height", containerHeight); // 6 row

  svg_calender.selectAll("*").remove()

  svg_header= svg_calender.append('g')
  svg_date = svg_calender.append('g')
  svg_header.attr('transform', `translate(0, ${10})`);
  svg_date.attr('transform', `translate(0, ${40+dayHeight / 2})`);

  const cells_day = svg_header.selectAll("g")
    .data(day_array)
    .enter()
    .append("g")
    .attr("transform", (d, i) => {
      const x = (i % 7) * dayWidth; // Calculate x based on the day of the week
      const y = (Math.floor(i / 7)) * dayHeight*0.45; // Calculate y based on the week
      return `translate(${x}, ${y})`;
    });

  // Add rectangles for each day cell
  cells_day.append("rect")
    .attr("width", dayWidth - 0.5) // Subtract 1 for grid gap
    .attr("height", dayHeight/2 )
    .style("fill", "none")
    .style("stroke", "#ffffff")
    .style("stroke-width",1)

  // Add text labels for each day
  cells_day.append("text")
    .attr("x", dayWidth / 2)
    .attr("y", (dayHeight/2-10) / 2)
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em") // Vertical alignment
    .text(d => d)
    .attr('class','semi-title')

  const monthData = data.filter(d => {
      const selectedDate = new Date(select_year, select_month, 1); // Creating a Date object for the selected year and month
      const dataDate = new Date(d.Date); // Creating a Date object for the data's date

      // Checking if the year and month of the data's date match the selected year and month
      return dataDate.getFullYear() === selectedDate.getFullYear() &&
             dataDate.getMonth() === selectedDate.getMonth();
  });
  var data_for_day = []

  // Define the start date of the month and the number of days in July 2023
  const startDate = new Date(select_year, select_month, 1); // Months are zero-indexed, 6 represents July
  const daysInMonth = new Date(select_year, select_month+1, 0).getDate(); // Get the last day of July

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
      const y = (Math.floor(i / 7)-0.5) * dayHeight+20; // Calculate y based on the week
      return `translate(${x}, ${y})`;
    });
    cell.append("rect")
      .attr('id',function(){
        if(calendarArray[i]>0){
          return "edge"
        }
        else{
          return "empty"
        }
      })
      .attr("width", dayWidth -0.5) // Subtract 1 for grid gap
      .attr("height", dayHeight - 0.5)
      .style("fill", function(){
        if(calendarArray[i]==dayOfMonth){
          return "#DCEBFE"
        }
        else if(calendarArray[i]>0){
          return "#ffffff"
        }
        else{
          return "#eeeeee"
        }
      })
      .style("opacity",1)
      .style("stroke", "#E4E4E7")
      .style("stroke-width",1)

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
      create_rosa_small(data_for_day[0].Date_org,data_for_day,cell,info,size,dayWidth,dayHeight,'True')
    }


}
data_for_day = monthData.filter(d => d.Date.getDate() === dayOfMonth)
create_rosa((1+select_month).toString()+"/"+dayOfMonth+"/2023",data_for_day,info)
d3.select('#prev-month-btn').on('click', function() {
  console.log("back-month")
    // Decrement the month and update year if needed
    select_month--;
    if (select_month < 0) {
        select_month = 11;
        select_year--;
    }
    if (select_year < 2014) {
        // Reset to the minimum limit
        select_year = 2014;
        select_month = 0;
    }
    create_select_month(svg_calender,select_month,data,info)
});

// Click event handler for the next month button
d3.select('#next-month-btn').on('click', function() {
    console.log("next-month")
    // Increment the month and update year if needed
    select_month++;
    if (select_month > 11) {
        select_month = 0;
        select_year++;
    }
    if (select_year > 2023) {
        // Reset to the maximum limit
        select_year = 2023;
        select_month = 11;
    }
    create_select_month(svg_calender,select_month,data,info)
});
d3.select('#back-to-year-btn').on('click', function() {
  console.log("back-to-year")

  create_year(data, info)
})
}
function create_rosa_small(date,data,group,info,size,width,height,click){
  barwidth = 25
  AQI_value = 0
const circle_bar = group.append('g').attr("id",'circle_bar').attr("transform",`translate(${width/2}, ${height*0.55})`)
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
const circle = layer3.append('circle')
.attr('cx', 0)
.attr('cy', 0)
.attr('r',barwidth/1.5)
.attr("fill","white")

const AQI_mark =  layer2.append('circle')
.attr('cx', 0)
.attr('cy', 0)
.attr('r',bar_height(AQI_value, outerRadius, innerRadius ))
//.attr("fill",color_fill(AQI_value))
.attr("fill",'none')
//.style('fill-opacity',0.3)
.attr("stroke",color_fill(AQI_value))
.attr("stroke-width",10)


  var yAxis = layer3
      .attr("text-anchor", "middle");

  var yTick = yAxis
    .selectAll("g")
    .data(rank)
    .enter().append("g");
layer2.attr('transform', `scale(${size})`)
layer3.attr('transform', `scale(${size})`)
if(click=='True'){

group.on("click", function(){
  console.log("Daily Calendar: "+date)
  create_rosa(date,data,info)
    svg_calender.selectAll('#edge').style('fill',"#ffffff")
  group.select('#edge').style('fill',"#DCEBFE")
})}
}


function bar_height_2(d, max, min){
  return d*0.7+barwidth
}
function bar_height(d, max, min){
  var res;
  if(d<151){
    res =  d;}
  else if (d<301){res= 200+(d-200)/2;}
  else if (d<501){res = 200+(300-200)/2+(d-300)/4;}
  return res*0.85+barwidth
}

function color_fill(d){
  if(d<51){
    return '#34B274';}
  else if (d<101){return '#FDD000';}
  else if (d<151){return '#F4681A';}
  else if (d<201){return '#D3112E';}
  else if (d<301){return '#8854D0';}
  else if (d<501){return '#731425';}
  else if (d=='Missing'){
    return '#bbbbbb'
  }
}
