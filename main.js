import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const margin = { top: 50, right: 100, bottom: 50, left: 100 };
const width = 2000 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3
  .select("#parallelPlot")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const dimensions = ["age",  "weight", "op_duration_hr"];
const colorMap = {
  Open: "#1f77b4",
  Robotic: "#9467bd",
  Videoscopic: "#2ca02c"
};

// Load your local CSV file
d3.csv("with_opdur.csv").then((data) => {
  data.forEach((d) => {
    d.age = +d.age;
    //d.death_inhosp = +d.death_inhosp;
    d.weight = +d.weight;
    d.op_duration_hr = +d.op_duration_hr;
  });

  const yScales = {};
  dimensions.forEach((dim) => {
    yScales[dim] = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d[dim]))
      .range([height, 0]);
  });

  const xScale = d3
    .scalePoint()
    .domain(dimensions)
    .range([0, width])
    .padding(1);

  // Draw background lines
  svg
    .selectAll(".line")
    .data(data)
    .join("path")
    .attr("class", "line")
    .attr("d", (d) =>
      d3.line()(
        dimensions.map((p) => [xScale(p), yScales[p](d[p])])
      )
    )
    .attr("stroke", (d) => colorMap[d.approach]);

  // Draw axes
  dimensions.forEach((dim) => {
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${xScale(dim)},0)`)
      .call(d3.axisLeft(yScales[dim]))
      .append("text")
      .attr("y", -9)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text(dim);
  });

  const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${width - 150}, 0)`);

Object.entries(colorMap).forEach(([label, color], i) => {
  const legendRow = legend.append("g")
    .attr("transform", `translate(0, ${i * 20})`);

  legendRow.append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", color);

  legendRow.append("text")
    .attr("x", 18)
    .attr("y", 10)
    .attr("font-size", "12px")
    .attr("fill", "black")
    .text(label);
});
});
