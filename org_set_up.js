const select_month = 6
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

// set the dimensions and margins of the graph
const margin = {top: 100, right: 20, bottom: 50, left: 20},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    innerRadius = 60,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

const modal = document.getElementById("myModal");
const modalContent = document.getElementById("modalContentText");// Clear previous SVG content
modalContent.innerHTML += '<svg id="circleSvg" ></svg>';
const modalWidth = modalContent.offsetWidth;
const modalHeight = modalContent.offsetHeight;
const svg = d3.select("#circleSvg");
const svgX = (modalWidth - (width + margin.left + margin.right)) / 2;
const svgY = (modalHeight - (height + margin.top + margin.bottom)) / 2;


// append the svg object to the body of the page
svg.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", `translate(${svgX},${svgY})`)
  .append("g")
    .attr("transform", `translate(${width/2},${height/2+100})`); // Add 100 on Y translation, cause upper bars are longer

const margin1 = {top: 0, right: 0, bottom: 0, left: 0},
    width1 = 600 - margin1.left - margin1.right,
    height1 = 800 - margin1.top - margin1.bottom
/*
const svg1 = d3.select("#rosa_chart")
.append("svg")
  .attr("width", width1 + margin1.left + margin1.right)
  .attr("height", height1 + margin1.top + margin1.bottom)
.append("g")
  .attr("transform", `translate(${margin1.left},${margin1.top})`);
// Create a new image element
const img1 = new Image();
const imageUrl1 = "example.png"
img1.src = imageUrl1;
const imageWidth1 = img1.width;
const imageHeight1 = img1.height;
const imageRatio1 = imageWidth1 / imageHeight1;
// Define the pattern for the image background
const pattern1 = svg1.append("defs")
    .append("pattern")
    .attr("id", "background-pattern1")
    .attr("width", "100%")
    .attr("height", "100%");

// Add the image to the pattern
pattern1.append("image")
    .attr("xlink:href", imageUrl1)
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", (width1 + margin1.left + margin1.right)/imageRatio1)
    .attr("preserveAspectRatio", "none"); // Adjust according to your image aspect ratio


// Create a rectangle with the pattern as its fill
svg1.append("rect")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", (width1 + margin1.left + margin1.right)/imageRatio1)
    .attr("fill", "url(#background-pattern1)")
    .attr("y",0)

*/
// set the dimensions and margins of the graph
var margin2 = {top: 50, right: 30, bottom: 40, left: 150},
    width2 = d3.select("#line_chart").node().clientWidth - margin2.left - margin2.right,
    height2 = 1500 - margin2.top - margin2.bottom;


const svg2 = d3.select("#line_chart")
.append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
.append("g")
  .attr("transform", `translate(${margin2.left},${margin2.top})`);

var y_axis_L = 1400
var fall_area_width = 550
var fall_area_height = 600

width2 = width2-fall_area_width

// Create a new image element
const img = new Image();
const imageUrl = "bg.png"
img.src = imageUrl;
const imageWidth = img.width;
const imageHeight = img.height;
const imageRatio = imageWidth / imageHeight;
// Define the pattern for the image background
const pattern = svg2.append("defs")
    .append("pattern")
    .attr("id", "background-pattern")
    .attr("width", "100%")
    .attr("height", "100%");

// Add the image to the pattern
pattern.append("image")
    .attr("xlink:href", imageUrl)
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", (width2 + margin2.left + margin2.right)/imageRatio)
    .attr("preserveAspectRatio", "none"); // Adjust according to your image aspect ratio



var fall_area_L = svg2.append("svg")
.attr("class","new_svg")
    .attr("width", fall_area_width)
    .attr("height", fall_area_height)
    .attr("x",width2+20)
    .attr("y",0)
    .attr("fill","none")
var fall_area_x_L = parseFloat(fall_area_L.attr("x"))
var fall_area_y_L = parseFloat(fall_area_L.attr("y"))

fall_area_L.append("rect")
    .attr("width", fall_area_width)
    .attr("height", fall_area_height)
    .attr("x", 0)
    .attr("y", 0)
    .attr("class","compare_box")
    .attr("fill","none")


var fall_area_svg_L = fall_area_L.append("g")
    .attr("transform", `translate(${fall_area_width/2},${10+fall_area_height/2})`); // Add 100 on Y translation, cause upper bars are longer

var fall_area_width_M = fall_area_width
var fall_area_height_M = 200

var fall_area_M = svg2.append("svg")
.attr("class","new_svg")
    .attr("width", fall_area_width_M)
    .attr("height", fall_area_height_M)
    .attr("x",width2+20)
    .attr("y",fall_area_height+10)
var fall_area_x_M = parseFloat(fall_area_M.attr("x"))
var fall_area_y_M = parseFloat(fall_area_M.attr("y"))



var fall_area_svg_M = fall_area_M.append("g")
    .attr("transform", `translate(${fall_area_width_M/2},${fall_area_height_M/2})`); // Add 100 on Y translation, cause upper bars are longer
    var left_g = fall_area_svg_M.append("g")
    var right_g = fall_area_svg_M.append("g")
    var mid_g = fall_area_svg_M.append("g")
var fall_area_R = svg2.append("svg")
.attr("class","new_svg")
    .attr("width", fall_area_width)
    .attr("height", fall_area_height)
    .attr("x",width2+20)
    .attr("y",fall_area_height+200)
var fall_area_x_R = parseFloat(fall_area_R.attr("x"))
var fall_area_y_R = parseFloat(fall_area_R.attr("y"))

fall_area_R.append("rect")
    .attr("width", fall_area_width)
    .attr("height", fall_area_height)
    .attr("x", 0)
    .attr("y", 0)
    .attr("class","compare_box")
    .attr("fill","none")

var fall_area_svg_R = fall_area_R.append("g")
    .attr("transform", `translate(${fall_area_width/2},${10+fall_area_height/2})`); // Add 100 on Y translation, cause upper bars are longer

var line_chart = svg2.append("g")
.attr("class","new_svg")
    .attr("transform", `translate(${0},${0})`);

var img_height = (width2 )/imageRatio

var y_axis_length = y_axis_L- margin2.top - margin2.bottom;
// Create a rectangle with the pattern as its fill
svg2.append("rect")
    .attr("width", width2)
    .attr("height", img_height)
    .attr("fill", "url(#background-pattern)")
    .attr("y", y_axis_length-img_height)
    .attr("opacity",0.2)
// set the dimensions and margins of the graph
const margin3 = {top: 50, right: 30, bottom: 40, left: 45},
    width3= d3.select("#line_chart").node().clientWidth - margin3.left - margin3.right,
    height3 = 800 - margin3.top - margin3.bottom;

// append the svg object to the body of the page
const svg3 = d3.select("#seperate_chart")
  .append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin3.left}, ${margin3.top})`);


// set the dimensions and margins of the graph
const margin4 = {top: 60, right: 30, bottom: 20, left:60},
    width4 = d3.select("#line_chart").node().clientWidth - margin4.left - margin4.right,
    height4 = 600 - margin4.top - margin4.bottom;

// append the svg object to the body of the page
const svg4 = d3.select("#bump_chart")
  .append("svg")
    .attr("width", width4 + margin4.left + margin4.right)
    .attr("height", height4 + margin3.top + margin4.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin4.left}, ${margin4.top})`);

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
  .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33'])



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
const rank = [50,100,150,200,300]
