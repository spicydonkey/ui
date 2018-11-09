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
import {StepPlotView} from 'src/types/v2/dashboards'
import {TimeRange} from 'src/types/v2'
import {FluxTable, RemoteDataState} from 'src/types'

interface Props {
  loading: RemoteDataState
  properties: StepPlotView
  timeRange: TimeRange
  tables: FluxTable[]
  viewID: string
  onZoom: (range: TimeRange) => void
}

@ErrorHandlingWith(InvalidData)
class StepPlot extends PureComponent<Props> {
  public render() {
    const {tables, viewID, onZoom, loading, timeRange, properties} = this.props
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
            />
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
      stepPlot: true,
    }
  }
}

export default StepPlot
