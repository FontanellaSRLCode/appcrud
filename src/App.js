
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import {Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap'
import { useEffect, useState } from 'react';

function App() {
  const urlBase ='https://fontanellafsapi-g5b9egd8dbfgg7fe.brazilsouth-01.azurewebsites.net/api/usuarios'
  const endpoint1 = "/SeleccionarTodo"
  const endpoint2 = '/InsertarUsuario'
  const endpoint3 = '/ModificarUsuario'
  const endpoint4 = '/EliminarUsuario'

  const [data,setData]= useState([])
  const [usuSeleccionado, setUsuSeleccionado] = useState({
    usuId:'',
    usuNombre:'',
    usuEmail:'',
    usuTelefono:'',
    usuUsuario:'',
    usuPassword:''

  })
  const [modalInsert, setModalInsert]= useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)


  const handleChange = e =>{
    const {name, value}= e.target;
    setUsuSeleccionado({
      ...usuSeleccionado,
      [name]:value
    })
    console.log(usuSeleccionado)
  }

  const abrirModalInsert=()=>{
    setModalInsert(!modalInsert)
  }
  const abrirModalEdit = () => {
    setModalEdit(!modalEdit)
  }
  const abrirModalEliminar = () => {
    setModalEliminar(!modalEliminar)
  }

  const peticionGet=async()=>{
    const url = `${urlBase}${endpoint1}`;
    await axios.get(url).then(response=>{
      setData(response.data)
    }).catch(error=>{console.log(error)})
  }

  const peticionPost = async () => {

    delete usuSeleccionado.usuId
    const url = `${urlBase}${endpoint2}`;
    await axios.post(url,usuSeleccionado)
    .then(response => {
      setData(data.concat(response.data))
      abrirModalInsert()
    }).catch(error => { console.log(error) })
  }

  const seleccionarUsuario=(usuarios,caso)=>{
    setUsuSeleccionado(usuarios)
    if (caso === "Editar") 
      { 
        abrirModalEdit() 
      } else 
      { 
        abrirModalEliminar ()
      }
    
  }

  const peticionPut = async () => {

    const url = `${urlBase}${endpoint3}`;
    await axios.put(url, usuSeleccionado)
      .then(response => {
        var respuesta= response.data
        var dataAuxiliar=data
        dataAuxiliar.map(usuarios=>{
          if(usuarios.usuId === usuSeleccionado.usuId){
            usuarios.usuNombre=respuesta.usuNombre
            usuarios.usuEmail = respuesta.usuEmail
            usuarios.usuTelefono = respuesta.usuTelefono
            usuarios.usuUsuario = respuesta.usuUsuario
            usuarios.usuPassword = respuesta.usuPassword
          }
        })

        abrirModalEdit()
      }).catch(error => { console.log(error) })
  }

  const peticionDelete = async () => {

    const url = `${urlBase}${endpoint4}`;
    await axios.delete(url+"?id="+usuSeleccionado.usuId, usuSeleccionado)
      .then(response => {
        setData(data.filter(usuarios=>usuarios.id!==response.data))

        abrirModalEliminar()
      }).catch(error => { console.log(error) })
  }


  useEffect(()=>{
    peticionGet()
  },[])

  return (
    <div className="App">
      <br></br>
      <button className='btn btn-success' onClick={()=>abrirModalInsert()}>Insertar nuevo Usuario</button>
      <br></br>
      <br></br>
      <table className='table table-bordered'>
          <thead>
            <tr>
              <th>ID</th>
              <th>MONBRE</th>
              <th>EMAIL</th>
              <th>TELEFONO</th>
              <th>USUARIO</th>
              <th>PASS</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {data.map(usuarios=>(
              <tr key={usuarios.usuId}>
                <td>{usuarios.usuId}</td>
                <td>{usuarios.usuNombre}</td>
                <td>{usuarios.usuEmail}</td>
                <td>{usuarios.usuTelefono}</td>
                <td>{usuarios.usuUsuario}</td>
                <td>{usuarios.usuPassword}</td>
                <td>
                  <button className='btn btn-primary' onClick={() => seleccionarUsuario(usuarios,"Editar")} >Editar</button>
                  <button className='btn btn-danger' onClick={() => seleccionarUsuario(usuarios, "Eliminar")}>Eliminar</button>

                </td>
              </tr>
            ))}
          </tbody>
      </table>
      
     

      <Modal isOpen={modalInsert}>
        <ModalHeader>Insertar  Usuarios en la DB</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nonbre:</label>
            <br/>
            <input type="text" className="form-control" name='usuNombre'onChange={handleChange}/>
            <br/>
            <label>Email:</label>
            <br />
            <input type="text" className="form-control" name='usuEmail'onChange={handleChange}/>
            <br />
            <label>Telefono:</label>
            <br />
            <input type="text" className="form-control" name='usuTelefono' onChange={handleChange}/>
            <br />
            <label>Usuario:</label>
            <br />
            <input type="text" className="form-control" name='usuUsuario' onChange={handleChange}/>
            <br />
            <label>Password:</label>
            <br />
            <input type="text" className="form-control" name='usuPassword' />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => peticionPost()}>Agregar</button>
          <button className='btn btn-danger' onClick={()=>abrirModalInsert()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdit}>
        <ModalHeader>Editar Usuarios en la DB</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID:</label>
            <br />
            <input type="text" className="form-control" name='usuId' readOnly value={usuSeleccionado && usuSeleccionado.usuId} />
            <br />
            <label>Nonbre:</label>
            <br />
            <input type="text" className="form-control" name='usuNombre' onChange={handleChange} value={usuSeleccionado && usuSeleccionado.usuNombre} />
            <br />
            <label>Email:</label>
            <br />
            <input type="text" className="form-control" name='usuEmail' onChange={handleChange} value={usuSeleccionado && usuSeleccionado.usuEmail} />
            <br />
            <label>Telefono:</label>
            <br />
            <input type="text" className="form-control" name='usuTelefono' onChange={handleChange} value={usuSeleccionado && usuSeleccionado.usuTelefono} />
            <br />
            <label>Usuario:</label>
            <br />
            <input type="text" className="form-control" name='usuUsuario' onChange={handleChange} value={usuSeleccionado && usuSeleccionado.usuUsuario} />
            <br />
            <label>Password:</label>
            <br />
            <input type="text" className="form-control" name='usuPassword' onChange={handleChange} value={usuSeleccionado && usuSeleccionado.usuPassword} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => peticionPut()}>Editar</button>
          <button className='btn btn-danger' onClick={() => abrirModalEdit()}>Cancelar</button>
        </ModalFooter>
      </Modal>
      
      <Modal isOpen={modalEliminar}>
        <ModalBody>
          ¿Estas Seguro de eliminar {usuSeleccionado && usuSeleccionado.usuNombre}?
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={() => peticionDelete()}>
            Si
          </button>
          <button className='btn btn-secondary'
            onClick={() => abrirModalEliminar()}>
            No
          </button>
        </ModalFooter>
      </Modal>


    </div>
  );
}

export default App;
