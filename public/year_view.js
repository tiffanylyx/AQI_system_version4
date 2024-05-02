
const years = [2014,2015,2016,2017,2018,2019,2020,2021,2022,2023];
let select_year;
let colorRanges = [
    { threshold: 0, color: '#34B274' },
    { threshold: 30, color: '#34B274' },
    { threshold: 50, color: '#FDD000' },
    { threshold: 80, color: '#FDD000' },
    { threshold: 100, color: '#F4681A' },
    { threshold: 130, color: '#F4681A' },
    { threshold: 150, color: '#D3112E' },
    { threshold: 180, color: '#D3112E' },
    { threshold: 200, color: '#8854D0' },
    { threshold: 260, color: '#8854D0' },
    { threshold: 300, color: '#731425' },
    { threshold: 500, color: '#731425' },
    // ... Add other ranges here
  ];
  // Create individual scales for each gradient range
const scales = colorRanges.slice(0, -1).map((range, i) => {
    const nextRange = colorRanges[i + 1];
    return {
      scale: d3.scaleLinear()
               .domain([range.threshold, nextRange.threshold])
               .range([range.color, nextRange.color]),
      maxThreshold: nextRange.threshold
    };
  });
  containerWidth = screen.width*0.6//container.node().getBoundingClientRect().width;
containerHeight = screen.height*0.8//container.node().getBoundingClientRect().height;

  const view_type = "gradient"
  const step = 10
  const show_pie = 0
  const gridSize = containerWidth/60,svg_year = d3.select(".year_view").append("svg").attr("width",1600).attr("height",gridSize*10*10.5)

// Parse the date and create a new structure
const dayFormat = d3.timeFormat("%w"), // Week day as decimal number
      weekFormat = d3.timeFormat("%U"); // Week number of the year
Promise.all([
d3.csv(csvFile1),
d3.csv(csvFile2)
]).then(function([data, info]) {
data.forEach(function(d) {
    d.Date_org = d.Date
    d.Date = d3.timeParse("%m/%d/%Y")(d.Date);
});

  for(i in years){
    year = years[i]

    let filteredData = data.filter(d => parseDate(d.Date_org).getFullYear() == year);

    // Parse and convert data types
    filteredData.forEach(d => {
        const parsedDate = new Date(d.Date); // Convert string to Date object
        // Format date to MM/DD/YYYY
        d.real_date = parsedDate
        d.date = `${String(parsedDate.getMonth() + 1).padStart(2, '0')}/${String(parsedDate.getDate()).padStart(2, '0')}/${parsedDate.getFullYear()}`;
        d.value = +d.Value; // Convert string to number
        d.Type = d.Type
    });
    filteredData = filteredData.sort((a, b) => a.real_date - b.real_date);

    // Group by date and find max value in each group
    let groupedData = d3.rollups(filteredData, (v) => {
    // Finding the entry with the maximum 'value'
    const maxEntry = v.reduce((prev, curr) => (prev.value > curr.value ? prev : curr), v[0]);
    return {
        Value: maxEntry.value,
        Type: maxEntry.Type // Assuming 'type' is the attribute you want to retain
    };
}, d => d.date);
    const group = svg_year.append("g").attr("transform",`translate(60,${50+gridSize*10*i})`).attr("class",year)
    group.append("text").text(year).attr("x",0).attr("y",-10).attr("text-anchor","end").attr("font-size",20)

    const cards = group.selectAll(".hour")
        .data(groupedData)
        .enter().append("rect")
        .attr("x", d => weekFormat(parseDate(d[0])) * gridSize)
        .attr("y", d => dayFormat(parseDate(d[0])) * gridSize)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
    group.on("click",function(){
        console.log(d3.select(this).attr("class"))
        select_year = d3.select(this).attr("class")
        create_year(data, info)
        d3.select(".year_view").style("display","none")
        d3.select("#color_bar").style("display","none")
    })
    if(view_type=="DP"){
      cards.style("fill", d => DP_fill(d[1].Type));
    }
    else if(view_type=="gradient"){
      cards.style("fill", d => color_fill(d[1].Value));
    }
    else{
      cards.style("fill", d => color_fill1(d[1].Value));
    }




    cards.append("title")
        .text(d => `${d[0]}: ${d[1]}`);

    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


    // Create y-axis to show the days of the week
    const yAxis = group.append("g")
        .attr("class", "axis")

yAxis.selectAll("text")
    .data(days)
    .enter().append("text")
    .text(d => d)
    .attr("x", 0)
    .attr("y", (d, i) => i * gridSize + gridSize / 2)
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 3+ ")")
    .attr("class","note")


const parsedData = groupedData.map(d => ({
  date: parseDate(d[0]),
  value: d[1]
}));
    count = 0
    let date, month
    for(i in groupedData){
      if(i>1){
        d = groupedData[i]
        date = parseDate(d[0]);
        month = date.getMonth();
        if (month !== parseDate(groupedData[i-1][0]).getMonth()){
          const dayOfWeek = date.getDay();
          const week = +weekFormat(date);
          const x = week * gridSize; // x position
          const y = dayOfWeek * gridSize; // y position
          group.append("text").text(months[count]).attr("x",x).attr("y",-4).attr("text-anchor","end").attr("class","note")
          group.append("line").attr("x1",x).attr("x2",x+gridSize).attr("y1",y).attr("y2",y).attr("stroke","black")
          group.append("line").attr("x1",x).attr("x2",x).attr("y1",y).attr("y2",gridSize*7).attr("stroke","black")
          group.append("line").attr("x1",x+gridSize).attr("x2",x+gridSize).attr("y1",y).attr("y2",0).attr("stroke","black")
          count+=1
        }

      }
}
const dayOfWeek = date.getDay();
const week = +weekFormat(date);
const x = week * gridSize; // x position
group.append("text").text(months[11]).attr("x",x).attr("y",-4).attr("text-anchor","end").attr("class","note")
if(show_pie==1){


for(i in groupedData){
  groupedData[i] = [groupedData[i][0],groupedData[i][1].Value,groupedData[i][1].Type,color_type(groupedData[i][1].Value)]
}
const categoryCounts = countCategories(groupedData,view_type);


const data1 = Object.entries(countCategories(groupedData,view_type)).map(([key, value]) => ({
      label: key,
      value: value
  }));
  var radius = 60

  g = group.append("g").attr("transform", `translate(1000,50)`);

  const pie = d3.pie()
      .sort(null)
      .value(d => d.value);

  const path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius / 2);  // Adjust innerRadius here for donut shape

  const label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

  const arc = g.selectAll(".arc")
      .data(pie(data1))
      .enter().append("g")
        .attr("class", "arc");
  if(view_type=="DP"){
    arc.append("path")
        .attr("d", path)
        .attr("fill", d => DP_fill(d.data.label));

  }
  else{
    arc.append("path")
        .attr("d", path)
        .attr("fill", d => color_fill2(d.data.label));
  }

  arc.append("text")
      .attr("transform", d => `translate(${label.centroid(d)})`)
      .attr("dy", "0.35em")
      .text(d => d.data.label);
  }
  }
  let scale
  gLegend = d3.select("#color_bar").append("svg").attr("width",containerWidth).attr("height",50).append("g").attr("transform", `translate(${containerWidth-gridSize*30},0)`);
   if(view_type=='gradient'){
     scale = 2.4
     // Create a linear gradient for the color scale
     const gradient = gLegend.append("defs")
       .append("linearGradient")
       .attr("id", "gradient")
       .attr("x1", "0%")
       .attr("x2", "100%")
       .attr("y1", "0%")
       .attr("y2", "0%");

     // Define the color stops from the colorRanges
     colorRanges.forEach((range, index) => {
       gradient.append("stop")
         .attr("offset", `${range.threshold*scale / (colorRanges.length - 1)}%`)
         .attr("stop-color", range.color);
     });

     // Add a rectangle to visualize the gradient
     gLegend.append("rect")
       .attr("x",0)
       .attr("y", 0)
       .attr("width", gridSize*25)
       .attr("height", 20)
       .style("fill", "url(#gradient)");

     // Add axis to represent the thresholds
     const xScale = d3.scaleLinear()
       .domain([colorRanges[0].threshold, colorRanges[colorRanges.length - 1].threshold])
       .range([0, gridSize*25]);

     const xAxis = d3.axisBottom(xScale)
       .tickSize(10)
       .tickValues(colorRanges.map(d => d.threshold))
       .tickFormat(d3.format(".0f"))

     gLegend.append("g")
       .attr("class", "x axis")
       .attr("transform", `translate(0,20)`)
       .call(xAxis)  
       .selectAll("text")   // selects all text elements in the g element
       .style("font-size", "12px")    // set the font size
   }
   else{
     range = [0,50,100,150,200,300,500]
     for(i in range){
       if(i>0){
         gLegend.append("rect")
           .attr("x",range[i-1]*0.8)
           .attr("y", 0)
           .attr("width", (range[i]-range[i-1])*0.8)
           .attr("height", 20)
           .style("fill", color_fill1(range[i]));

       }
       gLegend.append("text")
         .attr("x",range[i]*0.8+5)
         .attr("y", 36)
         .text(range[i])
         .attr("text-anchor","end")
     }
   }



}).catch(error => {
    console.error('Error loading or processing data:', error);
});

