import { apiData } from "./dataFile";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileUpload } from "../FileUpload/FileUpload";
import { Pagination } from "../Pagination/Pagination"
import './table.css'
export function Table() {
  const [headers, setHeaders] = useState([]);
  const [body, setBody] = useState([]);
  const [searchValue, setSearchValue] = useState({ value: "", index: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [addColumnForm, setAddColumnform] = useState({
    name: "",
    elementType: "",
  });
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [rowPageData, setRowPageData] = useState([])
   const pageSize = 5;
   const pageOptions = 5;

  function getRows(items, columnTypes) {
    const columnNames = Object.keys(columnTypes);
    return items.map((item) => {
      return {
        cells: columnNames.map((columnName) => {
          return {
            cellValue: item[columnName],
            elementType: columnTypes[columnName],
          };
        }),
      };
    });
  }
  function getColumns(columnTypes) {
    const columnData = Object.keys(columnTypes).map((key) => {
      return {
        name: key,
        elementType: columnTypes[key],
      };
    });
    return columnData;
  }

  function setDataInState(apiData) {
    const { items = [], metaData = {} } = apiData;
    const { columnTypes = {} } = metaData;
    const columnData = getColumns(columnTypes);
    const rowData = getRows(items, columnTypes);
    setHeaders(columnData);
    setBody(rowData);
  }

  useEffect(() => {
    setDataInState(apiData);
    // eslint-disable-next-line
  }, []);

  const addColumnPrompt = () => setModalOpen(true);
  const handleAddColumn = (columnName, elemType) => {
    const newHeader = [...headers, { name: columnName, elementType: elemType }];
    //  adding cells for columns
    setBody(
      body.map((row, idx) => {
        row.cells.push({
          cellValue: `Cell ${idx}-${headers.length}`,
          elementType: elemType,
        });
        return row;
      })
    );
    setHeaders(newHeader);
  };
  const handleAddRow = () => {
    if (!headers.length) {
      alert("To add row, please add column first");
      return;
    } else {
      const newRows = [
        ...body,
        {
          rowName: `Row ${body.length}`,
          cells: headers.map((obj, idx) => ({
            cellValue: `Cell ${body.length}-${idx}`,
            elementType: obj.elementType,
          })),
        },
      ];
      setBody(newRows);
    }
  };
  function submitForm(e) {
    e.preventDefault();
    handleAddColumn(addColumnForm.name, addColumnForm.elementType);
    setAddColumnform({ name: "", elementType: "" });
    setModalOpen(false);
  }
  return (
    <>
      <header className="Button-header">
        <button onClick={addColumnPrompt}>Add Column</button>
        <button onClick={handleAddRow}>Add Row</button>
      </header>
      {modalOpen && (
        <CreateModalComponent
          setAddColumnform={setAddColumnform}
          setModalOpen={setModalOpen}
          submitForm={submitForm}
        />
      )}
      {fileUploadModal && (
        <FileUploadModal setFileUploadModal={setFileUploadModal} />
      )}
      <table id="tableContainer">
        <thead id="thead">
          {headers.map((obj, idx) => {
            return (
              <CreateThElement
                name={obj.name}
                idx={idx}
                setHeaders={setHeaders}
                setSearchValue={setSearchValue}
              />
            );
          })}
        </thead>
        <tbody id="tbody">
          {rowPageData.map((obj, idx) => {
            const value = "" + obj.cells[searchValue.index].cellValue;
            if (value.includes(searchValue.value))
              return (
                <RowComponent
                  rowData={obj}
                  idx={idx}
                  setBody={setBody}
                  headers={headers}
                  setFileUploadModal={setFileUploadModal}
                />
              );
            return <></>
          })}
        </tbody>
      </table>
      <Pagination
        data={body}
        pageSize={pageSize}
        pageOptions={pageOptions}
        onChange={(newArr) => setRowPageData(newArr)}
      />
    </>
  );
}

function CreateThElement(props) {
  const { idx = 0, name = "", setHeaders, setSearchValue } = props;
  return (
    <th id={`id_${idx}`}>
      <span id="inputButton">
        <input
          type="text"
          value={name}
          onChange={(e) =>
            setHeaders((header) => {
              header[idx].name = e.target.value;
              return [...header];
            })
          }
        />
        <input
          placeholder="search"
          type="search"
          onChange={(e) =>
            setSearchValue({
              value: "" + e.target.value,
              index: idx,
            })
          }
        />
      </span>
    </th>
  );
}
function RowComponent(props) {
  const { rowData, idx, setBody,setFileUploadModal } = props;
  const { rowName, cells } = rowData;
  const typeMap = {
    input: InputComponent,
    textarea: TextAreaComponent,
    button: function Button() {
      return <button onClick={()=>setFileUploadModal(true)}>select image</button>;
    },
  };
  return (
    <tr id={rowName}>
      {cells.map((cellObj, index) => {
        const { cellValue } = cellObj;
        const ComponentType = typeMap[cellObj.elementType];
        return (
          <td key={index}>
            <ComponentType
              cellValue={cellValue}
              idx={idx}
              index={index}
              setBody={setBody}
            />
          </td>
        );
      })}
    </tr>
  );
}
function InputComponent(props) {
  const { cellValue, idx, index, setBody } = props;
  return (
    <input
      value={cellValue}
      onChange={(e) =>
        setBody((body) => {
          body[idx].cells[index].cellValue = e.target.value;
          return [...body];
        })
      }
    />
  );
}
function TextAreaComponent(props) {
  const { cellValue, idx, index, setBody } = props;
  return (
    <textarea
      value={cellValue}
      onChange={(e) =>
        setBody((body) => {
          body[idx].cells[index].cellValue = e.target.value;
          return [...body];
        })
      }
    />
  );
}
function CreateModalComponent(props) {
  const { setModalOpen} = props;
  return createPortal(
    <div className="modal-div">
      <div className="close-btn">
        <button type="button" onClick={() => setModalOpen(false)}>
          ❌
        </button>
      </div>
      <FileUpload />
    </div>,
    document.body
  );
}

function FileUploadModal({ setFileUploadModal }) {
  return (
    <>
      {(
        <CreateModalComponent setModalOpen={setFileUploadModal}>
        </CreateModalComponent>
      )}
    </>
  );
}
