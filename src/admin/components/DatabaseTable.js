import React, {PropTypes} from 'react'
import DatabaseRow from 'src/admin/components/DatabaseRow'
import ConfirmButtons from 'src/admin/components/ConfirmButtons'

const {
  func,
  shape,
  bool,
} = PropTypes

const DatabaseTable = ({
  database,
  notify,
  isRFDisplayed,
  onEditDatabase,
  onKeyDownDatabase,
  onCancelDatabase,
  onConfirmDatabase,
  onStartDeleteDatabase,
  onDatabaseDeleteConfirm,
  onAddRetentionPolicy,
  onCreateRetentionPolicy,
  onUpdateRetentionPolicy,
  onRemoveRetentionPolicy,
  onDeleteRetentionPolicy,
}) => {
  return (
    <div className="db-manager">
      <DatabaseTableHeader
        database={database}
        isAddRPDisabled={!!database.retentionPolicies.some(rp => rp.isNew)}
        onEdit={onEditDatabase}
        onKeyDown={onKeyDownDatabase}
        onCancel={onCancelDatabase}
        onConfirm={onConfirmDatabase}
        onStartDelete={onStartDeleteDatabase}
        onDatabaseDeleteConfirm={onDatabaseDeleteConfirm}
        onAddRetentionPolicy={onAddRetentionPolicy}
        onDeleteRetentionPolicy={onDeleteRetentionPolicy}
      />
      <div className="db-manager-table">
        <table className="table v-center admin-table">
          <thead>
            <tr>
              <th>Retention Policy</th>
              <th>Duration</th>
              {isRFDisplayed ? <th>Replication Factor</th> : null}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              database.retentionPolicies.map(rp => {
                return (
                  <DatabaseRow
                    key={rp.links.self}
                    notify={notify}
                    database={database}
                    retentionPolicy={rp}
                    onCreate={onCreateRetentionPolicy}
                    onUpdate={onUpdateRetentionPolicy}
                    onRemove={onRemoveRetentionPolicy}
                    onDelete={onDeleteRetentionPolicy}
                    isRFDisplayed={isRFDisplayed}
                    isDeletable={database.retentionPolicies.length > 1}
                  />
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

DatabaseTable.propTypes = {
  onEditDatabase: func,
  database: shape(),
  notify: func,
  isRFDisplayed: bool,
  isAddRPDisabled: bool,
  onKeyDownDatabase: func,
  onCancelDatabase: func,
  onConfirmDatabase: func,
  onStartDeleteDatabase: func,
  onDatabaseDeleteConfirm: func,
  onAddRetentionPolicy: func,
  onCancelRetentionPolicy: func,
  onCreateRetentionPolicy: func,
  onUpdateRetentionPolicy: func,
  onRemoveRetentionPolicy: func,
  onDeleteRetentionPolicy: func,
}

const DatabaseTableHeader = ({
  database,
  onEdit,
  onKeyDown,
  onConfirm,
  onCancel,
  onStartDelete,
  onDatabaseDeleteConfirm,
  onAddRetentionPolicy,
  isAddRPDisabled,
}) => {
  if (database.isEditing) {
    return (
      <EditHeader
        database={database}
        onEdit={onEdit}
        onKeyDown={onKeyDown}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )
  }

  return (
    <Header
      database={database}
      onStartDelete={onStartDelete}
      onDatabaseDeleteConfirm={onDatabaseDeleteConfirm}
      onAddRetentionPolicy={onAddRetentionPolicy}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isAddRPDisabled={isAddRPDisabled}
    />
  )
}

DatabaseTableHeader.propTypes = {
  onEdit: func,
  database: shape(),
  onKeyDown: func,
  onCancel: func,
  onConfirm: func,
  onStartDelete: func,
  onDatabaseDeleteConfirm: func,
  onAddRetentionPolicy: func,
  isAddRPDisabled: bool,
}

const Header = ({
  database,
  onStartDelete,
  onDatabaseDeleteConfirm,
  onAddRetentionPolicy,
  isAddRPDisabled,
  onCancel,
  onConfirm,
}) => {
  const confirmStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  const buttons = (
    <div className="text-right">
      {
        database.name === '_internal' ? null :
          <button className="btn btn-xs btn-danger" onClick={() => onStartDelete(database)}>
            Delete
          </button>
      }
      <button className="btn btn-xs btn-primary" disabled={isAddRPDisabled} onClick={() => onAddRetentionPolicy(database)}>
        Add retention policy
      </button>
    </div>
  )

  const deleteConfirm = (
    <div style={confirmStyle}>
      <div className="admin-table--delete-cell">
        <input
          className="form-control"
          name="name"
          type="text"
          value={database.deleteCode || ''}
          placeholder={`DELETE ${database.name}`}
          onChange={(e) => onDatabaseDeleteConfirm(database, e)}
          onKeyDown={(e) => onDatabaseDeleteConfirm(database, e)}
          autoFocus={true}
        />
      </div>
      <ConfirmButtons item={database} onConfirm={onConfirm} onCancel={onCancel} />
    </div>
  )

  return (
    <div className="db-manager-header">
      <h4>{database.name}</h4>
      {database.hasOwnProperty('deleteCode') ? deleteConfirm : buttons}
    </div>
  )
}

Header.propTypes = {
  database: shape(),
  onStartDelete: func,
  onDatabaseDeleteConfirm: func,
  onAddRetentionPolicy: func,
  isAddRPDisabled: bool,
  onConfirm: func,
  onCancel: func,
}

const EditHeader = ({database, onEdit, onKeyDown, onConfirm, onCancel}) => (
  <div className="db-manager-header-edit">
    <input
      className="form-control"
      name="name"
      type="text"
      value={database.name}
      placeholder="Database name"
      onChange={(e) => onEdit(database, {name: e.target.value})}
      onKeyDown={(e) => onKeyDown(e, database)}
      autoFocus={true}
    />
    <ConfirmButtons item={database} onConfirm={onConfirm} onCancel={onCancel} />
  </div>
)

EditHeader.propTypes = {
  database: shape(),
  onEdit: func,
  onKeyDown: func,
  onCancel: func,
  onConfirm: func,
  isRFDisplayed: bool,
}

export default DatabaseTable
