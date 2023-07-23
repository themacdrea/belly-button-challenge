const DATA_URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let firstSampleid; 

function init() {
  d3.json(DATA_URL).then(function (data) {
    firstSampleid = data.names[0];


    const dropdown = d3.select("#selDataset");
    data.names.forEach((id) => {
      dropdown
        .append("option")
        .attr("value", id)
        .text(`Sample ${id}`);
    });

    optionChanged(firstSampleid);
  });
}
  
  function drawMetadata(data, sample) {
    d3.select("#sample-metadata").html("");
    const selectedMetadata = data.metadata.filter((md) => md.id == sample)[0];
  
  
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      d3.select("#sample-metadata")
        .append("h5")
        .text(`${key}: ${value}`);
    });
  }
  
  function drawBarChart(data, sample) {
    const selectedSample = data.samples.filter((sd) => sd.id == sample)[0];
    const top10Samplevalues = selectedSample.sample_values.slice(0, 10).reverse();
    const top10OtuIDs = selectedSample.otu_ids.slice(0, 10).reverse();
    const top10Otulabels = selectedSample.otu_labels.slice(0, 10).reverse();
  

      const trace1 = {
        x: top10Samplevalues,
        y: top10OtuIDs.map((id) => `OTU ${id}`),
        text: top10Otulabels,
        type: "bar",
        orientation: "h",
        marker: {
          color: "#d3ca0e",
        },
      };
  
      const barData = [trace1];
  
      const layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" },
        width: 450,
        height: 460,
      };
  
    if (sample === firstSampleid) {

      Plotly.newPlot("bar", barData, layout);
    } else {

      Plotly.restyle("bar", "x", [top10Samplevalues]);
      Plotly.restyle("bar", "y", [top10OtuIDs.map((id) => `OTU ${id}`)]);
      Plotly.restyle("bar", "text", [top10Otulabels]);
    }
  }
  
  
  function drawBubbleChart(data, sample) {
    const selectedSample = data.samples.filter((sd) => sd.id == sample)[0];
 
    const trace2 = {
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      text: selectedSample.otu_labels,
      mode: "markers",
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: "Earth",
      },
    };
  

    const bubbleData = [trace2];
  
    const bubbleLayout = {
      title: "Sample Values vs. OTU IDs",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" },
      showlegend: false,
    };
  
    if (sample === firstSampleid) {
      
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    } else {
     
      Plotly.restyle("bubble", "x", [selectedSample.otu_ids]);
      Plotly.restyle("bubble", "y", [selectedSample.sample_values]);
      Plotly.restyle("bubble", "text", [selectedSample.otu_labels]);
    }
  }
  

  function optionChanged(selectedSample) {

    d3.json(DATA_URL).then((data) => {
      drawMetadata(data, selectedSample);
      drawBarChart(data, selectedSample);
      drawBubbleChart(data, selectedSample);
      drawGaugeChart(data, selectedSample);
    });
  }
  

  init();