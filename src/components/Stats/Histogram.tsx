import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { Rectangle } from './Rectangle';
import styles from './Stats.module.scss';
import { IconInfoCircle } from '@tabler/icons-react';
import { Tooltip } from '@mantine/core';

const MARGIN = { top: 30, right: 30, bottom: 40, left: 50 };

const BUCKET_PADDING = 4;

type HistogramProps = {
  title?: string;
  description: string;
  width: number;
  height: number;
  data: number[];
  resolution: number;
  domainMin: number;
  domainMax: number;
  xLabel?: string;
  yLabel?: string;
};

export const Histogram = ({ title, description, width, height, data, resolution, domainMin, domainMax, xLabel, yLabel }: HistogramProps) => {
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const domain: [number, number] = [domainMin, domainMax]; // [0, 100]
  const xScale = useMemo(() => {
    return d3.scaleLinear().domain(domain).range([resolution, boundsWidth]);
  }, [data, width]);

  const buckets = useMemo(() => {
    const bucketGenerator = d3
      .bin()
      .value((d) => d)
      .domain(domain)
      .thresholds(xScale.ticks(resolution));
    return bucketGenerator(data);
  }, [xScale]);

  const yScale = useMemo(() => {
    const max = Math.max(...buckets.map((bucket) => bucket?.length));
    return d3.scaleLinear().range([boundsHeight, 0]).domain([0, max]).nice();
  }, [data, height]);

  // Render the X axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll('*').remove();

    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append('g')
      .attr('transform', 'translate(0,' + boundsHeight + ')')
      .call(xAxisGenerator);
    svgElement.append('text')
      .attr('class', styles.histogramXAxis)
      .attr('text-anchor', 'end')
      .attr('dy', '2em')
      .attr('x', boundsWidth)
      .attr('y', boundsHeight)
      .text(xLabel);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append('g').call(yAxisGenerator);
    svgElement.append('text')
      .attr('class', styles.histogramYAxis)
      .attr('text-anchor', 'end')
      .attr('y', 0)
      .attr('dy', '-2em')
      .attr('transform', 'rotate(-90)')
      .text(yLabel);
  }, [xScale, yScale, boundsHeight]);

  const allRects = buckets.map((bucket, i) => {
    const { x0, x1 } = bucket;
    if (x0 == undefined || x1 == undefined) {
      return null;
    }
    return (
      <Rectangle
        key={i}
        x={xScale(x0) + BUCKET_PADDING / 2}
        width={xScale(x1) - xScale(x0) - BUCKET_PADDING}
        y={yScale(bucket.length)}
        height={boundsHeight - yScale(bucket.length)}
      />
    );
  });

  return (
    <div className={styles.histogram}>
      <div className={styles.statsSubTitle}>
        <div>{title}</div>
        <Tooltip label={description}>
        <IconInfoCircle
          size={24}
          strokeWidth={2}
        />
        </Tooltip>
      </div>

      <svg width={width} height={height}>
        <g
            width={boundsWidth}
            height={boundsHeight}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
            {allRects}
        </g>
        <g
            width={boundsWidth}
            height={boundsHeight}
            ref={axesRef}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
      </svg>
    </div>
    
  );
};
