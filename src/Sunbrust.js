import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import stockData from './dataUtils/modifedData.json'

const Sunbrust = () => {
  const [data, setData] = useState(stockData)
  const svgRef = useRef()
  const width = 975
  const radius = width / 2

  /*

  notes:
  - removes autobox function as it did not serve its purpose well
  - added few lines of code to correctly center the sunbrust in the middle

  below:
  .append('g')
      .attr('transform', `translate(${width / 2},${width / 2})`)
  - code depends on the correct data layout passed into partiton

  */

  const drawSunbrust = () => {
    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1 - 1)

    const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, data.children.length + 1)
    )

    const format = d3.format(',d')

    const partition = (data) => {
      const root = d3
        .hierarchy(data)
        .sum((d) => d.c)
        .sort((a, b) => b.value - a.value)
      return d3.partition().size([2 * Math.PI, radius])(root)
    }

    // chart

    const root = partition(data)

    const svg = d3.select(svgRef.current)
    svg.attr('viewBox', [0, 0, width, width]).style('font', '10px sans-serif')

    svg
      .append('g')
      .attr('transform', `translate(${width / 2},${width / 2})`)
      .append('g')
      .attr('fill-opacity', 0.6)
      .selectAll('path')
      .data(root.descendants().filter((d) => d.depth))
      .join('path')
      .attr('fill', (d) => {
        while (d.depth > 1) d = d.parent
        return color(d.data.name)
      })
      .attr('d', arc)
      .append('title')
      .text(
        (d) =>
          `${d
            .ancestors()
            .map((d) => d.data.name)
            .reverse()
            .join('/')}\n${format(d.value)}`
      )
    svg
      .append('g')
      .attr('transform', `translate(${width / 2},${width / 2})`)
      .append('g')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('font-family', 'sans-serif')
      .selectAll('text')
      .data(
        root
          .descendants()
          .filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
      )
      .join('text')
      .attr('transform', function (d) {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI
        const y = (d.y0 + d.y1) / 2
        return `rotate(${
          x - 90
        }) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
      })
      .attr('dy', '0.35em')
      .text((d) => d.data.name)
  }

  useEffect(() => {
    setData(stockData)
    drawSunbrust()
  }, [])
  return (
    <div id='sunbrust' className='chart'>
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default Sunbrust
