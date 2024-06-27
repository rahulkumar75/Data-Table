import React, { useEffect, useRef, useState } from "react";

export default function DataTable() {
  const [formData, setFormData] = useState({ name: "", gender: "", age: "" });
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const outSideClick = useRef(false);
  const itemPerPage = 3; //vid-51:00
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;

  const filteredItems = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredData = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    //vid- 1:06:00
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (!editId) return;
    let selectedItem = document.querySelectorAll(`[id = '${editId}']`);
    selectedItem[0].focus();
  }, [editId]);

  useEffect(() => {
    //vid- 46:00
    const handleClickOutside = (event) => {
      if (
        outSideClick.current &&
        !outSideClick.current.contains(event.target)
      ) {
        setEditId(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    if (formData.name && formData.gender && formData.age) {
      const newItem = {
        id: Date.now(),
        name: formData.name,
        gender: formData.gender,
        age: formData.age,
      };
      setData([...data, newItem]);
      setFormData({ name: "", gender: "", age: "" });
    }
  };
  const handleDelete = (id) => {
    if (filteredData.length === 1 && currentPage !== 1) {
      setCurrentPage((prev) => prev - 1);
    }

    const updatedList = data.filter((item) => item.id !== id);
    setData(updatedList);
  };

  const handleEdit = (id, updatedData) => {
    if (!editId || editId != id) {
      return;
    }
    const updatedList = data.map((item) =>
      item.id === id ? { ...item, ...updatedData } : item
    );
    setData(updatedList);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <div className="add-container">
        <div className="info-container">
          <input
            className="form-control p-2 mt-2 mb-2 border border-primary"
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            className="form-control p-2 mb-2 border border-primary"
            type="text"
            placeholder="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          />
          <input
            className="form-control p-2 mb-2 border border-primary"
            padding-x="2"
            type="text"
            placeholder="Age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
          />
          <button
            type="button"
            class="btn btn-primary  rounded-pill"
            onClick={handleAddClick}
          >
            Add
          </button>
        </div>
      </div>

      <div className="search-table-container">
        <br />
        <input
          class="form-control-sm shadow-sm p-1 mb-2"
          type="text"
          placeholder="Search By Name"
          id="search-input"
          value={searchTerm}
          onChange={handleSearch}
        />
        <table className="table table-dark table-hover" ref={outSideClick}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td
                  id={item.id}
                  contentEditable={editId === item.id}
                  onBlur={(e) =>
                    handleEdit(item.id, { name: e.target.innerText })
                  }
                >
                  {item.name}
                </td>
                <td
                  id={item.id}
                  contentEditable={editId === item.id}
                  onBlur={(e) =>
                    handleEdit(item.id, { gender: e.target.innerText })
                  }
                >
                  {item.gender}
                </td>
                <td
                  id={item.id}
                  contentEditable={editId === item.id}
                  onBlur={(e) =>
                    handleEdit(item.id, { age: e.target.innerText })
                  }
                >
                  {item.age}
                </td>
                <td className="actions" >
                  
                  <button
                    className="edit" 
                    onClick={() => setEditId(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {" "}
          {/* vid- 55:00 */}
          {Array.from(
            { length: Math.ceil(filteredItems.length / itemPerPage) },
            (_, index) => (
              <button className="btn btn-secondary"
                key={index + 1}
                onClick={() => paginate(index + 1)}
                style={{
                  backgroundColor: currentPage === index + 1 && "lightgreen",
                }}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
