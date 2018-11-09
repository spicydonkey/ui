// Libraries
import React, {PureComponent} from 'react'
import Dygraph from 'src/shared/components/dygraph/Dygraph'
import DygraphCell from 'src/shared/components/DygraphCell'
import DygraphTransformation from 'src/shared/components/DygraphTransformation'

// Components
import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'

// Types
import {Options} from 'src/external/dygraph'
import {LineView} from 'src/types/v2/dashboards'
import {TimeRange} from 'src/types/v2'
import {FluxTable, RemoteDataState} from 'src/types'

interface Props {
  viewID: string
  staticLegend: boolean
  onZoom: (range: TimeRange) => void
  tables: FluxTable[]
  properties: LineView
  timeRange: TimeRange
  loading: RemoteDataState
  children: JSX.Element
}

@ErrorHandlingWith(InvalidData)
class LineGraph extends PureComponent<Props> {
  public static defaultProps: Partial<Props> = {
    staticLegend: false,
  }

  public render() {
    const {
      tables,
      viewID,
      onZoom,
      loading,
      children,
      timeRange,
      properties,
    } = this.props

    const {axes, type, colors, queries} = properties

    return (
      <DygraphTransformation tables={tables}>
        {({labels, dygraphsData}) => (
          <DygraphCell loading={loading}>
            <Dygraph
              type={type}
              axes={axes}
              viewID={viewID}
              colors={colors}
              onZoom={onZoom}
              labels={labels}
              queries={queries}
              options={this.options}
              timeRange={timeRange}
              timeSeries={dygraphsData}
            >
              {children}
            </Dygraph>
          </DygraphCell>
        )}
      </DygraphTransformation>
    )
  }

  private get options(): Partial<Options> {
    return {
      rightGap: 0,
      yRangePad: 10,
      labelsKMB: true,
      fillGraph: true,
      axisLabelWidth: 60,
      animatedZooms: true,
      drawAxesAtZero: true,
      axisLineColor: '#383846',
      gridLineColor: '#383846',
      connectSeparatedPoints: true,
    }
  }
}

export default LineGraph
