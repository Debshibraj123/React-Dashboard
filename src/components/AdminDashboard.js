// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editableRow, setEditableRow] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  const handleEdit = (id) => {
    setEditableRow(id);
  };

  const handleSave = (id) => {
    setEditableRow(null);
    // Add logic to save the edited data (in memory only)
  };

  const handleDelete = (id) => {
    setEditableRow(null);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    setSelectedRows((prevSelectedRows) => prevSelectedRows.filter((rowId) => rowId !== id));
  };

  const handleDeleteSelected = () => {
    setEditableRow(null);
    setUsers((prevUsers) => prevUsers.filter((user) => !selectedRows.includes(user.id)));
    setSelectedRows([]);
  };
  
  

  return (
    <div className="admin-dashboard">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users
            .filter((user) =>
              Object.values(user).some(
                (value) =>
                  typeof value === 'string' &&
                  value.toLowerCase().includes(searchTerm.toLowerCase())
              )
            )
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((user) => (
              <tr key={user.id} className={selectedRows.includes(user.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => handleRowSelect(user.id)}
                  />
                </td>
                <td>{user.id}</td>
                <td>
                  {editableRow === user.id ? (
                    <input type="text" value={user.name} />
                  ) : (
                    <span>{user.name}</span>
                  )}
                </td>
                <td>
                  {editableRow === user.id ? (
                    <input type="text" value={user.email} />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </td>
                <td>{user.role}</td>
                <td>
                  {editableRow === user.id ? (
                    <button className="save" onClick={() => handleSave(user.id)}>
                      Save
                    </button>
                  ) : (
                    <button className="edit" onClick={() => handleEdit(user.id)}>
                      ✎
                    </button>
                  )}
                  <button className="delete" onClick={() => handleDelete(user.id)}>
                     🗑️
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="pagination">
        {/* <button className="first-page" onClick={() => handlePageChange(1)}>
          1
        </button> */}
        <button className="previous-page" onClick={() => handlePageChange(currentPage - 1 )}>
          Previous Page
        </button>
        {Array.from({ length: Math.ceil(users.length / itemsPerPage) }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button className="next-page" onClick={() => handlePageChange(currentPage + 1)}>
          Next Page
        </button>
        {/* <button className="last-page" onClick={() => handlePageChange(Math.ceil(users.length / itemsPerPage))}>
          Last Page
        </button> */}
      </div>

      <button className="delete-selected" onClick={handleDeleteSelected} >Delete Selected</button>
    </div>
  );
};

export default AdminDashboard;
