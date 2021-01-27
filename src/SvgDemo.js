import React, { useRef, useState, useEffect } from 'react'
import * as d3 from 'd3'

const SvgDemo = () => {
  const svgRef = useRef()

  /*
  reference: https://www.youtube.com/watch?v=Y-ThTzB-Zjk

  svg has 3 selections: enter, update, exit
  .join() api auto handles eneter, update, exit.remove() if not specified as callback params
  */
  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('r', (value) => value)
      .attr('cx', (value) => value * 2)
      .attr('cy', (value) => value * 2)
      .attr('stroke', 'red')
  }, [])

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  )
}
