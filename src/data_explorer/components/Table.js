import React, {PropTypes} from 'react'
import {Table, Column, Cell} from 'fixed-data-table'
import Dimensions from 'react-dimensions'
import fetchTimeSeries from 'shared/apis/timeSeries'
import _ from 'lodash'
import moment from 'moment'

const {oneOfType, number, string, shape, arrayOf, func} = PropTypes

const CustomCell = React.createClass({
  propTypes: {
    data: oneOfType([number, string]).isRequired,
    columnName: string.isRequired,
  },

  render() {
    const {columnName, data} = this.props

    if (columnName === 'time') {
      const date = moment(new Date(data)).format('MM/DD/YY hh:mm:ssA')

      return <span>{date}</span>
    }

    return <span>{data}</span>
  },
})

const ChronoTable = React.createClass({
  propTypes: {
    query: shape({
      host: arrayOf(string.isRequired).isRequired,
      text: string.isRequired,
    }),
    containerWidth: number.isRequired,
    height: number,
    onEditRawStatus: func.isRequired,
  },

  getInitialState() {
    return {
      cellData: {
        columns: [],
        values: [],
      },
      columnWidths: {},
    }
  },

  getDefaultProps() {
    return {
      height: 600,
    }
  },

  async fetchCellData(query) {
    this.setState({isLoading: true})
    const {onEditRawStatus} = this.props
    // second param is db, we want to leave this blank
    try {
      const {data} = await fetchTimeSeries(query.host, undefined, query.text)
      this.setState({isLoading: false})

      const error = _.get(data, ['results', '0', 'error'], false)
      if (error) {
        return onEditRawStatus(query.id, {error})
      }

      const cellData = _.get(data, ['results', '0', 'series', '0'], false)
      onEditRawStatus(query.id, {success: 'Success!'})

      if (!cellData) {
        return
      }

      this.setState({cellData})
    } catch (error) {
      const {message} = error.data
      this.setState({isLoading: false})
      console.error(message)
      onEditRawStatus(query.id, {error: message})
    }
  },

  componentDidMount() {
    this.fetchCellData(this.props.query)
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.query.text !== nextProps.query.text) {
      this.fetchCellData(nextProps.query)
    }
  },

  handleColumnResize(newColumnWidth, columnKey) {
    this.setState(({columnWidths}) => ({
      columnWidths: Object.assign({}, columnWidths, {
        [columnKey]: newColumnWidth,
      }),
    }))
  },

  // Table data as a list of array.
  render() {
    const {containerWidth, height} = this.props
    const {cellData, columnWidths, isLoading} = this.state
    const {columns, values} = cellData

    // adjust height to proper value by subtracting the heights of the UI around it
    // tab height, graph-container vertical padding, graph-heading height, multitable-header height
    const stylePixelOffset = 136

    const rowHeight = 34
    const defaultColumnWidth = 200
    const width = columns.length > 1 ? defaultColumnWidth : containerWidth
    const headerHeight = 30
    const minWidth = 70
    const styleAdjustedHeight = height - stylePixelOffset

    if (!isLoading && !values.length) {
      return <div className="generic-empty-state">Your query returned no data</div>
    }

    return (
      <Table
        onColumnResizeEndCallback={this.handleColumnResize}
        isColumnResizing={false}
        rowHeight={rowHeight}
        rowsCount={values.length}
        width={containerWidth}
        ownerHeight={styleAdjustedHeight}
        height={styleAdjustedHeight}
        headerHeight={headerHeight}>
        {columns.map((columnName, colIndex) => {
          return (
            <Column
              isResizable={true}
              key={columnName}
              columnKey={columnName}
              header={<Cell>{columnName}</Cell>}
              cell={({rowIndex}) => {
                return <CustomCell columnName={columnName} data={values[rowIndex][colIndex]} />
              }}
              width={columnWidths[columnName] || width}
              minWidth={minWidth}
            />
          )
        })}
      </Table>
    )
  },
})

export default Dimensions({elementResize: true})(ChronoTable)