function DP_fill(d){
  if(d=='O3'){
    return "steelblue"
  }
  else if(d=='PM2.5'){
    return "purple"
  }
  else if(d=='NO2'){
    return "grey"
  }
  else if (d=='PM10'){
    return "pink"
  }

}




function color_fill(d) {
  if (d === 'Missing') {
    return '#bbbbbb'; // Missing data color
  } else if (d < colorRanges[0].threshold) {
    return colorRanges[0].color; // Use the first color below the first threshold
  } else {
    // Find the correct scale based on the value of d
    const scale = scales.find(s => d < s.maxThreshold);
    if (scale) {
      return scale.scale(d); // Return the color for the value within the range
    } else {
      return colorRanges[colorRanges.length - 1].color; // Use the last color above the last threshold
    }
  }
}
function color_type(d){
  if(d<51){
    return 'Good';}
  else if (d<101){return 'Moderate';}
  else if (d<151){return 'Unhealthy for sensitive group';}
  else if (d<201){return 'Unhealthy';}
  else if (d<301){return 'Very Unhealthy';}
  else if (d<501){return 'Hazardous';}
}
function color_fill2(d){
  if(d=='Good'){
    return '#34B274';}
  else if (d=='Moderate'){return '#FDD000';}
  else if (d=='Unhealthy for sensitive group'){return '#F4681A';}
  else if (d=='Unhealthy'){return '#D3112E';}
  else if (d=='Very Unhealthy'){return '#8854D0';}
  else if (d=='Hazardous'){return '#731425';}
  else if (d=='Missing'){
    return '#bbbbbb'
  }
}
function color_fill1(d){
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
// Function to count categories
function countCategories(data,countCategories) {
  if(countCategories=='DP'){
    return data.reduce((acc, curr) => {
        const category = curr[2]; // Assuming the category is always in the third element
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});
  }
  else{
    return data.reduce((acc, curr) => {
        const category = curr[3]; // Assuming the category is always in the third element
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});
  }

}
